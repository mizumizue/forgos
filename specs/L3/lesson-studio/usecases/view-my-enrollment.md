---
layer: L3
domain: lesson-studio
kind: usecases
maturity: draft
actors:
  - 保護者（代理申立者）
  - 受講生（本人申立者）
---

# 在籍枠の確認

## 概要

保護者または受講生（本人）が、自世帯（または本人）の在籍固定枠と今週の回次ステータスを S3 マイ枠で確認する。

## 事前条件

- アクターがログイン済みである
- EnrollmentAssignment が存在する

## 事後条件

- 在籍枠（曜日・時刻・クラス名・LevelBand）が表示される
- 今週の回次ステータス（予定／欠席連絡済／振替申請中／振替確定／振替不可）が1行で追える
- 他受講生の氏名・出欠は表示されない

## 基本フロー

1. アクターが S3 マイ枠を開く
2. システムが在籍固定枠カードを表示する
3. システムが今週の回次ステータスを表示する
4. 状態に応じて主 CTA（欠席連絡／振替希望）の活性を切り替える

## 代替・例外フロー

- 在籍が paused／withdrawn の場合、欠席・振替 CTA は非活性とする

## 関連

- 決め事: `decisions/actor-surfaces.md` D4, `decisions/scheduling-rules.md` D11
- 用語: `glossary/terms.md`（EnrollmentAssignment, LessonOccurrence）
- アクター: `actors/members.md`
