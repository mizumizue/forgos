---
id: PBI-0002
title: "小規模ピアノ教室の授業枠・出席・振替管理"
type: feature
status: review
feature-slug: lesson-studio-scheduling
---

# PBI-0002: 小規模ピアノ教室の授業枠・出席・振替管理

## 価値

1人講師の定員制グループレッスン教室において、講師は週次レッスン帳で出欠と実施時間を確定し、振替キューで申請を処理できる。保護者／受講生はマイ枠から期限内欠席連絡と振替希望を完結できる。

## 受入条件

- [ ] （AC-1）manifest A 全 actor が demo-seeded ペルソナで主表面に到達できる（A-teacher, A-parent, A-student）
- [ ] （AC-2）manifest B の 5 UC が画面で完遂できる（B-uc-view-enrollment 〜 B-uc-confirm-attendance）
- [ ] （AC-3）manifest C の例外 4 件が S1/S2 から操作できる（C-late-absence, C-makeup-reject, C-override-makeup, C-all-absent）
- [ ] （AC-4）manifest D の implement 行 2 件が UI 到達可能（D-runtime-duration, D-contact-channel）
- [ ] （AC-5）保護者面に他受講生の氏名・出欠は表示されない
- [ ] （AC-6）cold start（起動直後）で `scope.md` §demo-seeded visibility の全 26 V-ID が画面に見える（manifest 行と束ね可）:
  - Actor 到達（3）: V-a-teacher（S1/S2）、V-a-parent（S3・鈴木家のみ）、V-a-student（S3・本人のみ）
  - S1 レッスン帳（9）: V-s1-today-band、V-s1-slot-tue、V-s1-slot-thu、V-s1-slot-sat、V-s1-seat-ring、V-s1-absence-seat、V-s1-duration-badge、V-s1-makeup-link、V-s1-outbound-seat
  - S2 振替キュー（7）: V-s2-pending-card、V-s2-processed-card、V-s2-level-chips、V-s2-policy-labels、V-s2-late-absence、V-s2-override-entry、V-s2-reject-entry
  - S3 マイ枠（7）: V-s3-parent-enrollment、V-s3-student-enrollment、V-s3-status-scheduled、V-s3-status-absence-pending、V-s3-status-makeup-done、V-s3-contact-channel、V-s3-privacy-empty-seat

## マップ

### 対応表（必須）

| 規範 | tier | 証拠 | issue | 状態 |
|------|------|------|--------|------|
| manifest A-teacher | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest A-parent | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| manifest A-student | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| manifest B-uc-view-enrollment | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| manifest B-uc-report-absence | ui | `product/apps/web/src/App.tsx`, `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| manifest B-uc-request-makeup | ui | `product/apps/web/src/App.tsx`, `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| manifest B-uc-process-makeup | ui | `product/apps/web/src/App.tsx`, `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest B-uc-confirm-attendance | ui | `product/apps/web/src/App.tsx`, `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest C-late-absence | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest C-makeup-reject | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest C-override-makeup | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest C-all-absent | ui | `product/apps/web/src/App.tsx`, `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest D-runtime-duration | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| manifest D-contact-channel | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| visibility V-a-parent, V-a-student | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| visibility V-s3-parent-enrollment, V-s3-student-enrollment, V-s3-status-scheduled, V-s3-status-absence-pending, V-s3-status-makeup-done, V-s3-contact-channel, V-s3-privacy-empty-seat | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| visibility V-a-teacher | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| visibility V-s1-today-band, V-s1-slot-tue, V-s1-slot-thu, V-s1-slot-sat, V-s1-seat-ring, V-s1-absence-seat, V-s1-duration-badge, V-s1-makeup-link, V-s1-outbound-seat | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| visibility V-s2-pending-card, V-s2-processed-card, V-s2-level-chips, V-s2-policy-labels, V-s2-late-absence, V-s2-override-entry, V-s2-reject-entry | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| scheduling-rules#D1–D13 | domain | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md`, `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| actor-surfaces#D1–D6 | ui | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md`, `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |

### 補助一覧

関連仕様パス:

- `specs/L3/lesson-studio/decisions/scheduling-rules.md`
- `specs/L3/lesson-studio/decisions/actor-surfaces.md`
- `specs/L3/lesson-studio/usecases/`
- `quality/fw-validation/runs/20260810-lesson-studio/scope.md`（§implementation manifest、§demo-seeded visibility）
- `quality/fw-validation/runs/20260810-lesson-studio/design-call.md`
- `quality/fw-validation/runs/20260810-lesson-studio/implement-reachability.md`

関連コード:

- `product/packages/domain/`
- `product/apps/web/`

関連 issue:

- `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md`
- `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md`

## 内部結合より先（任意）

- 成果物: 単体テスト（domain vitest）
- 再 Audit: 工程10で実施予定

## メモ

Validation run `20260810-lesson-studio`。manifest `implement` 14 行。design-call J1–J4 に整合。
