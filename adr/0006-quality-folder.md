---
adr: 0006
status: accepted
date: 2026-08-08
---

# 品質・挙動保証を `quality/` に分離する

## 文脈

`specs/` は製品の決め事（仕様 → 実装）の正本だが、実装・検証の過程で初めて見えるバグ修正後の挙動、品質属性、合格条件もある。これらを `specs/` に逆流させると憲法のアウトプット向き（仕様 → 実装）と衝突し、決め事と検証基準が混ざる。既存の薄いガイドは `docs/post-unit-guide.md` 等だったが、単体を含まずレイヤも曖昧だった。

## 決定

1. ルートに **`quality/`** を置く。仕様時点では未記載だが、実装後に挙動・品質として保証するもの（機能・非機能）の正本とする。
2. **3層**はテストレベル: `unit` / `integration` / `system`（`specs` の L1/L2/L3 とは別軸）。
3. 各層内を設計段階で分類: `requirements` / `basic-design` / `detailed-design`。パスは `quality/<layer>/<stage>/<slug>.md`。段階フォルダは文書追加時に作成する。
4. 機能と非機能は別ツリーにせず、front matter の `aspect` で区別する。
5. `quality/` はテスト／fixture／PBI／issue へのリンクを許可する。実装ソースは hub（PBI/issue）経由を推奨する。
6. 製品規範に格上げすべき発見は Specify／決め事へ移す。工程・置き場の案内は `quality/README.md` と `pbl/README.md` に置く（L1 憲法 §10: `docs/` ガイドは増やさない）。
7. L1 の結合以降の参照は `quality/README.md` / `pbl/README.md` に寄せる。

## 代替案

- `docs/qa/` 配下に正式化 → ルートの `specs/` と対称性が弱く、単体保証の置き場が曖昧
- `specs` に L4 的な品質レイヤを足す → 仕様と検証の混同が残る
- `specs` の L1/L2/L3 を品質にも流用 → テストレベル軸と衝突する

## 却下理由

上記のとおり。検証保証は製品決め事と分離し、テストレベルを第一軸にする。

## 決め事への反映

規範の製品決め事は増やさない。運用は `quality/README.md`、導線は `CONTEXT.md` / `AGENTS.md` / `README.md`（`docs/` ガイドは L1 憲法 §10）。
