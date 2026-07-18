# ForgOS

リポジトリ規約と Cursor 第一の AI 工程 OS を一体にしたスターター。表示名 **ForgOS**、slug `forgos`。

## Language

**Mode（モード）**:
Explore / Build / Spec-only / Maintain-FW / Verify。作業の公式入口。スキル名はモードに対応する。

**Extract**:
仕様昇格の人間ゲート。独立モードではない。

**決め事（Decision）**:
守るべき規範の正本。`specs/**/decisions/`。

**ADR**:
意思決定の経緯。規範の正本ではない。

**PBI**:
要求・進捗・リンクのハブ。正本にしない。

**成熟度**:
draft / stable / confirmed。実装可否を決める。

**Sandbox**:
探索用コード置き場（`product/sandbox/`）。通常 feature に紐づけない。

**L1**:
FW 憲法と工学最低ライン。Agent 編集不可。

## Relationships

- 定常の正本: **決め事 > ADR > コード**
- PBI はハブ。`done` と `specified` を区別する
- Build は TDD 必須。人間は仕様意図レビュー
- `examples/` は参考。コア規約はスタック非依存
- 結合以降は `docs/post-unit-guide.md` の薄いガイドのみ

## Flagged ambiguities

- 「仕様」— 決め事を指すことが多い。ADR や PBI と混同しない
- 「完了」— モードにより意味が違う。PBI `done` とは限らない
- 「レビュー」— コードレビューではなく仕様意図・整合
