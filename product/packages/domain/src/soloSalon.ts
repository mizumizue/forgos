import type {
  ApplyReservationInput,
  AvailableSlot,
  Reservation,
  ReservationStatus,
  SalonState,
  ServiceMenu,
  Weekday,
} from "./types.js";

const SLOT_STEP_MINUTES = 30;

export const CANCEL_POLICY_TEXT =
  "ご予約のキャンセルは来店前日までにご連絡ください。当日キャンセルは次回のご案内に影響する場合があります（料金の自動課金はありません）。";

function weekdayOf(date: string): Weekday {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() as Weekday;
}

function occupiesCalendar(status: ReservationStatus): boolean {
  return status === "requested" || status === "confirmed";
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

/** ローカル日付 YYYY-MM-DD */
export function todayIso(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysIso(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return todayIso(dt);
}

/**
 * デモの焦点日: 当日が定休なら次の営業日。
 * 台帳シードと初期選択を同じ日に揃える。
 */
export function demoFocusDate(
  now = new Date(),
  closedWeekdays: Weekday[] = [0, 1],
): string {
  let date = todayIso(now);
  for (let i = 0; i < 7; i += 1) {
    if (!closedWeekdays.includes(weekdayOf(date))) return date;
    date = addDaysIso(date, 1);
  }
  return todayIso(now);
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function menuLabel(menu: ServiceMenu): string {
  return `${menu.name}（${menu.durationMinutes}分）`;
}

/** demo-seeded 初期状態（個人美容室） */
export function createDemoSalonState(now = new Date()): SalonState {
  const closedWeekdays: Weekday[] = [0, 1];
  const date = demoFocusDate(now, closedWeekdays);
  return {
    shopName: "アトリエ霧",
    cancelPolicyText: CANCEL_POLICY_TEXT,
    businessHours: {
      openStartMinutes: 10 * 60,
      openEndMinutes: 19 * 60,
    },
    // 日・月定休（火〜土営業）
    closedWeekdays,
    breakBlocks: [{ startMinutes: 13 * 60, endMinutes: 14 * 60 }],
    menus: [
      { id: "menu-cut", name: "カット", durationMinutes: 60 },
      { id: "menu-cut-color", name: "カット＋カラー", durationMinutes: 120 },
      { id: "menu-cut-perm", name: "カット＋パーマ", durationMinutes: 150 },
    ],
    reservations: [
      {
        id: "seed-confirmed-cut",
        menuId: "menu-cut",
        menuName: "カット",
        durationMinutes: 60,
        date,
        startMinutes: 10 * 60,
        customerName: "佐藤みどり",
        customerContact: "090-1111-2222",
        status: "confirmed",
      },
      {
        id: "seed-requested-color",
        menuId: "menu-cut-color",
        menuName: "カット＋カラー",
        durationMinutes: 120,
        date,
        startMinutes: 15 * 60,
        customerName: "鈴木あかり",
        customerContact: "080-3333-4444",
        status: "requested",
      },
    ],
  };
}

export function listAvailableSlots(
  state: SalonState,
  menuId: string,
  date: string,
): AvailableSlot[] {
  const menu = state.menus.find((m) => m.id === menuId);
  if (!menu) return [];

  const weekday = weekdayOf(date);
  if (state.closedWeekdays.includes(weekday)) return [];

  const duration = menu.durationMinutes;
  const openStart = state.businessHours.openStartMinutes;
  const openEnd = state.businessHours.openEndMinutes;

  const busy = [
    ...state.breakBlocks.map((b) => ({
      start: b.startMinutes,
      end: b.endMinutes,
    })),
    ...state.reservations
      .filter((r) => r.date === date && occupiesCalendar(r.status))
      .map((r) => ({
        start: r.startMinutes,
        end: r.startMinutes + r.durationMinutes,
      })),
  ];

  const slots: AvailableSlot[] = [];
  for (
    let start = openStart;
    start + duration <= openEnd;
    start += SLOT_STEP_MINUTES
  ) {
    const end = start + duration;
    const blocked = busy.some((b) => rangesOverlap(start, end, b.start, b.end));
    if (!blocked) {
      slots.push({ date, startMinutes: start, endMinutes: end, menuId });
    }
  }
  return slots;
}

export type ApplyResult =
  | { ok: true; state: SalonState; reservation: Reservation }
  | { ok: false; error: "MENU_NOT_FOUND" | "SLOT_UNAVAILABLE" | "CUSTOMER_REQUIRED" };

export function applyReservation(
  state: SalonState,
  input: ApplyReservationInput,
): ApplyResult {
  const name = input.customerName.trim();
  const contact = input.customerContact.trim();
  if (!name || !contact) {
    return { ok: false, error: "CUSTOMER_REQUIRED" };
  }

  const menu = state.menus.find((m) => m.id === input.menuId);
  if (!menu) return { ok: false, error: "MENU_NOT_FOUND" };

  const available = listAvailableSlots(state, input.menuId, input.date);
  const slotOk = available.some((s) => s.startMinutes === input.startMinutes);
  if (!slotOk) return { ok: false, error: "SLOT_UNAVAILABLE" };

  const reservation: Reservation = {
    id: newId("rsv"),
    menuId: menu.id,
    menuName: menu.name,
    durationMinutes: menu.durationMinutes,
    date: input.date,
    startMinutes: input.startMinutes,
    customerName: name,
    customerContact: contact,
    status: "requested",
  };

  return {
    ok: true,
    reservation,
    state: {
      ...state,
      reservations: [...state.reservations, reservation],
    },
  };
}

export type TransitionResult =
  | { ok: true; state: SalonState; reservation: Reservation }
  | { ok: false; error: "NOT_FOUND" | "INVALID_TRANSITION" };

function transition(
  state: SalonState,
  id: string,
  allowedFrom: ReservationStatus[],
  next: ReservationStatus,
): TransitionResult {
  const current = state.reservations.find((r) => r.id === id);
  if (!current) return { ok: false, error: "NOT_FOUND" };
  if (!allowedFrom.includes(current.status)) {
    return { ok: false, error: "INVALID_TRANSITION" };
  }
  const reservation = { ...current, status: next };
  return {
    ok: true,
    reservation,
    state: {
      ...state,
      reservations: state.reservations.map((r) =>
        r.id === id ? reservation : r,
      ),
    },
  };
}

export function confirmReservation(
  state: SalonState,
  id: string,
): TransitionResult {
  return transition(state, id, ["requested"], "confirmed");
}

export function completeReservation(
  state: SalonState,
  id: string,
): TransitionResult {
  return transition(state, id, ["confirmed"], "completed");
}

export function cancelReservation(
  state: SalonState,
  id: string,
): TransitionResult {
  return transition(state, id, ["requested", "confirmed"], "cancelled");
}

/** 本日台帳: キャンセル以外を開始時刻順 */
export function listTodayLedger(
  state: SalonState,
  date: string,
): Reservation[] {
  return state.reservations
    .filter((r) => r.date === date && r.status !== "cancelled")
    .slice()
    .sort((a, b) => a.startMinutes - b.startMinutes);
}

export function findReservation(
  state: SalonState,
  id: string,
): Reservation | undefined {
  return state.reservations.find((r) => r.id === id);
}

export function updateBusinessHours(
  state: SalonState,
  patch: {
    openStartMinutes?: number;
    openEndMinutes?: number;
    closedWeekdays?: Weekday[];
    breakBlocks?: SalonState["breakBlocks"];
  },
): SalonState {
  return {
    ...state,
    businessHours: {
      openStartMinutes:
        patch.openStartMinutes ?? state.businessHours.openStartMinutes,
      openEndMinutes:
        patch.openEndMinutes ?? state.businessHours.openEndMinutes,
    },
    closedWeekdays: patch.closedWeekdays ?? state.closedWeekdays,
    breakBlocks: patch.breakBlocks ?? state.breakBlocks,
  };
}

export function updateMenus(
  state: SalonState,
  menus: ServiceMenu[],
): SalonState {
  return { ...state, menus: menus.map((m) => ({ ...m })) };
}
