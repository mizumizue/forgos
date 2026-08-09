---
adr: 0001
status: accepted
date: 2026-08-09
---

# 成熟度＝凍結／完了ゲート、置き場はレイヤ、入口第一分岐は Spike or Specify

「mode／パスが長い」への対策として、ゲートは残したまま **入口とフローを分け**、**コード置き場を成熟度ではなく仕様レイヤで決める** ことにした。仮説が外れたら本 ADR を `superseded` にし、下記「巻き戻し」で 0.7.4 相当に戻す。

## 文脈

- 新規機能の成果物パスが長く見える。
- 一方 Promote・向き制限・TDD・`done` 前点検は ForgOS の差別化であり、削るとガバナンスが薄れる。
- 旧モデルは「draft 成熟度 → sandbox」「stable 以上 → product/」で、**すでに L2/L3 にある規範**なのに draft だと sandbox に戻る、という棲み分けの違和感があった。
- スキル名 `/draft` が成熟度 `draft` と同語で混乱したため `/inbox` を経て **`/spec-source`** に改名し、置き場も **`specs/source/`** に揃えた。

## 決定

1. **入口 ≠ フロー。** 第一分岐は Spike or Specify。Implement / Audit / Steward は第二段。Source へ書くフロー起動は `/spec-source`。
2. **Spike** = 要件スパイク。粗い Source ＋ sandbox。`product/` 禁止。
3. **Specify** = L2/L3 直書き入口（Source 非経由）。`/spec-source` と別。
4. **置き場:** source↔sandbox、L2/L3↔product/。Promote = source → L2/L3（product/ 資格）。
5. **成熟度** = 凍結／完了ゲート（置き場は決めない）。
   - draft: 仕様編集可、`product/` 可、`done` 不可
   - stable: 原則仕様変更しない（例外は差分＋人間が維持 or draft 降格）、`done` 可
   - confirmed: 仕様変更しない。競合は矛盾をユーザーへ返し仕様検討
6. **map と cut は同一セッション可**（段の削除ではない）。
7. L1 を **0.8.x** に上げ、案内を同期。スキル `/draft` → `/inbox` → **`/spec-source`**。置き場 `specs/inbox/` → **`specs/source/`**。

## 仮説

- 長さの痛みはゲートそのものより **案内の段数と置き場の混同** である。
- source↔sandbox / L2/L3↔product/ の方が運用がきれい。
- Spike or Specify の第一分岐で入口の認知負荷が下がる。
- スキル名を置き場に揃えると成熟度 draft との衝突が消える。

## 代替案（却下）

| 案 | 却下理由 |
|----|----------|
| Promote／TDD／二重 Audit を条件付き免除 | ガバナンス核を捨てる |
| Specify 直書きを短い新規の主経路にする | 大げさ。粗い Source は specs/source が適切 |
| 成熟度をやめて 2 値化 | 用語コスト大。draft／stable／confirmed の三段で足りる |
| sandbox を L2/L3 draft にも使う（旧） | 規範ツリーと試し場が混ざる |
| スキル名 `/draft` を維持し注記で区別 | 再発しやすい。置き場名 `/spec-source` の方が一致する |

## 決め事への反映

規範の正本は L1（憲法 §1–4・§6–7、工学最低ライン E2）。製品ドメイン決め事は変更していない。

## 巻き戻し（仮説が外れたとき）

1. 本 ADR を `status: superseded` にし、後継 ADR を切る（または `rejected` に変更して理由を追記）。
2. `specs/L1/VERSION` と各 L1 front matter を **0.7.4** 相当の定義に戻す:
   - draft → 探索のみ（sandbox）
   - stable 以上 → 通常 `product/`
   - Spike: 仕様後回し可・Source 必須にしない
3. スキル `/spec-source` を旧 `/draft`（`pipeline/draft/`）に戻すかは別判断（成熟度との衝突は残る）。
4. 同期ファイルを旧案内に戻す: `CONTEXT.md`、`AGENTS.md`、`README.md`、`specs/README.md`、`sandbox/README.md`、`.cursor/rules/framework.mdc`、`.cursor/skills/ask-me/`、`modes/spike|specify|implement`、`pipeline/spec-source|map|cut`。
5. git では本変更のコミットを `git revert` するのが最短。

検証観点（戻す判断の目安）:

- draft の `product/` が捨てコードで汚れる／`done` が draft のまま通る
- Spike で Source 必須が探索を阻害する
- 第一分岐 Spike/Specify がかえって迷わせる
