---
layer: unit # unit | integration | system
stage: requirements # requirements | basic-design | detailed-design
aspect: functional # functional | nfr | both
status: draft # draft | active | retired
related_pbi: []
related_issues: []
related_specs: []
---

# （日本語タイトル。タイトルだけで何を保証するか分かる文面）

## 背景

Coverage（既存決め事の検証）か Discovery（specs に無い合格条件）かを一言。何を保証したいか。

## 保証内容

合格条件を箇条書きで。機能・非機能を混ぜてよい（`aspect` で明示）。

## 検証

- 観点・境界:
- ケース／手順（`detailed-design` なら具体化）:
- 関連テスト／fixture（パス可）:

## 関連

- 対応決め事（あれば `related_specs`）:
- PBI / issue:

作成・退役したら同レイヤの `catalog.md` に **保証する内容**（合格条件本文）を同じ変更で書く／消す。
