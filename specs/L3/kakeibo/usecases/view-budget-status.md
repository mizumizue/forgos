---
layer: L3
domain: kakeibo
kind: usecases
maturity: draft
actors:
  - 個人利用者
---

# UC4. 予算消化状態を確認する

## 概要

個人利用者が、確定済み支出と月次予算に基づく予算消化状態（余裕・逼迫・超過、または未設定）を画面で確認する。

## 事前条件

- （任意）対象月の月次予算が設定されている
- （任意）対象月に確定済み支出がある

## 事後条件

- 対象月の予算消化状態が画面上で分かる

## 基本フロー

1. 個人利用者が月次サマリーまたは同等の確認画面を開く
2. 対象月を確認する（必要なら切り替える）
3. 予算消化状態（余裕・逼迫・超過、または未設定）を確認する

## 代替・例外フロー

- 月次予算未設定のとき、「未設定」と分かり、余裕・逼迫・超過とは表示しない

## 関連

- 決め事: `specs/L3/kakeibo/decisions/monthly-budget-and-status.md`、`specs/L3/kakeibo/decisions/screen-presentation.md`
- 用語: `specs/L3/kakeibo/glossary/terms.md`
