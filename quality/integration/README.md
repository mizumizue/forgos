# 内部結合レベル（integration）

`product/` 内の複数モジュール協調など、**内部結合**で保証する品質・挙動。パス名は `integration`、意味は内部結合。制御した依存（テストダブル・ローカル永続など）で検証する。外部システム結合やフル E2E は [`../system/`](../system/)（任意・FW 保証外）。

## 一覧（合格条件が読める正本）

正本: [`catalog.md`](./catalog.md)（catalog 単体で何が保証されているか分かる文面）

## 文書の置き方

```text
quality/integration/<stage>/<slug>.md
# stage: requirements | basic-design | detailed-design
```

段階フォルダは文書追加時に作成する。雛形: [`../_template/guarantee.md`](../_template/guarantee.md)。運用正本: [`../README.md`](../README.md)。
