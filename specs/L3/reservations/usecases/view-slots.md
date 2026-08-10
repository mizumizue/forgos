---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 来店客
---

# 空き枠を見る

## 概要

来店客が予約申込面で、メニュー所要が反映された空き枠の一覧を見る。

## 事前条件

- 施術メニューが選択可能である

## 事後条件

- 来店客が開始時刻と所要に基づく空き枠を把握している

## 基本フロー

1. 来店客が予約申込面を開く
2. 施術メニュー（所要時間つき）を確認・選択する
3. 提示された空き枠の時間帯を見る

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`（D1, D2）
- 用語: `specs/L3/reservations/glossary/terms.md`
- UC: `specs/L3/reservations/usecases/check-availability.md`
