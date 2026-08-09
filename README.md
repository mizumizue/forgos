# ForgOS

**モードで回す、AI 工程 OS。**

スキルの使いこなしではなく、**モード**でアプリとインフラの開発品質を揃えます。リポジトリ規約と Cursor 第一の工程を、一つのスターターにまとめています。

## Features

- **モード駆動** — Spike / Specify / Implement / Audit / Steward。入り口はスキル名ではなくモード
- **パイプライン** — `/draft` → `/promote` → `/map` → `/cut` → `/implement` → `/audit`（→ `/assure`）
- **決め事が正本** — Promote 後は **決め事 > コード**。PBI はハブにとどめる
- **Implement は TDD** — 安定以上の仕様に紐づけ、単体が緑になるまで完了としない
- **Audit / Assure** — 仕様と実装の乖離、および仕様の保証 Coverage・品質実現を指摘する

人間はコードレビューではなく、**仕様意図・整合**をレビューします。

## Quickstart

1. このリポジトリを template として複製する
2. Cursor で開き、[AGENTS.md](./AGENTS.md) と [CONTEXT.md](./CONTEXT.md) に目を通す
3. 入口に迷ったら **`/ask-me`**（ルーター）。下のモード表でも可

技術スタックに拘りがなければ、先に **`/bootstrap-product`** で default example を `product/` に展開し、リポジトリをプロダクト用に仕立てる（examples / デモは削除される）。

動く参考実装は [examples/taskboard](./examples/taskboard/)（Bootstrap 前の default）。

## 作業モード

開始時は **モード** を選ぶ。手順の正本は Agent 向けの `AGENTS.md` と `.cursor/skills/modes/`。

| モード | 目的 | 起動 |
|--------|------|------|
| Spike | あいまい → プロトタイプ（sandbox）。仕様は後 | `/spike` |
| Implement | 安定以上の仕様に従い実装 ＋ TDD | `/implement`（TDD: `/tdd`） |
| Specify | 実装せず仕様（と必要なら PBI）のみ | `/specify` |
| Audit | 仕様↔実装の乖離と拡大解釈の指摘 | `/audit` |
| Steward | L1・スキル等の FW メンテ | `/steward` |

**パイプライン:** `/draft`（`specs/inbox`）→ `/promote`（L2/L3）→ `/map`（pbl）→ `/cut`（issues）→ `/implement`。Promote は独立モードではない（Audit 必須・人間ゲート）。

早見: 曖昧なら Spike／実装なら Implement／仕様だけなら Specify／点検なら Audit／FW 直しなら Steward。

## Directory

```text
specs/     仕様（L1 / L2 横断 / L3 アプリ関心 / inbox＝機能 PRD）
quality/   実装後に保証する挙動・品質（単体／結合／システム）
adr/       任意の経緯（必須ではない）
pbl/       PBI / Epic（hub。説明は pbl/README.md）
product/   実装（内部構成は任意）
sandbox/   探索コード（Spike）
examples/  参考実装（Bootstrap 前）
.cursor/   モード・パイプラインスキルとルール
```

ガイド用の `docs/` 文書は置かない（各 README / rules / skills）。

## Concepts

| 状態 | 正本 |
|------|------|
| Spike | sandbox（`sandbox/`） |
| Promote 後 | **決め事 > コード** |
| Specify | 仕様（＋必要なら PBI） |

## Docs

- [仕様モデル](./specs/README.md)
- [品質・挙動保証](./quality/README.md)
- [PBL（hub）](./pbl/README.md)
- [L1 憲法](./specs/L1/constitution.md)
- Agent 入口: [AGENTS.md](./AGENTS.md)
- スキル案内（ルーター）: [`.cursor/skills/ask-me/SKILL.md`](./.cursor/skills/ask-me/SKILL.md)（`/ask-me`）

L1 版: [`specs/L1/VERSION`](./specs/L1/VERSION)

## Status

初期は template 複製と本リポの skills / L1 コピー運用です。versioned パッケージ配布は後続です。

## License

MIT
