---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 店主（スタイリスト）
---

# 営業時間とメニュー所要を管理する

## 概要

店主が店設定面で営業時間・定休・休憩ブロックと施術メニューの所要時間を整え、以降の空き枠提示に効かせる。

## 事前条件

- 店主が店設定の導線を利用できる

## 事後条件

- 設定した営業時間・定休・休憩が空き枠生成の前提になる
- 設定したメニュー所要が以降の空き枠長に反映される

## 基本フロー

1. 店主が店設定を開く
2. 営業時間・定休・休憩ブロックを設定する
3. 施術メニューとその所要時間を設定する
4. 以降の空き枠確認／申込が新しい前提に従う

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`（D3, D4）
- 用語: `specs/L3/reservations/glossary/terms.md`
- アクター: `specs/L3/reservations/actors/members.md`
- 対象外: `specs/L3/reservations/decisions/out-of-scope.md`
