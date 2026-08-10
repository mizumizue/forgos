# Run log — 20260810-lesson-studio（overlay v3 再実行）

**テーマ:** 小規模ピアノ教室の受講生・授業枠・振替管理（1人講師・定員制グループレッスン）  
**ブランチ:** `validation/20260810-lesson-studio`  
**feature-slug:** `lesson-studio-scheduling`  
**STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**実施日:** 2026-08-10（overlay v3 再実行：工程5・8–12）

## 概要

overlay v2 完了後、`DEMO-UX.md` overlay v3（demo-seeded visibility・`demo-seeded-check.md`・`cold_start` 列・Audit 拡張）を追加。**工程1–4**（sector brief／spec-depth／design-call）と**工程6–7**（L3・promote-check・Source 削除済み）を保持し、**工程5 → 8 → 9 → 10 → 11 → 12** を hands-off で再実行。

## 工程サマリー

| # | 工程 | 結果 | 主成果物 |
|---|------|------|----------|
| 1–2 | テーマ／業種調査 | Pass（保持） | `sector-brief.md`, `loop-log.md` |
| 3 | 仕様深度 | Pass（保持） | `spec-depth.md` |
| 4 | モックデザイン | Pass（保持） | `design-call.md` |
| 5 | スコープ統合（v3） | Pass | `scope.md` §demo-seeded visibility（26 行） |
| 6 | Spike | Pass（保持） | Source 削除済み |
| 7 | Promote | Pass（保持） | `specs/L3/lesson-studio/` |
| 8 | map/cut（v3） | Pass | PBI AC-6、issues cold start チェックリスト |
| 9 | Implement（v3） | Pass | `product/`、`implement-reachability.md`、`demo-seeded-check.md` |
| 10 | Audit（v3） | Pass (A) | `audit-findings.md` |
| 11 | 実証ログ | Pass | 本ファイル |
| 12 | ログのみ main | 下記 | `quality/fw-validation/` のみ main 反映 |

## エンジニアリングサマリー（v3）

- **visibility 26 行:** `scope.md` の V-a / V-s1 / V-s2 / V-s3 を `demo-seeded-check.md` で cold start 証明。manifest implement **14/14** は `implement-reachability.md` で `cold_start=Yes`。
- **シード:** `createDemoStudioState` + `DEMO_NOW=2026-08-10T17:00:00`（月曜17:00）で欠席 CTA 期限前・火曜／木曜／土曜枠・振替キュー混在を起動直後表示。
- **genre look:** 座席リング・週ストリップ今日帯・ウォームスタジオパレット・規約タグ（G1–G5）維持。
- **Audit 参照:** 重大 Gap なし。軽微は `audit-findings.md`（AF-G1 tsc、`AF-06` CTA 文言解釈差）。

## 詰まり・所見

- **overlay v3 差分:** v2 時点では `## demo-seeded visibility` 未整備。v3 で scope 26 行・map/cut M7・I2a/I9a/I12・Audit visibility チェックを追加。
- **cold start 調整:** 初級A火曜 scheduled、期限後欠席は木曜に分離、中村涼振替確定の `makeupTargetSummary`、S1 outbound 座席、規約「月1回」、シード時刻固定（`demo-seeded-check.md` 修正メモ）。
- **pnpm:** WSL で `corepack pnpm` または package 内 vitest 直接実行で回避（v2 と同様）。
- **BL-20260810-01:** `main` checkout が worktree 占有で阻害される場合、ログのみ main 反映は別 worktree または `git checkout validation/... -- quality/fw-validation/` を tip/main 上で実行。

## テスト

- `product/packages/domain` vitest: **15 passed**
- `python3 -m tools.check`: **ok**

## FW 改善

- `quality/fw-validation/backlog.md` 参照。BL-20260810-05（overlay v3）は本 run で**完了**として記録済み。BL-20260810-02（catalog Coverage）は Audit AF-01 で既知・draft デモとして無視候補。
- **改善なし**（未着手 backlog への新規追記なし）

## 工程12 反映手順

```bash
# validation ブランチ push
git push -u origin validation/20260810-lesson-studio

# main へログのみ反映（main 占有時は空き worktree で main を checkout）
git checkout main
git checkout validation/20260810-lesson-studio -- quality/fw-validation/
git commit -m "chore(fw-validation): sync run log 20260810-lesson-studio overlay v3"
git push origin main
```

**validation ブランチ:** `validation/20260810-lesson-studio`  
**main 同期:** 工程12 で `quality/fw-validation/` のみ反映（push 結果は `gate-log.md` 工程12 参照）

