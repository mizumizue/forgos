---
layer: L3
domain: reservations
kind: usecases
maturity: draft
actors:
  - 店舗スタッフ
  - 顧客
---

# 空きを確認する

## 概要

店舗スタッフまたは顧客が、日時・人数・提供リソースの空きを画面で確認する。

## 事前条件

- 予約枠が営業前提で参照できる

## 事後条件

- 申し込み可能な空きかどうかが分かる

## 基本フロー

1. 利用者が日時・人数・提供リソースを指定する
2. システムが空き可否を返す
3. 利用者は空きがある場合に申込へ進める

## 代替・例外フロー

- 定員超過、または該当枠が無い場合は申込へ進めない

## 関連

- 決め事: `specs/L3/reservations/decisions/reservation-rules.md`
- 用語: `specs/L3/reservations/glossary/terms.md`
