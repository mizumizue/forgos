---
adr: 0007
status: accepted
date: 2026-08-08
---

# 品質保証の実現点検を `/assure` スキルにする

## 文脈

`quality/`（[ADR 0006](./0006-quality-folder.md)）に保証を置いても、それが証拠・実行で満たされているかを洗う機構がなかった。Audit は `specs/` ↔ 実装（Gap / Conform / Baseline）であり、入力と先導語が違う。公式第6モードにすると L1 の5モードを崩す。

## 決定

1. **ユーザー起動スキル** `.cursor/skills/engineering/assure/SKILL.md`（`/assure`）を追加する。公式モードではない。
2. 正本入力は `quality/` の `status: active`。成果物は人間判断用の指摘リスト（Evidence / Run / Orphan / Promote 候補）。
3. Audit は specs 軸のまま。範囲に active 保証があれば `/assure` へ誘導するステップのみ足す（手順の単一情報源は assure）。
4. 置き場は `engineering/`（`/tdd` と同型のモード外手順）。`modes/` には置かない。
5. L1 は変更しない（モード一覧は既存のまま）。

## 代替案

- Audit に Quality 節を直書き → `quality` 手順が Audit に堆積し、単一情報源が崩れる
- 公式第6モード → L1・認知負荷が重い
- スキルを作らない → `quality/` が記録だけになり実現点検が散発する

## 却下理由

上記のとおり。点検は必要だがモード増設は不要。

## 決め事への反映

製品決め事は増やさない。運用は `quality/README.md`、導線は `AGENTS.md` / `CONTEXT.md` / Audit スキル。

## 後続

Coverage（specs↔保証）とレイヤ `catalog.md` は [ADR 0010](./0010-assure-coverage-catalog.md)。
