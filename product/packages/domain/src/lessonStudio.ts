import type {
  AbsenceNotice,
  CapacityTier,
  ContactChannel,
  LessonOccurrence,
  MakeupPolicyBundle,
  MakeupProcessedItem,
  MakeupQueueItem,
  MakeupRequest,
  PendingLateAbsenceItem,
  ParentEnrollmentView,
  ParentSessionView,
  ReportAbsenceInput,
  RequestMakeupInput,
  SeatAttendance,
  StudioState,
  TeacherOccurrenceView,
  WeeklyClassSlot,
  Weekday,
} from "./types.js";
import {
  CAPACITY_BY_TIER,
  LEVEL_BAND_LABEL,
  WEEKDAY_LABELS,
} from "./types.js";

export * from "./types.js";

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function todayIso(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIso(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function weekdayOf(date: string): Weekday {
  return parseIso(date).getDay() as Weekday;
}

function addDaysIso(date: string, days: number): string {
  const dt = parseIso(date);
  dt.setDate(dt.getDate() + days);
  return todayIso(dt);
}

function startOfWeekMonday(date: string): string {
  const wd = weekdayOf(date);
  const offset = wd === 0 ? -6 : 1 - wd;
  return addDaysIso(date, offset);
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function capacityMax(tier: CapacityTier): number {
  return CAPACITY_BY_TIER[tier];
}

/** RuntimeDurationRule: 1→20, 2→45, 3→60 */
export function deriveRuntimeMinutes(presentCount: number): number {
  if (presentCount <= 0) return 0;
  if (presentCount === 1) return 20;
  if (presentCount === 2) return 45;
  return 60;
}

export function countPresent(seats: Record<string, SeatAttendance>): number {
  return Object.values(seats).filter((s) => s === "present").length;
}

function slotById(state: StudioState, slotId: string): WeeklyClassSlot {
  const slot = state.slots.find((s) => s.id === slotId);
  if (!slot) throw new Error(`slot not found: ${slotId}`);
  return slot;
}

function occurrenceById(state: StudioState, id: string): LessonOccurrence {
  const occ = state.occurrences.find((o) => o.id === id);
  if (!occ) throw new Error(`occurrence not found: ${id}`);
  return occ;
}

function absenceDeadline(
  occurrenceDate: string,
  policy: MakeupPolicyBundle,
): Date {
  const lessonDay = parseIso(occurrenceDate);
  const deadline = new Date(lessonDay);
  deadline.setDate(
    deadline.getDate() - policy.absenceNoticeDeadlineDaysBefore,
  );
  deadline.setHours(policy.absenceNoticeDeadlineHour, 0, 0, 0);
  return deadline;
}

export function isBeforeAbsenceDeadline(
  occurrenceDate: string,
  policy: MakeupPolicyBundle,
  now = new Date(),
): boolean {
  return now.getTime() <= absenceDeadline(occurrenceDate, policy).getTime();
}

function enrolledStudentIds(state: StudioState, slotId: string): string[] {
  return state.enrollments
    .filter((e) => e.slotId === slotId && e.status === "active")
    .map((e) => e.studentId);
}

function occupancyCount(
  state: StudioState,
  occurrence: LessonOccurrence,
): number {
  const enrolled = enrolledStudentIds(state, occurrence.slotId);
  const inbound = occurrence.makeupInboundStudentIds.length;
  const outbound = new Set(occurrence.makeupOutboundStudentIds);
  const attendingEnrolled = enrolled.filter((id) => !outbound.has(id)).length;
  return attendingEnrolled + inbound;
}

export function openSeatCount(
  state: StudioState,
  occurrence: LessonOccurrence,
): number {
  const slot = slotById(state, occurrence.slotId);
  const max = capacityMax(slot.capacityTier);
  return Math.max(0, max - occupancyCount(state, occurrence));
}

function hasAbsence(
  state: StudioState,
  occurrenceId: string,
  studentId: string,
): boolean {
  return state.absences.some(
    (a) => a.occurrenceId === occurrenceId && a.studentId === studentId,
  );
}

function activeMakeupForAbsence(
  state: StudioState,
  absenceNoticeId: string,
): MakeupRequest | undefined {
  return state.makeupRequests.find(
    (r) =>
      r.absenceNoticeId === absenceNoticeId &&
      (r.status === "submitted" || r.status === "approved"),
  );
}

function sessionDisplayStatus(
  state: StudioState,
  occurrenceId: string,
  studentId: string,
): ParentSessionView["status"] {
  const inboundMakeup = state.makeupRequests.find(
    (r) =>
      r.studentId === studentId &&
      r.targetOccurrenceId === occurrenceId &&
      (r.status === "approved" || r.status === "completed"),
  );
  if (inboundMakeup) return "makeup_confirmed";

  const outboundMakeup = state.makeupRequests.find(
    (r) =>
      r.studentId === studentId &&
      r.sourceOccurrenceId === occurrenceId &&
      (r.status === "approved" || r.status === "completed"),
  );
  if (outboundMakeup) return "makeup_confirmed";

  const absence = state.absences.find(
    (a) => a.occurrenceId === occurrenceId && a.studentId === studentId,
  );
  if (!absence) return "scheduled";
  if (absence.status === "pending_teacher_review") {
    return "absence_pending_review";
  }

  const makeup = state.makeupRequests.find(
    (r) => r.absenceNoticeId === absence.id,
  );
  if (!makeup) return "absence_reported";
  if (makeup.status === "submitted") return "makeup_pending";
  if (makeup.status === "approved" || makeup.status === "completed") {
    return "makeup_confirmed";
  }
  if (makeup.status === "rejected") return "makeup_rejected";
  return "absence_reported";
}

function confirmedMakeupsInMonth(
  state: StudioState,
  studentId: string,
  monthKey: string,
): number {
  return state.makeupRequests.filter((r) => {
    if (r.studentId !== studentId) return false;
    if (r.status !== "approved" && r.status !== "completed") return false;
    const resolved = r.resolvedAt ?? r.submittedAt;
    return resolved.slice(0, 7) === monthKey;
  }).length;
}

export function listAvailableMakeupTargets(
  state: StudioState,
  absenceNoticeId: string,
  now = new Date(),
): LessonOccurrence[] {
  const absence = state.absences.find((a) => a.id === absenceNoticeId);
  if (!absence || !absence.makeupEligible) return [];

  const source = occurrenceById(state, absence.occurrenceId);
  const sourceSlot = slotById(state, source.slotId);

  return state.occurrences.filter((target) => {
    if (target.id === source.id) return false;
    if (target.locked) return false;
    const targetSlot = slotById(state, target.slotId);
    if (targetSlot.levelBand !== sourceSlot.levelBand) return false;
    if (openSeatCount(state, target) <= 0) return false;

    const daysSince =
      (parseIso(target.date).getTime() - parseIso(source.date).getTime()) /
      (24 * 60 * 60 * 1000);
    if (daysSince < 0 || daysSince > state.policy.makeupValidityDays) {
      return false;
    }

    const monthKey = now.toISOString().slice(0, 7);
    if (
      confirmedMakeupsInMonth(state, absence.studentId, monthKey) >=
      state.policy.makeupQuotaPerMonth
    ) {
      return false;
    }

    return true;
  });
}

/** demo-seeded 初期状態（ピアノ田中スタジオ） */
export function createDemoStudioState(now = new Date("2026-08-10T17:00:00")): StudioState {
  const demoWeekStart = startOfWeekMonday(todayIso(now));
  const tuesday = addDaysIso(demoWeekStart, 1);
  const thursday = addDaysIso(demoWeekStart, 3);
  const saturday = addDaysIso(demoWeekStart, 5);

  const slots: WeeklyClassSlot[] = [
    {
      id: "slot-tue-beginner-a",
      name: "初級A・火曜",
      weekday: 2,
      startMinutes: 16 * 60,
      levelBand: "BEGINNER_A",
      capacityTier: "DUO_45",
    },
    {
      id: "slot-thu-beginner-a",
      name: "初級A・木曜",
      weekday: 4,
      startMinutes: 17 * 60,
      levelBand: "BEGINNER_A",
      capacityTier: "TRIO_60",
    },
    {
      id: "slot-sat-grade3",
      name: "3級準備・土曜",
      weekday: 6,
      startMinutes: 10 * 60,
      levelBand: "GRADE3_PREP",
      capacityTier: "TRIO_60",
    },
  ];

  const students = [
    {
      id: "stu-hana",
      displayName: "鈴木はな",
      householdId: "household-suzuki",
      actorType: "parent_child" as const,
    },
    {
      id: "stu-sota",
      displayName: "鈴木颯太",
      householdId: "household-suzuki",
      actorType: "parent_child" as const,
    },
    {
      id: "stu-ryo",
      displayName: "中村涼",
      householdId: "household-nakamura",
      actorType: "self" as const,
    },
  ];

  const enrollments = [
    {
      id: "enr-hana",
      studentId: "stu-hana",
      slotId: "slot-tue-beginner-a",
      status: "active" as const,
    },
    {
      id: "enr-sota",
      studentId: "stu-sota",
      slotId: "slot-tue-beginner-a",
      status: "active" as const,
    },
    {
      id: "enr-ryo",
      studentId: "stu-ryo",
      slotId: "slot-sat-grade3",
      status: "active" as const,
    },
  ];

  const occTue: LessonOccurrence = {
    id: "occ-tue-0811",
    slotId: "slot-tue-beginner-a",
    date: tuesday,
    status: "scheduled",
    seats: {
      "stu-hana": "unmarked",
      "stu-sota": "absent",
    },
    locked: false,
    makeupOutboundStudentIds: [],
    makeupInboundStudentIds: [],
  };

  const occThu: LessonOccurrence = {
    id: "occ-thu-0813",
    slotId: "slot-thu-beginner-a",
    date: thursday,
    status: "scheduled",
    seats: {
      "stu-hana": "unmarked",
    },
    locked: false,
    makeupOutboundStudentIds: [],
    makeupInboundStudentIds: [],
  };

  const occSat: LessonOccurrence = {
    id: "occ-sat-0815",
    slotId: "slot-sat-grade3",
    date: saturday,
    status: "scheduled",
    seats: {},
    locked: false,
    makeupOutboundStudentIds: ["stu-ryo"],
    makeupInboundStudentIds: [],
  };

  const absenceHanaLate: AbsenceNotice = {
    id: "abs-hana-late-thu",
    occurrenceId: "occ-thu-0813",
    studentId: "stu-hana",
    status: "pending_teacher_review",
    channel: "PHONE",
    reason: "急用で遅れて連絡",
    submittedAt: new Date("2026-08-12T19:30:00").toISOString(),
    makeupEligible: false,
  };

  const absenceSota: AbsenceNotice = {
    id: "abs-sota-tue",
    occurrenceId: "occ-tue-0811",
    studentId: "stu-sota",
    status: "absence_confirmed",
    channel: "LINE",
    reason: "発熱のため",
    submittedAt: new Date("2026-08-10T17:30:00").toISOString(),
    makeupEligible: true,
  };

  const makeupPending: MakeupRequest = {
    id: "req-sota-pending",
    absenceNoticeId: "abs-sota-tue",
    studentId: "stu-sota",
    sourceOccurrenceId: "occ-tue-0811",
    targetOccurrenceId: "occ-thu-0813",
    status: "submitted",
    submittedAt: new Date("2026-08-10T18:00:00").toISOString(),
  };

  const absenceRyo: AbsenceNotice = {
    id: "abs-ryo-sat",
    occurrenceId: "occ-sat-0815",
    studentId: "stu-ryo",
    status: "absence_confirmed",
    channel: "WEB_FORM",
    submittedAt: new Date("2026-08-13T12:00:00").toISOString(),
    makeupEligible: true,
  };

  const makeupDone: MakeupRequest = {
    id: "req-ryo-done",
    absenceNoticeId: "abs-ryo-sat",
    studentId: "stu-ryo",
    sourceOccurrenceId: "occ-sat-0815",
    targetOccurrenceId: "occ-thu-0813",
    status: "approved",
    submittedAt: new Date("2026-08-13T14:00:00").toISOString(),
    resolvedAt: new Date("2026-08-13T15:00:00").toISOString(),
  };

  const occThuFinal: LessonOccurrence = {
    ...occThu,
    makeupInboundStudentIds: ["stu-ryo"],
    seats: { ...occThu.seats, "stu-ryo": "unmarked" },
  };

  occTue.makeupOutboundStudentIds = [];

  return {
    studioName: "ピアノ田中スタジオ",
    policy: {
      absenceNoticeDeadlineHour: 18,
      absenceNoticeDeadlineDaysBefore: 1,
      makeupQuotaPerMonth: 1,
      makeupValidityDays: 30,
      reMakeupAllowed: false,
    },
    slots,
    students,
    enrollments,
    occurrences: [occTue, occThuFinal, occSat],
    absences: [absenceHanaLate, absenceSota, absenceRyo],
    makeupRequests: [makeupPending, makeupDone],
    demoWeekStart,
  };
}

export type ReportAbsenceResult =
  | { ok: true; state: StudioState; notice: AbsenceNotice }
  | {
      ok: false;
      error:
        | "OCCURRENCE_NOT_FOUND"
        | "STUDENT_NOT_ENROLLED"
        | "ALREADY_REPORTED"
        | "SESSION_LOCKED";
    };

export function reportAbsence(
  state: StudioState,
  input: ReportAbsenceInput,
): ReportAbsenceResult {
  const now = input.now ?? new Date();
  const occurrence = state.occurrences.find((o) => o.id === input.occurrenceId);
  if (!occurrence) return { ok: false, error: "OCCURRENCE_NOT_FOUND" };
  if (occurrence.locked) return { ok: false, error: "SESSION_LOCKED" };

  const enrolled = state.enrollments.some(
    (e) =>
      e.studentId === input.studentId &&
      e.slotId === occurrence.slotId &&
      e.status === "active",
  );
  if (!enrolled) return { ok: false, error: "STUDENT_NOT_ENROLLED" };
  if (hasAbsence(state, occurrence.id, input.studentId)) {
    return { ok: false, error: "ALREADY_REPORTED" };
  }

  const onTime = isBeforeAbsenceDeadline(
    occurrence.date,
    state.policy,
    now,
  );
  const notice: AbsenceNotice = {
    id: newId("abs"),
    occurrenceId: occurrence.id,
    studentId: input.studentId,
    status: onTime ? "absence_confirmed" : "pending_teacher_review",
    channel: input.channel,
    reason: input.reason,
    submittedAt: now.toISOString(),
    makeupEligible: onTime,
  };

  const occurrences = state.occurrences.map((o) => {
    if (o.id !== occurrence.id) return o;
    return {
      ...o,
      seats: { ...o.seats, [input.studentId]: "absent" as SeatAttendance },
    };
  });

  return {
    ok: true,
    state: {
      ...state,
      occurrences,
      absences: [...state.absences, notice],
    },
    notice,
  };
}

export type RequestMakeupResult =
  | { ok: true; state: StudioState; request: MakeupRequest }
  | {
      ok: false;
      error:
        | "ABSENCE_NOT_FOUND"
        | "NOT_ELIGIBLE"
        | "TARGET_UNAVAILABLE"
        | "QUOTA_EXCEEDED"
        | "ALREADY_REQUESTED";
    };

export function requestMakeup(
  state: StudioState,
  input: RequestMakeupInput,
): RequestMakeupResult {
  const now = input.now ?? new Date();
  const absence = state.absences.find((a) => a.id === input.absenceNoticeId);
  if (!absence) return { ok: false, error: "ABSENCE_NOT_FOUND" };
  if (!absence.makeupEligible) return { ok: false, error: "NOT_ELIGIBLE" };
  if (activeMakeupForAbsence(state, absence.id)) {
    return { ok: false, error: "ALREADY_REQUESTED" };
  }

  const targets = listAvailableMakeupTargets(state, absence.id, now);
  if (!targets.some((t) => t.id === input.targetOccurrenceId)) {
    return { ok: false, error: "TARGET_UNAVAILABLE" };
  }

  const monthKey = now.toISOString().slice(0, 7);
  if (
    confirmedMakeupsInMonth(state, absence.studentId, monthKey) >=
    state.policy.makeupQuotaPerMonth
  ) {
    return { ok: false, error: "QUOTA_EXCEEDED" };
  }

  const request: MakeupRequest = {
    id: newId("req"),
    absenceNoticeId: absence.id,
    studentId: absence.studentId,
    sourceOccurrenceId: absence.occurrenceId,
    targetOccurrenceId: input.targetOccurrenceId,
    status: "submitted",
    submittedAt: now.toISOString(),
  };

  return {
    ok: true,
    state: { ...state, makeupRequests: [...state.makeupRequests, request] },
    request,
  };
}

export type ApproveMakeupResult =
  | { ok: true; state: StudioState }
  | {
      ok: false;
      error: "REQUEST_NOT_FOUND" | "TARGET_FULL" | "INVALID_STATUS";
    };

export function approveMakeup(
  state: StudioState,
  requestId: string,
  overrideReason?: string,
): ApproveMakeupResult {
  const request = state.makeupRequests.find((r) => r.id === requestId);
  if (!request || request.status !== "submitted") {
    return { ok: false, error: "REQUEST_NOT_FOUND" };
  }

  const target = occurrenceById(state, request.targetOccurrenceId);
  if (openSeatCount(state, target) <= 0) {
    return { ok: false, error: "TARGET_FULL" };
  }

  const updatedRequest: MakeupRequest = {
    ...request,
    status: "approved",
    resolvedAt: new Date().toISOString(),
    overrideReason,
  };

  const makeupRequests = state.makeupRequests.map((r) =>
    r.id === requestId ? updatedRequest : r,
  );

  const occurrences = state.occurrences.map((o) => {
    if (o.id === request.sourceOccurrenceId) {
      return {
        ...o,
        makeupOutboundStudentIds: [
          ...o.makeupOutboundStudentIds,
          request.studentId,
        ],
        seats: { ...o.seats, [request.studentId]: "absent" as SeatAttendance },
      };
    }
    if (o.id === request.targetOccurrenceId) {
      return {
        ...o,
        makeupInboundStudentIds: [
          ...o.makeupInboundStudentIds,
          request.studentId,
        ],
        seats: { ...o.seats, [request.studentId]: "unmarked" as SeatAttendance },
      };
    }
    return o;
  });

  return { ok: true, state: { ...state, makeupRequests, occurrences } };
}

export type ReviewLateAbsenceResult =
  | { ok: true; state: StudioState }
  | {
      ok: false;
      error: "ABSENCE_NOT_FOUND" | "NOT_PENDING" | "REASON_REQUIRED";
    };

/** D4/D8: 期限超過欠席の講師受理・却下 */
export function reviewLateAbsence(
  state: StudioState,
  absenceId: string,
  approved: boolean,
  overrideReason: string,
): ReviewLateAbsenceResult {
  const absence = state.absences.find((a) => a.id === absenceId);
  if (!absence) return { ok: false, error: "ABSENCE_NOT_FOUND" };
  if (absence.status !== "pending_teacher_review") {
    return { ok: false, error: "NOT_PENDING" };
  }
  if (!overrideReason.trim()) {
    return { ok: false, error: "REASON_REQUIRED" };
  }

  if (approved) {
    const absences = state.absences.map((a) =>
      a.id === absenceId
        ? {
            ...a,
            status: "absence_confirmed" as const,
            makeupEligible: true,
          }
        : a,
    );
    return { ok: true, state: { ...state, absences } };
  }

  const absences = state.absences.filter((a) => a.id !== absenceId);
  const occurrences = state.occurrences.map((o) => {
    if (o.id !== absence.occurrenceId) return o;
    const seats = { ...o.seats };
    delete seats[absence.studentId];
    return { ...o, seats };
  });
  return { ok: true, state: { ...state, absences, occurrences } };
}

export function listPendingLateAbsences(
  state: StudioState,
): PendingLateAbsenceItem[] {
  return state.absences
    .filter((a) => a.status === "pending_teacher_review")
    .map((absence) => {
      const student = state.students.find((s) => s.id === absence.studentId)!;
      const occurrence = occurrenceById(state, absence.occurrenceId);
      const slot = slotById(state, occurrence.slotId);
      return {
        absence,
        studentName: student.displayName,
        slotName: slot.name,
        occurrenceDate: occurrence.date,
        channel: absence.channel,
      };
    });
}

export function rejectMakeup(
  state: StudioState,
  requestId: string,
  reason: string,
): StudioState {
  const makeupRequests = state.makeupRequests.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "rejected" as const,
          rejectReason: reason,
          resolvedAt: new Date().toISOString(),
        }
      : r,
  );
  return { ...state, makeupRequests };
}

export function toggleSeatAttendance(
  state: StudioState,
  occurrenceId: string,
  studentId: string,
  attendance: SeatAttendance,
): StudioState {
  const occurrences = state.occurrences.map((o) => {
    if (o.id !== occurrenceId || o.locked) return o;
    return {
      ...o,
      seats: { ...o.seats, [studentId]: attendance },
    };
  });
  return { ...state, occurrences };
}

export type ConfirmLessonResult =
  | { ok: true; state: StudioState }
  | { ok: false; error: "OCCURRENCE_NOT_FOUND" | "ALREADY_LOCKED" };

export function confirmLesson(
  state: StudioState,
  occurrenceId: string,
): ConfirmLessonResult {
  const occurrence = state.occurrences.find((o) => o.id === occurrenceId);
  if (!occurrence) return { ok: false, error: "OCCURRENCE_NOT_FOUND" };
  if (occurrence.locked) return { ok: false, error: "ALREADY_LOCKED" };

  const present = countPresent(occurrence.seats);
  const actualMinutes = deriveRuntimeMinutes(present);
  const status =
    present === 0 ? ("cancelled_no_show" as const) : ("recorded" as const);

  const occurrences = state.occurrences.map((o) =>
    o.id === occurrenceId
      ? {
          ...o,
          locked: true,
          actualMinutes,
          status,
        }
      : o,
  );

  return { ok: true, state: { ...state, occurrences } };
}

function previewAttendeeCount(seats: Record<string, SeatAttendance>): number {
  return Object.values(seats).filter((s) => s !== "absent").length;
}

export function expectedMinutesForOccurrence(
  state: StudioState,
  occurrence: LessonOccurrence,
): number {
  const attending = previewAttendeeCount(occurrence.seats);
  return deriveRuntimeMinutes(attending);
}

export function listParentEnrollments(
  state: StudioState,
  householdId: string,
  now = new Date(),
): ParentEnrollmentView[] {
  const studentIds = state.students
    .filter((s) => s.householdId === householdId)
    .map((s) => s.id);

  return state.enrollments
    .filter((e) => studentIds.includes(e.studentId) && e.status === "active")
    .map((enrollment) => {
      const student = state.students.find((s) => s.id === enrollment.studentId)!;
      const slot = slotById(state, enrollment.slotId);
      const occurrence =
        state.occurrences.find(
          (o) =>
            o.slotId === slot.id &&
            !o.locked &&
            o.date >= state.demoWeekStart &&
            o.date < addDaysIso(state.demoWeekStart, 7),
        ) ??
        state.occurrences.find((o) => o.slotId === slot.id && !o.locked);

      if (!occurrence) {
        throw new Error(`no occurrence for slot ${slot.id}`);
      }

      const status = sessionDisplayStatus(
        state,
        occurrence.id,
        enrollment.studentId,
      );
      const absence = state.absences.find(
        (a) =>
          a.occurrenceId === occurrence.id &&
          a.studentId === enrollment.studentId,
      );
      const makeup = absence
        ? state.makeupRequests.find((r) => r.absenceNoticeId === absence.id)
        : undefined;

      const confirmedMakeup =
        state.makeupRequests.find(
          (r) =>
            r.studentId === enrollment.studentId &&
            (r.sourceOccurrenceId === occurrence.id ||
              r.targetOccurrenceId === occurrence.id) &&
            (r.status === "approved" || r.status === "completed"),
        ) ?? makeup;

      let makeupTargetSummary: string | undefined;
      if (
        status === "makeup_confirmed" &&
        confirmedMakeup &&
        (confirmedMakeup.status === "approved" ||
          confirmedMakeup.status === "completed")
      ) {
        const targetOcc = occurrenceById(
          state,
          confirmedMakeup.targetOccurrenceId,
        );
        const targetSlot = slotById(state, targetOcc.slotId);
        makeupTargetSummary = `${WEEKDAY_LABELS[targetSlot.weekday]} ${formatTime(targetSlot.startMinutes)} · ${targetSlot.name}`;
      }

      const canReportAbsence =
        status === "scheduled" &&
        isBeforeAbsenceDeadline(occurrence.date, state.policy, now);

      const canRequestMakeup =
        status === "absence_reported" && absence?.makeupEligible === true;

      const session: ParentSessionView = {
        occurrenceId: occurrence.id,
        date: occurrence.date,
        slotName: slot.name,
        levelBand: slot.levelBand,
        weekdayLabel: WEEKDAY_LABELS[slot.weekday],
        timeLabel: formatTime(slot.startMinutes),
        status,
        openSeatCount: openSeatCount(state, occurrence),
        canReportAbsence,
        canRequestMakeup,
        absenceNoticeId: absence?.id,
        makeupRequestId: makeup?.id,
        makeupTargetSummary,
      };

      return {
        studentId: student.id,
        studentLabel: student.displayName,
        slotName: slot.name,
        weekdayLabel: WEEKDAY_LABELS[slot.weekday],
        timeLabel: formatTime(slot.startMinutes),
        levelBand: slot.levelBand,
        thisWeekSession: session,
      };
    });
}

export function listMakeupQueue(
  state: StudioState,
  now = new Date(),
): MakeupQueueItem[] {
  return state.makeupRequests
    .filter((r) => r.status === "submitted")
    .map((request) => {
      const student = state.students.find((s) => s.id === request.studentId)!;
      const source = occurrenceById(state, request.sourceOccurrenceId);
      const target = occurrenceById(state, request.targetOccurrenceId);
      const sourceSlot = slotById(state, source.slotId);
      const targetSlot = slotById(state, target.slotId);
      const deadline = absenceDeadline(source.date, state.policy);
      const hoursUntil =
        (deadline.getTime() - now.getTime()) / (60 * 60 * 1000);

      const availableTargetSlots = listAvailableMakeupTargets(
        state,
        request.absenceNoticeId,
        now,
      ).map((o) => slotById(state, o.slotId));

      const absence = state.absences.find(
        (a) => a.id === request.absenceNoticeId,
      );

      return {
        request,
        studentName: student.displayName,
        sourceSlotName: sourceSlot.name,
        targetSlotName: targetSlot.name,
        targetDate: target.date,
        deadlineAt: deadline.toISOString(),
        hoursUntilDeadline: hoursUntil,
        levelBand: sourceSlot.levelBand,
        availableTargetSlots,
        contactChannel: absence?.channel ?? "WEB_FORM",
      };
    })
    .sort((a, b) => a.hoursUntilDeadline - b.hoursUntilDeadline);
}

export function listProcessedMakeupQueue(state: StudioState): MakeupProcessedItem[] {
  return state.makeupRequests
    .filter((r) => r.status === "approved" || r.status === "rejected")
    .map((request) => {
      const student = state.students.find((s) => s.id === request.studentId)!;
      const source = occurrenceById(state, request.sourceOccurrenceId);
      const target = occurrenceById(state, request.targetOccurrenceId);
      const sourceSlot = slotById(state, source.slotId);
      const targetSlot = slotById(state, target.slotId);
      return {
        request,
        studentName: student.displayName,
        sourceSlotName: sourceSlot.name,
        targetSlotName: targetSlot.name,
        targetDate: target.date,
        statusLabel: request.status === "approved" ? "確定" : "却下",
      };
    })
    .sort((a, b) => {
      const at = a.request.resolvedAt ?? a.request.submittedAt;
      const bt = b.request.resolvedAt ?? b.request.submittedAt;
      return bt.localeCompare(at);
    });
}

export function listTeacherWeek(
  state: StudioState,
  weekStart: string,
  now = new Date(),
): TeacherOccurrenceView[] {
  const weekEnd = addDaysIso(weekStart, 7);
  const today = todayIso(now);

  return state.occurrences
    .filter((o) => o.date >= weekStart && o.date < weekEnd)
    .map((occurrence) => {
      const slot = slotById(state, occurrence.slotId);
      const enrolled = enrolledStudentIds(state, slot.id);
      const allStudentIds = [
        ...new Set([
          ...enrolled,
          ...occurrence.makeupInboundStudentIds,
          ...occurrence.makeupOutboundStudentIds,
        ]),
      ];

      const seats = allStudentIds.map((studentId) => {
        const student = state.students.find((s) => s.id === studentId)!;
        return {
          studentId,
          displayName: student.displayName,
          attendance: occurrence.seats[studentId] ?? "unmarked",
          isMakeupOutbound: occurrence.makeupOutboundStudentIds.includes(
            studentId,
          ),
          isMakeupInbound: occurrence.makeupInboundStudentIds.includes(
            studentId,
          ),
        };
      });

      const pendingMakeupCount = state.makeupRequests.filter(
        (r) =>
          r.sourceOccurrenceId === occurrence.id && r.status === "submitted",
      ).length;

      return {
        occurrence,
        slot,
        seats,
        expectedMinutes: expectedMinutesForOccurrence(state, occurrence),
        pendingMakeupCount,
        isToday: occurrence.date === today,
      };
    })
    .sort((a, b) => {
      if (a.occurrence.date !== b.occurrence.date) {
        return a.occurrence.date.localeCompare(b.occurrence.date);
      }
      return a.slot.startMinutes - b.slot.startMinutes;
    });
}

export function levelBandLabel(band: keyof typeof LEVEL_BAND_LABEL): string {
  return LEVEL_BAND_LABEL[band];
}

export const POLICY_TAGS = [
  "前日 18:00 まで",
  "月1回",
  "同レベルのみ",
  "再振替不可",
] as const;

export const SESSION_STATUS_LABEL: Record<
  ParentSessionView["status"],
  string
> = {
  scheduled: "予定",
  absence_reported: "欠席連絡済",
  absence_pending_review: "講師確認待ち",
  makeup_pending: "欠席連絡済・振替申請中",
  makeup_confirmed: "振替確定",
  makeup_rejected: "振替不可",
};

export const CONTACT_CHANNEL_LABEL: Record<ContactChannel, string> = {
  WEB_FORM: "WEB",
  LINE: "LINE",
  PHONE: "電話",
};
