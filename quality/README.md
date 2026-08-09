# 品質・挙動保証（quality）

実装・検証の過程で判明した、**挙動・品質として保証するもの**の置き場。機能・非機能の両方を含む。製品の決め事（何を作るか）は [`specs/`](../specs/) に置き、ここには置かない。

詳細は本 README。実現点検: [`/assure`](../.cursor/skills/engineering/assure/SKILL.md)。

## FW 保証範囲

**ForgOS が保証・点検の正本とするのは単体と内部結合まで。**

| レイヤ | パス | FW 上の位置づけ |
|--------|------|----------------|
| 単体 | `quality/unit/` | **保証対象**（TDD／高速ループ） |
| 内部結合 | `quality/integration/` | **保証対象**（`product/` 内モジュール協調。制御した依存） |
| システム | `quality/system/` | **任意の記録置き場**（FW 保証外。E2E・環境・UAT 相当） |

`/assure` の既定範囲は `unit` + `integration`。`system` は利用者が明示したときだけ洗う。合否の中身は人間が定義する。UAT／リリースの**記録**が必要になったら、そのときに最小限のファイルを置き、パスを関連 PBI に残す（ガイド用の `docs/` 文書は増やさない。hub: [`pbl/README.md`](../pbl/README.md)）。

### 拡張口（環境情報・任意）

`system/` に載せるときは、合格条件だけでなく **検証時の環境**（OS／ランタイム／ブラウザ／外部サービス／設定の要約など。秘密は書かない）を残してよい。必須ではない。後から製品側で保証範囲を広げる・再現するときの取り込み口として使う。環境なしの合格条件だけの記録も可。

## specs との境界

| | `specs/` | `quality/` |
|--|----------|------------|
| 役割 | 製品の決め事・導線 | 検証・品質の合格条件 |
| 向き | 仕様 → 実装 | 実装・検証から得た保証の記録 |
| ソース参照 | L2/L3 は不可 | テスト／fixture／PBI／issue へのリンク可。実装ソースは hub（PBI/issue）経由を推奨 |

製品規範に格上げすべき発見は Specify／決め事へ移す。`quality/` に製品決め事を溜め込まない。

### Coverage と Discovery

| 系統 | 意味 | `related_specs` |
|------|------|-----------------|
| **Coverage** | 既存の L2/L3（Dn・usecase）を検証としてカバーする | 必須（パスまたは `#Dn`） |
| **Discovery** | `specs/` に無い合格条件を `quality/` が担う | 空でよい |

Discovery の例（**単体または内部結合で検証可能な**一般的な品質条件。決め事にするなら Specify へ＝`/assure` の Promote 候補）:

- モジュール間の公開契約（入力・出力・失敗形）が呼び出し側の期待と一致する
- 永続化往復で多バイト文字・絵文字などを含む値が化けない
- 書き込み失敗時に理由付きで失敗し、壊れた中間状態を残さない（制御した依存内）
- 同一資源を複数経路から触ったときの競合が明示されるか、後勝ちが文書化されている（プロセス内／テストダブル可）
- 重い処理の公開 API がタイムアウトまたは進捗コールバックを返す（UI 体感は system 任意）
- 一覧・検索など件数が増えても公開 API の応答契約が破綻しない（上限・ページング等）
- 本番相当データや秘密がテスト成果物・ログに漏れない
- ステータスやログに機微なパス・本文を出さない
- 一部だけ編集したとき、未編集部分の差分ノイズが大きくない（ドメイン／永続レイヤ）

UI 体感・支援技術・実ブラウザ複数タブ・本番環境依存などは **system 任意記録**（FW 保証外）。Coverage 用に載せるときは `related_specs` と [catalog](#レイヤ-catalog) に書く（本文は `specs/` のまま）。

## レイヤ（テストレベル）

```text
quality/
├── unit/          # 単体 + catalog.md          … FW 保証
├── integration/   # 内部結合 + catalog.md      … FW 保証
├── system/        # システム + catalog.md      … 任意・FW 保証外
└── _template/
```

パス名 `integration` は **内部結合**（プロダクト内部のモジュール協調）を指す。外部システム結合やフル E2E は `system/`（任意）。

## レイヤ catalog

各レイヤの保証内容の正本（人間向けの読みやすさ）は **`quality/<layer>/catalog.md`**。

**必須:** catalog だけを読んで、そのレイヤで何が保証されているかが分かること。一言要約やファイル名の列挙だけでは足りない。各エントリに合格条件（箇条書き可）を本文で書く。

個別ファイル（`<stage>/<slug>.md`）は検証手順・証拠・背景の詳細。catalog の合格条件と食い違う更新は、両方を同じ変更で揃える。

各エントリに含めるもの:

| 項目 | 内容 |
|------|------|
| **索引** | ファイル先頭。日本語タイトルの一覧（タイトルだけで何が保証されているか分かる） |
| 見出し | 索引と同じ日本語タイトル ＋ status（`draft` / `active` / `retired`）。slug を見出しにしない |
| 文書 | `<stage>/<slug>.md` へのリンク（ファイル名は実装・リンク用） |
| related_specs | Coverage なら決め事／usecase。Discovery なら `—` |
| **保証する内容** | 合格条件そのもの（箇条書き可） |

`/assure` は catalog↔ファイル突合に加え、catalog に合格条件本文があるかを洗う（既定は unit + integration）。

## 段階（設計レベル）

文書パス:

```text
quality/<layer>/<stage>/<slug>.md
```

| パス | 意味 |
|------|------|
| `requirements` | 合格条件・品質要件（何を保証するか） |
| `basic-design` | 検証方針・境界・観点の概要 |
| `detailed-design` | ケース一覧・手順・合否・データ／fixture |

段階サブフォルダは **文書を書くときに作成**する。空の木を先に増やさない。

## 機能と非機能

別ツリーにしない。front matter の `aspect` で区別する（`functional` / `nfr` / `both`）。

## Front matter（必須）

```yaml
---
layer: unit | integration | system
stage: requirements | basic-design | detailed-design
aspect: functional | nfr | both
status: draft | active | retired
related_pbi: []
related_issues: []
related_specs: []
---
```

`layer: integration` = 内部結合。`layer: system` = 任意記録（FW 保証外）。

## テンプレ

新規文書は [`_template/guarantee.md`](./_template/guarantee.md) をコピーする。追加後に当該レイヤの `catalog.md` へ **保証する内容** を本文で書く。

## 点検

`/assure`（モード外）は次を洗う（**既定範囲: unit + integration**。`system` は明示時のみ）:

1. **Coverage** — 範囲の L2/L3（Dn・usecase）が `active` 保証に載っているか（source / L1 / glossary 全文は対象外）
2. **Discovery を含む実現** — Catalog / 台帳 / Evidence / Run / Orphan（`related_specs` 空の保証も Evidence/Run の対象）
3. **Promote** — Discovery → Specify の候補

Audit（`/audit`）は specs↔実装。範囲に製品仕様または active があれば `/assure` へ誘導する。

## 工程との関係

要件 → 基本設計 → 詳細設計 → 開発 → 単体 → **（高速ループここまで）** → 内部結合 → （任意）システム → UAT → リリース。

| 工程 | 保証の置き場 | FW |
|------|-------------|-----|
| 単体 | `quality/unit/` | 保証 |
| 内部結合 | `quality/integration/` | 保証 |
| システム／UAT | `quality/system/` または PBI 追記 | 任意・保証外 |
