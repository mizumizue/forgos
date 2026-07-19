# Agent 向けメモ

このリポジトリは **ForgOS**（AI 工程 OS スターター）である（リポジトリ規約 ＋ Cursor 第一の工程 OS）。

作業開始前に [CONTEXT.md](./CONTEXT.md) と [specs/L1/constitution.md](./specs/L1/constitution.md) を読む。

## モードで開始する

| やりたいこと | モード | 起動 |
|--------------|--------|------|
| あいまい探索・スパイク | Explore | `/explore` |
| 安定仕様の実装（TDD） | Build | `/build` |
| 仕様だけ書く | Spec-only | `/spec-only` |
| 乖離・拡大解釈チェック | Verify | `/verify` |
| FW 自体のメンテ | Maintain-FW | `/maintain-fw` |

スタック未決で default example からプロダクトリポへ仕立てる場合（モード外）: `/bootstrap-product`（破壊的・ユーザー起動のみ）。

Extract（仕様昇格）は Explore / Build 内の人間ゲート。`specs/L1/extract-gate.md`。

## 編集制約（要約）

- **L1 は編集しない**（Maintain-FW で提案のみ）
- 通常実装は **stable 以上** の決め事に紐づける
- 探索コードは `product/sandbox/`（または draft 明示）
- 秘密情報をログ・コミット・仕様に出さない
- 顧客原文は `input/`（git 外）。抽出結果だけを specs/pbl/adr へ
- Build 完了に単体テスト緑が必須

## ディレクトリ

| パス | 役割 |
|------|------|
| `specs/` | 仕様（L1/L2/L3） |
| `adr/` | 意思決定の経緯 |
| `pbl/` | PBI / Epic（ハブ） |
| `product/apps/` | プロダクトアプリ |
| `product/infra/` | プロダクト IaC |
| `product/sandbox/` | 探索用コード |
| `examples/` | 参考実装（コア非依存） |
| `input/` | 外部インプット（gitignore） |
| `docs/` | 人間向けガイド |

テンプレのプロダクト置き場は `product/` 配下。`examples/` 内部の `{apps,infra}` は自己完結モノレポの慣例形であり、テンプレ地図とは意図的に別形とする。

詳細: `docs/modes.md` / `docs/spec-model.md` / `docs/pbl.md`
