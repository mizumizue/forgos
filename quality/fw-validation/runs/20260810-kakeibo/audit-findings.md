# Audit 指摘リスト — run `20260810-kakeibo`

- モード: Audit
- 日時: 2026-08-10
- ブランチ: `validation/20260810-kakeibo`
- 範囲一文: PBI-0002〜0005 と `specs/L3/kakeibo/`（D1–D16・UC1–UC4）に対し、`product/apps/kakeibo/` の実装乖離・拡大解釈・L1 工学ラインを点検する（最終ゲート承認はしない）。
- 重大指摘: **なし** → Verifier **(A)**

## Gap

- [x] （空）仕様にあるが実装にない重大な欠落は見当たらない。
  - D1–D3 / UC1: 口座・カテゴリ登録と空名称拒否・取引土台検証 → `domain/kakeibo.ts` + 画面「口座」「カテゴリ」
  - D4–D7 / UC2: 下書き→確定／取消、禁止遷移、画面上の状態区別 → ドメイン遷移 + 画面「取引」
  - D8–D11 / UC3–UC4: 月次予算・消化閾値（80%）・未設定 → `getBudgetDigest` + 「月次予算」「月次サマリー」
  - D12–D15: 対象月切替・消化進捗・収支視覚差・マスタ導線 → `App.tsx` / `App.css`
  - D16: 対象外機能の実装なし（意図どおり）
- [ ] （参考・非重大）画面操作の自動テストは無く、UI 受入は手動操作パス（README）に依存する。ドメイン単体は `kakeibo.test.ts` 10 件緑。
  - 仕様引用: 決め事は画面振る舞いを求めるが、自動化手段は How として規定していない
  - コード: `product/apps/kakeibo/src/App.tsx`（UI あり）／テストは `src/domain/kakeibo.test.ts` のみ

## Conform

- [x] （空）仕様を超えるスコープ拡大・対象外（D16）の実装は見当たらない。
- [ ] （参考・非重大）取引登録時にカテゴリ選択肢を収入／支出向きで絞る。決め事の必須ではないが、D3 の向き一致を助け過剰機能ではない。
  - 仕様: `accounts-and-categories.md` D3
  - コード: `App.tsx` `filteredCategories`
- [ ] （参考・非重大）ホームの取引一覧を対象月でフィルタする。D12 の月次中心提示と整合し、スコープ外機能ではない。
  - 仕様: `screen-presentation.md` D12
  - コード: `App.tsx` `monthTransactions`

## Baseline（L1 E1–E12）

- [x] E1 秘密情報: 該当なし（デモ入力のみ）
- [x] E2 実装の紐づけ: `product/apps/kakeibo` → L3 `specs/L3/kakeibo/`（draft）。PBI は `done` 未宣言（意図どおり）
- [x] E3 Audit 可能性: 決め事 ID・PBI 対応表・issue から追跡可能。仕様から実装パスを張っていない
- [x] E4 単体緑: `cd product/apps/kakeibo && npm test` → 10 passed（本 Audit で再実行）
- [x] E5 L1 不可侵: 本セッションで L1 未編集
- [x] E6 入力検証: 空名称・不正金額・未登録紐づけ・向き不一致・禁止遷移をドメインで拒否
- [x] E7 認可: 単一利用者デモ（actors）。マルチテナント対象外（D16）のため指摘なし
- [x] E8 失敗の表現: `Result` + エラーコード、画面で区別可能なメッセージ
- [x] E9–E11: 該当する本番インフラ／破壊的変更なし
- [x] E12 構造衛生: 公開境界は `createKakeiboLedger` に集約。UI は単一 `App.tsx` だがデモ規模で責務重複・曖昧分岐の放置は見当たらない。入り口過多なし

## Assure

範囲: L3 `specs/L3/kakeibo/` の決め事・UC。品質レイヤ既定 `unit` + `integration`。

### 台帳

- active: 0（Discovery: 0） / draft: 0 / retired: 0（`quality/unit/catalog.md`・`quality/integration/catalog.md` とも索引「保証なし」）

### Catalog

- [x] 索引はあるが保証エントリなし（欠如を明示）
- [x] ファイル突合: catalog と個別保証文書の不一致なし（エントリ自体が無い）

### Coverage

- [ ] D1–D15 および UC1–UC4 が `quality/**` の active 保証に載っていない（Coverage 欠落）
  - 実装側の単体テストは存在するが、catalog／`related_specs` への紐づけが無い

### Evidence

- 対象なし（active 0）

### Run

- [x] ドメイン単体: `npm test` 10 passed（本セッション）
- [x] integration: 未実施（catalog に active なし）
- [x] system: 範囲外

### Orphan

- [ ] `product/apps/kakeibo/src/domain/kakeibo.test.ts` は quality catalog のいずれの active にも紐づかない（catalog 空のため構造的孤児）

### Promote 候補（Specify 直書き）

- 対象なし（Discovery active なし。実装学習で What に格上げすべき新規規範は見当たらない）

### Assure 次アクション

- Coverage 欠落: 保証追加（`quality/unit/` に D1–D10 相当を載せる）／無視（理由: 成熟度 draft・デモ run。ドメイン単体はリポ内テストで担保）
- Orphan テスト: catalog 更新で紐づけ／無視（同上）

## 次アクション

| 指摘 | 候補 |
|------|------|
| Gap・Conform の重大欠落なし | 無視（理由: Verifier (A)。実装修正不要） |
| UI 自動テストなし（参考） | 無視（理由: 仕様は How を規定せず、手動操作パスで demo-grade 充足）／必要なら証拠追加 |
| Assure Coverage 欠落 | 保証追加／無視（draft デモ。工程7 改善バックログ候補） |
| PBI 状態 | review へ（`done` は stable 未満のため据え置き） |

## Verifier 自己点検（工程6）

1. Audit 完了（本指摘リスト）: Yes
2. (A) 重大指摘なし / (B) 巻き戻し修復+ADR: **(A)**
3. 画面必須で操作面が無い → 重大 Gap 候補: **該当せず**（ナビ＋各画面フォームあり）
4. 画面必須で genre look（D12–D15）が UI に無い → 重大 Gap 候補: **該当せず**
5. 採用ドメイン骨格の WF／状態が UI／振る舞いに無い → 重大 Gap 候補: **該当せず**（取引ライフサイクル・予算消化状態）

巻き戻し提案: なし（一言承認待ち停止: なし）
