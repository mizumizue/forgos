# PBL / PBI（hub）

PBI は正本ではない。**hub** — `specs/` と `product/` のマップ（要求・進捗・リンクの集約）。

手順の正本: `.cursor/skills/pipeline/map/SKILL.md` と `/cut`。公開先・ファイル名・トリアージ: `.cursor/skills/pipeline/map/issue-tracker.md`。対応表: [ADR 0009](../adr/0009-pbi-trace-matrix.md)。

## 役割分担

| 置き場 | 役割 |
|--------|------|
| `specs/` | 規範の正本（決め事・用語・アクター・ユースケース） |
| `product/` | 実装 |
| `pbl/` | **hub**: `specs/` ↔ `product/` のマップ（PBI / Epic） |
| `issues/` | 作業チケット。原則は **PBI から切る** |
| `quality/` | 実装後の挙動・品質保証（hub ではない） |

- `specs/` はソースを参照しない（L1 憲法 §2.4）。実装トレースは hub（PBI）または issue に置く。
- issue は **仕様化していない対応**の作業単位でもある。Issue 先行で実装 → 仕様化 → PBI に対応リンクだけ載る、という経路を許す。その場合も最終的なマップは hub に閉じる。

## 単位

- 1 PBI = ユーザー価値の一塊
- 大きいテーマは任意で薄い Epic（`pbl/epics/`）
- Epic は配下 PBI の束。hub の階層であって正本ではない
- **マップの粗さは PBI 分割ではなく対応表で解く**（価値単位を無闇に割らない）

## タイプ

| タイプ | 意味 |
|--------|------|
| `feature` | 機能 |
| `nfr` | 非機能 |
| `issue` | 課題・不具合・改善負債 |
| `chore` | FW/リポメンテ・仕様整理 |

## 状態

```text
idea → exploring → ready → doing → verify → review → done
```

仕様のみ完了は **`specified`**（実装 `done` と混同しない）。

## `done` 条件

1. 安定以上の関連決め事を満たす実装がある
2. 単体テストが緑
3. Audit（少なくとも Conform＝拡大解釈チェック）を 1 回通す
4. 人間が仕様意図レビュー済み
5. 対応表に対象規範の行があり、`gap` は意図的に残すか解消済み

## 必須リンク（マップ）

**正は対応表。** フォルダ列挙だけでは不足（ADR 0009）。

### 対応表

| 列 | 内容 |
|----|------|
| 規範 | `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>` + 一言 |
| 証拠 | テストまたは公開モジュールのパス。UI のみなら e2e または「手動・未自動化」 |
| issue | 関連 issue パス（なければ —） |
| 状態 | `covered` / `partial` / `gap` |

行の対象: 関連する決め事の各 Dn、関連ユースケース、受入条件 AC。対象外: glossary 全文、actors 散文。決め事の「対象外」は必要なら gap 行。

### 補助一覧

対応表から辿れる範囲で、関連仕様パス・関連コード/PR・関連 issue を重複なく列挙してよい（表の要約）。

テンプレ: `.cursor/skills/pipeline/map/templates/pbi.md` / `epic.md`

## Issue との境界

| 経路 | 流れ |
|------|------|
| 通常 | hub（PBI）を用意 → PBI から `issues/backlog/` へ切る（`/cut`） |
| Issue 先行 | `issues/` で着手・実装 → `/promote` 等で L2/L3 化 → PBI に対応表ごと載せる |

## 結合以降（任意）

保証の正本は [`quality/`](../quality/README.md)。結合以降に進める PBI には次を追記してよい:

- 結合／システム／UAT の成果物パス（保証は `quality/`）
- 再 Audit の要否と実施日
- リリースノートへのリンク（あれば）

Audit 再実行の目安: 結合で仕様解釈が揺れたとき、UAT 指摘で仕様変更が入ったとき、リリース直前（Conform のみでも可）。
