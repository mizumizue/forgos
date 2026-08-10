# Promote 自動点検 — run `20260810-kakeibo`

feature-slug: `personal-kakeibo`  
書き込み先: `specs/L3/kakeibo/`（glossary / actors / decisions / usecases）  
成熟度: `draft`（初回取り込み）  
点検日時: 2026-08-10  
方式: 本 run の検証オーバーレイにより、ForgOS 本体の人間 Approve を本ファイルの自動点検ログで代行する（本体の人間ゲート手順自体は変更しない）。

## 1. Source 固定

- Source: `specs/source/personal-kakeibo/spec.md`（点検時点。取り込み完了直後に削除）
- Feature: 個人向け家計簿（デモ版）
- 書き込み先: L3 アプリ関心ドメイン `kakeibo`

## 2. Audit（取り込み前）

範囲: 当該 Source ＋ 既存 L3（`tasks` は別ドメイン）＋ 関連 sandbox／実装（本 Spike では sandbox 未作成・`product/` 未着手）。

### Gap

- [x] 実装は未着手（Promote 前の想定どおり）。仕様→実装の Gap は Implement 以降の対象。取り込みブロッカーではない。
- [x] Source の採用概念・導線 A–D・genre look は L3 草案でカバー予定（本点検の分解・反映で充足）。

### Conform

- [x] 該当実装なし。拡大解釈の実装指摘なし。
- [x] Source の見送り（定期自動登録・複数人共有）およびスコープ外を対象外決め事へ明示し、膨らませない。

### Baseline（L1 E1–E12）

- [x] 製品コード変更なし。Baseline 指摘なし（実装後の Audit で再点検）。

### Assure

- 対象なし（L2/L3 反映前。`quality/**` active なし）。

### 取り込みブロッカー

- 未解決ブロッカー: **ゼロ**

## 3. PRD 分解対応

| Source 節／候補 | L3 種別 | 反映先 |
|-----------------|---------|--------|
| 用語種（取引・口座・カテゴリ・月次予算・ライフサイクル・消化状態） | glossary | `glossary/terms.md` |
| 個人利用者 | actors | `actors/members.md` |
| 口座・カテゴリ | decisions | `decisions/accounts-and-categories.md` |
| 取引ライフサイクル | decisions | `decisions/transaction-lifecycle.md` |
| 月次予算・消化状態 | decisions | `decisions/monthly-budget-and-status.md` |
| genre look 要素 1–4 | decisions（受入境界） | `decisions/screen-presentation.md` |
| 見送り・スコープ外 | decisions | `decisions/out-of-scope.md` |
| US1 / 導線 A | usecases | `usecases/prepare-masters.md` |
| US2 / 導線 B | usecases | `usecases/record-transaction.md` |
| US3 / 導線 C | usecases | `usecases/set-monthly-budget.md` |
| US4 / 導線 D | usecases | `usecases/view-budget-status.md` |
| 実装上の How・FW・永続化選定 | （取り込まない） | — |
| テスト手段の How | （取り込まない。検証可能性は決め事の公開振る舞いに残す） | — |

### 既存決め事との衝突

| 既存 | 衝突 | 方針 |
|------|------|------|
| `specs/L3/tasks/*` | なし（別ドメイン） | 併存 |
| L2 | 本 worktree に製品横断の衝突候補なし | 追加なし |

## 4. Promote ゲート（`specs/L1/promote-gate.md` 完了条件 7 項）

| # | 条件 | 状態 | 根拠 |
|---|------|------|------|
| 1 | 用語 | OK | `glossary/terms.md` に口座・カテゴリ・取引・状態・消化の三態を定義 |
| 2 | アクター | OK | `actors/members.md` に個人利用者の責務 |
| 3 | ユースケース | OK | UC1–UC4。いずれも actors: 個人利用者 |
| 4 | 決め事（What・テスト可能） | OK | D1–D16。閾値（80%）・状態遷移・拒否条件を明記。How なし |
| 5 | 成熟度 | OK | 全ファイル `maturity: draft` |
| 6 | トレーサビリティ | OK | 仕様間リンクのみ。Source／`product/`／sandbox パスなし。PBI は未作成（map 工程） |
| 7 | 矛盾チェック | OK | 既存 L3 `tasks` と衝突なし。解消方針: 併存 |

## 5. 人間ゲート代行（検証オーバーレイ）

### 今回の要点

- Source `personal-kakeibo` を L3 `kakeibo` に分解取り込み
- 採用ドメイン骨格 1–6、table stakes 採用、導線 A–D、genre look 1–4 を What／UC へ
- 見送り・スコープ外は D16
- 成熟度は draft

### 自動点検による承認代行

| 点検項目 | 結果 |
|----------|------|
| ゲート 7 項すべて OK | Yes |
| 取り込みブロッカーゼロ | Yes |
| How・内部構造・Source パスが L3 に混入していない | Yes |
| 採用ドメイン骨格が決め事／UC／対象外に辿れる | Yes（下表） |

**判定: 取り込み可（承認代行）** — 推奨案どおり L3 `kakeibo` へ draft で書き込み、直後に Source を削除する。

## 6. ドメイン骨格トレーサビリティ

| # | 概念 | 辿り先 |
|---|------|--------|
| 1 | 取引 | glossary「取引」／D4–D7／UC2 |
| 2 | カテゴリ | glossary「カテゴリ」／D2–D3／UC1 |
| 3 | 口座 | glossary「口座」／D1,D3／UC1 |
| 4 | 月次予算 | glossary「月次予算」／D8–D11／UC3 |
| 5 | 取引ライフサイクル | glossary「下書き・確定・取消」／D5–D7／UC2 |
| 6 | 予算消化状態 | glossary「余裕・逼迫・超過」／D9–D11,D13／UC4 |
| 7 | 定期自動登録（見送り） | D16 対象外 |
| 8 | 複数人共有（見送り） | D16 対象外 |

## 7. 反映パス一覧

- `specs/L3/kakeibo/glossary/terms.md`
- `specs/L3/kakeibo/actors/members.md`
- `specs/L3/kakeibo/decisions/accounts-and-categories.md`
- `specs/L3/kakeibo/decisions/transaction-lifecycle.md`
- `specs/L3/kakeibo/decisions/monthly-budget-and-status.md`
- `specs/L3/kakeibo/decisions/screen-presentation.md`
- `specs/L3/kakeibo/decisions/out-of-scope.md`
- `specs/L3/kakeibo/usecases/prepare-masters.md`
- `specs/L3/kakeibo/usecases/record-transaction.md`
- `specs/L3/kakeibo/usecases/set-monthly-budget.md`
- `specs/L3/kakeibo/usecases/view-budget-status.md`

## 8. Source 削除・機械ゲート

- 削除対象: `specs/source/personal-kakeibo/`
- 確認コマンド: `python -m tools.check --promoted personal-kakeibo`

## 総合判定

**取り込み可 → 反映済み想定。工程3 Verifier 自己点検は完了報告参照。最終ゲート承認は指揮者。**
