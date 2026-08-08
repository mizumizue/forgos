# 結合レベル（integration）

複数モジュールやブラウザ API・永続など、境界をまたいで保証する品質・挙動。

## 一覧（合格条件が読める正本）

正本: [`catalog.md`](./catalog.md)（catalog 単体で何が保証されているか分かる文面）

## 文書の置き方

```text
quality/integration/<stage>/<slug>.md
# stage: requirements | basic-design | detailed-design
```

段階フォルダは文書追加時に作成する。雛形: [`../_template/guarantee.md`](../_template/guarantee.md)。運用正本: [`../README.md`](../README.md)。
