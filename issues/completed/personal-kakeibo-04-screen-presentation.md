# 04 — 家計簿画面の提示（genre look）を揃える

**Feature:** personal-kakeibo

**PBI:** PBI-0005（`pbl/items/PBI-0005-screen-presentation.md`）

**作るもの:** デモ版の主要導線上で、月次提示・消化の一目表示・取引リストの収支視覚差・マスタ導線が揃い、家計簿らしい画面提示として UC1–UC4 を画面だけで完遂できる。

**Blocked by:** personal-kakeibo-03-monthly-budget-and-status.md

**Status:** completed

**Triage:** ready-for-agent

- [x] 主要画面で対象月が利用者に分かり、少なくとも当月を中心に表示または切り替えできる（D12）
- [x] 予算消化状態（余裕・逼迫・超過、または未設定）が進捗表示または同等で一目で分かる（D13）
- [x] 取引一覧で日付・カテゴリ・口座・金額が分かり、収入と支出に視覚差がある（D14）
- [x] 口座・カテゴリ・月次予算の各操作へ同一アプリ内の画面から辿れる（D15）
- [x] UC1→UC2→UC3→UC4 を画面操作だけで一通り辿れる（demo-grade 導線）

## Comments

- cut: EPIC-0002 / PBI-0005 から切出し。決め事 D12–D15。01–03 の機能面を前提に提示を揃える。D16 対象外は実装しない。
- implement: genre look（月次バー／消化進捗／収支視覚差／マスタナビ）を UI に搭載。
