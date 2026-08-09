# 品質・挙動保証（quality）

実装・検証の過程で判明した、**挙動・品質として保証するもの**の置き場。機能・非機能の両方を含む。製品の決め事（何を作るか）は [`specs/`](../specs/) に置き、ここには置かない。

詳細は本 README。実現点検: [`/assure`](../.cursor/skills/engineering/assure/SKILL.md)。

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

Discovery の例（アプリ固有ではなく一般的な品質条件。決め事にするなら Specify へ＝`/assure` の Promote 候補）:

- 長いラベルや項目名が読みづらい位置で折り返されない
- 初期表示・主要操作の待ち時間が上限以内（例: 5 秒）
- 連動するビュー（行番号と本文、一覧と詳細など）のスクロール／選択がずれない
- エラーや注意の表示が主操作を隠さない
- 現在位置（フォーカス・選択・検索ヒットなど）が一目で分かる
- 一覧が多件数でも操作・表示が破綻しない
- 重い処理中に UI が長時間固まったままにならない（または進捗が見える）
- 書き込み・保存完了が体感上限以内、または進捗／完了が分かる
- ストレージ不足や権限拒否など環境失敗時に理由付きで失敗し、壊れた状態を残さない
- 同一資源を複数文脈（別タブ等）から触ったときの競合が明示されるか、後勝ちが文書化されている
- 権限・同意を一度拒んだあとに再試行できる
- エラーが支援技術（スクリーンリーダー等）に伝わる
- キーボードだけで主経路（開く→変更→保存など）が通る
- 多バイト文字・絵文字などを含む入力でも往復・再表示で化けない
- 一部だけ編集したとき、未編集部分の差分ノイズが大きくない
- 本番相当データや秘密がテスト成果物・ログに漏れない
- ステータスやログに機微なパス・本文を出さない

Coverage 用に載せるときは `related_specs` と [catalog](#レイヤ-catalog) に書く（本文は `specs/` のまま）。

## レイヤ（テストレベル）

```text
quality/
├── unit/          # 単体 + catalog.md
├── integration/   # 結合 + catalog.md
├── system/        # システム + catalog.md
└── _template/
```

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

`/assure` は catalog↔ファイル突合に加え、catalog に合格条件本文があるかを洗う。

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

## テンプレ

新規文書は [`_template/guarantee.md`](./_template/guarantee.md) をコピーする。追加後に当該レイヤの `catalog.md` へ **保証する内容** を本文で書く。

## 点検

`/assure`（モード外）は次を洗う:

1. **Coverage** — 範囲の L2/L3（Dn・usecase）が `active` 保証に載っているか（inbox / L1 / glossary 全文は対象外）
2. **Discovery を含む実現** — Catalog / 台帳 / Evidence / Run / Orphan（`related_specs` 空の保証も Evidence/Run の対象）
3. **Promote** — Discovery → Specify の候補

Audit（`/audit`）は specs↔実装。範囲に製品仕様または active があれば `/assure` へ誘導する。

## 工程との関係

要件 → 基本設計 → 詳細設計 → 開発 → 単体 → **（高速ループここまで）** → 結合 → システム → UAT → リリース。

| 工程 | 保証の置き場 |
|------|-------------|
| 単体 | `quality/unit/` |
| 結合 | `quality/integration/` |
| システム | `quality/system/` |

FW は結合以降を強く誘導しない。合否の中身は人間が定義する。UAT／リリースの**記録**が必要になったら、そのときに最小限のファイルを置き、パスを関連 PBI に残す（ガイド用の `docs/` 文書は増やさない。hub: [`pbl/README.md`](../pbl/README.md)）。
