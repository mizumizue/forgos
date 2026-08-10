import { useMemo, useState } from "react";
import {
  applyReservation,
  cancelReservation,
  completeReservation,
  confirmReservation,
  createDemoSalonState,
  demoFocusDate,
  formatMinutes,
  listAvailableSlots,
  listTodayLedger,
  menuLabel,
  updateBusinessHours,
  updateMenus,
  type Reservation,
  type ReservationStatus,
  type SalonState,
  type ServiceMenu,
  type Weekday,
} from "@solo-salon/domain";

type Surface = "booking" | "ledger" | "settings";

const WEEKDAY_LABELS: { day: Weekday; label: string }[] = [
  { day: 0, label: "日" },
  { day: 1, label: "月" },
  { day: 2, label: "火" },
  { day: 3, label: "水" },
  { day: 4, label: "木" },
  { day: 5, label: "金" },
  { day: 6, label: "土" },
];

const STATUS_LABEL: Record<ReservationStatus, string> = {
  requested: "申請中",
  confirmed: "確定",
  completed: "完了",
  cancelled: "キャンセル",
};

function statusClass(status: ReservationStatus): string {
  return `status status--${status}`;
}

export function App() {
  const [state, setState] = useState<SalonState>(() => createDemoSalonState());
  const [surface, setSurface] = useState<Surface>("booking");
  const focusDate = demoFocusDate(new Date(), state.closedWeekdays);

  return (
    <div className="app-shell">
      <header className="brand-hero">
        <p className="brand-kicker">個人美容室 · 1 chair</p>
        <h1 className="brand-name">{state.shopName}</h1>
        <p className="brand-tag">メニュー所要の空き枠から、穏やかに予約する</p>
      </header>

      <nav className="surface-nav" aria-label="主表面">
        <button
          type="button"
          className={surface === "booking" ? "nav-btn is-active" : "nav-btn"}
          onClick={() => setSurface("booking")}
        >
          予約申込
        </button>
        <button
          type="button"
          className={surface === "ledger" ? "nav-btn is-active" : "nav-btn"}
          onClick={() => setSurface("ledger")}
        >
          本日台帳
        </button>
        <button
          type="button"
          className={surface === "settings" ? "nav-btn is-active" : "nav-btn"}
          onClick={() => setSurface("settings")}
        >
          店設定
        </button>
      </nav>

      <main className="surface-stage" key={surface}>
        {surface === "booking" ? (
          <BookingSurface
            state={state}
            setState={setState}
            focusDate={focusDate}
          />
        ) : null}
        {surface === "ledger" ? (
          <LedgerSurface
            state={state}
            setState={setState}
            focusDate={focusDate}
          />
        ) : null}
        {surface === "settings" ? (
          <SettingsSurface state={state} setState={setState} />
        ) : null}
      </main>
    </div>
  );
}

function BookingSurface({
  state,
  setState,
  focusDate,
}: {
  state: SalonState;
  setState: (s: SalonState) => void;
  focusDate: string;
}) {
  const [menuId, setMenuId] = useState(state.menus[0]?.id ?? "");
  const [date, setDate] = useState(focusDate);
  const [startMinutes, setStartMinutes] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [trackedId, setTrackedId] = useState<string | null>(null);

  const slots = useMemo(
    () => (menuId ? listAvailableSlots(state, menuId, date) : []),
    [state, menuId, date],
  );

  const tracked = trackedId
    ? state.reservations.find((r) => r.id === trackedId)
    : undefined;

  function onApply() {
    setMessage(null);
    if (startMinutes == null) {
      setMessage("空き枠を選んでください");
      return;
    }
    const result = applyReservation(state, {
      menuId,
      date,
      startMinutes,
      customerName,
      customerContact,
    });
    if (!result.ok) {
      setMessage(
        result.error === "SLOT_UNAVAILABLE"
          ? "その枠は埋まりました。別の時間を選んでください"
          : "メニューまたはお客様情報を確認してください",
      );
      return;
    }
    setState(result.state);
    setTrackedId(result.reservation.id);
    setStartMinutes(null);
    setCustomerName("");
    setCustomerContact("");
    setMessage("申し込みを受け付けました（申請中）");
  }

  function onCancelOwn() {
    if (!trackedId) return;
    const result = cancelReservation(state, trackedId);
    if (!result.ok) {
      setMessage("キャンセルできませんでした");
      return;
    }
    setState(result.state);
    setMessage("キャンセルしました。枠が再び空きます");
  }

  return (
    <section className="surface booking-surface" aria-labelledby="booking-title">
      <h2 id="booking-title">予約申込</h2>
      <p className="surface-lead">施術メニューを選び、所要に合う空き枠へ申し込みます</p>

      <div className="attention-block">
        <h3 className="step-label">1. 施術メニュー</h3>
        <div className="menu-grid" role="list">
          {state.menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              role="listitem"
              className={
                menuId === menu.id ? "menu-card is-selected" : "menu-card"
              }
              onClick={() => {
                setMenuId(menu.id);
                setStartMinutes(null);
              }}
            >
              <span className="menu-card__name">{menu.name}</span>
              <span className="menu-card__duration">{menu.durationMinutes}分</span>
            </button>
          ))}
        </div>
      </div>

      <div className="attention-block">
        <h3 className="step-label">2. 空き枠の時間帯</h3>
        <label className="field">
          <span>来店日</span>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setStartMinutes(null);
            }}
          />
        </label>
        {slots.length === 0 ? (
          <p className="empty-hint">この日・メニューで取れる連続空きはありません</p>
        ) : (
          <div className="slot-row" role="list">
            {slots.map((slot) => (
              <button
                key={`${slot.date}-${slot.startMinutes}`}
                type="button"
                role="listitem"
                className={
                  startMinutes === slot.startMinutes
                    ? "slot-chip is-selected"
                    : "slot-chip"
                }
                onClick={() => setStartMinutes(slot.startMinutes)}
              >
                {formatMinutes(slot.startMinutes)}–{formatMinutes(slot.endMinutes)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="attention-block">
        <h3 className="step-label">3. 申込</h3>
        <p className="policy">{state.cancelPolicyText}</p>
        <div className="field-row">
          <label className="field">
            <span>お名前</span>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="例: 高橋ゆい"
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>ご連絡先</span>
            <input
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="電話またはメール"
              autoComplete="tel"
            />
          </label>
        </div>
        <button type="button" className="primary-btn" onClick={onApply}>
          この枠で申し込む
        </button>
      </div>

      {message ? <p className="flash">{message}</p> : null}

      {tracked ? (
        <div className="track-panel">
          <h3>あなたの予約状態</h3>
          <p>
            {tracked.menuName} · {tracked.date}{" "}
            {formatMinutes(tracked.startMinutes)}{" "}
            <span className={statusClass(tracked.status)}>
              {STATUS_LABEL[tracked.status]}
            </span>
          </p>
          {tracked.status === "requested" || tracked.status === "confirmed" ? (
            <button type="button" className="ghost-btn" onClick={onCancelOwn}>
              キャンセルする
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function LedgerSurface({
  state,
  setState,
  focusDate,
}: {
  state: SalonState;
  setState: (s: SalonState) => void;
  focusDate: string;
}) {
  const [date, setDate] = useState(focusDate);
  const ledger = listTodayLedger(state, date);
  const openStart = state.businessHours.openStartMinutes;
  const openEnd = state.businessHours.openEndMinutes;
  const span = Math.max(openEnd - openStart, 1);

  function mutate(
    id: string,
    fn: (
      s: SalonState,
      id: string,
    ) => { ok: true; state: SalonState } | { ok: false },
  ) {
    const result = fn(state, id);
    if (result.ok) setState(result.state);
  }

  return (
    <section className="surface ledger-surface" aria-labelledby="ledger-title">
      <h2 id="ledger-title">本日台帳</h2>
      <p className="surface-lead">次の来店を時間ブロックで把握し、申請を確定します</p>

      <label className="field inline-field">
        <span>台帳日</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div className="ledger-board" aria-label="時間順台帳">
        <div className="ledger-axis">
          <span>{formatMinutes(openStart)}</span>
          <span>{formatMinutes(openEnd)}</span>
        </div>
        <div className="ledger-track">
          {state.breakBlocks.map((b) => (
            <div
              key={`break-${b.startMinutes}`}
              className="ledger-break"
              style={{
                top: `${((b.startMinutes - openStart) / span) * 100}%`,
                height: `${((b.endMinutes - b.startMinutes) / span) * 100}%`,
              }}
              title="休憩"
            />
          ))}
          {ledger.length === 0 ? (
            <p className="empty-hint ledger-empty">この日の予約はありません</p>
          ) : (
            ledger.map((r) => (
              <LedgerBlock
                key={r.id}
                reservation={r}
                openStart={openStart}
                span={span}
                onConfirm={() => mutate(r.id, confirmReservation)}
                onComplete={() => mutate(r.id, completeReservation)}
                onCancel={() => mutate(r.id, cancelReservation)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function LedgerBlock({
  reservation: r,
  openStart,
  span,
  onConfirm,
  onComplete,
  onCancel,
}: {
  reservation: Reservation;
  openStart: number;
  span: number;
  onConfirm: () => void;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const top = ((r.startMinutes - openStart) / span) * 100;
  const height = (r.durationMinutes / span) * 100;

  return (
    <article
      className={`ledger-block ledger-block--${r.status}`}
      style={{ top: `${top}%`, height: `${Math.max(height, 8)}%` }}
    >
      <div className="ledger-block__head">
        <strong>
          {formatMinutes(r.startMinutes)}–{formatMinutes(r.startMinutes + r.durationMinutes)}
        </strong>
        <span className={statusClass(r.status)}>{STATUS_LABEL[r.status]}</span>
      </div>
      <p className="ledger-block__body">
        {r.menuName}（{r.durationMinutes}分） · {r.customerName}
      </p>
      <div className="ledger-block__actions">
        {r.status === "requested" ? (
          <button type="button" className="primary-btn compact" onClick={onConfirm}>
            確定する
          </button>
        ) : null}
        {r.status === "confirmed" ? (
          <button type="button" className="ghost-btn compact" onClick={onComplete}>
            完了にする
          </button>
        ) : null}
        {r.status === "requested" || r.status === "confirmed" ? (
          <button type="button" className="ghost-btn compact" onClick={onCancel}>
            キャンセル
          </button>
        ) : null}
      </div>
    </article>
  );
}

function SettingsSurface({
  state,
  setState,
}: {
  state: SalonState;
  setState: (s: SalonState) => void;
}) {
  const [openStart, setOpenStart] = useState(
    formatMinutes(state.businessHours.openStartMinutes),
  );
  const [openEnd, setOpenEnd] = useState(
    formatMinutes(state.businessHours.openEndMinutes),
  );
  const [breakStart, setBreakStart] = useState(
    formatMinutes(state.breakBlocks[0]?.startMinutes ?? 13 * 60),
  );
  const [breakEnd, setBreakEnd] = useState(
    formatMinutes(state.breakBlocks[0]?.endMinutes ?? 14 * 60),
  );
  const [closedWeekdays, setClosedWeekdays] = useState<Weekday[]>(
    state.closedWeekdays,
  );
  const [menus, setMenus] = useState<ServiceMenu[]>(state.menus);
  const [saved, setSaved] = useState<string | null>(null);

  function toggleClosedDay(day: Weekday) {
    setClosedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
  }

  function parseHm(value: string): number | null {
    const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
  }

  function saveHours() {
    const os = parseHm(openStart);
    const oe = parseHm(openEnd);
    const bs = parseHm(breakStart);
    const be = parseHm(breakEnd);
    if (os == null || oe == null || bs == null || be == null) {
      setSaved("時刻は HH:MM で入力してください");
      return;
    }
    setState(
      updateBusinessHours(state, {
        openStartMinutes: os,
        openEndMinutes: oe,
        breakBlocks: [{ startMinutes: bs, endMinutes: be }],
        closedWeekdays,
      }),
    );
    setSaved("営業時間・定休・休憩を保存しました（以降の空き枠に反映）");
  }

  function saveMenus() {
    setState(updateMenus(state, menus));
    setSaved("メニュー所要を保存しました");
  }

  return (
    <section className="surface settings-surface" aria-labelledby="settings-title">
      <h2 id="settings-title">店設定</h2>
      <p className="surface-lead">今日以降に効く営業前提と、メニュー所要を整えます</p>

      <div className="attention-block">
        <h3 className="step-label">1. 営業時間／定休／休憩</h3>
        <p className="hint">定休の曜日を選ぶと、その日の空き枠は出ません。</p>
        <fieldset className="closed-days">
          <legend>定休</legend>
          <div className="closed-days__row" role="list">
            {WEEKDAY_LABELS.map(({ day, label }) => (
              <label key={day} className="closed-day" role="listitem">
                <input
                  type="checkbox"
                  checked={closedWeekdays.includes(day)}
                  onChange={() => toggleClosedDay(day)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field-row">
          <label className="field">
            <span>開店</span>
            <input value={openStart} onChange={(e) => setOpenStart(e.target.value)} />
          </label>
          <label className="field">
            <span>閉店</span>
            <input value={openEnd} onChange={(e) => setOpenEnd(e.target.value)} />
          </label>
          <label className="field">
            <span>休憩開始</span>
            <input value={breakStart} onChange={(e) => setBreakStart(e.target.value)} />
          </label>
          <label className="field">
            <span>休憩終了</span>
            <input value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} />
          </label>
        </div>
        <button type="button" className="primary-btn" onClick={saveHours}>
          営業前提を保存
        </button>
      </div>

      <div className="attention-block">
        <h3 className="step-label">2. メニュー所要</h3>
        <ul className="menu-edit-list">
          {menus.map((menu, index) => (
            <li key={menu.id}>
              <span>{menuLabel(menu)}</span>
              <label className="field compact-field">
                <span>所要（分）</span>
                <input
                  type="number"
                  min={30}
                  step={30}
                  value={menu.durationMinutes}
                  onChange={(e) => {
                    const durationMinutes = Number(e.target.value);
                    setMenus((prev) =>
                      prev.map((m, i) =>
                        i === index ? { ...m, durationMinutes } : m,
                      ),
                    );
                  }}
                />
              </label>
            </li>
          ))}
        </ul>
        <button type="button" className="primary-btn" onClick={saveMenus}>
          メニュー所要を保存
        </button>
      </div>

      {saved ? <p className="flash">{saved}</p> : null}
    </section>
  );
}
