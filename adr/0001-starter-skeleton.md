---
adr: 0001
status: accepted
date: 2026-07-19
---

# スターターの骨格と正本順位

## 文脈

AI 駆動開発のリポジトリ規約と Cursor 第一の工程 OS を一体スターターとして提供する。

## 決定

1. 形態は別リポジトリのスターターとする。
2. 正本はフェーズ依存: Explore は sandbox、Extract 後は **決め事 > ADR > コード**。PBI はハブ。
3. 公式モードは Explore / Build / Spec-only / Maintain-FW / Verify。Extract はゲート。
4. Build は TDD 必須。人間は仕様意図レビュー。
5. `input/` は git 管理外。

## 代替案

- スキル集のみ（規約なし）→ 工程の一貫性が弱いため不採用
- 常にコード正本 → 仕様意図レビューと矛盾するため不採用

## 却下理由

上記。

## 決め事への反映

`specs/L1/constitution.md` / `engineering-baseline.md`
