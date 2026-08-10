import { describe, expect, it } from "vitest";
import {
  applyReservation,
  cancelReservation,
  completeReservation,
  confirmReservation,
  createDemoSalonState,
  formatMinutes,
  listAvailableSlots,
  listTodayLedger,
  menuLabel,
  updateBusinessHours,
  updateMenus,
} from "./soloSalon.js";

/** 固定の火曜（営業日） */
const TUESDAY = "2026-08-11";
/** 固定の月曜（定休） */
const MONDAY = "2026-08-10";

function emptyTuesdayState() {
  const state = createDemoSalonState(new Date("2026-08-11T09:00:00"));
  return { ...state, reservations: [] };
}

describe("createDemoSalonState", () => {
  it("seeds salon menus with duration labels and mixed statuses", () => {
    // 月曜定休 → 焦点日は翌火曜
    const state = createDemoSalonState(new Date("2026-08-10T09:00:00"));
    expect(state.shopName).toBe("アトリエ霧");
    expect(state.menus.map(menuLabel)).toEqual([
      "カット（60分）",
      "カット＋カラー（120分）",
      "カット＋パーマ（150分）",
    ]);
    expect(state.businessHours.openStartMinutes).toBe(600);
    expect(state.businessHours.openEndMinutes).toBe(1140);
    expect(state.closedWeekdays).toEqual([0, 1]);
    expect(state.breakBlocks).toEqual([{ startMinutes: 780, endMinutes: 840 }]);
    expect(state.reservations.every((r) => r.date === "2026-08-11")).toBe(true);
    const statuses = state.reservations.map((r) => r.status).sort();
    expect(statuses).toEqual(["confirmed", "requested"]);
  });
});

describe("listAvailableSlots (D1/D2/D3)", () => {
  it("returns no slots on closed weekdays", () => {
    const state = emptyTuesdayState();
    expect(listAvailableSlots(state, "menu-cut", MONDAY)).toEqual([]);
  });

  it("excludes lunch break and only fits menu duration", () => {
    const state = emptyTuesdayState();
    const cut = listAvailableSlots(state, "menu-cut", TUESDAY);
    // 12:00–13:00 は休憩直前までで重ならない。13:00 開始は休憩内。
    expect(cut.some((s) => s.startMinutes === 12 * 60)).toBe(true);
    expect(cut.some((s) => s.startMinutes === 13 * 60)).toBe(false);
    expect(cut.some((s) => s.startMinutes === 12 * 60 + 30)).toBe(false);
    expect(cut.some((s) => s.startMinutes === 11 * 60)).toBe(true);
    expect(cut.every((s) => s.endMinutes - s.startMinutes === 60)).toBe(true);

    const color = listAvailableSlots(state, "menu-cut-color", TUESDAY);
    expect(color.every((s) => s.endMinutes - s.startMinutes === 120)).toBe(true);
    // 12:00 start would run into 13:00 break
    expect(color.some((s) => s.startMinutes === 12 * 60)).toBe(false);
    // 14:00–16:00 fits after break
    expect(color.some((s) => s.startMinutes === 14 * 60)).toBe(true);
  });

  it("excludes intervals overlapping existing requested/confirmed reservations", () => {
    const state = emptyTuesdayState();
    const applied = applyReservation(state, {
      menuId: "menu-cut",
      date: TUESDAY,
      startMinutes: 11 * 60,
      customerName: "山田",
      customerContact: "090-0000-0000",
    });
    expect(applied.ok).toBe(true);
    if (!applied.ok) return;
    const slots = listAvailableSlots(applied.state, "menu-cut", TUESDAY);
    expect(slots.some((s) => s.startMinutes === 11 * 60)).toBe(false);
    expect(slots.some((s) => s.startMinutes === 10 * 60 + 30)).toBe(false);
  });
});

describe("apply / confirm / cancel (D5–D8)", () => {
  it("applies as requested when slot is free", () => {
    const state = emptyTuesdayState();
    const result = applyReservation(state, {
      menuId: "menu-cut",
      date: TUESDAY,
      startMinutes: 10 * 60,
      customerName: " 田中はな ",
      customerContact: " 070-5555-6666 ",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reservation.status).toBe("requested");
    expect(result.reservation.customerName).toBe("田中はな");
    expect(result.reservation.menuName).toBe("カット");
  });

  it("rejects apply when slot is unavailable", () => {
    const state = emptyTuesdayState();
    const result = applyReservation(state, {
      menuId: "menu-cut",
      date: TUESDAY,
      startMinutes: 13 * 60,
      customerName: "田中",
      customerContact: "070-1",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("SLOT_UNAVAILABLE");
  });

  it("confirms requested and lists ledger in time order", () => {
    const seeded = createDemoSalonState(new Date("2026-08-11T09:00:00"));
    const confirmed = confirmReservation(seeded, "seed-requested-color");
    expect(confirmed.ok).toBe(true);
    if (!confirmed.ok) return;
    expect(confirmed.reservation.status).toBe("confirmed");
    const ledger = listTodayLedger(confirmed.state, "2026-08-11");
    expect(ledger.map((r) => r.startMinutes)).toEqual([600, 900]);
    expect(ledger.every((r) => r.status !== "cancelled")).toBe(true);
  });

  it("frees the block after cancel so the slot reappears (D7)", () => {
    const state = emptyTuesdayState();
    const applied = applyReservation(state, {
      menuId: "menu-cut-perm",
      date: TUESDAY,
      startMinutes: 14 * 60,
      customerName: "木村",
      customerContact: "090-9",
    });
    expect(applied.ok).toBe(true);
    if (!applied.ok) return;
    expect(
      listAvailableSlots(applied.state, "menu-cut-perm", TUESDAY).some(
        (s) => s.startMinutes === 14 * 60,
      ),
    ).toBe(false);

    const cancelled = cancelReservation(applied.state, applied.reservation.id);
    expect(cancelled.ok).toBe(true);
    if (!cancelled.ok) return;
    expect(cancelled.reservation.status).toBe("cancelled");
    expect(
      listAvailableSlots(cancelled.state, "menu-cut-perm", TUESDAY).some(
        (s) => s.startMinutes === 14 * 60,
      ),
    ).toBe(true);
  });

  it("completes only from confirmed", () => {
    const state = emptyTuesdayState();
    const applied = applyReservation(state, {
      menuId: "menu-cut",
      date: TUESDAY,
      startMinutes: 10 * 60,
      customerName: "A",
      customerContact: "1",
    });
    if (!applied.ok) throw new Error("apply failed");
    const tooEarly = completeReservation(applied.state, applied.reservation.id);
    expect(tooEarly.ok).toBe(false);
    const confirmed = confirmReservation(applied.state, applied.reservation.id);
    if (!confirmed.ok) throw new Error("confirm failed");
    const done = completeReservation(confirmed.state, applied.reservation.id);
    expect(done.ok).toBe(true);
    if (!done.ok) return;
    expect(done.reservation.status).toBe("completed");
  });
});

describe("settings affect slots (D3/D4)", () => {
  it("reflects longer menu duration and break changes", () => {
    let state = emptyTuesdayState();
    state = updateMenus(state, [
      { id: "menu-cut", name: "カット", durationMinutes: 90 },
    ]);
    const beforeBreakChange = listAvailableSlots(state, "menu-cut", TUESDAY);
    expect(
      beforeBreakChange.every((s) => s.endMinutes - s.startMinutes === 90),
    ).toBe(true);

    state = updateBusinessHours(state, {
      breakBlocks: [{ startMinutes: 12 * 60, endMinutes: 13 * 60 }],
    });
    const after = listAvailableSlots(state, "menu-cut", TUESDAY);
    expect(after.some((s) => s.startMinutes === 11 * 60)).toBe(false);
    expect(formatMinutes(780)).toBe("13:00");
  });

  it("reflects closedWeekdays so a former open day yields no slots (D3)", () => {
    let state = emptyTuesdayState();
    expect(listAvailableSlots(state, "menu-cut", TUESDAY).length).toBeGreaterThan(
      0,
    );
    state = updateBusinessHours(state, {
      closedWeekdays: [0, 1, 2], // 日・月・火
    });
    expect(listAvailableSlots(state, "menu-cut", TUESDAY)).toEqual([]);
  });
});
