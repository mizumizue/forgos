# Loop log — sector-research-loop

**Run:** 20260810-lesson-studio  
**STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**Skill:** `sector-research-loop`  
**Theme:** 小規模ピアノ教室（1人講師・定員制グループレッスン）の受講生・授業枠・振替管理

---

## 起動パラメータ

| 項目 | 値 |
|------|-----|
| テーマ | 指示書どおり（上記） |
| STATE_DIR | `quality/fw-validation/runs/20260810-lesson-studio/`（指示書指定） |
| 周回上限 | 3 |

---

## Round 1

**実施:** Web 調査（教室規約・コース案内・比較用チェーン規約）→ `sector-brief.md` 初稿作成

**調査ソース（主要）:**
- 石橋音楽教室 レッスン規約 (S1)
- ピアノ田中音楽教室 グループレッスン (S2)
- KASE Piano Studio 教室規約 (S3)
- ひらたピアノ教室 規約 (S5)
- MGSピアノ教室 キャンセル・振替 (S4, 比較)
- 島村楽器 大宮店 レッスン規約 (S8, 比較)

### Verifier 結果

| ID | 判定 | 根拠 |
|----|------|------|
| V1 | **Yes** | 業態を「個人経営・1講師・定員制集合個人レッスン型」に1つに絞り、テーマ適合理由を記載 |
| V2 | **Yes** | 根拠ソース S1〜S9（9件）。各通例・オペ・顧客属性に [Sx] 参照あり |
| V3 | **Yes** | 「事実と仮説の分離」節で事実5項目・仮説3項目（H1〜H3）を明示 |
| V4 | **Yes** | ロール権限表、メニュー可変、予約／枠決定項目、オプション×時間、現場オペ OP-1〜4 を記載 |
| V5 | **Yes** | 採用 A1〜A5（5件）、見送り D1〜D5（5件） |
| V6 | **Yes** | 前日18時、2人45分／3人60分、月1回振替、1名20分短縮など具体名詞・手順あり。一般論のみの欄なし |

### 欠陥リスト（Round 1）

なし — 全項目合格。

### 判定

**Stop（合格）** — V1–V6 全 Yes。Round 2 不要。

---

## 最終状態

| 項目 | 値 |
|------|-----|
| 完了周回 | 1 / 3 |
| 最終判定 | **合格** |
| 成果物 | `sector-brief.md`, `loop-log.md` |

---

# Loop log — mock-design-loop

**Run:** 20260810-lesson-studio  
**STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**Skill:** `mock-design-loop`  
**Theme:** 小規模ピアノ教室（講師＋保護者／受講生、定期枠・出席・振替）

---

## 起動パラメータ

| 項目 | 値 |
|------|-----|
| 入力 | `sector-brief.md`（`spec-depth.md` 未作成 → brief のみから推論） |
| STATE_DIR | `quality/fw-validation/runs/20260810-lesson-studio/` |
| 周回上限 | 3 |

---

## Round 1

**実施:** sector brief ＋ scope から `design-call.md` 初稿作成

### Verifier 結果（C1–C9）

| ID | 判定 | 根拠 |
|----|------|------|
| C1 | **Yes** | 「入力参照」節で `sector-brief.md`・`scope.md` を明示。`spec-depth.md` 未作成を記載し brief からの推論範囲を宣言 |
| C2 | **Yes** | S1/S2/S3 各主表面に優先度 1–3＋従の attention 表と主従理由 |
| C3 | **Yes** | R1〜R4 の 4 件（おけいこ帳、LINE チャット、紙出席簿、Google Calendar 週表示）。借りる／借りない列あり |
| C4 | **Yes** | G1〜G5 の 5 要素（座席リング、週ストリップ、人数連動バッジ、パレット、規約タグ）— 色コード・配置まで具体 |
| C5 | **Yes** | Actors 表で講師 S1/S2・保護者 S3 を分離。他生徒非表示・override は講師のみ |
| C6 | **Yes** | 「デモでの採用／見送り」表（座席リング採用、五線譜全面見送り、月謝/LINE 見送り等） |
| C7 | **Yes** | 「汎用スキン回避の明示」節＋G4 パレットで SaaS 管理画面との差別化 |
| C8 | **Yes** | J1〜J4 の遷移列（欠席連絡・振替 WF・当日出欠・S1↔S2）。分岐・戻る・キャンセルあり |
| C9 | **Yes** | J4 で actor-split 矛盾チェック。保護者は S3 のみ申請、講師確定は S2 のみ、S1 は出欠正本 |

### 欠陥リスト（Round 1）

なし — 全項目合格。

### 判定

**Stop（合格）** — C1–C9 全 Yes。Round 2 不要。

---

## 最終状態（mock-design-loop）

| 項目 | 値 |
|------|-----|
| 完了周回 | 1 / 3 |
| 最終判定 | **合格** |
| 成果物 | `design-call.md`, `loop-log.md`（本節追記） |

---

# Loop log — spec-depth-loop

**Run:** 20260810-lesson-studio  
**STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**Skill:** `spec-depth-loop`  
**入力:** `sector-brief.md`＋`scope.md` §システム狙い

---

## Round 1

**実施:** `sector-brief.md` と `scope.md` から `spec-depth.md` 初稿作成

### Verifier 結果

| ID | 判定 | 根拠 |
|----|------|------|
| D1 | **Yes** | §システム狙いで `scope.md`・`sector-brief.md` を明示参照。§D6 で brief 各節との対応表あり |
| D2 | **Yes** | 役3（講師・保護者・受講生）、各主ジョブ1文、見える／できる／できないの権限表＋講師 override |
| D3 | **Yes** | `WeeklyClassSlot`・`CapacityTier`・`LevelBand` 等8境界を当該ドメイン語で命名。可変／固定の区別と波及を記載 |
| D4 | **Yes** | WF-1〜3 に決定項目・状態遷移（各2遷移以上）。時間・量・承認を各 WF に明示 |
| D5 | **Yes** | 概念12件（採用8・見送り4）、理由と brief 根拠あり。採用 ≥1 |
| D6 | **Yes** | brief OP/T/A との対応表。欠席期限・振替多段ガード・定員連動時間の3 WF が CRUD 単体でない |

### 欠陥リスト（Round 1）

なし — 全項目合格。

### 判定

**Stop（合格）** — D1–D6 全 Yes。Round 2 不要。

---

## 最終状態（spec-depth-loop）

| 項目 | 値 |
|------|-----|
| 完了周回 | 1 / 3 |
| 最終判定 | **合格** |
| 成果物 | `spec-depth.md` |
