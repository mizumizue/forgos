---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 顧客
  - 店舗スタッフ
---

# 予約を申し込む

## 概要

顧客（または店舗スタッフの代行）が、空きを前提に最小限の顧客情報で予約を申し込む。申込時点の予約ステータスは受付とする。

## 事前条件

- 対象の日時・人数・提供リソースに空きがある

## 事後条件

- 予約が受付状態で作成され、一覧・詳細から追える

## 基本フロー

1. 利用者が空きのある枠を選ぶ
2. 氏名・連絡先など最小の顧客情報を入力する
3. 申し込む
4. 予約が受付として記録される

## 代替・例外フロー

- 申込時点で定員超過または枠消失の場合は拒否する
- 顧客情報が不足する場合は受け付けない

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`
- 用語: `specs/L3/reservations/glossary/terms.md`
