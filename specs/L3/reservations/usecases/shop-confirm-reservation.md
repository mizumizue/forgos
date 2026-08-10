---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 店舗スタッフ
---

# 店舗が申込を確定／却下／保留する

## 概要

店舗スタッフが受付中の申込を確認し、確定・却下・保留のいずれかを行う。

## 事前条件

- 受付状態の予約がある

## 事後条件

- 予約ステータスが確定、却下、または保留になっている

## 基本フロー

1. 店舗スタッフが受付中の予約を開く
2. 内容（日時・人数・顧客・割当リソース）を確認する
3. 確定、却下、または保留を選ぶ
4. 一覧・詳細の状態が更新される

## 代替・例外フロー

- すでに確定済み・キャンセル済みなど、操作不能な状態の予約には確定操作を適用しない

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`
- 用語: `specs/L3/reservations/glossary/terms.md`
