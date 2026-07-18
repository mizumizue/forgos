---
layer: L1
maturity: confirmed
version: 0.1.1
editable_by_agent: false
---

# L1 工学最低ライン

業務ドメイン規則はここに入れない。違反は Verify およびセッション完了判定で指摘する。

## E1. 秘密情報

秘密情報をログ・コミット・仕様・チャット出力に出さない。例示はプレースホルダを使う。

## E2. 実装の紐づけ

通常実装（`product/apps/` / `product/infra/` の feature）は **stable 以上** の決め事に紐づける。`product/sandbox/` は探索専用。

## E3. Verify 可能性

仕様↔実装の乖離と、仕様の拡大解釈を指摘できるようにする。実装は決め事から追跡可能であること。

## E4. Build 完了とテスト

Build セッション完了には、関連する単体テストが緑であることが必須である。

## E5. L1 不可侵

Agent は L1 を直接編集しない。変更案は Maintain-FW で提示し、人間承認後に版を上げる。
