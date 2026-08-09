---
name: implement
description: L2/L3 の決め事に従い TDD で product/ に実装する。Implement モード、機能実装、バグ修正を求めたときに使う。
---

# Implement

L2/L3 の決め事に紐づけて **`product/`** に実装する（成熟度 **draft でも可**）。アプリ／CI の「ビルド」ではない。手順の正本は TDD スキル。PBI `done`／リリース相当の完了宣言は関連決め事が **stable 以上**（L1 §4）。

## ステップ

1. **紐づけを固定する。** 必須コンテキストは対象決め事（L2/L3）と issue／PBI だけ。成熟度が draft なら `done` にしない旨を明示する。完了条件: 仕様パス・成熟度・作業単位が明示されている。
2. **TDD を回す。** `.cursor/skills/engineering/tdd/SKILL.md` に従う（公開インターフェース確認 → red → green → refactor）。完了条件: 関連単体が緑。
3. **構造衛生を洗う。** 変更範囲の入り口過多・責務重複・曖昧分岐を整理する（L1 E12）。振る舞い不変。未整理を残すなら明示。完了条件: 整理した／残課題を明示した、のいずれか。
4. **マップを更新する。** 関連 PBI／issue のコード・PR・状態リンクを更新する。`specs/` の L2/L3 本文に実装パスを書かない。完了条件: hub／issue から実装へ辿れる。

## セッション完了

TDD サイクルと単体緑、構造衛生（E12）の整理または残課題明示、関連リンク更新。`done` 宣言をするなら関連決め事が stable 以上であること。

## リファレンス

- TDD: `.cursor/skills/engineering/tdd/SKILL.md`
- モード索引: `AGENTS.md`
- L1 E2 / E4 / E12: `specs/L1/engineering-baseline.md`
