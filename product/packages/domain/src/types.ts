export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type LevelBand = "BEGINNER_A" | "GRADE3_PREP";

export type CapacityTier = "DUO_45" | "TRIO_60";

export type ContactChannel = "WEB_FORM" | "LINE" | "PHONE";

export type EnrollmentStatus = "active" | "paused" | "withdrawn";

export type OccurrenceStatus =
  | "scheduled"
  | "held"
  | "recorded"
  | "cancelled_no_show"
  | "cancelled_by_studio";

export type SeatAttendance = "present" | "absent" | "unmarked";

export type AbsenceStatus = "absence_confirmed" | "pending_teacher_review";

export type MakeupRequestStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "completed";

export type SessionDisplayStatus =
  | "scheduled"
  | "absence_reported"
  | "absence_pending_review"
  | "makeup_pending"
  | "makeup_confirmed"
  | "makeup_rejected";

export type WeeklyClassSlot = {
  id: string;
  name: string;
  weekday: Weekday;
  startMinutes: number;
  levelBand: LevelBand;
  capacityTier: CapacityTier;
};

export type Student = {
  id: string;
  displayName: string;
  householdId: string;
  actorType: "parent_child" | "self";
};

export type EnrollmentAssignment = {
  id: string;
  studentId: string;
  slotId: string;
  status: EnrollmentStatus;
};

export type LessonOccurrence = {
  id: string;
  slotId: string;
  date: string;
  status: OccurrenceStatus;
  seats: Record<string, SeatAttendance>;
  actualMinutes?: number;
  locked: boolean;
  makeupOutboundStudentIds: string[];
  makeupInboundStudentIds: string[];
};

export type AbsenceNotice = {
  id: string;
  occurrenceId: string;
  studentId: string;
  status: AbsenceStatus;
  channel: ContactChannel;
  reason?: string;
  submittedAt: string;
  makeupEligible: boolean;
};

export type MakeupRequest = {
  id: string;
  absenceNoticeId: string;
  studentId: string;
  sourceOccurrenceId: string;
  targetOccurrenceId: string;
  status: MakeupRequestStatus;
  submittedAt: string;
  resolvedAt?: string;
  overrideReason?: string;
  rejectReason?: string;
};

export type MakeupPolicyBundle = {
  absenceNoticeDeadlineHour: number;
  absenceNoticeDeadlineDaysBefore: number;
  makeupQuotaPerMonth: number;
  makeupValidityDays: number;
  reMakeupAllowed: boolean;
};

export type StudioState = {
  studioName: string;
  policy: MakeupPolicyBundle;
  slots: WeeklyClassSlot[];
  students: Student[];
  enrollments: EnrollmentAssignment[];
  occurrences: LessonOccurrence[];
  absences: AbsenceNotice[];
  makeupRequests: MakeupRequest[];
  demoWeekStart: string;
};

export type ReportAbsenceInput = {
  occurrenceId: string;
  studentId: string;
  channel: ContactChannel;
  reason?: string;
  now?: Date;
};

export type RequestMakeupInput = {
  absenceNoticeId: string;
  targetOccurrenceId: string;
  now?: Date;
};

export type ParentSessionView = {
  occurrenceId: string;
  date: string;
  slotName: string;
  levelBand: LevelBand;
  weekdayLabel: string;
  timeLabel: string;
  status: SessionDisplayStatus;
  openSeatCount: number;
  canReportAbsence: boolean;
  canRequestMakeup: boolean;
  absenceNoticeId?: string;
  makeupRequestId?: string;
};

export type ParentEnrollmentView = {
  studentId: string;
  studentLabel: string;
  slotName: string;
  weekdayLabel: string;
  timeLabel: string;
  levelBand: LevelBand;
  thisWeekSession: ParentSessionView;
};

export type TeacherSeatView = {
  studentId: string;
  displayName: string;
  attendance: SeatAttendance;
  isMakeupOutbound: boolean;
  isMakeupInbound: boolean;
};

export type TeacherOccurrenceView = {
  occurrence: LessonOccurrence;
  slot: WeeklyClassSlot;
  seats: TeacherSeatView[];
  expectedMinutes: number;
  pendingMakeupCount: number;
  isToday: boolean;
};

export type MakeupQueueItem = {
  request: MakeupRequest;
  studentName: string;
  sourceSlotName: string;
  targetSlotName: string;
  targetDate: string;
  deadlineAt: string;
  hoursUntilDeadline: number;
  levelBand: LevelBand;
  availableTargetSlots: WeeklyClassSlot[];
  contactChannel: ContactChannel;
};

export type PendingLateAbsenceItem = {
  absence: AbsenceNotice;
  studentName: string;
  slotName: string;
  occurrenceDate: string;
  channel: ContactChannel;
};

export const CAPACITY_BY_TIER: Record<CapacityTier, number> = {
  DUO_45: 2,
  TRIO_60: 3,
};

export const LEVEL_BAND_LABEL: Record<LevelBand, string> = {
  BEGINNER_A: "初級A",
  GRADE3_PREP: "3級準備",
};

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;
