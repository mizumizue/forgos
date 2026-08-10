---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 店舗スタッフ
---

# 営業時間・休業を確認／設定する

## 概要

店舗スタッフが、予約枠の前提となる営業時間と休業日を確認し、必要なら設定する。

## 事前条件

- 対象店舗が特定されている

## 事後条件

- 営業時間・休業が予約枠の前提として参照できる

## 基本フロー

1. 店舗スタッフが営業時間・休業の現状を確認する
2. 必要に応じて営業時間または休業日を設定する
3. 設定後の内容が枠把握の前提として使えることを確認する

## 代替・例外フロー

- 休業日として扱う日には、受付可能な予約枠を出さない（決め事 D1）

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`
- 用語: `specs/L3/reservations/glossary/terms.md`
