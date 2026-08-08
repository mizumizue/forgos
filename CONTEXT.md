# ForgOS

リポジトリ規約と Cursor 第一の AI 工程 OS を一体にしたスターター。表示名 **ForgOS**、slug `forgos`。

## Language

**Mode（モード）**:
Spike / Specify / Implement / Audit / Steward。作業の公式入口。

**Pipeline**:
`/draft` → `/promote` → `/map` → `/cut` → `/implement` → `/audit`。成果物の流れ。

**Promote**:
`specs/inbox` の機能 PRD を L2/L3 へ取り込む人間ゲート。独立モードではない。起動は `/promote`。

**決め事（Decision）**:
守るべき規範の正本。`specs/**/decisions/`。

**ADR**:
意思決定の経緯。規範の正本ではない。

**PBI**:
**hub** — `specs/` ↔ `product/` のマップ。正本にしない。issue は原則 PBI から切る。

**成熟度**:
draft / stable / confirmed。実装可否を決める。

**Sandbox**:
探索用コード置き場（`product/sandbox/`）。通常 feature に紐づけない。

**inbox**:
機能 PRD（Source）。`specs/inbox/<feature-slug>/spec.md`。

**L1**:
FW 憲法と工学最低ライン。Agent 編集不可。

**quality**:
実装後に保証する挙動・品質（機能・非機能）。`quality/`（単体／結合／システム × 要件／基本設計／詳細設計）。製品決め事は `specs/`（ADR 0006）。

**Assure**:
Coverage（L2/L3→保証）と Discovery（specs 外の保証）の実現点検。レイヤの合格条件は `quality/<layer>/catalog.md`（単体で読める文面）。モード外。起動は `/assure`（ADR 0007／0010）。Audit は specs↔実装。

**ask-me**:
モード・パイプライン・モード外スキルのルーター。起動は `/ask-me`（ADR 0008）。案内のみで代理実行しない。

**Bootstrap**:
default example を `product/` に展開し、プロダクト用リポに仕立てる一度きりの手順。起動は `/bootstrap-product`。

## Relationships

- 定常の正本: **決め事 > ADR > コード**
- 定常のアウトプット: **仕様 → 実装**。L2/L3 はソースを参照しない（L1 憲法 §2.3–2.4 / `specs/README.md`）
- 検証・品質の保証は `quality/`（`specs` と分離。ADR 0006）。`/assure` は Coverage（specs↔保証）と実現を洗う（ADR 0010）。製品規範への格上げは Specify／決め事へ
- 起動先に迷ったら `/ask-me`
- PBI は hub（`specs/` ↔ `product/`）。定義は `pbl/README.md`。マップの正は規範 ID 対応表（ADR 0009）。`done` と `specified` を区別する。関連コード/PR は PBI・issue 側
- issue は原則 PBI から切る。Issue 先行後は仕様化して PBI に対応だけ載せる
- Implement は TDD 必須。人間は仕様意図レビュー
- `examples/` は参考。コア規約はスタック非依存
- 結合以降の保証置き場は `quality/README.md`。hub への追記は `pbl/README.md`
- `docs/` にガイド・エージェント文書を増やさない（L1 憲法 §10）

## Flagged ambiguities

- 「仕様」— 決め事を指すことが多い。ADR や PBI と混同しない。品質保証は `quality/`、Coverage／実現点検は Assure
- 「完了」— モードにより意味が違う。PBI `done` とは限らない
- 「レビュー」— コードレビューではなく仕様意図・整合
- 「ビルド」— アプリ／CI のビルド。モード名は Implement
- 「Audit」— specs↔実装。Assure — Coverage（specs→保証）＋ Discovery（specs 外保証）＋ Evidence/Run
