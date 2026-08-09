# システムテストレベル（system）

システム全体・横断・E2E・環境依存を含む保証の **任意の記録置き場**。**FW 保証外**（ForgOS が約束・既定点検する範囲は単体と内部結合まで。正本: [`../README.md`](../README.md)）。

エンドツーエンドの合否と品質属性を人間が定義して残すときに使う。`/assure` は明示指定時のみこのレイヤを洗う。

文書には検証時の **環境情報**（OS／ランタイム／ブラウザ／外部サービス／設定の要約。秘密は書かない）を任意で載せてよい。後から保証範囲を広げる・再現するときの取り込み口。必須ではない（正本の「拡張口」: [`../README.md`](../README.md)）。

## 一覧（合格条件が読める正本）

正本: [`catalog.md`](./catalog.md)（catalog 単体で何が保証されているか分かる文面）

## 文書の置き方

```text
quality/system/<stage>/<slug>.md
# stage: requirements | basic-design | detailed-design
```

段階フォルダは文書追加時に作成する。雛形: [`../_template/guarantee.md`](../_template/guarantee.md)。運用正本: [`../README.md`](../README.md)。
