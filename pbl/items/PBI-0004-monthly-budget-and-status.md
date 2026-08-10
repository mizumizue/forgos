---
id: PBI-0004
title: 月次予算を設定し消化状態を確認できる
type: feature
status: review
epic: EPIC-0002
---

# PBI-0004: 月次予算を設定し消化状態を確認できる

## 価値

個人利用者が対象月の月次予算を設定し、確定済み支出に基づく消化状態（余裕・逼迫・超過、または未設定）を画面で把握できる。

## 受入条件

- [x] （AC-1）対象年月ごとに正の金額の月次予算を設定できる。不正金額は拒否、再設定は上書き
- [x] （AC-2）消化は対象月の確定済み支出合計のみを対象とする
- [x] （AC-3）予算あり時は余裕／逼迫／超過、未設定時は「未設定」と分かる
- [x] （AC-4）画面で予算設定と消化状態確認ができる

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| monthly-budget-and-status#D8 月次予算の設定 | `setMonthlyBudget` / 画面「月次予算」 | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| monthly-budget-and-status#D9 消化の対象 | `getBudgetDigest` | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| monthly-budget-and-status#D10 予算消化状態 | 閾値テスト + UI `data-testid=budget-status` | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| monthly-budget-and-status#D11 公開振る舞い | 月次サマリー／月次予算画面 | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| usecases/set-monthly-budget UC3 | 画面「月次予算」 | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| usecases/view-budget-status UC4 | 画面「月次サマリー」 | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| AC-1 予算設定・拒否・上書き | 単体＋UI | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| AC-2 確定済み支出のみ消化 | 単体 | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| AC-3 三態または未設定 | 単体＋進捗バー | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |
| AC-4 画面での設定・確認 | `App.tsx` | `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md` | covered |

### 補助一覧

関連仕様パス（表から辿れる範囲を重複なく）:

- `specs/L3/kakeibo/decisions/monthly-budget-and-status.md`
- `specs/L3/kakeibo/usecases/set-monthly-budget.md`
- `specs/L3/kakeibo/usecases/view-budget-status.md`
- `specs/L3/kakeibo/glossary/terms.md`

関連コード / PR（表の証拠の親ディレクトリや PR でよい）:

- `product/apps/kakeibo/`

関連 issue:

- `issues/completed/personal-kakeibo-03-monthly-budget-and-status.md`

## メモ

成熟度 draft。`done` にはしない。
Audit 2026-08-10: 重大指摘なし（Verifier A）。指摘リスト `quality/fw-validation/runs/20260810-kakeibo/audit-findings.md`。status → `review`。
