---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 来店客
---

# 予約を申し込む

## 概要

来店客が施術メニューと空き枠を選び、顧客最小情報とともに予約を申請する。申込面でキャンセルポリシー文面を確認できる。

## 事前条件

- 選んだメニューの所要に合う空き枠が存在する
- 対象枠が営業時間内であり、定休・休憩・既存予約と重ならない

## 事後条件

- 予約が申請状態で作成されている
- 当該時間塊は他の申込と重ならないよう占有される
- 来店客が同一予約の状態を追える起点がある

## 基本フロー

1. 来店客が施術メニューを選ぶ
2. 提示された空き枠から開始時刻を選ぶ
3. キャンセルポリシー文面を確認する
4. 顧客最小情報を添えて申し込む
5. 予約が申請として受け付けられる

## 代替・例外フロー

- 申込時点で枠が既に埋まっている／ブロックされている場合、申込は拒否される

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`（D1, D2, D5, D8, D9）
- 用語: `specs/L3/reservations/glossary/terms.md`
- UC: `specs/L3/reservations/usecases/check-availability.md`
