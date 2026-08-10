# 実証ログ — 20260810-shop-reservation

**工程:** 7完了 → 8実施（ログのみ main 反映・push）  
**実行手段:** `loop-eng` 型 `EO`  
**作業ブランチ:** `validation/20260810-shop-reservation`

## テーマ

小規模店舗の予約管理（正式プロダクトのデモ版）。画面操作で営業時間・枠・空き確認・申込・店舗確定・ステータス遷移・一覧詳細を一通り辿れるかを、ForgOS 工程（スコープ固定〜Audit）で検証した。

## 通った工程（1–6）とゲート結果要約

| 工程 | 結果 | 要約 |
|------|------|------|
| 1 スコープ固定 | 通過 | `scope.md`。骨格7概念すべて採用。画面を通常形態。スコープ外（決済・外部同期等）明示 |
| 2 Spike / Source | 通過（成果は後工程参照） | Source `specs/source/shop-reservation/` を作成し Promote で取り込み。完了直後に Source 削除済み（`promote-check.md`） |
| 3 Promote | 通過 | L3 `specs/L3/reservations/` へ What 取り込み。ゲート7項 OK。人間ゲートは点検ログ代行（`promote-check.md`） |
| 4 map / cut | 通過 | PBI-0002 新規。issue 01（営業時間・枠）／02（空き〜確定・状態）を cut → Implement 後 `issues/completed/` |
| 5 Implement | 通過 | `product/` domain（Vitest）＋ web（Vite/React）。`pnpm test` 7 passed。issue 01/02 completed。PBI 対応表 covered |
| 6 Audit | 通過 | 重大 0。軽微あり（G1–G3 等）。Implement 巻き戻し不要。詳細は `audit-findings.md` |

参照: `gate-log.md` / `promote-check.md` / `audit-findings.md` / `scope.md`

## 詰まり・所見

- **詰まり（重大）:** なし。工程1–6はいずれも通過。
- **所見（アプリ／デモ固有・軽微）:** Audit G1（空きなしでも申込ボタン活性）、G2（状態非連動の店舗操作ボタン）、G3（`partySize <= 0` 未拒否）、E6–E7・E12 はドメイン拒否またはデモ前提で受入可。**本 run では FW backlog に載せず、アプリ側の任意フォローとする。**
- **所見（環境）:** Audit セッションで PATH に node/pnpm がなく単体の再実行未実施（E4）。Implement 時点の 7 passed 記録で代替。
- **所見（Assure）:** `quality/unit`・`quality/integration` catalog は索引あり・active 0。Coverage 欠落は軽微扱い（A1）。重大判定にはしていない。
- **所見（adapter）:** Promote は `.cursor/skills/` にスキルがなく `agents/pipeline/promote/playbook.md` 直実行で通過（フォールバック不要判定）。

## 改善事項の扱い

方針: **FW／パイプライン改善のみ backlog 追記。アプリ固有の軽微 UI／入力は run-log 所見に留める。**

- backlog 追記: **2件**（上限内）→ `quality/fw-validation/backlog.md`
  1. Implement 後も Assure catalog active が空のまま工程6通過できる導線
  2. Cursor adapter に promote スキルが無い点
- アプリ軽微（G1–G3 等）: **改善なし（backlog 非掲載）** — 上記方針どおり所見のみ

## 工程8（ログのみ main 反映・push）

- 作業ブランチ: `validation/20260810-shop-reservation`
- validation ブランチ push: `git push -u origin validation/20260810-shop-reservation`（remote: `https://github.com/mizumizue/forgos`、HEAD `4a011d1`）済み
- main への取り込み手順（ログのみ）:
  1. `main` を最新化（`git pull origin main`）
  2. `git checkout validation/20260810-shop-reservation -- quality/fw-validation/`
  3. 変更が `quality/fw-validation/` のみであることを確認してコミット
  4. `git push origin main`（force 禁止）
- main 反映コミット: `2a47efc` — `add fw-validation log for 20260810-shop-reservation`（`quality/fw-validation/` のみ）
- main push: `origin/main` へ反映済み（`95b730f..2a47efc`）
