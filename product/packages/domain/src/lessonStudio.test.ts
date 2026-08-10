import { describe, expect, it } from "vitest";
import {
  approveMakeup,
  confirmLesson,
  createDemoStudioState,
  deriveRuntimeMinutes,
  formatTime,
  isBeforeAbsenceDeadline,
  listAvailableMakeupTargets,
  listMakeupQueue,
  listParentEnrollments,
  listPendingLateAbsences,
  listProcessedMakeupQueue,
  listTeacherWeek,
  openSeatCount,
  reportAbsence,
  requestMakeup,
  reviewLateAbsence,
  toggleSeatAttendance,
} from "./lessonStudio.js";

const DEMO_NOW = new Date("2026-08-10T17:00:00");

describe("createDemoStudioState", () => {
  it("seeds piano studio slots, students, and mixed session states", () => {
    const state = createDemoStudioState(DEMO_NOW);
    expect(state.studioName).toBe("ピアノ田中スタジオ");
    expect(state.slots.map((s) => s.name)).toEqual([
      "初級A・火曜",
      "初級A・木曜",
      "3級準備・土曜",
    ]);
    expect(state.policy.reMakeupAllowed).toBe(false);
    expect(state.students).toHaveLength(3);

    const hana = listParentEnrollments(state, "household-suzuki", DEMO_NOW).find(
      (e) => e.studentId === "stu-hana",
    );
    expect(hana?.thisWeekSession.status).toBe("scheduled");
    expect(hana?.thisWeekSession.canReportAbsence).toBe(true);

    const sota = listParentEnrollments(state, "household-suzuki", DEMO_NOW).find(
      (e) => e.studentId === "stu-sota",
    );
    expect(sota?.thisWeekSession.status).toBe("makeup_pending");

    const ryo = listParentEnrollments(state, "household-nakamura", DEMO_NOW).find(
      (e) => e.studentId === "stu-ryo",
    );
    expect(ryo?.thisWeekSession.status).toBe("makeup_confirmed");
    expect(ryo?.thisWeekSession.makeupTargetSummary).toContain("初級A・木曜");
  });

  it("seeds late absence review queue and processed makeup for demo cold start", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const late = listPendingLateAbsences(state);
    expect(late).toHaveLength(1);
    expect(late[0].studentName).toBe("鈴木はな");
    expect(late[0].absence.status).toBe("pending_teacher_review");

    const processed = listProcessedMakeupQueue(state);
    expect(processed.some((p) => p.request.id === "req-ryo-done")).toBe(true);
    expect(processed[0].statusLabel).toBe("確定");
  });
});

describe("RuntimeDurationRule (WF-3 / OP-4)", () => {
  it("derives 20/45/60 minutes from present count", () => {
    expect(deriveRuntimeMinutes(0)).toBe(0);
    expect(deriveRuntimeMinutes(1)).toBe(20);
    expect(deriveRuntimeMinutes(2)).toBe(45);
    expect(deriveRuntimeMinutes(3)).toBe(60);
  });

  it("locks lesson with derived actualMinutes after confirm", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const occ = state.occurrences.find((o) => o.id === "occ-tue-0811")!;
    let next = toggleSeatAttendance(state, occ.id, "stu-hana", "present");
    const result = confirmLesson(next, occ.id);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const updated = result.state.occurrences.find((o) => o.id === occ.id)!;
    expect(updated.locked).toBe(true);
    expect(updated.actualMinutes).toBe(20);
    expect(updated.status).toBe("recorded");
  });
});

describe("WF-1 absence reporting", () => {
  it("accepts on-time absence and marks makeup eligible", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const before = new Date("2026-08-10T12:00:00");
    const result = reportAbsence(state, {
      occurrenceId: "occ-tue-0811",
      studentId: "stu-hana",
      channel: "WEB_FORM",
      reason: "体調不良",
      now: before,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.notice.status).toBe("absence_confirmed");
    expect(result.notice.makeupEligible).toBe(true);
    const occ = result.state.occurrences.find((o) => o.id === "occ-tue-0811")!;
    expect(occ.seats["stu-hana"]).toBe("absent");
  });

  it("rejects duplicate absence notice", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const first = reportAbsence(state, {
      occurrenceId: "occ-tue-0811",
      studentId: "stu-hana",
      channel: "PHONE",
      now: new Date("2026-08-10T12:00:00"),
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = reportAbsence(first.state, {
      occurrenceId: "occ-tue-0811",
      studentId: "stu-hana",
      channel: "LINE",
      now: new Date("2026-08-10T13:00:00"),
    });
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error).toBe("ALREADY_REPORTED");
  });

  it("flags late absence as pending teacher review", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const late = new Date("2026-08-10T19:00:00");
    expect(isBeforeAbsenceDeadline("2026-08-11", state.policy, late)).toBe(false);
    const result = reportAbsence(state, {
      occurrenceId: "occ-tue-0811",
      studentId: "stu-hana",
      channel: "LINE",
      now: late,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.notice.status).toBe("pending_teacher_review");
    expect(result.notice.makeupEligible).toBe(false);
  });
});

describe("WF-2 makeup request and approval", () => {
  it("lists same-level open slots for makeup", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const targets = listAvailableMakeupTargets(state, "abs-sota-tue", DEMO_NOW);
    expect(targets.some((t) => t.id === "occ-thu-0813")).toBe(true);
    const thu = targets.find((t) => t.id === "occ-thu-0813")!;
    expect(openSeatCount(state, thu)).toBeGreaterThan(0);
  });

  it("submits makeup request after absence", () => {
    let state = createDemoStudioState(DEMO_NOW);
    const reported = reportAbsence(state, {
      occurrenceId: "occ-tue-0811",
      studentId: "stu-hana",
      channel: "WEB_FORM",
      now: new Date("2026-08-09T12:00:00"),
    });
    expect(reported.ok).toBe(true);
    if (!reported.ok) return;
    state = reported.state;
    const req = requestMakeup(state, {
      absenceNoticeId: reported.notice.id,
      targetOccurrenceId: "occ-thu-0813",
      now: DEMO_NOW,
    });
    expect(req.ok).toBe(true);
    if (!req.ok) return;
    expect(req.request.status).toBe("submitted");
  });

  it("approves makeup and updates outbound/inbound seats", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const result = approveMakeup(state, "req-sota-pending");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const source = result.state.occurrences.find((o) => o.id === "occ-tue-0811")!;
    const target = result.state.occurrences.find((o) => o.id === "occ-thu-0813")!;
    expect(source.makeupOutboundStudentIds).toContain("stu-sota");
    expect(target.makeupInboundStudentIds).toContain("stu-sota");
    const parent = listParentEnrollments(
      result.state,
      "household-suzuki",
      DEMO_NOW,
    ).find((e) => e.studentId === "stu-sota");
    expect(parent?.thisWeekSession.status).toBe("makeup_confirmed");
  });
});

describe("makeup queue (S2)", () => {
  it("sorts pending requests by hours until deadline ascending", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const queue = listMakeupQueue(state, DEMO_NOW);
    expect(queue.length).toBeGreaterThanOrEqual(1);
    expect(queue[0].request.id).toBe("req-sota-pending");
    expect(queue[0].studentName).toBe("鈴木颯太");
    expect(queue[0].levelBand).toBe("BEGINNER_A");
  });
});

describe("teacher week view (S1)", () => {
  it("includes seat rings and duration expectation for Tuesday class", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const week = listTeacherWeek(state, state.demoWeekStart, DEMO_NOW);
    const tue = week.find((v) => v.occurrence.id === "occ-tue-0811");
    expect(tue).toBeDefined();
    expect(tue!.seats).toHaveLength(2);
    expect(tue!.expectedMinutes).toBe(20);
    expect(tue!.isToday).toBe(false);
    expect(formatTime(tue!.slot.startMinutes)).toBe("16:00");
  });
});

describe("late absence review (D4/D8)", () => {
  it("approves pending_teacher_review and enables makeup", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const reviewed = reviewLateAbsence(
      state,
      "abs-hana-late-thu",
      true,
      "感染症のため特例",
    );
    expect(reviewed.ok).toBe(true);
    if (!reviewed.ok) return;
    const notice = reviewed.state.absences.find(
      (a) => a.id === "abs-hana-late-thu",
    );
    expect(notice?.status).toBe("absence_confirmed");
    expect(notice?.makeupEligible).toBe(true);
  });

  it("shows scheduled status for hana while late absence is on another occurrence", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const view = listParentEnrollments(state, "household-suzuki", DEMO_NOW).find(
      (e) => e.studentId === "stu-hana",
    );
    expect(view?.thisWeekSession.status).toBe("scheduled");
  });
});

describe("privacy (D11)", () => {
  it("parent view exposes open seat count without other student names in session", () => {
    const state = createDemoStudioState(DEMO_NOW);
    const views = listParentEnrollments(state, "household-suzuki", DEMO_NOW);
    for (const view of views) {
      expect(view.thisWeekSession.openSeatCount).toBeGreaterThanOrEqual(0);
      expect(typeof view.studentLabel).toBe("string");
    }
    const otherNames = views.flatMap((v) =>
      v.studentLabel === "鈴木はな" || v.studentLabel === "鈴木颯太"
        ? []
        : [v.studentLabel],
    );
    expect(otherNames.every((n) => n !== "中村涼")).toBe(true);
  });
});
