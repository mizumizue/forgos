---
layer: L2
kind: decisions
maturity: draft
---

# インフラ横断の工学詳細

L1 E9–E11 の詳細・例外・ツール固有の運用をここに育てる。現状は置き場のみ（draft）。

## 対象（L1 からの委任）

- **E9 環境分離** — 環境の数と命名、秘密の置き場、開発データと本番相当の境界
- **E10 変更の残し方** — plan / policy / 契約テストの置き場、PR 必須範囲
- **E11 破壊的変更** — 承認、blast radius、ロールバック方針

## まだ書かないこと

- 特定クラウドや IaC ツールを唯一の正とすること（例は `examples/` または Bootstrap 後の `product/infra`）
- 個別サービスの構成詳細（それは L3 `infrastructure/`）

## 関連

- L1: `specs/L1/engineering-baseline.md`（E9–E11）
- ADR: `adr/0005-l1-engineering-baseline-0.2.md`
