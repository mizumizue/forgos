import { useMemo, useState } from "react";
import {
  approveMakeup,
  CONTACT_CHANNEL_LABEL,
  createDemoStudioState,
  formatTime,
  levelBandLabel,
  listAvailableMakeupTargets,
  listMakeupQueue,
  listParentEnrollments,
  listPendingLateAbsences,
  listTeacherWeek,
  POLICY_TAGS,
  rejectMakeup,
  reportAbsence,
  requestMakeup,
  reviewLateAbsence,
  SESSION_STATUS_LABEL,
  toggleSeatAttendance,
  confirmLesson,
  type ContactChannel,
  type ParentEnrollmentView,
  type SeatAttendance,
  type StudioState,
  type TeacherOccurrenceView,
} from "@lesson-studio/domain";

type Actor = "teacher" | "parent-suzuki" | "student-self";
type TeacherSurface = "ledger" | "makeup";
type ParentSheet = "none" | "absence" | "makeup";

const DEMO_NOW = new Date("2026-08-11T10:00:00");
const CONSULT_URL = "tel:090-0000-0000";

const ACTOR_HOUSEHOLD: Record<Exclude<Actor, "teacher">, string> = {
  "parent-suzuki": "household-suzuki",
  "student-self": "household-nakamura",
};

function addDaysIso(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function seatClass(attendance: SeatAttendance): string {
  if (attendance === "present") return "seat-ring seat-ring--present";
  if (attendance === "absent") return "seat-ring seat-ring--absent";
  return "seat-ring seat-ring--empty";
}

function durationBadge(minutes: number, locked: boolean): string {
  const base = "duration-badge";
  return locked ? `${base} ${base}--locked` : base;
}

export function App() {
  const [state, setState] = useState<StudioState>(() =>
    createDemoStudioState(DEMO_NOW),
  );
  const [actor, setActor] = useState<Actor>("parent-suzuki");
  const [teacherSurface, setTeacherSurface] = useState<TeacherSurface>("ledger");
  const [weekStart, setWeekStart] = useState(() => state.demoWeekStart);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    string | null
  >(null);
  const [parentSheet, setParentSheet] = useState<ParentSheet>("none");
  const [activeEnrollment, setActiveEnrollment] =
    useState<ParentEnrollmentView | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [makeupAnchor, setMakeupAnchor] = useState<string | null>(null);

  const parentViews = useMemo(() => {
    if (actor === "teacher") return [];
    return listParentEnrollments(state, ACTOR_HOUSEHOLD[actor], DEMO_NOW);
  }, [state, actor]);

  const pendingLateAbsences = useMemo(
    () => listPendingLateAbsences(state),
    [state],
  );

  const teacherWeek = useMemo(
    () => listTeacherWeek(state, weekStart, DEMO_NOW),
    [state, weekStart],
  );

  const makeupQueue = useMemo(
    () => listMakeupQueue(state, DEMO_NOW),
    [state],
  );

  const selectedTeacherOcc = teacherWeek.find(
    (v) => v.occurrence.id === selectedOccurrenceId,
  );

  function showFlash(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3200);
  }

  function jumpToMakeup(requestId: string) {
    setActor("teacher");
    setTeacherSurface("makeup");
    setMakeupAnchor(requestId);
  }

  return (
    <div className="app-shell">
      <header className="brand-hero">
        <p className="brand-kicker">定員制グループレッスン · 1講師</p>
        <h1 className="brand-name">{state.studioName}</h1>
        <p className="brand-tag">週の固定枠から、出欠と振替をやさしく整える</p>
        <div className="policy-tags" aria-label="教室規約">
          {POLICY_TAGS.map((tag) => (
            <span key={tag} className="policy-tag">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <nav className="actor-nav" aria-label="actor-split">
        <button
          type="button"
          className={actor === "teacher" ? "nav-btn is-active" : "nav-btn"}
          onClick={() => setActor("teacher")}
        >
          講師
        </button>
        <button
          type="button"
          className={
            actor === "parent-suzuki" ? "nav-btn is-active" : "nav-btn"
          }
          onClick={() => {
            setActor("parent-suzuki");
            setParentSheet("none");
          }}
        >
          保護者（鈴木家）
        </button>
        <button
          type="button"
          className={
            actor === "student-self" ? "nav-btn is-active" : "nav-btn"
          }
          onClick={() => {
            setActor("student-self");
            setParentSheet("none");
          }}
        >
          受講生（中村涼）
        </button>
      </nav>

      {flash ? <p className="flash-banner">{flash}</p> : null}

      {actor === "teacher" ? (
        <>
          <nav className="surface-nav" aria-label="講師主表面">
            <button
              type="button"
              className={
                teacherSurface === "ledger" ? "nav-btn is-active" : "nav-btn"
              }
              onClick={() => setTeacherSurface("ledger")}
            >
              S1 レッスン帳
            </button>
            <button
              type="button"
              className={
                teacherSurface === "makeup" ? "nav-btn is-active" : "nav-btn"
              }
              onClick={() => setTeacherSurface("makeup")}
            >
              S2 振替キュー
            </button>
          </nav>

          {teacherSurface === "ledger" ? (
            <TeacherLedger
              weekStart={weekStart}
              setWeekStart={setWeekStart}
              demoWeekStart={state.demoWeekStart}
              views={teacherWeek}
              selected={selectedTeacherOcc}
              onSelect={(id) =>
                setSelectedOccurrenceId((prev) => (prev === id ? null : id))
              }
              onToggleSeat={(occId, studentId, att) => {
                setState((s) => toggleSeatAttendance(s, occId, studentId, att));
              }}
              onConfirm={(occId) => {
                const result = confirmLesson(state, occId);
                if (!result.ok) {
                  showFlash("すでに確定済みです");
                  return;
                }
                setState(result.state);
                setSelectedOccurrenceId(null);
                showFlash("レッスンを確定しました");
              }}
              onJumpMakeup={jumpToMakeup}
            />
          ) : (
            <MakeupQueueSurface
              queue={makeupQueue}
              pendingLate={pendingLateAbsences}
              anchorId={makeupAnchor}
              onApprove={(id, overrideReason) => {
                const result = approveMakeup(state, id, overrideReason);
                if (!result.ok) {
                  showFlash("確定できませんでした");
                  return;
                }
                setState(result.state);
                showFlash(
                  overrideReason
                    ? "override で振替を確定しました"
                    : "振替を確定しました",
                );
              }}
              onReject={(id) => {
                setState(rejectMakeup(state, id, "同レベル空きなし"));
                showFlash("振替を却下しました");
              }}
              onReviewLate={(absenceId, approved, reason) => {
                const result = reviewLateAbsence(
                  state,
                  absenceId,
                  approved,
                  reason,
                );
                if (!result.ok) {
                  showFlash("受理できませんでした");
                  return;
                }
                setState(result.state);
                showFlash(
                  approved ? "期限後欠席を受理しました" : "期限後欠席を却下しました",
                );
              }}
              onGoLedger={() => {
                setTeacherSurface("ledger");
                setWeekStart(state.demoWeekStart);
              }}
            />
          )}
        </>
      ) : (
        <ParentSurface
          enrollments={parentViews}
          sheet={parentSheet}
          active={activeEnrollment}
          state={state}
          onOpenAbsence={(enrollment) => {
            setActiveEnrollment(enrollment);
            setParentSheet("absence");
          }}
          onOpenMakeup={(enrollment) => {
            setActiveEnrollment(enrollment);
            setParentSheet("makeup");
          }}
          onCloseSheet={() => {
            setParentSheet("none");
            setActiveEnrollment(null);
          }}
          onReportAbsence={(channel, reason) => {
            if (!activeEnrollment) return;
            const canReport =
              activeEnrollment.thisWeekSession.canReportAbsence;
            if (!canReport) {
              showFlash("期限内の欠席連絡ができません。講師にご相談ください");
              setParentSheet("none");
              return;
            }
            const result = reportAbsence(state, {
              occurrenceId: activeEnrollment.thisWeekSession.occurrenceId,
              studentId: activeEnrollment.studentId,
              channel,
              reason,
              now: DEMO_NOW,
            });
            if (!result.ok) {
              showFlash(
                result.error === "ALREADY_REPORTED"
                  ? "すでに欠席連絡済みです"
                  : "期限内の欠席連絡ができませんでした。講師にご相談ください",
              );
              setParentSheet("none");
              return;
            }
            setState(result.state);
            setParentSheet("none");
            setActiveEnrollment(null);
            showFlash("欠席連絡を送信しました");
          }}
          onRequestMakeup={(targetOccurrenceId) => {
            if (!activeEnrollment?.thisWeekSession.absenceNoticeId) return;
            const result = requestMakeup(state, {
              absenceNoticeId: activeEnrollment.thisWeekSession.absenceNoticeId,
              targetOccurrenceId,
              now: DEMO_NOW,
            });
            if (!result.ok) {
              showFlash("振替申請できませんでした");
              return;
            }
            setState(result.state);
            setParentSheet("none");
            setActiveEnrollment(null);
            showFlash("振替を申請しました（講師確認待ち）");
          }}
          consultUrl={CONSULT_URL}
        />
      )}
    </div>
  );
}

function TeacherLedger({
  weekStart,
  setWeekStart,
  demoWeekStart,
  views,
  selected,
  onSelect,
  onToggleSeat,
  onConfirm,
  onJumpMakeup,
}: {
  weekStart: string;
  setWeekStart: (d: string) => void;
  demoWeekStart: string;
  views: TeacherOccurrenceView[];
  selected?: TeacherOccurrenceView;
  onSelect: (id: string) => void;
  onToggleSeat: (
    occId: string,
    studentId: string,
    att: SeatAttendance,
  ) => void;
  onConfirm: (occId: string) => void;
  onJumpMakeup: (requestId: string) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDaysIso(weekStart, i));

  return (
    <section className="surface ledger-surface" aria-labelledby="ledger-title">
      <h2 id="ledger-title">S1 レッスン帳</h2>
      <p className="surface-lead">
        今日の縦帯と座席リングで、定員連動の実施時間を確定します
      </p>

      <div className="week-nav">
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setWeekStart(addDaysIso(weekStart, -7))}
        >
          ← 前週
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setWeekStart(demoWeekStart)}
        >
          今週
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setWeekStart(addDaysIso(weekStart, 7))}
        >
          次週 →
        </button>
      </div>

      <div className="week-strip" role="list">
        {days.map((date) => {
          const dayViews = views.filter((v) => v.occurrence.date === date);
          const isToday = dayViews.some((v) => v.isToday);
          return (
            <div
              key={date}
              role="listitem"
              className={isToday ? "week-col week-col--today" : "week-col"}
            >
              <header className="week-col__head">
                {date.slice(5).replace("-", "/")}
              </header>
              {dayViews.length === 0 ? (
                <p className="week-col__empty">—</p>
              ) : (
                dayViews.map((view) => (
                  <article
                    key={view.occurrence.id}
                    className={
                      selected?.occurrence.id === view.occurrence.id
                        ? "slot-card is-selected"
                        : "slot-card"
                    }
                  >
                    <button
                      type="button"
                      className="slot-card__tap"
                      onClick={() => onSelect(view.occurrence.id)}
                    >
                      <h3>{view.slot.name}</h3>
                      <p className="slot-card__time">
                        {formatTime(view.slot.startMinutes)}
                      </p>
                      <div className="seat-rings" aria-label="座席リング">
                        {view.seats.map((seat) => (
                          <span
                            key={seat.studentId}
                            className={seatClass(seat.attendance)}
                            title={seat.displayName}
                          />
                        ))}
                        {Array.from({
                          length: Math.max(
                            0,
                            3 - view.seats.length,
                          ),
                        }).map((_, i) => (
                          <span
                            key={`empty-${i}`}
                            className="seat-ring seat-ring--empty"
                          />
                        ))}
                      </div>
                      <span
                        className={durationBadge(
                          view.expectedMinutes,
                          view.occurrence.locked,
                        )}
                      >
                        ♩= {view.expectedMinutes}min
                      </span>
                    </button>
                    {view.pendingMakeupCount > 0 ? (
                      <button
                        type="button"
                        className="makeup-link"
                        onClick={() => onJumpMakeup("req-sota-pending")}
                      >
                        振替 {view.pendingMakeupCount} 件
                      </button>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          );
        })}
      </div>

      {selected ? (
        <div className="seat-sheet">
          <h3>
            {selected.slot.name} · {selected.occurrence.date}
          </h3>
          <ul className="seat-sheet__list">
            {selected.seats.map((seat) => (
              <li key={seat.studentId}>
                <span>{seat.displayName}</span>
                {seat.isMakeupInbound ? (
                  <span className="chip chip--inbound">振替 inbound</span>
                ) : null}
                {seat.isMakeupOutbound ? (
                  <span className="chip chip--outbound">振替 outbound</span>
                ) : null}
                {!selected.occurrence.locked ? (
                  <div className="att-toggle">
                    {(
                      ["present", "absent", "unmarked"] as SeatAttendance[]
                    ).map((att) => (
                      <button
                        key={att}
                        type="button"
                        className={
                          seat.attendance === att
                            ? "att-btn is-active"
                            : "att-btn"
                        }
                        onClick={() =>
                          onToggleSeat(
                            selected.occurrence.id,
                            seat.studentId,
                            att,
                          )
                        }
                      >
                        {att === "present"
                          ? "出席"
                          : att === "absent"
                            ? "欠席"
                            : "未確定"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="locked-label">確定済み</span>
                )}
              </li>
            ))}
          </ul>
          {!selected.occurrence.locked ? (
            <button
              type="button"
              className="primary-btn"
              onClick={() => onConfirm(selected.occurrence.id)}
            >
              レッスンを確定
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function MakeupQueueSurface({
  queue,
  pendingLate,
  anchorId,
  onApprove,
  onReject,
  onReviewLate,
  onGoLedger,
}: {
  queue: ReturnType<typeof listMakeupQueue>;
  pendingLate: ReturnType<typeof listPendingLateAbsences>;
  anchorId: string | null;
  onApprove: (id: string, overrideReason?: string) => void;
  onReject: (id: string) => void;
  onReviewLate: (
    absenceId: string,
    approved: boolean,
    reason: string,
  ) => void;
  onGoLedger: () => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [overrideId, setOverrideId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [lateReviewId, setLateReviewId] = useState<string | null>(null);
  const [lateReason, setLateReason] = useState("");

  return (
    <section className="surface makeup-surface" aria-labelledby="makeup-title">
      <h2 id="makeup-title">S2 振替キュー</h2>
      <p className="surface-lead">
        期限切れ間近の申請から処理。同レベル空き枠のみ確定できます
      </p>

      {pendingLate.length > 0 ? (
        <div className="late-absence-block">
          <h3>期限後欠席（講師確認）</h3>
          {pendingLate.map((item) => (
            <article key={item.absence.id} className="makeup-card">
              <h4>{item.studentName}</h4>
              <p>
                {item.slotName} · {item.occurrenceDate}
              </p>
              <p className="makeup-card__channel">
                連絡: {CONTACT_CHANNEL_LABEL[item.channel]}
              </p>
              {lateReviewId === item.absence.id ? (
                <div className="confirm-dialog">
                  <label className="field">
                    <span>override 理由（必須）</span>
                    <input
                      value={lateReason}
                      onChange={(e) => setLateReason(e.target.value)}
                      placeholder="感染症などの特例"
                    />
                  </label>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      onReviewLate(item.absence.id, true, lateReason);
                      setLateReviewId(null);
                      setLateReason("");
                    }}
                  >
                    受理
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      onReviewLate(item.absence.id, false, lateReason);
                      setLateReviewId(null);
                      setLateReason("");
                    }}
                  >
                    却下
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setLateReviewId(null);
                      setLateReason("");
                    }}
                  >
                    戻る
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setLateReviewId(item.absence.id)}
                >
                  override 受理
                </button>
              )}
            </article>
          ))}
        </div>
      ) : null}

      {queue.length === 0 ? (
        <p className="empty-hint">処理待ちの申請はありません</p>
      ) : (
        <div className="makeup-cards">
          {queue.map((item) => (
            <article
              key={item.request.id}
              id={`makeup-${item.request.id}`}
              className={
                anchorId === item.request.id
                  ? "makeup-card is-highlight"
                  : "makeup-card"
              }
            >
              <header className="makeup-card__head">
                <span
                  className={
                    item.hoursUntilDeadline < 24
                      ? "deadline-badge deadline-badge--urgent"
                      : "deadline-badge"
                  }
                >
                  残り {Math.max(0, Math.round(item.hoursUntilDeadline))}h
                </span>
                <h3>{item.studentName}</h3>
              </header>
              <p>
                {item.sourceSlotName} → {item.targetSlotName}（
                {item.targetDate}）
              </p>
              <p className="makeup-card__level">
                {levelBandLabel(item.levelBand)}
              </p>
              <p className="makeup-card__channel">
                連絡: {CONTACT_CHANNEL_LABEL[item.contactChannel]}
              </p>
              <div className="policy-tags">
                {POLICY_TAGS.map((tag) => (
                  <span key={tag} className="policy-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="slot-chips">
                {item.availableTargetSlots.map((slot) => (
                  <span key={slot.id} className="slot-chip">
                    {slot.name}
                  </span>
                ))}
              </div>
              {confirmId === item.request.id ? (
                <div className="confirm-dialog">
                  <p>再振替不可の規約に同意のうえ確定します</p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      onApprove(item.request.id);
                      setConfirmId(null);
                    }}
                  >
                    確定
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setConfirmId(null)}
                  >
                    戻る
                  </button>
                </div>
              ) : overrideId === item.request.id ? (
                <div className="confirm-dialog">
                  <label className="field">
                    <span>override 理由（必須）</span>
                    <input
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="月1回超過の特例など"
                    />
                  </label>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      onApprove(item.request.id, overrideReason);
                      setOverrideId(null);
                      setOverrideReason("");
                    }}
                  >
                    override 確定
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setOverrideId(null);
                      setOverrideReason("");
                    }}
                  >
                    戻る
                  </button>
                </div>
              ) : (
                <div className="makeup-actions">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setConfirmId(item.request.id)}
                  >
                    この枠で確定
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => onReject(item.request.id)}
                  >
                    却下
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setOverrideId(item.request.id)}
                  >
                    override 受理
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <button type="button" className="ghost-btn ledger-jump" onClick={onGoLedger}>
        レッスン帳で確認
      </button>
    </section>
  );
}

function ParentSurface({
  enrollments,
  sheet,
  active,
  state,
  consultUrl,
  onOpenAbsence,
  onOpenMakeup,
  onCloseSheet,
  onReportAbsence,
  onRequestMakeup,
}: {
  enrollments: ParentEnrollmentView[];
  sheet: ParentSheet;
  active: ParentEnrollmentView | null;
  state: StudioState;
  consultUrl: string;
  onOpenAbsence: (e: ParentEnrollmentView) => void;
  onOpenMakeup: (e: ParentEnrollmentView) => void;
  onCloseSheet: () => void;
  onReportAbsence: (channel: ContactChannel, reason: string) => void;
  onRequestMakeup: (targetOccurrenceId: string) => void;
}) {
  const [channel, setChannel] = useState<ContactChannel>("WEB_FORM");
  const [reason, setReason] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const makeupTargets =
    active?.thisWeekSession.absenceNoticeId && sheet === "makeup"
      ? listAvailableMakeupTargets(
          state,
          active.thisWeekSession.absenceNoticeId,
          DEMO_NOW,
        )
      : [];

  return (
    <section className="surface parent-surface" aria-labelledby="parent-title">
      <h2 id="parent-title">S3 マイ枠</h2>
      <p className="surface-lead">
        在籍固定枠と今週の回次。他の受講生の氏名・出欠は表示しません
      </p>

      {enrollments.some((e) => !e.thisWeekSession.canReportAbsence) ? (
        <p className="consult-hint">
          期限後の欠席連絡は
          <a href={consultUrl} className="consult-link">
            講師に相談
          </a>
          してください
        </p>
      ) : null}

      <div className="enrollment-cards">
        {enrollments.map((enrollment) => {
          const session = enrollment.thisWeekSession;
          return (
            <article key={enrollment.studentId} className="enrollment-card">
              <header>
                <h3>{enrollment.studentLabel}</h3>
                <span className="level-chip">
                  {levelBandLabel(enrollment.levelBand)}
                </span>
              </header>
              <p className="enrollment-card__slot">
                {enrollment.weekdayLabel} {enrollment.timeLabel} ·{" "}
                {enrollment.slotName}
              </p>
              <p className="session-status">
                今週:{" "}
                <strong>{SESSION_STATUS_LABEL[session.status]}</strong>
                <span className="open-seats">
                  （空き席 {session.openSeatCount}）
                </span>
              </p>
              <div className="parent-cta">
                <button
                  type="button"
                  className="primary-btn"
                  disabled={!session.canReportAbsence}
                  onClick={() => onOpenAbsence(enrollment)}
                >
                  欠席を連絡する
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={!session.canRequestMakeup}
                  onClick={() => onOpenMakeup(enrollment)}
                >
                  振替を希望する
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {sheet === "absence" && active ? (
        <div className="sheet" role="dialog" aria-label="欠席連絡">
          <h3>欠席連絡 — {active.studentLabel}</h3>
          <label className="field">
            <span>連絡チャネル</span>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as ContactChannel)}
            >
              <option value="WEB_FORM">WEB_FORM</option>
              <option value="LINE">LINE</option>
              <option value="PHONE">電話</option>
            </select>
          </label>
          <label className="field">
            <span>理由（任意）</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="体調不良など"
            />
          </label>
          <div className="sheet-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => onReportAbsence(channel, reason)}
            >
              送信
            </button>
            <button type="button" className="ghost-btn" onClick={onCloseSheet}>
              キャンセル
            </button>
          </div>
        </div>
      ) : null}

      {sheet === "makeup" && active ? (
        <div className="sheet" role="dialog" aria-label="振替希望">
          <h3>振替希望 — {active.studentLabel}</h3>
          {makeupTargets.length === 0 ? (
            <>
              <p className="empty-hint">
                今月は同レベルの空きがありません
              </p>
              <div className="policy-tags">
                {POLICY_TAGS.map((tag) => (
                  <span key={tag} className="policy-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="slot-chips selectable">
              {makeupTargets.map((target) => {
                const slot = state.slots.find((s) => s.id === target.slotId)!;
                return (
                  <button
                    key={target.id}
                    type="button"
                    className={
                      selectedTarget === target.id
                        ? "slot-chip is-selected"
                        : "slot-chip"
                    }
                    onClick={() => setSelectedTarget(target.id)}
                  >
                    {slot.name} {target.date}
                  </button>
                );
              })}
            </div>
          )}
          <div className="sheet-actions">
            <button
              type="button"
              className="primary-btn"
              disabled={!selectedTarget}
              onClick={() => selectedTarget && onRequestMakeup(selectedTarget)}
            >
              申請する
            </button>
            <button type="button" className="ghost-btn" onClick={onCloseSheet}>
              キャンセル
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
