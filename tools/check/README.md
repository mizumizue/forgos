# Mechanical gates (ForgOS)

不変条件の機械チェック。Approve（Promote / maturity / 最終 `done`）はしない。

## 実行

リポジトリルートで:

```text
python -m tools.check
python -m tools.check --promoted <feature-slug>
python -m unittest discover -s tools/check/tests
```

## チェック（最小4）

| code | 内容 |
|------|------|
| `L23_IMPL_REF` | L2/L3 が `product/...` / `sandbox/...` パスを参照しない（L1 §2.5）。単独の `product/` / `sandbox/` トークンは許容 |
| `DECISION_FRONT_MATTER` | `specs/L{2,3}/**/decisions/**/*.md` の `maturity` ∈ draft\|stable\|confirmed |
| `DONE_DRAFT_DECISION` | PBI `status: done` なのにリンク先決め事が `draft`（または欠落） |
| `PROMOTE_SOURCE_LEFTOVER` | `--promoted <slug>` 指定時、`specs/source/<slug>/` が残っている |

公開 IF: `tools.check.run_checks(root, promoted_slugs=...)` → `CheckResult`。
