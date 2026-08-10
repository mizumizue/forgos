---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 店主（スタイリスト）
---

# 店主が予約を確定する

## 概要

店主が本日台帳で当日の予約を時間順に把握し、申請中の予約を確定する。

## 事前条件

- 申請状態の予約が存在する
- 店主が本日台帳の導線を利用できる

## 事後条件

- 対象予約が確定状態になっている
- 店主が当日の並びと状態を把握できる

## 基本フロー

1. 店主が本日台帳を開く
2. 当日の予約を時間順に確認する
3. 申請中の予約を選び確定する
4. 確定後の状態を確認する

## 代替・例外フロー

- 既にキャンセルされた申請は確定できない

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`（D5, D6）
- 用語: `specs/L3/reservations/glossary/terms.md`
- アクター: `specs/L3/reservations/actors/members.md`
