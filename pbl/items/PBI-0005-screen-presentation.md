---
id: PBI-0005
title: 家計簿画面の提示（genre look）を満たす
type: feature
status: review
epic: EPIC-0002
---

# PBI-0005: 家計簿画面の提示（genre look）を満たす

## 価値

デモ版として、月次中心・消化の一目表示・取引リストの収支差・マスタ導線が揃い、家計簿らしい画面提示で主要導線を完遂できる。

## 受入条件

- [x] （AC-1）主要画面で対象月が分かり、少なくとも当月中心に表示または切り替えができる
- [x] （AC-2）予算消化状態が進捗表示または同等で一目で分かる
- [x] （AC-3）取引一覧で日付・カテゴリ・口座・金額が分かり、収入と支出に視覚差がある
- [x] （AC-4）口座・カテゴリ・月次予算の各操作へ同一アプリ内から辿れる

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| screen-presentation#D12 月次の提示 | `App.tsx` 月次バー（前月／翌月） | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| screen-presentation#D13 予算消化の提示 | 進捗バー＋状態ラベル | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| screen-presentation#D14 取引リストの提示 | `data-kind` 収入／支出の色差 | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| screen-presentation#D15 マスタへの導線 | nav: 口座／カテゴリ／月次予算 | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| AC-1 対象月の表示／切替 | 同上 | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| AC-2 消化状態の一目表示 | 同上 | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| AC-3 取引リストの収支視覚差 | 同上 | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| AC-4 マスタ操作への導線 | 同上 | `issues/completed/personal-kakeibo-04-screen-presentation.md` | covered |
| out-of-scope#D16 対象外（意図的非実装） | — | — | gap |

### 補助一覧

関連仕様パス（表から辿れる範囲を重複なく）:

- `specs/L3/kakeibo/decisions/screen-presentation.md`
- `specs/L3/kakeibo/decisions/out-of-scope.md`
- `specs/L3/kakeibo/usecases/view-budget-status.md`
- `specs/L3/kakeibo/usecases/prepare-masters.md`
- `specs/L3/kakeibo/usecases/record-transaction.md`
- `specs/L3/kakeibo/usecases/set-monthly-budget.md`

関連コード / PR（表の証拠の親ディレクトリや PR でよい）:

- `product/apps/kakeibo/`

関連 issue:

- `issues/completed/personal-kakeibo-04-screen-presentation.md`

## メモ

機能本体は PBI-0002〜0004。本 PBI は画面提示（genre look）の受入境界。D16 は意図的 gap。成熟度 draft。`done` にはしない。
Audit 2026-08-10: 重大指摘なし（Verifier A）。指摘リスト `quality/fw-validation/runs/20260810-kakeibo/audit-findings.md`。status → `review`。
