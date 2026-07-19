---
name: bootstrap-product
description: 技術スタックに拘りがないとき、default example でリポジトリをプロダクト用に仕立てる。ユーザー起動のみ。
disable-model-invocation: true
---

# Bootstrap Product

公式5モードの外。**一度きり**のリポジトリ仕立て。default example を `product/` へ展開し、examples / デモ成果物を削除してプロダクト入口にする。

破壊的。ユーザーが明示起動したときだけ実行する。

## ステップ

1. **不可逆であることとプロダクト名を確認する。** 次をユーザーに明示し、合意を得る: `examples/` 削除、デモ L3/PBI/Epic 削除、README 差し替え、`product/` への展開。プロダクト名（package / README 用）を1つ決める。ドメイン名は任意（未定ならデモ概念を残さずプレースホルダ）。完了条件: ユーザー合意とプロダクト名がある。
2. **default example を特定する。** `examples/README.md` の default（未記載なら唯一の example ディレクトリ）。いまの正本は `examples/taskboard`。完了条件: ソースパスが一文で固定されている。
3. **`product/` へ展開する。** 詳細マップは [reference.md](./reference.md) の「展開マップ」。既存の空 `product/apps`・`product/infra` README は上書きしてよい。`product/sandbox/` は残す。モノレポ根（`package.json` / `pnpm-workspace.yaml` 等）は **`product/` 直下**に置く。完了条件: `product/apps`・`product/packages`・`product/infra`・`product/package.json` が存在する。
4. **example 固有名を剥がす。** `taskboard` / `@taskboard/*` / デモ仕様パス参照を、プロダクト名ベースに置換する。決め事・PBI へのデモリンクは残さない（次ステップでデモ自体を消す）。完了条件: `product/` 配下を検索して example 固有スラッグがゼロ。
5. **examples とデモ成果物を削除する。** 削除リストは [reference.md](./reference.md) の「削除リスト」。`specs/L3/_template`・空の `pbl` 構造・`specs/L3/infrastructure` プレースホルダは残す。完了条件: 削除リストのパスが存在しない。リポ全体を検索して `examples/taskboard`・`@taskboard` 参照がゼロ（このスキルと ADR の歴史記述を除く）。
6. **プロダクト README に差し替える。** プロダクト名をタイトルに、Quickstart は `cd product && pnpm install && pnpm test` 系。ForgOS への言及は一行（工程 OS として残している旨）まで。完了条件: ルート README がプロダクト入口であり、examples 案内がない。
7. **案内を同期する。** `AGENTS.md` の `examples/` 行を削除または「Bootstrap 済みなら無し」。Directory 説明を `product/` モノレポ前提に更新。CI があれば `product/` 向けに直すか削除。完了条件: 壊れたパス参照が残っていない。
8. **煙テストする。** `cd product && pnpm install && pnpm test && pnpm typecheck`（example に準ずるコマンド）。失敗したら直してから完了とする。完了条件: 単体と typecheck が緑。
9. **次モードを提示して終了する。** 例: 要件が曖昧 → `/explore`、仕様から実装 → `/build`。完了条件: 次アクションが一文である。

## リファレンス

- 展開・削除の詳細: [reference.md](./reference.md)
- 工程の正本: `specs/L1/`（本スキルは L1 を編集しない）
