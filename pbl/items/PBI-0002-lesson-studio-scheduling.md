---
id: PBI-0002
title: "小規模ピアノ教室の授業枠・出席・振替管理"
type: feature
status: verify
feature-slug: lesson-studio-scheduling
---

# PBI-0002: 小規模ピアノ教室の授業枠・出席・振替管理

## 価値

1人講師の定員制グループレッスン教室において、講師は週次レッスン帳で出欠と実施時間を確定し、振替キューで申請を処理できる。保護者／受講生はマイ枠から期限内欠席連絡と振替希望を完結できる。

## 受入条件

- [ ] （AC-1）保護者が期限内に欠席連絡すると S3 が「欠席連絡済」となり S1 に欠席が反映される
- [ ] （AC-2）欠席連絡済の受講生が同レベル・定員空きの振替先を申請し、講師が S2 で確定すると双方に「振替確定」が反映される
- [ ] （AC-3）講師が S1 で出欠をトグルすると人数連動の実施時間が導出され、確定後にロックされる
- [ ] （AC-4）ガード違反の振替申請は講師 override なしでは受理されない
- [ ] （AC-5）保護者面に他受講生の氏名・出欠は表示されない

## マップ

### 対応表（必須）

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| scheduling-rules#D1 週次クラス枠 | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| scheduling-rules#D2 在籍割当 | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| scheduling-rules#D3–D5 欠席連絡 WF-1 | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| scheduling-rules#D6–D8 振替 WF-2 | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md`, `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| scheduling-rules#D9–D10 出欠正本・実施時間 WF-3 | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| scheduling-rules#D11 プライバシー | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| actor-surfaces#D1–D6 主表面3・actor-split | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md`, `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| usecases/report-absence | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| usecases/request-makeup | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |
| usecases/process-makeup-queue | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| usecases/confirm-lesson-attendance | `product/packages/domain/src/lessonStudio.test.ts` | `issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` | covered |
| usecases/view-my-enrollment | `product/apps/web/src/App.tsx` | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md` | covered |

### 補助一覧

関連仕様パス:

- `specs/L3/lesson-studio/decisions/scheduling-rules.md`
- `specs/L3/lesson-studio/decisions/actor-surfaces.md`
- `specs/L3/lesson-studio/usecases/`
- `quality/fw-validation/runs/20260810-lesson-studio/scope.md`
- `quality/fw-validation/runs/20260810-lesson-studio/design-call.md`
- `quality/fw-validation/runs/20260810-lesson-studio/sector-brief.md`

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

Validation run `20260810-lesson-studio`。design-call の主表面 S1/S2/S3、遷移 J1–J4 に整合。
