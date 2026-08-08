---
adr: 0011
status: accepted
date: 2026-08-08
---

# 現場成熟（L1 0.7.2）を ForgOS スターターへ逆輸入する

## 文脈

ForgOS（本リポ）から派生した現場リポで、モード名、パイプライン（draft→promote→map→cut）、`quality/`／`/assure`、inbox Source、`docs/` ガイド廃止、`input/` 退役などが成熟した。スターター側は L1 0.2.0・旧モード名・Extract／`docs/*` ガイドのまま取り残されていた。

## 決定

1. L1 を **0.7.2** に上げ、現場の憲法・工学最低ライン・Promote ゲートを正とする。
2. 公式5モードを **Spike / Specify / Implement / Audit / Steward** に揃える（旧 Explore / Build / Spec-only / Verify / Maintain-FW を廃止）。
3. パイプラインスキル（`/draft` `/promote` `/map` `/cut`）と `/assure` `/ask-me` をスターターに載せる。
4. Source は **`specs/inbox/`**。`input/` は退役する。
5. ガイドは領域 README / rules / skills に置き、`docs/` にガイドを増やさない（L1 憲法 §10）。
6. `product/` 内部構成（`apps` / `infra` 等）は必須ではない。L3 はアプリ関心のみ（技術ドメイン名では切らない）。
7. アプリ知識（現場ドメインの L3・quality 要件・issue 本体）は輸入しない。`examples/taskboard` 等のスターターデモは残す。
8. 運用系 ADR は本リポ採番で追加する（0006–0010）。歴史 ADR 0001–0005 は残し、吸収された決定は superseded とする。

## 代替案

- 現場リポを正本リポにリネームする → スターター配布と現場履歴が混ざる
- 段階的に一部だけ戻す → モード名とパイプラインが分裂したまま残る

## 却下理由

工程 OS の単一情報源をスターターに戻す必要がある。アプリ成果物は対象外。

## 決め事への反映

L1 0.7.2、`AGENTS.md` / `CONTEXT.md` / `README.md`、skills / rules、`quality/` 骨格、`pbl/README.md`、`issues/` スケルトン。
