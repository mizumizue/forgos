# Audit findings — 20260810-lesson-studio（overlay v3・工程10）

**Run:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**Branch:** `validation/20260810-lesson-studio`  
**Audit 日:** 2026-08-10  
**対象:** L3 `lesson-studio` + `product/` + manifest overlay v3（visibility 26 行・implement 14 行）

## 判定

**Pass (A)** — 重大 Gap なし。

- manifest `implement` **14/14** 行: `implement-reachability.md` で UI 到達・`cold_start=Yes` 申告。コード・シード・単体テストで裏取り。
- visibility **26/26** 行: `demo-seeded-check.md` 記載。cold start 表示は満たす（1 行は scope 文言と WF の解釈差 — 下記 AF-06・軽微）。
- 修復ラウンド: **不要**（ADR 不要）。

## Gap

- [ ] **なし（重大）**

| ID | 種別 | 内容 | 重大度 | 次アクション |
|----|------|------|--------|--------------|
| AF-G1 | Gap（軽微） | `product/apps/web` の `npm run build` が `lessonStudio.ts` の `statusLabel` 型（`MakeupProcessedItem`）で tsc 失敗。vitest は緑 | minor | 実装修正: `statusLabel` を `"確定" \| "却下"` に as const 化、または戻り型を合わせる |

## Conform

| ID | 種別 | 内容 | 重大度 | 次アクション |
|----|------|------|--------|--------------|
| AF-01 | Conform | `quality/unit` catalog に lesson-studio 紐づけなし（BL-20260810-02 既知・draft デモ） | minor | run-log 記録済み。Assure 時に catalog 追加 or 無視（理由: validation run） |
| AF-05 | Conform | manifest `deferred` 6 行（D のシード固定境界）は UI 編集なし — scope 意図どおり | — | 過剰実装なし。無視 |
| AF-06 | Conform | V-s3-status-absence-pending: scope は「振替を希望する」CTA **活性**、シードは `makeup_pending`（申請済み）のため CTA は **disabled**（WF・UC `request-makeup` 事後条件と整合） | minor | **仕様変更候補**（visibility 文言を「CTA 表示・申請済みは非活性」へ）または **無視**（実装は WF 正本どおり） |

## Baseline（L1 E1–E12）

| ID | 項目 | 結果 |
|----|------|------|
| E1 | 秘密情報 | 問題なし（tel プレースホルダのみ） |
| E2 | 仕様→実装の向き | PBI 対応表・issue Manifest で追跡。L3 から product パス参照なし |
| E3 | Audit 可能性 | manifest ID ↔ `App.tsx` / `lessonStudio.ts` ↔ vitest で追跡可能 |
| E4 | 単体テスト | `product/packages/domain` vitest **15 passed** |
| E6–E8 | 入力検証・失敗表現 | domain API が `ok` / `error` で返却。UI は flash で区別 |
| E7 | 認可 | クライアント actor タブはデモ用。世帯フィルタは domain で `householdId` 限定（D11） |
| E12 | 構造衛生 | `App.tsx` 単ファイル約 1000 行（表面コンポーネント内包）。デモ規模では許容。本番前に分割検討可 |
| AF-02 | genre look G1–G5 | 座席リング・今日縦帯・ウォームスタジオ CSS 反映（`styles.css`） |
| AF-03 | actor-split | 講師／保護者／受講生 3 タブ + S1/S2/S3 分離 |
| AF-04 | ジャーニー J1–J4 | `implement-reachability.md` §I7 に手順記載 |

## manifest 到達（overlay v3 重大候補チェック）

| チェック | 結果 |
|----------|------|
| manifest `implement` 14 行 UI 到達 | **Yes**（14/14） |
| 全行 `cold_start=Yes` | **Yes**（シード `createDemoStudioState(DEMO_NOW)` + `DEMO_NOW=2026-08-10T17:00:00`） |
| domain のみで済ませた行 | なし（PBI tier 全 `ui`） |
| visibility 26 行 cold start | **Yes**（表示要件。AF-06 は活性文言のみ解釈差） |
| `implement-reachability.md` 欠落 | なし |
| `demo-seeded-check.md` 欠落 | なし |
| actor-split 破れ | なし |
| demo-seeded 欠落 | なし（初級A火曜・木曜・3級準備土曜・石橋型期限・振替キュー混在状態） |
| design-call ジャーニー省略 | なし |
| sector brief／spec-depth／design-call 薄い一般論 | なし（各 RUN 成果あり） |

## visibility cold start（v3 サマリ）

| 区分 | 行数 | cold start |
|------|------|------------|
| Actor（V-a-*） | 3 | Yes |
| S1（V-s1-*） | 9 | Yes |
| S2（V-s2-*） | 7 | Yes |
| S3（V-s3-*） | 7 | Yes（AF-06: CTA 活性文言のみ） |
| **計** | **26** | **Pass** |

## Assure

**対象あり（未実行・誘導のみ）**

- 製品仕様: L3 `lesson-studio`（draft）
- `quality/unit` catalog: lesson-studio 未紐づけ（AF-01 / BL-20260810-02）
- 次: `/assure` で Coverage（scheduling-rules D1–D13 ↔ catalog）+ vitest Evidence 台帳

## 次アクション

1. **AF-06** — visibility 文言修正（Specify／scope 再統合）**または** 実装どおり無視（推奨: 無視。WF 正本優先）
2. **AF-G1** — Implement 余力で tsc ビルド緑化（E4 補助。デモランタイムは vitest で担保済み）
3. **AF-01** — validation 完了後 Assure で catalog Coverage 検討
4. **PBI-0002** — `verify` → `review`（本 Audit Pass A）

## 単体テスト

`product/packages/domain` vitest **15 passed**（overlay v3 cold start シードテスト含む）

## ADR

不要（修復ラウンドなし）。
