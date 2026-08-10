---
id: PBI-0003
title: 取引を下書き・確定・取消できる
type: feature
status: review
epic: EPIC-0002
---

# PBI-0003: 取引を下書き・確定・取消できる

## 価値

個人利用者が取引を下書き登録し、確定して実績に含め、必要なら取消できる。

## 受入条件

- [x] （AC-1）必須属性付きで取引を下書き登録できる。不正入力は拒否される
- [x] （AC-2）下書き→確定、下書き→取消、確定→取消のみ遷移できる
- [x] （AC-3）確定のみが家計実績・予算消化の対象になり、下書き・取消は対象外
- [x] （AC-4）画面から下書き登録・確定・取消ができ、状態が区別できる

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| transaction-lifecycle#D4 必須属性 | `addDraftTransaction` / `kakeibo.test.ts` | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| transaction-lifecycle#D5 状態遷移 | `confirmTransaction` / `cancelTransaction` | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| transaction-lifecycle#D6 実績への算入 | `getBudgetDigest` が confirmed expense のみ | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| transaction-lifecycle#D7 公開振る舞い | 画面「取引」 | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| usecases/record-transaction UC2 | 下書き→確定／取消の画面操作 | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| AC-1 下書き登録・不正拒否 | 単体＋UI | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| AC-2 許可された状態遷移のみ | 単体 | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| AC-3 確定のみ実績・消化対象 | 単体 | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |
| AC-4 画面での登録・確定・取消と状態区別 | `App.tsx` バッジ・ボタン | `issues/completed/personal-kakeibo-02-transaction-lifecycle.md` | covered |

### 補助一覧

関連仕様パス（表から辿れる範囲を重複なく）:

- `specs/L3/kakeibo/decisions/transaction-lifecycle.md`
- `specs/L3/kakeibo/decisions/accounts-and-categories.md`（D3 土台）
- `specs/L3/kakeibo/usecases/record-transaction.md`
- `specs/L3/kakeibo/glossary/terms.md`

関連コード / PR（表の証拠の親ディレクトリや PR でよい）:

- `product/apps/kakeibo/`

関連 issue:

- `issues/completed/personal-kakeibo-02-transaction-lifecycle.md`

## メモ

依存: PBI-0002。成熟度 draft。`done` にはしない。
Audit 2026-08-10: 重大指摘なし（Verifier A）。指摘リスト `quality/fw-validation/runs/20260810-kakeibo/audit-findings.md`。status → `review`。
