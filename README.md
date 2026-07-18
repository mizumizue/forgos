# ForgOS

**モードで回す、AI 工程 OS。**

スキルの使いこなしではなく、**モード**でアプリとインフラの開発品質を揃えます。リポジトリ規約と Cursor 第一の工程を、一つのスターターにまとめています。

## Features

- **モード駆動** — Explore / Build / Spec-only / Verify / Maintain-FW。入り口はスキル名ではなくモード
- **決め事が正本** — Extract 後は **決め事 > ADR > コード**。PBI はハブにとどめる
- **Build は TDD** — 安定以上の仕様に紐づけ、単体が緑になるまで完了としない
- **Verify** — 仕様と実装の乖離、および仕様の拡大解釈を指摘する

人間はコードレビューではなく、**仕様意図・整合**をレビューします。

## Quickstart

1. このリポジトリを template として複製する
2. Cursor で開き、[AGENTS.md](./AGENTS.md) と [CONTEXT.md](./CONTEXT.md) に目を通す
3. モードを起動する（例: `/explore`, `/build`）

動く参考実装は [examples/taskboard](./examples/taskboard/) を参照。

## Directory

```text
specs/     仕様（L1 / L2 / L3）
adr/       意思決定の経緯
pbl/       PBI / Epic
product/   実装（apps / infra / sandbox）
examples/  参考実装
input/     外部原文（git 外）
.cursor/   モードスキルとルール
docs/      ガイド
```

ルートは工程・知識用。プロダクト実装は `product/` 配下。`examples/` 内部のレイアウトはテンプレとは意図的に別形です。

## Concepts

| 状態 | 正本 |
|------|------|
| Explore | sandbox（`product/sandbox/`） |
| Extract 後 | **決め事 > ADR > コード** |
| Spec-only | 仕様（＋必要なら ADR / PBI） |

## Docs

- [モード](./docs/modes.md)
- [仕様モデル](./docs/spec-model.md)
- [PBL](./docs/pbl.md)
- [結合以降](./docs/post-unit-guide.md)
- [L1 憲法](./specs/L1/constitution.md)

L1 版: [`specs/L1/VERSION`](./specs/L1/VERSION)

## Status

初期は template 複製と本リポの skills / L1 コピー運用です。versioned パッケージ配布は後続です。

## License

MIT
