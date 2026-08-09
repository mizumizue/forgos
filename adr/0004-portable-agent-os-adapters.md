---
adr: 0004
status: accepted
date: 2026-08-09
---

# 工程手順の正本を agents/ に置き、IDE 固有入口を adapter にする

ForgOS は Cursor 第一のまま、Claude Code など他エージェントからも同じ工程 OS に入れる必要がある。手順本文が `.cursor/skills/` に閉じていると、Cursor 以外は完了条件付き手順に到達できない。

## 文脈

- 運用レーン（`specs/` / `pbl/` / `product/` / `quality/` / `issues/`）は既にツール非依存。
- Mode / Pipeline / Engineering の手順・テンプレ・issue 規約は `.cursor/skills/` に同居していた。
- L1 §6 と framework 規則 9 が手順正本を `.cursor/` に固定していた。

## 決定

1. **工程手順の正本は `agents/`**（modes / pipeline / engineering / ask-me / bootstrap / policy）。
2. **Cursor は primary adapter**: `.cursor/skills/*/SKILL.md` は起動（front matter / slash）と `agents/` への pointer。`.cursor/rules/*.mdc` は常時適用の薄い adapter。規範本文は `agents/policy/`。
3. **Claude Code は二次 adapter**: ルート `CLAUDE.md` は入口のみ。手順は複製しない。
4. **「Cursor 第一」のアイデンティティは維持**（L1 §1.1）。ツール固有パスを憲法の手順正本に焼かない。
5. ADR-0001〜0003（入口分離・What/How・運転第一ページ）は維持。レーン統合はしない。

## 代替案

| 案 | 却下理由 |
|----|----------|
| `.cursor/skills` を共有正本のまま他ツールにコピー | 二重管理。locality が崩れる |
| `docs/` に手順を移す | L1 §10 / framework の `docs/` ガイド禁止と衝突 |
| シンボリックリンクのみ | Windows とツール解決の摩擦が大きい |

## 決め事への反映

規範の正本は L1 0.9.0（憲法 §1.1・§6・§10）。案内同期は `AGENTS.md` / `CONTEXT.md` / `README.md` / `CLAUDE.md` / 領域 README、`agents/`、`.cursor` adapter。
