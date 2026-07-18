# Product infrastructure

プロダクト IaC の置き場。template 時点ではスタブのみ。

- 先出し検証（`terraform plan` / policy / 契約テスト）を Build 相当で使う
- 仕様は `specs/L3/infrastructure/`
検証の入口（先出し）:

```bash
terraform -chdir=product/infra init -backend=false
terraform -chdir=product/infra validate
```

`main.tf` は空に近い有効 HCL スタブ。モジュール追加は stable 以上のインフラ決め事に紐づける。
