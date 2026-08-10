---
layer: L3
domain: kakeibo
kind: usecases
maturity: draft
actors:
  - 個人利用者
---

# UC1. 口座・カテゴリを用意する

## 概要

個人利用者が取引の土台として口座とカテゴリを画面から登録する。

## 事前条件

- アプリの画面にアクセスできる

## 事後条件

- 少なくとも1つの口座と、取引に使えるカテゴリが登録されている（利用者が登録を完了した場合）

## 基本フロー

1. 個人利用者が口座登録画面へ辿る
2. 名称を入力して口座を登録する
3. カテゴリ登録画面へ辿る
4. 名称と収入／支出の向きを指定してカテゴリを登録する

## 代替・例外フロー

- 名称が空のとき、登録は拒否され、利用者に分かる

## 関連

- 決め事: `specs/L3/kakeibo/decisions/accounts-and-categories.md`
- 用語: `specs/L3/kakeibo/glossary/terms.md`
