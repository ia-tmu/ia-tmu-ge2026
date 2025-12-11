# 日時表記統一ガイド

## Date and Time Notation Style Guide

本プロジェクトで使用されている日時等の英語表記をまとめています。他の媒体でも統一して使用してください。
This document summarizes the English date and time notations used in this project. Please use these consistently across all media.

## 展示会期

### 日本語版

- **期間**: `3/1 Sun - 3/7 Sat`
- **開始日**: `3/1` (日曜日: `日`)
- **終了日**: `3/7` (土曜日: `土`)
- **休館日**: `3/2` (月曜日: `月`)

### 英語版

- **期間**: `3/1 Sun - 3/7 Sat`
- **開始日**: `3/1` (日曜日: `Sun`)
- **終了日**: `3/7` (土曜日: `Sat`)
- **休館日**: `3/2` (月曜日: `Mon`)

## 開館時間

### 日本語版

- **通常開館時間**: `9:30 - 17:30（最終入場 17:00）`
- **最終日開館時間**: `3/7 最終日のみ 9:30 - 12:00（最終入場 11:30）`

### 英語版

- **通常開館時間**: `9:30 - 17:30 (Last admission 17:00)`
- **最終日開館時間**: `3/7 Last day 9:30 - 12:00 (Last admission 11:30)`

## 曜日表記

### 英語版の曜日略称

- **日曜日**: `Sun`
- **月曜日**: `Mon`
- **火曜日**: `Tue`
- **水曜日**: `Wed`
- **木曜日**: `Thu`
- **金曜日**: `Fri`
- **土曜日**: `Sat`

## 日付フォーマット

### 使用されている形式

- **月/日**: `3/1`, `3/7`, `3/2` (M/D 形式)
- **期間表記**: `3/1 Sun - 3/7 Sat` (開始日 曜日 - 終了日 曜日)
- **休館日表記**: `Closed: 3/2 Mon` (英語版) / `休館日：3/2 月` (日本語版)

## 時間フォーマット

### 使用されている形式

- **24 時間表記**: `9:30`, `17:30`, `12:00`, `17:00`, `11:30`
- **時間範囲**: `9:30 - 17:30` (開始時間 - 終了時間)
- **最終入場時間**: `(Last admission 17:00)` (英語版) / `（最終入場 17:00）` (日本語版)

## その他の表記

### 入場料

- **日本語版**: `入場無料`
- **英語版**: `Admission Free`

### 会場

- **日本語版**: `東京都美術館 ギャラリーA・B`
- **英語版**: `Tokyo Metropolitan Art Museum Gallery A・B`

## 実装ファイルの参照

### 翻訳ファイル

- **英語版**: `public/locales/en/translation.json`
- **日本語版**: `public/locales/ja/translation.json`

### 定数ファイル

- **日時定数**: `app/constants.ts`

```typescript
export const EXHIBITION_CONFIG = {
  year: 2026,
  dates: {
    start: { month: 3, day: 1, dayOfWeek: "Sun", dayOfWeekJa: "日" },
    end: { month: 3, day: 7, dayOfWeek: "Sat", dayOfWeekJa: "土" },
  },
  closedDay: { month: 3, day: 2, dayOfWeek: "Mon", dayOfWeekJa: "月" },
};
```

## 注意事項

- 日付は `M/D` 形式（月/日）で統一されています
- 曜日は英語版では 3 文字の略称（Sun, Mon, Tue, Wed, Thu, Fri, Sat）を使用
- 時間は 24 時間表記で、分は `:30` または `:00` で表記
- 期間表記は `開始日 曜日 - 終了日 曜日` の形式
- 最終入場時間は括弧内に表記
