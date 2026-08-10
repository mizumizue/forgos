import { FormEvent, useMemo, useState } from "react";
import {
  createReservationShop,
  type Reservation,
  type ReservationStatus,
  type SlotView,
} from "@shop-reservation/domain";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  received: "受付",
  confirmed: "確定",
  arrived: "来店",
  completed: "完了",
  cancelled: "キャンセル",
  rejected: "却下",
  on_hold: "保留",
};

function createDemoShop() {
  return createReservationShop({
    businessHours: { open: "10:00", close: "18:00", slotMinutes: 60 },
    closedDates: ["2026-08-15"],
    resources: [
      { id: "table-a", name: "席A", capacity: 4 },
      { id: "table-b", name: "席B", capacity: 2 },
      { id: "staff-1", name: "スタイリスト佐藤", capacity: 1 },
    ],
  });
}

export function App() {
  const [shop] = useState(() => createDemoShop());
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  const hours = shop.getBusinessHours();
  const closedDates = shop.getClosedDates();
  const resources = shop.listResources();

  const [openInput, setOpenInput] = useState(hours.open);
  const [closeInput, setCloseInput] = useState(hours.close);
  const [slotMinutes, setSlotMinutes] = useState(String(hours.slotMinutes));
  const [closedInput, setClosedInput] = useState(closedDates.join(", "));

  const [boardDate, setBoardDate] = useState("2026-08-11");
  const [resourceId, setResourceId] = useState(resources[0]?.id ?? "");

  const [partySize, setPartySize] = useState("2");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<SlotView | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  void tick;

  const slots = useMemo(
    () => (resourceId ? shop.listSlots({ date: boardDate, resourceId }) : []),
    [shop, boardDate, resourceId, tick],
  );
  const reservations = useMemo(() => shop.listReservations(), [shop, tick]);
  const selected = selectedReservationId
    ? shop.getReservation(selectedReservationId)
    : undefined;

  function onSaveHours(e: FormEvent) {
    e.preventDefault();
    shop.setBusinessHours({
      open: openInput,
      close: closeInput,
      slotMinutes: Number(slotMinutes) || 60,
    });
    shop.setClosedDates(
      closedInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
    setSelectedSlot(null);
    refresh();
  }

  function onCheckAvailability() {
    if (!selectedSlot) {
      setAvailabilityMsg("枠を選んでください");
      return;
    }
    const result = shop.checkAvailability({
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      partySize: Number(partySize) || 0,
      resourceId: selectedSlot.resourceId,
    });
    if (result.available) {
      setAvailabilityMsg(`空きあり（残り定員 ${result.remaining}）→ 申込へ進めます`);
    } else {
      setAvailabilityMsg(`空きなし（${result.reason}）→ 申込へ進めません`);
    }
  }

  function onApply(e: FormEvent) {
    e.preventDefault();
    setApplyMsg(null);
    if (!selectedSlot) {
      setApplyMsg("枠を選んでください");
      return;
    }
    const availability = shop.checkAvailability({
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      partySize: Number(partySize) || 0,
      resourceId: selectedSlot.resourceId,
    });
    if (!availability.available) {
      setApplyMsg(`申込不可: ${availability.reason}`);
      return;
    }
    const result = shop.applyReservation({
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      partySize: Number(partySize) || 0,
      resourceId: selectedSlot.resourceId,
      customer: { name: customerName, contact: customerContact },
    });
    if (!result.ok) {
      setApplyMsg(`申込失敗: ${result.error}`);
      return;
    }
    setApplyMsg(`申込完了（受付）。ID: ${result.reservation.id}`);
    setSelectedReservationId(result.reservation.id);
    setCustomerName("");
    setCustomerContact("");
    refresh();
  }

  function decide(decision: "confirm" | "reject" | "hold") {
    if (!selectedReservationId) return;
    const result = shop.shopDecide({ reservationId: selectedReservationId, decision });
    setApplyMsg(result.ok ? `店舗操作: ${decision}` : `操作不可: ${result.error}`);
    refresh();
  }

  function transition(to: "arrived" | "completed" | "cancelled") {
    if (!selectedReservationId) return;
    const result = shop.transitionStatus({ reservationId: selectedReservationId, to });
    setApplyMsg(result.ok ? `状態更新: ${STATUS_LABEL[to]}` : `遷移不可: ${result.error}`);
    refresh();
  }

  return (
    <main className="layout">
      <header>
        <h1>店舗予約管理（デモ版）</h1>
        <p>営業時間・枠 → 空き確認 → 申込 → 店舗確定 → 一覧・状態までを画面で辿れます。</p>
      </header>

      <section className="panel" aria-labelledby="hours-heading">
        <h2 id="hours-heading">営業時間・休業</h2>
        <form className="row" onSubmit={onSaveHours}>
          <label>
            開店
            <input aria-label="開店" value={openInput} onChange={(e) => setOpenInput(e.target.value)} />
          </label>
          <label>
            閉店
            <input aria-label="閉店" value={closeInput} onChange={(e) => setCloseInput(e.target.value)} />
          </label>
          <label>
            枠分
            <input
              aria-label="枠分"
              value={slotMinutes}
              onChange={(e) => setSlotMinutes(e.target.value)}
            />
          </label>
          <label>
            休業日（カンマ区切り）
            <input
              aria-label="休業日"
              value={closedInput}
              onChange={(e) => setClosedInput(e.target.value)}
              style={{ minWidth: "16rem" }}
            />
          </label>
          <button type="submit">保存</button>
        </form>
        <p>
          現在: {hours.open}–{hours.close} / {hours.slotMinutes}分枠 / 休業:{" "}
          {closedDates.join(", ") || "なし"}
        </p>
      </section>

      <section className="panel" aria-labelledby="board-heading">
        <h2 id="board-heading">日次ボード（カレンダー俯瞰）</h2>
        <p>
          提供リソース:{" "}
          {resources.map((r) => (
            <span key={r.id} className="resource-chip">
              {r.name}（定員 {r.capacity}）
            </span>
          ))}
        </p>
        <div className="row">
          <label>
            対象日
            <input
              type="date"
              aria-label="対象日"
              value={boardDate}
              onChange={(e) => {
                setBoardDate(e.target.value);
                setSelectedSlot(null);
                refresh();
              }}
            />
          </label>
          <label>
            提供リソース
            <select
              aria-label="提供リソース"
              value={resourceId}
              onChange={(e) => {
                setResourceId(e.target.value);
                setSelectedSlot(null);
                refresh();
              }}
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {slots.length === 0 ? (
          <p role="status">受付可能な予約枠はありません（休業日または時間帯なし）。</p>
        ) : (
          <div className="slot-grid" role="list" aria-label="日時スロット一覧">
            {slots.map((slot) => {
              const full = slot.remaining <= 0;
              const selectedHere =
                selectedSlot?.date === slot.date &&
                selectedSlot.startTime === slot.startTime &&
                selectedSlot.resourceId === slot.resourceId;
              return (
                <div
                  key={`${slot.date}-${slot.startTime}-${slot.resourceId}`}
                  className={`slot${full ? " full" : ""}`}
                  role="listitem"
                >
                  <strong>{slot.startTime}</strong>
                  <div>
                    占有 {slot.occupied} / 定員 {slot.capacity}（残 {slot.remaining}）
                  </div>
                  <button
                    type="button"
                    disabled={full}
                    aria-pressed={selectedHere}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setAvailabilityMsg(null);
                      setApplyMsg(null);
                    }}
                  >
                    {selectedHere ? "選択中" : "この枠を選ぶ"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="apply-heading">
        <h2 id="apply-heading">空き確認〜申込</h2>
        <p>
          選択枠:{" "}
          {selectedSlot
            ? `${selectedSlot.date} ${selectedSlot.startTime} / ${
                resources.find((r) => r.id === selectedSlot.resourceId)?.name ?? selectedSlot.resourceId
              }`
            : "未選択"}
        </p>
        <div className="row">
          <label>
            人数
            <input
              aria-label="人数"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
            />
          </label>
          <button type="button" onClick={onCheckAvailability}>
            空き確認
          </button>
        </div>
        {availabilityMsg ? <p className="msg">{availabilityMsg}</p> : null}
        <form onSubmit={onApply}>
          <div className="row">
            <label>
              氏名
              <input
                aria-label="氏名"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </label>
            <label>
              連絡先
              <input
                aria-label="連絡先"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
              />
            </label>
            <button type="submit">申し込む</button>
          </div>
        </form>
        {applyMsg ? <p className="msg ok">{applyMsg}</p> : null}
      </section>

      <section className="panel" aria-labelledby="list-heading">
        <h2 id="list-heading">予約一覧・詳細（状態ラベル）</h2>
        <table>
          <thead>
            <tr>
              <th>日時</th>
              <th>人数</th>
              <th>顧客</th>
              <th>リソース</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5}>予約はまだありません</td>
              </tr>
            ) : (
              reservations.map((r: Reservation) => (
                <tr key={r.id}>
                  <td>
                    <button type="button" onClick={() => setSelectedReservationId(r.id)}>
                      {r.date} {r.startTime}
                    </button>
                  </td>
                  <td>{r.partySize}</td>
                  <td>
                    {r.customer.name}（{r.customer.contact}）
                  </td>
                  <td>{resources.find((x) => x.id === r.resourceId)?.name ?? r.resourceId}</td>
                  <td>
                    <span className={`status status-${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selected ? (
          <div style={{ marginTop: "1rem" }}>
            <h3>詳細</h3>
            <p>
              {selected.date} {selected.startTime} / {selected.partySize}名 /{" "}
              {resources.find((x) => x.id === selected.resourceId)?.name} /{" "}
              <span className={`status status-${selected.status}`}>
                {STATUS_LABEL[selected.status]}
              </span>
            </p>
            <p>
              顧客: {selected.customer.name} / {selected.customer.contact}
            </p>
            <div className="actions" aria-label="店舗側の確定操作">
              <button type="button" onClick={() => decide("confirm")}>
                確定
              </button>
              <button type="button" onClick={() => decide("reject")}>
                却下
              </button>
              <button type="button" onClick={() => decide("hold")}>
                保留
              </button>
              <button type="button" onClick={() => transition("arrived")}>
                来店
              </button>
              <button type="button" onClick={() => transition("completed")}>
                完了
              </button>
              <button type="button" onClick={() => transition("cancelled")}>
                キャンセル
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
