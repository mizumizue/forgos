# 実装イシュー

ライフサイクルはディレクトリで表す。**ファイルは削除しない** — `Status:` を更新して移動する。

| ディレクトリ | Status | 意味 |
|---|---|---|
| `backlog/` | `backlog` | 未着手（`/cut` の公開先） |
| `active/` | `active` | 作業中 |
| `pending_sync/` | `pending_sync` | 同期・人間ゲート等の保留 |
| `completed/` | `completed` | 完了 |

規約の正本: `.cursor/skills/pipeline/map/issue-tracker.md`
