---
name: pipeline-continuity-loop
description: >-
  ForgOS 実証ループの隣接工程間で要件・manifest・UC の抜け落ち（黙落）を機械的に検出する。
  単一工程の内部品質ではなく工程境界の連続性を検証。P56・P67 を含むペア別ルーブリック。
  実証ループの工程6・7直後や mode=all で起動。scope 縮小・demo-grade 低下の監視に使う。
disable-model-invocation: true
---

# 工程間連続性ループ（pipeline continuity）

単一工程の Verifier（V1–V6、S0–S8、U0–U7 等）が **工程内** の品質を見る。本スキルは **隣接工程の境界**で、上流の採用事項・`implement` 行・visibility・UC が下流に **黙って落ちていないか** を機械的に追跡する。

型: **GV**（詳細: `.cursor/skills/loop/author-loop-skill/patterns/GV.md`）

**ルーブリック正本:** [`PAIR-RUBRIC.md`](PAIR-RUBRIC.md)（ペア別抽出・痕跡・件数契約。甘い一般論は不合格）

## 呼び出し

| 起動 | 人間との接点 |
|------|----------------|
| `forgos-validation-loop-workflow` の工程境界（推奨: 6・7 直後、または工程9前に `all`） | **なし**。`STATE_DIR`・`mode`・`feature-slug` は指示書に従う |
| ユーザーが単体起動 | 起動文の `STATE_DIR`（必須）と `mode`（`all` または `pair`）のみ。途中確認しない |

## ペルソナ

既定は空。

## kernel

| 柱 | 内容 |
|----|------|
| Verifier | `STATE_DIR/continuity-check.md` に対し、実行した各ペアの **X0–X5 すべて Yes**（`skip` ペアは X0 で記録済み）。**黙落（silent_drop）0 件** |
| State | `STATE_DIR/continuity-check.md`（最終稿）、`STATE_DIR/continuity-log.md`（各周のペア結果） |
| Stop | 全実行ペアが pass または skip、または改稿 **最大 2 周**（1周＝抽出→痕跡照合→報告書更新→Verifier）。2 周後も黙落あれば未達を記録して停止 |
| Leash | 触ってよい: `STATE_DIR/`、`specs/`・`pbl/`・`issues/`・`product/` の **読み取り**、Web 調査（上流義務の確認のみ）。触るな: 上流／下流成果物の **内容改変**（本スキルは監視のみ。修正は対象工程へ戻す）、`agents/` への書き込み、PAIR-RUBRIC の緩和、起動後のユーザー確認 |

## 入力パラメータ（指示書または起動文）

| パラメータ | 必須 | 内容 |
|------------|------|------|
| `STATE_DIR` | **必須** | 例: `quality/fw-validation/runs/<run-id>/` |
| `mode` | 推奨 | `all`（下流存在する全ペア）／`pair`（単一ペア）／`strict`（P56+P67 のみ） |
| `pair` | `mode=pair` 時 | 例: `5→6` → 検証 ID `P56` |
| `feature-slug` | 任意 | 未指定時は `STATE_DIR/scope.md` の feature-slug |

### mode の既定

- オーケストレータ未指定 → **`all`**
- 工程6直後の単発起動 → **`pair` + `5→6`**
- 工程7直後の単発起動 → **`pair` + `6→7`**

## 手順

1. `STATE_DIR`・`mode`・`feature-slug` を固定。欠けていれば AI が決め `continuity-log.md` に1行。ユーザーに聞かない  
2. [`PAIR-RUBRIC.md`](PAIR-RUBRIC.md) を読み、実行対象ペアを列挙する  
3. **Extractor（生成）:** 各ペアについて  
   - 上流成果物から **上流義務**を表に抽出（ID・種別・件数）  
   - 下流成果物を開き **痕跡**を照合  
   - 判定: `carried`／`deferred_ok`／`silent_drop`／`scope_out_ok`  
   - 件数契約（manifest implement 行数、visibility 行数、UC 数等）を数える  
4. **Verifier（検証）:** 各ペアの X0–X5 を Yes/No。`silent_drop` を黙落詳細表に列挙  
5. `continuity-check.md` を PAIR-RUBRIC のテンプレに沿って書く／更新する  
6. 不合格かつ周回 < 2 なら、**成果物は直さない**。黙落リストを `continuity-log.md` に残し、指揮者／対象工程へ **戻し先**（PAIR-RUBRIC 表）を報告して手順3へ（再読のみ）  
7. Stop で止め、サマリ（pass/skip/fail 件数・黙落件数・推奨戻し先）を短く報告する  

## 指揮者向けゲート文（コピー用）

工程 N 完了直後に SubAgent へ渡す Verifier の例:

```text
skill:pipeline-continuity-loop 完了＝ゲート。
STATE_DIR=<RUN>。mode=pair。pair=<上流>→<下流>（例 5→6 → P56）。
PAIR-RUBRIC の X0–X5 全 Yes・黙落 0。失敗時は PAIR-RUBRIC の戻し先へ（Stop 内）。
```

工程9前の一括:

```text
skill:pipeline-continuity-loop 完了＝ゲート。STATE_DIR=<RUN>。mode=all。
実行可能な全ペアで黙落 0。P56・P67 が skip なら No（下流未完了）。
```

## 完了基準

- [ ] 実行対象ペアすべてで X0–X5 が Yes（または正当な skip）  
- [ ] `continuity-check.md` が存在し、サマリとペア別抽出表がある  
- [ ] 黙落（silent_drop）が 0 件、または Stop 上限で未達を `continuity-log.md` に記録済み  
- [ ] Leash を破っていない（監視のみで上流／下流を書き換えていない）  
- [ ] ユーザーへの途中確認をしていない  

## 他スキルとの関係

| スキル | 役割 |
|--------|------|
| `sector-research-loop` 等 | 工程 **内** の深さ |
| `forgos-validation-loop-workflow` + `DEMO-UX.md` | 工程 **内** の S/U/P/M/I ルーブリック |
| **本スキル** | 工程 **間** の要件連続性（縮小・黙落の監視） |

両方通して初めて「仕様が薄くならず実装まで届いた」と言える。
