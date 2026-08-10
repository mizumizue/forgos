---
layer: L3
domain: kakeibo
kind: usecases
maturity: draft
actors:
  - 個人利用者
---

# UC3. 月次予算を設定する

## 概要

個人利用者が対象年月の月次予算（支出の上限感）を画面で設定する。

## 事前条件

- アプリの画面にアクセスできる

## 事後条件

- 対象年月に正の金額の月次予算が設定されている（設定を完了した場合）

## 基本フロー

1. 個人利用者が月次予算の設定へ辿る
2. 対象年月と金額を指定して保存する
3. 設定内容を画面で確認する

## 代替・例外フロー

- 金額が正でないとき、設定は拒否される
- 同一年月への再設定は上書きされる

## 関連

- 決め事: `specs/L3/kakeibo/decisions/monthly-budget-and-status.md`
- 用語: `specs/L3/kakeibo/glossary/terms.md`
