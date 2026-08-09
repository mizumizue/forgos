# ForgOS

リポジトリ規約と Cursor 第一の AI 工程 OS を一体にしたスターター。表示名 **ForgOS**、slug `forgos`。

## Language

**Mode（モード）**:
Spike / Specify / Implement / Audit / Steward。作業の公式入口。第一分岐は Spike or Specify。フロー（Pipeline）とは別軸。

**Pipeline**:
source → L2/L3 → pbl → issues → product → audit。成果物の流れ。`/map` と `/cut` は同一セッション可。Source へ書くスキルは `/spec-source`。

**Spike**:
あいまいな要件を触って減らす。粗い Source ＋ `sandbox/`。`product/` には書かない。

**Specify**:
L2/L3 に規範を直書きする入口。Source を経由しない。`/spec-source`（フロー）とは別。

**Promote**:
`specs/source` の機能 PRD を L2/L3 へ取り込む人間ゲート。独立モードではない。起動は `/promote`。source → L2/L3 が `product/` 資格の境界。

**決め事（Decision）**:
守るべき規範の正本。`specs/**/decisions/`。

**ADR**:
任意の経緯置き場（`adr/`）。規範の正本ではない。必須ではない。

**PBI**:
**hub** — `specs/` ↔ `product/` のマップ。正本にしない。issue は原則 PBI から切る。

**成熟度**:
draft / stable / confirmed。仕様の凍結／完了ゲート。コード置き場はレイヤ（source→sandbox、L2/L3→product/）で決める。`done` は stable 以上。

**Sandbox**:
Source の試し場（`sandbox/`）。L2/L3 紐づけの本実装は置かない。

**Source**:
機能 PRD。`specs/source/<feature-slug>/spec.md`。書く起動は `/spec-source`。

**L1**:
FW 憲法と工学最低ライン。Agent 編集不可。

**quality**:
実装後に保証する挙動・品質（機能・非機能）。`quality/`（単体／結合／システム × 要件／基本設計／詳細設計）。製品決め事は `specs/`。

**Assure**:
Coverage（L2/L3→保証）と Discovery（specs 外の保証）の実現点検。レイヤの合格条件は `quality/<layer>/catalog.md`（単体で読める文面）。モード外。起動は `/assure`。Audit は specs↔実装。

**ask-me**:
モード・パイプライン・モード外スキルのルーター。起動は `/ask-me`。案内のみで代理実行しない。

**Bootstrap**:
default example を `product/` に展開し、プロダクト用リポに仕立てる一度きりの手順。起動は `/bootstrap-product`。

## Relationships

- 定常の正本: **決め事 > コード**
- 定常のアウトプット: **仕様 → 実装**。L2/L3 はソースを参照しない（L1 憲法 §2.3–2.4 / `specs/README.md`）
- 置き場: source↔sandbox、L2/L3↔product/
- 検証・品質の保証は `quality/`（`specs` と分離）。`/assure` は Coverage（specs↔保証）と実現を洗う。製品規範への格上げは Specify／決め事へ
- 起動先に迷ったら `/ask-me`（第一問は Spike or Specify）
- PBI は hub（`specs/` ↔ `product/`）。定義は `pbl/README.md`。マップの正は規範 ID 対応表。`done` と `specified` を区別する。関連コード/PR は PBI・issue 側
- issue は原則 PBI から切る。Issue 先行後は仕様化して PBI に対応だけ載せる
- Implement は TDD 必須。`product/` は L2/L3（draft 可）に紐づけ可。`done` は stable 以上。人間は仕様意図レビュー
- `examples/` は参考。コア規約はスタック非依存
- 結合以降の保証置き場は `quality/README.md`。hub への追記は `pbl/README.md`
- `docs/` にガイド・エージェント文書を増やさない（L1 憲法 §10）

## Flagged ambiguities

- 「仕様」— 決め事を指すことが多い。PBI と混同しない。品質保証は `quality/`、Coverage／実現点検は Assure
- 「完了」— モードにより意味が違う。PBI `done` は stable 以上。draft の `product/` 作業は WIP
- 「レビュー」— コードレビューではなく仕様意図・整合
- 「ビルド」— アプリ／CI のビルド。モード名は Implement
- 「Audit」— specs↔実装。Assure — Coverage（specs→保証）＋ Discovery（specs 外保証）＋ Evidence/Run
- 「draft」— **成熟度**（L2/L3 の凍結前）。スキル `/spec-source`・旧名 `/draft` `/inbox`・「下書き」一般と混同しない
- 「ソース」— 実装ソースコードではなく、文脈によって **Source（機能 PRD）** を指す
