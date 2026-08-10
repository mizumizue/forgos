# Audit findings — 20260810-lesson-studio（再実行・工程10）

**Run:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**Branch:** `validation/20260810-lesson-studio`  
**Audit 日:** 2026-08-10  
**対象:** L3 `lesson-studio` + `product/` + manifest overlay v2

## 判定

**Pass (A)** — 重大 Gap なし。manifest `implement` 14 行は `implement-reachability.md` で UI 到達証明済み。

## Gap / Conform / Baseline

| ID | 種別 | 内容 | 重大度 | 次アクション |
|----|------|------|--------|--------------|
| AF-01 | Conform | `quality/unit` catalog に lesson-studio 紐づけなし（BL-20260810-02 既知） | 軽微 | run-log に記録。draft デモ許容 |
| AF-02 | Baseline | genre look G1–G5（座席リング・ウォームスタジオ等）が `App.tsx` styles に反映 | — | 確認済み |
| AF-03 | Baseline | actor-split 3 タブ（講師／保護者／受講生）で S1/S2/S3 分離 | — | 確認済み |
| AF-04 | Baseline | ジャーニー J1–J4 の操作手順が `implement-reachability.md` §I7 に記載 | — | 確認済み |
| AF-05 | Conform | manifest `deferred` 6 行（シード固定境界）は UI 編集なし — scope 意図どおり | — | 過剰実装なし |

## manifest 到達（重大候補チェック）

| チェック | 結果 |
|----------|------|
| manifest `implement` 行すべて UI 到達 | Yes（14/14） |
| domain のみで済ませた行 | なし |
| design-call ジャーニー省略 | なし |
| actor-split 破れ | なし |
| demo-seeded 欠落 | なし（初級A火曜・3級準備土曜・石橋型期限） |

## 単体テスト

`product/packages/domain` vitest **14 passed**

## ADR

不要（修復ラウンドなし）。
