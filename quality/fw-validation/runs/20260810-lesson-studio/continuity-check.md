# Continuity check — 20260810-lesson-studio

- **STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`
- **feature-slug:** `lesson-studio-scheduling`
- **チェック日:** 2026-08-10
- **モード:** `all`
- **ブランチ:** `validation/20260810-lesson-studio`

## サマリ

| ペア | 状態 | 上流義務数 | 黙落 | 許可見送り | 逆流追加 | X0–X5 |
|------|------|------------|------|------------|----------|-------|
| P12 | skip | — | — | — | — | skip |
| P23 | **pass** | 採用5・見送り5 | 0 | 1 | 0 | Yes |
| P34 | **pass** | 概念8・WF3・役3 | 0 | 0 | 0 | Yes |
| P45 | **fail** | J4・起動時項目 | 1 | 0 | 0 | No（X3） |
| P56 | skip | manifest20行 | — | — | — | skip |
| P67 | **pass** | B5・概念8・役3 | 0 | 4 | 0 | Yes |
| P78 | **pass** | implement14・V26 | 0 | 0 | 0 | Yes |
| P89 | **fail** | implement14・V26 | 26 | 0 | 0 | No（X3） |

**総合判定: FAIL** — 黙落 27 件（visibility 26 件は単一根因）。P56 は Source 欠落で未検証。

## 黙落詳細

| ペア | 上流 ID／要約 | 期待下流 | 実際 |
|------|---------------|----------|------|
| P45 | design-call §採用／見送り表「未納は S1 上端の細アラートのみ」（A5 帰結） | `scope.md` manifest 行または §demo-seeded visibility、または `deferred`＋根拠 | manifest／visibility に行なし。`product/` に UI なし |
| P89 | `scope.md` §demo-seeded visibility **全26行**（V-a-teacher 〜 V-s3-privacy-empty-seat） | `RUN/demo-seeded-check.md` に 1行1 V-ID | **ファイル不存在**。issue AC に cold start 記述はあるが工程9必須成果物が欠落 |
| P89 | `scope.md` manifest `implement` 14行の cold start 契約（DEMO-UX I9a） | `implement-reachability.md` の `cold_start` 列が全 Yes | **列なし**。14行の操作パスはあるが cold_start 列・シード根拠列が欠落 |

### 許可見送り（黙落ではない）

| ペア | 上流 | 下流痕跡 | 判定 |
|------|------|----------|------|
| P23 | brief **A5** 月謝ステータス（未納・滞納アラート）採用 | `spec-depth.md` C9 `TuitionLedger` **見送り**＋`scope.md` §スコープ外・在籍状態のみ | `deferred_ok`（能力縮小は明示。brief 採用表の A5 は未更新が **conform 候補**） |
| P67 | Source 見送り概念 C9–C12 | `out-of-scope.md` | `deferred_ok` |

## ペア別抽出表

### P12（1→2）— skip

- **理由:** 工程1の初期 `scope.md`（brief 統合前）が残存せず、統合版のみ。テーマ・システム狙いは `sector-brief.md` に存在するが、ペア境界の機械比較不可。
- **X0:** skip 記録済み

### P23（2→3）— pass

| 上流 ID | 種別 | 下流痕跡 | 判定 |
|---------|------|----------|------|
| A1 | brief 採用 | C1,C2 `WeeklyClassSlot`,`EnrollmentAssignment` | carried |
| A2 | brief 採用 | C5 `MakeupRequest` + WF-2 | carried |
| A3 | brief 採用 | C4 `AbsenceNotice` | carried |
| A4 | brief 採用 | C6 `RuntimeDurationRule` | carried |
| A5 | brief 採用 | C9 `TuitionLedger` 見送り、在籍状態のみ | deferred_ok |
| D1–D5 | brief 見送り | C10–C12 等 見送り | carried |
| T1–T4 table stakes 採用 | 通例 | WF・C7 `MakeupPolicyBundle` 等 | carried |
| 役3 | ロール | D2 役3 | carried |

- **件数:** 採用5→概念採用8（A1–A4 は概念へ展開）。見送り5→見送り4概念+scope外。**黙落 0**

### P34（3→4）— pass

| 上流 | 下流痕跡 | 判定 |
|------|----------|------|
| 採用概念 C1–C8 | design-call 表面・G1 座席リング・ラベル | carried |
| WF-1,2,3 | J1,J2,J3 + J4 横断 | carried |
| D3 採用境界7行 | design-call / 後続 scope manifest D | carried |
| 役3 | S1/S2/S3 actor-split | carried |

### P45（4→5）— fail

| 上流 | 下流痕跡 | 判定 |
|------|----------|------|
| J1 | manifest B-uc-report-absence, J1 | carried |
| J2 | B-uc-request-makeup, B-uc-process-makeup, J2 | carried |
| J3 | B-uc-confirm-attendance, J3 | carried |
| J4 | B-uc-process-makeup, J4, S1↔S2 遷移 | carried |
| 表面3 S1,S2,S3 | scope S2,S3 | carried |
| attention 3表面 | scope S5 | carried |
| genre G1–G5 ≥3 | scope S7 | carried |
| 起動時見せ（座席・申請中カード等） | visibility 26行 | carried |
| **未納 S1 细アラート（A5 帰結）** | manifest／visibility／deferred | **silent_drop** |

- **件数:** ジャーニー4→B表ジャーニー列に4件すべて。**黙落 1**

### P56（5→6）— skip

- **上流:** `scope.md` manifest implement **14** + deferred **6** + visibility **26**
- **下流:** `specs/source/lesson-studio-scheduling/spec.md` — **削除済み**（`promote-check.md`）。git 履歴にも未コミット
- **代理証跡:** `promote-check.md` P5 Yes（UC5=manifest B implement5）、DEMO-UX U0–U7 は promote 時 Pass と記録
- **リスク:** 5→6 境界の **直接検証不可**。過去 run で scope→Source 縮小が起きた場合、本チェックでは検出できない
- **X0:** skip（下流成果物不在）

### P67（6→7）— pass

| 上流（promote-check／manifest 代理） | 下流痕跡 | 判定 |
|--------------------------------------|----------|------|
| B implement 5 UC | `usecases/*.md` 5ファイル | carried |
| 採用概念 C1–C8 | glossary, scheduling-rules, actor-surfaces | carried |
| 役3 | `actors/members.md` | carried |
| usability what 5件（promote-check P1） | scheduling-rules D3–D13, UC 本文 | carried |
| 見送り C9–C12 | `out-of-scope.md` | deferred_ok |
| design How | promote-check P4、L2/L3 に How なし | carried |

- **件数:** B implement 5 = UC 5。**黙落 0**

### P78（7→8）— pass

| 上流 | 下流痕跡 | 判定 |
|------|----------|------|
| manifest implement 14行 | PBI AC-1〜4 + issue Manifest 行 | carried |
| manifest A 3 actor | issue 01/02 cold start AC | carried |
| manifest C 4 + D implement 2 | issue 02 / 01 AC | carried |
| visibility 26行 | PBI AC-6 + issue cold start AC 全件 | carried |
| L3 UC 5 | issue ≥1 各 | carried |

- **件数:** implement 14 カバー、V 26 カバー（PBI/issue 上）。**黙落 0**（工程8境界）

### P89（8→9）— fail

| 上流 | 下流痕跡 | 判定 |
|------|----------|------|
| manifest implement 14 | `implement-reachability.md` 14行 | carried |
| manifest implement cold_start | reachability **cold_start 列なし** | **silent_drop**（契約列欠落） |
| visibility V×26 | `demo-seeded-check.md` | **silent_drop**（ファイル欠落） |
| issue Manifest IDs | reachability 14行と一致 | carried |

- **件数:** reachability 行数 14/14 ✓。visibility check 0/26 ✗。**黙落 26+1**

## 所見（縮小パターン）

1. **工程5→6（P56 未検証）:** Source 削除により境界検証不能。`promote-check` は件数一致のみ。UC 数と manifest B の一致は確認済みだが、visibility 26行・C/D 例外の Source 落ち込みは **再現不能**。
2. **工程8→9（P89）:** map/cut では visibility が issue AC に分解済みだが、工程9必須の `demo-seeded-check.md` が未作成。ゲートログは overlay v3 追加後の Pass 宣言と矛盾（成果物欠落）。
3. **A5 月謝（P23/P45）:** 決済スコープ外への縮小は `spec-depth`→`scope` で明示。ただし design-call の「S1 细アラートのみ」は manifest に落ちず実装もなし — **設計→統合 scope の黙落**。
4. **reachability:** 操作パスは揃うが cold_start 列欠落 — Implement 工程内の契約落ち。

## 推奨アクション（指揮者向け）

| 優先 | 戻し先 | 内容 |
|------|--------|------|
| 高 | 工程9 | `demo-seeded-check.md` 作成（26行）。`implement-reachability.md` に cold_start・シード根拠列追加 |
| 中 | 工程5 または 4 | A5 细アラートを `deferred`＋根拠で manifest 化するか、design-call から削除 |
| 低 | 工程6 | 次 run では P56 を Promote 前に必須化。本 run は Source 復元不可のため代理のみ |

## Verifier 総合

- 実行ペア: 8（skip 2, pass 4, fail 2）
- **X0–X5 全 Yes:** No
- **黙落（silent_drop）:** 27 件（実質 2 系統 + visibility 26）
- **Stop:** 周1打ち切り（監視スキル・改変なし）
