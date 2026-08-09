# Claude Code — ForgOS adapter

このリポジトリは **ForgOS**（リポジトリ規約 ＋ AI 工程 OS）。**Cursor 第一**だが、工程手順の正本はツール非依存の [`agents/`](./agents/)。本ファイルは Claude Code 向けの入口（adapter）であり、手順の複製ではない。

## 作業前

1. [`CONTEXT.md`](./CONTEXT.md)
2. [`specs/L1/constitution.md`](./specs/L1/constitution.md)
3. 索引: [`AGENTS.md`](./AGENTS.md)
4. 常時ポリシー: [`agents/policy/framework.md`](./agents/policy/framework.md)

迷子なら [`agents/ask-me.md`](./agents/ask-me.md)（ルーター。代理実行しない）。

## 手順の正本（Mode / Pipeline）

| やりたいこと | 読む正本 |
|--------------|----------|
| Spike | `agents/modes/spike.md` |
| Specify | `agents/modes/specify.md` |
| Implement（TDD） | `agents/modes/implement.md` → `agents/engineering/tdd/playbook.md` |
| Audit | `agents/modes/audit.md` |
| Steward | `agents/modes/steward.md` |
| Source（仮 PRD） | `agents/pipeline/spec-source/playbook.md` |
| Promote | `agents/pipeline/promote/playbook.md` |
| map / cut | `agents/pipeline/map/playbook.md` / `agents/pipeline/cut/playbook.md` |
| Assure | `agents/engineering/assure/playbook.md` |
| Bootstrap（破壊的） | `agents/bootstrap-product/playbook.md` |

Cursor の `/spike` などの slash 名は Cursor adapter 専用。ここでは上表のパスを使う。

## 編集の注意

日本語は UTF-8（BOM なし）・LF。詳細は `agents/policy/utf8-text.md`。`specs/L1/` は Steward 明示＋承認なしに編集しない。
