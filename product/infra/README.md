# Product infrastructure（任意）

プロダクト IaC の置き場。**必須ではない**（L1 憲法 §1.3）。template 時点ではスタブのみ。example に含まれる場合のみ Bootstrap で展開する。空スタブを必須とはしない。

- 先出し検証（`terraform plan` / policy / 契約テスト）を Implement 相当で使う
- 横断の技術・工学規範は `specs/L2/`（L3 に技術ドメイン名は置かない）

検証の入口（先出し、スタブがある場合）:

```bash
terraform -chdir=product/infra init -backend=false
terraform -chdir=product/infra validate
```

`main.tf` は空に近い有効 HCL スタブ。モジュール追加は stable 以上のインフラ決め事（L2）に紐づける。
