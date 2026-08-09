---
name: assure
description: Coverage（specs→保証）と Discovery（specs 外の保証）の実現を点検する。モード外。
disable-model-invocation: true
---

# Assure

保証には二系統ある。**Coverage**（製品仕様が保証に載っているか）と **Discovery**（`specs/` に無い合格条件——読みやすさ・応答時間など——を `quality/` が担う）。どちらも **Evidence / Run** で洗う。主成果物は人間判断用の指摘リスト。公式モードではない（Audit は specs↔実装）。

## ステップ

1. **範囲を固定する。** PBI・`quality` パス・レイヤ（`unit` / `integration` / `system` / 全部）・対象仕様パスを決める。完了条件: 範囲が一文で書ける。
2. **Catalog を読む。** 範囲レイヤの `quality/<layer>/catalog.md` を開き、次を確認する。完了条件: 各観点の指摘がある（欠如も明示）。形式の正本は `quality/README.md`。
   - (a) 文書ファイルと突合（catalog に無いファイル／ファイルに無いエントリ）
   - (b) 先頭に **索引**（日本語タイトル一覧）があり、タイトルだけで何が保証されているか分かる
   - (c) 各節の見出しが索引と同じ日本語タイトル＋status で、slug 見出しになっていない
   - (d) 各エントリに **保証する内容**（合格条件本文）があり、catalog 単体で読める（要約のみは指摘）
   - (e) 個別文書の H1 が catalog タイトルと一致している
3. **台帳を作る。** `status` ごとに件数を数え、`active` のうち `related_specs` が空のものを **Discovery** 件数として分ける。完了条件: 台帳がある。`active` が 0 でも Coverage は続行する。
4. **Coverage を洗う。** 範囲の製品仕様（`specs/` の L2/L3。**source・L1・`_template`・glossary 全文は対象外**）について、決め事の各 Dn と usecase が、いずれかの `active` 保証の `related_specs`（または catalog 行）でカバーされているか確認する。欠落をリストする。完了条件: Coverage リスト（空でも明示）。Discovery（`related_specs` 空）は Coverage リストの対象外で、Evidence / Run のみ洗う。hub 対応表は補助。正は `quality` 側の紐づけ。
5. **Evidence（証拠）を洗う。** 各 `active`（Coverage 由来も Discovery も）について、合格条件に対応する証拠があるか確認する。欠落をリストする。完了条件: Evidence リスト（空でも明示）。`active` 0 なら「対象なし」。
6. **Run（実行確認）をする。** `layer: unit` かつ証拠が自動化テストなら実行して緑を確認する。結合／システムは実施記録があるか、または「未実施」を明示する（強制 E2E は求めない）。完了条件: Run 節がある。
7. **Orphan（孤児）を洗う。** 範囲のテスト／手順がどの `active` にも紐づかないもの、`retired` なのに参照され続けるもの、catalog とファイルの不一致を指摘する。完了条件: Orphan リスト（空でも明示）。
8. **Promote 候補を付ける。** Discovery のうち製品決め事に格上げすべきものを「Specify へ」候補にする。完了条件: Promote 候補節がある（空可）。
9. **次アクションを付ける。** 各指摘に「保証追加 / catalog 更新（索引・日本語タイトル含む） / 証拠追加 / 実装修正 / 無視（理由）」を付ける。完了条件: 指摘ごとに次アクション候補がある。

## 出力フォーマット

```markdown
## 台帳
- active: N（Discovery: M） / draft: N / retired: N

## Catalog
- [ ] 索引（日本語タイトルだけで内容が分かる）
- [ ] 見出し・H1 一致 / 保証する内容の本文
- [ ] ファイル突合

## Coverage
- [ ] ...

## Evidence
- [ ] ...

## Run
- [ ] ...

## Orphan
- [ ] ...

## Promote 候補
- [ ] ...

## 次アクション
- ...
```

## セッション完了

指摘リストと次アクションがある。

## リファレンス

- Discovery / catalog 運用: `quality/README.md`
- Audit（specs↔実装）: `.cursor/skills/modes/audit/SKILL.md`
- モード索引: `AGENTS.md`
