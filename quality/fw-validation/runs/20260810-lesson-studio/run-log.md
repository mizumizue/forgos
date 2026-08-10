# Run log — 20260810-lesson-studio（再実行）

**テーマ:** 小規模ピアノ教室の受講生・授業枠・振替管理（1人講師・定員制グループレッスン）  
**ブランチ:** `validation/20260810-lesson-studio`  
**feature-slug:** `lesson-studio-scheduling`  
**STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**実施日:** 2026-08-10（stage 3 以降の再実行）

## 概要

工程1–2（sector brief）を保持したまま、overlay v2（implementation manifest S0–S8、I1–I11）準拠で stage 3 から再実行。hands-off で工程12まで完遂。

## 工程サマリー

| # | 工程 | 結果 | 主成果物 |
|---|------|------|----------|
| 1–2 | テーマ／業種調査 | Pass（保持） | `sector-brief.md`, `loop-log.md` |
| 3 | 仕様深度 | Pass | `spec-depth.md`（D1–D6） |
| 4 | モックデザイン | Pass | `design-call.md`（C1–C9, J1–J4） |
| 5 | スコープ統合 | Pass | `scope.md` + manifest（implement 14 / deferred 6） |
| 6 | Spike | Pass | Source（promote 後削除） |
| 7 | Promote | Pass | `specs/L3/lesson-studio/`, `promote-check.md` |
| 8 | map/cut | Pass | PBI-0002, issues×2（Manifest + tier 列） |
| 9 | Implement | Pass | `product/`, `implement-reachability.md`, vitest 14 green |
| 10 | Audit | Pass (A) | `audit-findings.md` |
| 11 | 実証ログ | Pass | 本ファイル |
| 12 | ログのみ main | 下記 | `quality/fw-validation/` のみ main 反映 |

## 詰まり・所見

- **リセット:** stage 3 前に downstream 成果物と `product/` を main ベースラインへ戻し、コミット `chore(validation): reset 20260810-lesson-studio from stage 3`。
- **overlay v2:** 初回 run には manifest が無かった。再実行で A–D 表（implement 14 行）と `implement-reachability.md` を新設。Map/Cut の tier 列・Manifest 行も追加。
- **pnpm:** WSL 環境で `pnpm` が PATH に無い場合あり。`corepack pnpm` または vitest 直接実行で回避。
- **genre look:** 座席リング・週ストリップ・ウォームスタジオパレット・規約タグ（G1–G5）を web に反映。

## テスト

- `product/packages/domain` vitest: **14 passed**
- `python3 -m tools.check`: **ok**

## FW 改善

- 既存 backlog 参照: BL-20260810-02（quality catalog Coverage 未紐づけ）は本 run でも該当。新規追記なし。
- **改善なし**（本 run 固有の新規 backlog 項目は追加しない）

## 工程12 反映手順

```bash
# validation ブランチ push（認証要）
git push -u origin validation/20260810-lesson-studio

# main へログのみ反映
git checkout main
git checkout validation/20260810-lesson-studio -- quality/fw-validation/
git commit -m "chore(fw-validation): update run log 20260810-lesson-studio (re-run stage 3+)"
```

**main 反映:** ローカル実施（下記ステータス参照）  
**remote push:** 認証未設定時は未実施
