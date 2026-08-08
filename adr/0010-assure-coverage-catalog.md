---
adr: 0010
status: accepted
date: 2026-08-08
---

# `/assure` に Coverage とレイヤ catalog を足す

## 文脈

[ADR 0007](./0007-assure-skill.md) の `/assure` は `quality/` の `active` 保証の実現（Evidence / Run）だけを洗った。製品仕様（`specs/` L2/L3）が保証に載っているかの点検がなく、「仕様外の品質だけ」という読みになりやすかった。また保証が `<stage>/<slug>.md` に分散し、レイヤ単位の一覧性が弱い。

Audit（specs↔実装）と混ぜると単一情報源が崩れる。Coverage は **specs↔保証**、Audit の Gap は **specs↔実装** と分ける。

## 決定

1. `/assure` に **Coverage** ステップを追加する。範囲の L2/L3（決め事 Dn・usecase）が `active` 保証の `related_specs`（または catalog）でカバーされているかを洗う。対象外: `specs/inbox/`、L1、`_template`、glossary 全文。
2. **Discovery**（`specs/` に無い合格条件——例: 改行単位の読みやすさ、Loading ≤5s）は第一級の保証のまま。`related_specs` は空でよい。Evidence / Run の対象であり、Coverage 欠落として扱わない。製品決め事化は Promote → Specify。
3. 各レイヤに **`quality/<layer>/catalog.md`** を置く。人間が catalog だけで何が保証されているか分かる文面（合格条件本文）を必須とし、個別保証ファイルは検証・証拠の詳細とする。`/assure` は catalog↔ファイル突合に加え、catalog の可読性（合格条件の有無）を洗う。
4. ADR 0007 の「正本入力は quality の active のみ」を拡張する: 入力は **範囲仕様（Coverage）＋ quality（Discovery 含む Catalog / 台帳 / Evidence / Run）**。成果物に Coverage・Catalog 節を足す。
5. 運用案内は `quality/README.md`。導線は `AGENTS.md` / `CONTEXT.md` / ask-me / Audit の参照文を更新する。L1 は変更しない。

## 代替案

- Coverage を Audit に足す → specs↔実装と specs↔保証が混ざる
- 一覧を PBI 対応表だけに任せる → レイヤ横断の保証一覧にならない（hub は specs↔product）
- 個別ファイルをやめ catalog 一枚にすべて書く → 検証詳細と合格条件の読み分けが崩れる（catalog は合格条件、個別は証拠・手順）

## 却下理由

上記のとおり。Assurance は Coverage と Discovery を扱い、実現で洗う。レイヤ catalog は索引ではなく、合格条件が読める文面の正本とする。

## 決め事への反映

製品決め事は増やさない。`quality/README.md` と `/assure` スキルが運用正本。
