---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 店舗スタッフ
---

# 予約枠を把握する

## 概要

店舗スタッフが、日付や提供リソース単位で受付可能な予約枠と定員を画面で把握する。

## 事前条件

- 営業時間・休業が参照できる

## 事後条件

- 受付可能な時間帯・定員・提供リソースの前提が分かる

## 基本フロー

1. 店舗スタッフが対象日（または期間）を選ぶ
2. 提供リソース単位で予約枠と定員を確認する
3. 既存予約がある場合は枠上の占有として把握する

## 代替・例外フロー

- 休業日を選んだ場合、受付可能な枠は表示されない

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`
- 用語: `specs/L3/reservations/glossary/terms.md`
