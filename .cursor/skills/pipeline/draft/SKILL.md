---
name: draft
description: 会話とコード理解から機能 PRD を作り specs/inbox に置く。Draft、機能仕様化、PRD 作成を求めたときに使う。
disable-model-invocation: true
---

# Draft

会話コンテキストとコードベースの理解から機能 PRD を書く。インタビューしない — 既知を統合するだけ。公開先は **`specs/inbox/<feature-slug>/spec.md`**（L2/L3 に丸ごと置かない）。L2/L3 への取り込みは `/promote`。

## ステップ

1. **現状を把握する。** 未把握ならリポジトリを探索する。ドメイン用語に合わせる。完了条件: 対象 feature-slug が一文で決まっている。
2. **公開インターフェースを確認する。** 単体で試す境界をスケッチし、ユーザーが返せる形で確認する（未確認のままステップ 3 に進まない）。選択肢があるときは差分・**推奨と次点とその理由**を付ける。完了条件: ユーザーが境界を明示承認している。

```markdown
## テスト境界の確認

単体テストで確かめる公開インターフェースを次にしたいです。

| 案 | 内容 |
|----|------|
| A | 主: <名前> — <一行>（副なし） |
| B | 主: … ＋ 副: … |

- **推奨: A** — 理由: …
- **次点: B** — 理由: …

### 返信例
1. **A でよい**（推奨どおり）
2. **B でよい**
3. **変えたい** — （どうしたいか）
```

使う語: 公開インターフェース、アプリケーション境界、テスト境界、API。使わない語: 継ぎ目、シーム、seam。

3. **PRD を書く。** 同フォルダの `templates/prd.md` で `specs/inbox/<feature-slug>/spec.md` に公開する。先頭付近に `Status: ready-for-agent`。完了条件: 置き場が inbox で、必須節が揃っている。

## セッション完了

`specs/inbox/<feature-slug>/spec.md` があり、テスト境界が承認済み。

## リファレンス

- 公開先: `.cursor/skills/pipeline/map/issue-tracker.md`（機能 PRD 節）
- 取り込み: `/promote`（`specs/L1/promote-gate.md`）
- テンプレ: 同フォルダの `templates/prd.md`
