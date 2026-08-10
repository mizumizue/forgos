---
layer: L3
domain: lesson-studio
kind: usecases
maturity: draft
actors:
  - 保護者（代理申立者）
  - 受講生（本人申立者）
---

# 振替希望の申出

## 概要

欠席連絡済（makeup_eligible）の受講生が、同 LevelBand・定員空きの振替先を選択して MakeupRequest を提出する（WF-2 申請側）。

## 事前条件

- 対象欠席が makeup_eligible である
- 当月の確定振替数が MakeupQuotaPerMonth 未満である

## 事後条件

- 条件充足: MakeupRequest が submitted となり、講師 S2 に表示される
- 条件不足: 申請は rejected となり、理由が表示される
- S3 に「振替申請中」ステータスが反映される

## 基本フロー

1. アクターが S3 で「振替を希望する」を選択する
2. システムが同 LevelBand・定員空きの候補 LessonOccurrence をチップ列で提示する
3. アクターが候補を選択し申請する
4. システムが D6 のガードを検証する
5. S3 に戻り、ステータスが「振替申請中」となる

## 代替・例外フロー

- 同レベル空きなし: 「今月は同レベルの空きがありません」と規約タグを表示し、S3 に戻る
- ガード違反（定員超過・回数超過・有効期間超過）: 申請を rejected とし理由を表示する

## 関連

- 決め事: `decisions/scheduling-rules.md` D6–D7
- 用語: `glossary/terms.md`（MakeupRequest, LevelBand, CapacityTier）
- ユースケース: `usecases/process-makeup-queue.md`
