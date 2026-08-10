---
layer: L3
domain: lesson-studio
kind: usecases
maturity: draft
actors:
  - 講師（オーナー）
---

# 当日出欠の確定と実施時間の記録

## 概要

講師が S1 レッスン帳で各生徒の出欠を確定し、出席人数に応じた実施時間を記録する（WF-3）。

## 事前条件

- 対象 LessonOccurrence が scheduled または held である
- 講師がログイン済みである

## 事後条件

- 出欠が正本として確定し、編集がロックされる
- RuntimeDurationRule に基づく actualMinutes が記録される
- 振替 outbound の生徒は当該枠で空席扱いとなる

## 基本フロー

1. 講師が S1 で対象日のクラス枠カードを開く
2. 座席リング上で各生徒の出席／欠席／未確定をトグルする
3. システムが出席人数に応じた実施時間の期待値を更新する
4. 講師が「レッスンを確定」する
5. 枠カードがロックされ、recorded 状態となる

## 代替・例外フロー

- 全員欠席: 休講扱いの提案を表示し、cancelled_no_show または講師確認後に記録する
- 振替確定済み生徒: 当該枠は振替 outbound 表示とし、座席は空席扱いとする
- 過去の確定済み枠: 読み取り専用とする

## 関連

- 決め事: `decisions/scheduling-rules.md` D9–D10, D12
- 決め事: `decisions/actor-surfaces.md` D2
- 用語: `glossary/terms.md`（RuntimeDurationRule, LessonOccurrence）
