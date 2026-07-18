# Agent 向けメモ

このリポジトリは **AI 駆動開発フレームワークのスターター** である（リポジトリ規約 ＋ Cursor 第一の工程 OS）。

作業開始前に [CONTEXT.md](./CONTEXT.md) と [specs/L1/constitution.md](./specs/L1/constitution.md) を読む。

## モードで開始する

| やりたいこと | モード | 起動 |
|--------------|--------|------|
| あいまい探索・スパイク | Explore | `/explore` |
| 安定仕様の実装（TDD） | Build | `/build` |
| 仕様だけ書く | Spec-only | `/spec-only` |
| 乖離・拡大解釈チェック | Verify | `/verify` |
| FW 自体のメンテ | Maintain-FW | `/maintain-fw` |

Extract（仕様昇格）は Explore / Build 内の人間ゲート。`specs/L1/extract-gate.md`。

## 編集制約（要約）

- **L1 は編集しない**（Maintain-FW で提案のみ）
- 通常実装は **stable 以上** の決め事に紐づける
- 探索コードは `sandbox/`（または draft 明示）
- 秘密情報をログ・コミット・仕様に出さない
- 顧客原文は `input/`（git 外）。抽出結果だけを specs/pbl/adr へ
- Build 完了に単体テスト緑が必須

## ディレクトリ

| パス | 役割 |
|------|------|
| `specs/` | 仕様（L1/L2/L3） |
| `adr/` | 意思決定の経緯 |
| `pbl/` | PBI / Epic（ハブ） |
| `apps/` | プロダクトアプリ |
| `infra/` | プロダクト IaC |
| `sandbox/` | 探索用コード |
| `examples/` | 参考実装（コア非依存） |
| `input/` | 外部インプット（gitignore） |
| `docs/` | 人間向けガイド |

詳細: `docs/modes.md` / `docs/spec-model.md` / `docs/pbl.md`
