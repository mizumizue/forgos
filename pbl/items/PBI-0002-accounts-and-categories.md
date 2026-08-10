---
id: PBI-0002
title: 口座・カテゴリを用意できる
type: feature
status: review
epic: EPIC-0002
---

# PBI-0002: 口座・カテゴリを用意できる

## 価値

取引の土台として、個人利用者が口座とカテゴリを画面から登録できる。

## 受入条件

- [x] （AC-1）名称付きの口座を登録できる。空名称は拒否される
- [x] （AC-2）名称と収入／支出の向き付きのカテゴリを登録できる。空名称は拒否される
- [x] （AC-3）登録した口座・カテゴリが取引の土台として参照できる（未登録紐づけは拒否）

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| accounts-and-categories#D1 口座登録 | `product/apps/kakeibo/src/domain/kakeibo.ts` / 画面「口座」 | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |
| accounts-and-categories#D2 カテゴリ登録 | 同上 / 画面「カテゴリ」 | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |
| accounts-and-categories#D3 取引の土台 | `addDraftTransaction` の口座・カテゴリ検証 | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |
| usecases/prepare-masters UC1 | 画面導線 口座→カテゴリ | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |
| AC-1 口座登録・空名称拒否 | `kakeibo.test.ts` + UI alert | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |
| AC-2 カテゴリ登録・空名称拒否 | 同上 | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |
| AC-3 土台参照・未登録拒否 | 同上 | `issues/completed/personal-kakeibo-01-accounts-and-categories.md` | covered |

### 補助一覧

関連仕様パス（表から辿れる範囲を重複なく）:

- `specs/L3/kakeibo/decisions/accounts-and-categories.md`
- `specs/L3/kakeibo/usecases/prepare-masters.md`
- `specs/L3/kakeibo/glossary/terms.md`
- `specs/L3/kakeibo/actors/members.md`

関連コード / PR（表の証拠の親ディレクトリや PR でよい）:

- `product/apps/kakeibo/`

関連 issue:

- `issues/completed/personal-kakeibo-01-accounts-and-categories.md`

## メモ

成熟度 draft。`done` にはしない。対象外 D16 は本 PBI の範囲外。
Audit 2026-08-10: 重大指摘なし（Verifier A）。指摘リスト `quality/fw-validation/runs/20260810-kakeibo/audit-findings.md`。status → `review`。
