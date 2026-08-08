# 仕様モデル

詳細規範の正本は `L1/`。本 README は `specs/` の運用ガイド。

## レイヤ

```text
specs/
├── L1/          # FW 憲法・工学最低ライン（Agent 編集不可）
├── L2/          # 横断: glossary / actors / decisions / usecases（技術・工学詳細を含む）
├── L3/
│   ├── <app-domain>/   # アプリ関心ドメイン（例: tasks）
│   └── _template/
└── inbox/       # 機能 PRD（Source）。Promote 前。L2/L3 に丸ごと置かない
```

- **L2**: プロダクト横断の仕様。入力検証・認可・失敗表現・環境分離など **技術・工学の詳細** もここに置く（インフラ横断は `infrastructure-engineering` 等。必要になったとき）。
- **L3**: 第一軸は **アプリケーションの関心ドメイン**（業務・機能の境界）。技術領域（API／UI／DB／infrastructure など）では切らない。
- **inbox**: `/draft` が書く機能 PRD。`/promote` で L2/L3 へ分解して取り込む。
- **実装**: `product/` 配下。`apps` / `infra` 等の内部構成は任意（空スタブは置かない）。

## 仕様と実装の向き（必須）

- 定常のアウトプットは **仕様 → 実装** のみ（L1 憲法 §2.3）。
- **L2/L3 はソースコードを参照しない**（`product/` の通常実装・sandbox パス、実装ファイル名を規範の根拠にしない）。L1 憲法 §2.4。
- 許可する相互リンク先: 他仕様・ADR・`specs/inbox`（Source）・`issues` / `pbl`。
- 実装↔仕様のトレース（関連コード/PR）は **PBI（hub）/ issue** に置き、L2/L3 本文には載せない。issue は原則 PBI から切る（`pbl/README.md`）。

## ファイル種別

| 種別 | 置き場例 | 内容 |
|------|----------|------|
| 用語 | `glossary/` | ユビキタス言語 |
| アクター | `actors/` | 誰が何をするか |
| 決め事 | `decisions/` | 守る規範（正本） |
| ユースケース | `usecases/` | 利用者のシステム導線・業務の流れ |

ADR（`adr/`）は「なぜその決め事か」。規範そのものは決め事に書く。**必須ではない** — 重要なら Agent が推奨し、作成はユーザー確認後（`CONTEXT.md`）。

## Front matter（必須）

```yaml
---
layer: L2 | L3
domain: <name>          # L3 のみ
kind: glossary | actors | decisions | usecases
maturity: draft | stable | confirmed
---
```

ユースケース（`kind: usecases`）は追加で **`actors` を必須**とする（1つ以上。単一・複数可）:

```yaml
actors:
  - Player
  # - Developer   # 複数可
```

L1 は `editable_by_agent: false` と `version` を持つ。

## 成熟度と実装

| 成熟度 | 通常 feature | sandbox |
|--------|--------------|---------|
| draft | 不可 | 可 |
| stable | 可 | — |
| confirmed | 可（仕様変更は原則提案のみ） | — |

新規アプリ関心ドメインは `L3/_template/` をコピーする。

## テンプレ・入口

- 機能 PRD（`/draft`）: `specs/inbox/<feature-slug>/spec.md`
- PRD → L2/L3（`/promote`）: Audit 後に glossary / actors / decisions / usecases へ分解して取り込む
- hub（`/map`）: `pbl/`
- 実装イシュー（`/cut`）: `issues/`
- テンプレ: `.cursor/skills/pipeline/promote/templates/spec.md`（ユースケースは同フォルダの `usecase.md`、ADR は `.cursor/skills/modes/steward/templates/adr.md`）
