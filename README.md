# AI Dev Framework（スターター）

リポジトリ規約と Cursor 第一の **AI 工程 OS** を一体にしたスターターです。スキルの使いこなしではなく、**モード**（Explore / Build / Spec-only / Verify / Maintain-FW）で一定品質のアプリ＋インフラ開発を進めます。

作業名: `ai-dev-framework`（正式名称は未定）  
L1 版: 見よ `specs/L1/VERSION`

## すぐにやること

1. このリポジトリを template として複製する
2. Cursor で開き、[AGENTS.md](./AGENTS.md) / [CONTEXT.md](./CONTEXT.md) を読む
3. モードを選んでスキルを起動する（例: `/explore`, `/build`）
4. 参考実装は [examples/taskboard](./examples/taskboard/)

## ディレクトリ

```text
specs/L1|L2|L3     仕様（決め事が正本）
adr/               意思決定の経緯
pbl/               PBI / Epic（ハブ）
product/apps/      プロダクトアプリ（空）
product/infra/     プロダクト IaC（スタブ）
product/sandbox/   Explore 用
examples/          参考実装
input/             外部原文（git 外）
.cursor/skills     モード誘導
docs/              ガイド
```

ルートは工程・知識用。プロダクト実装は `product/` 配下。`examples/` 内部の `{apps,infra}` は教材用の自己完結レイアウトであり、テンプレの `product/` とは意図的に別形です。

## 正本（要約）

| 状態 | 正本 |
|------|------|
| Explore | sandbox（`product/sandbox/`） |
| Extract 後 | **決め事 > ADR > コード** |
| Spec-only | 仕様（＋ADR/PBI） |

人間はコードレビューせず、**仕様意図・整合**をレビューします。Build は TDD 必須です。

## ドキュメント

- [モード](./docs/modes.md)
- [仕様モデル](./docs/spec-model.md)
- [PBL](./docs/pbl.md)
- [結合以降](./docs/post-unit-guide.md)
- [L1 憲法](./specs/L1/constitution.md)

## 配布について

初期は template 複製 ＋ 本リポの skills/L1 コピー運用です。versioned パッケージ配布は後続（草案 D の完成形）。

## ライセンス

MIT
