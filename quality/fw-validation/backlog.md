# ForgOS 実証ループ — 改善バックログ

シリーズ累積。各項目は検証 FW／運用の改善候補。テーマ固有の一時メモは各 `runs/*/run-log.md` に残す。

## 未着手

### BL-20260810-01 — worktree 占有時の `main` 起点手順

- 発見 run: `20260810-kakeibo`
- 種別: 運用／オーケストレーション
- 内容: Cursor worktree では他 worktree が `main` を占有していると `main` checkout 不可。本 run では tip コミットから `validation/<run-id>` を新規作成して回避した。工程8（ログのみ main 反映）でも同様の摩擦が出うる。
- 提案: 検証ループ手順（指揮者／工程1・8）に「`main` 占有時は tip から validation ブランチ作成／ログ反映は別 worktree または tip 同期」を明示する。`agents/` 本体へ検証概念を書き戻さない（オーバーレイ／スキル側）。
- 優先: 中

### BL-20260810-02 — draft デモ run での quality catalog Coverage

- 発見 run: `20260810-kakeibo`（Audit 参考・Assure）
- 種別: 検証 FW／Assure 運用
- 内容: Implement 後も `quality/unit`・`quality/integration` の active が 0 のまま。ドメイン単体テストは `product/` 内にあるが catalog／`related_specs` 未紐づけ（Coverage 欠落・構造的孤児）。Audit では非重大・draft デモとして無視候補。
- 提案: 実証ループの工程5–6 オーバーレイで、(a) draft デモは catalog 未整備を許容し run-log に理由を残す、または (b) 最低 1 件の unit catalog 紐づけをゲートに含める、のどちらかを決める。
- 優先: 低〜中

## 完了

（なし）
