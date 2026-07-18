# 仕様モデル

詳細規範の正本は `specs/L1/`。ここは運用ガイド。

## レイヤ

```text
specs/
├── L1/          # FW 憲法・工学最低ライン（Agent 編集不可）
├── L2/          # 横断: glossary / actors / decisions
└── L3/
    ├── <domain>/
    └── infrastructure/
```

## ファイル種別

| 種別 | 置き場例 | 内容 |
|------|----------|------|
| 用語 | `glossary/` | ユビキタス言語 |
| アクター | `actors/` | 誰が何をするか |
| 決め事 | `decisions/` | 守る規範（正本） |

ADR（`adr/`）は「なぜその決め事か」。規範そのものは決め事に書く。

## Front matter（必須）

```yaml
---
layer: L2 | L3
domain: <name>          # L3 のみ
kind: glossary | actors | decisions
maturity: draft | stable | confirmed
---
```

L1 は `editable_by_agent: false` と `version` を持つ。

## 成熟度と実装

| 成熟度 | 通常 feature | sandbox |
|--------|--------------|---------|
| draft | 不可 | 可 |
| stable | 可 | — |
| confirmed | 可（仕様変更は原則提案のみ） | — |

新規ドメインは `specs/L3/_template/` をコピーする。

## テンプレ

- 仕様ファイル: `docs/templates/spec.md`
- ADR: `docs/templates/adr.md`
