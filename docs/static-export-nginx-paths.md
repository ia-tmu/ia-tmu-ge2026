# Static Export + Nginx デプロイ時のパス解決

ルート `https://industrial-art.sd.tmu.ac.jp/ge2026` に `/out` を Nginx で配信する際のパス解決の確認結果と懸念事項です。

## 前提

- **ビルド**: `output: "export"` + `basePath: "/ge2026"`（Vercel 以外の本番）
- **配信**: Nginx で `out` の中身を `/ge2026/` 配下に配置
- **ミドルウェア**: Static Export では**動作しない**（リライト・リダイレクトはサーバ側で対応が必要）

---

## 問題なしと判断した点

### 1. basePath とアセット

- `next.config.ts` で本番（非 Vercel）は `basePath: "/ge2026"` が有効
- ビルド結果の HTML/JS 内の `_next/static` や画像は `/ge2026/...` で参照されている
- 画像などで `NEXT_PUBLIC_BASE_PATH` を使っている箇所（Map, SNSEmbedding, MoyaBG, FixedBackground）は `/ge2026` 付きでビルドされる

### 2. ページリンク（Next.js Link）

- `Button` や `Link` を使っている箇所は、Next が自動で basePath を付与する
- ナビの `/#concept` や「Web Exhibition」の `/works` などは `/ge2026/ja/#concept`, `/ge2026/ja/works` になる

### 3. ルート（/ge2026/）のリダイレクト

- `postbuild` の `generate-index.js` が `out/index.html` を生成
- アクセス時に `/ge2026/ja/` または `/ge2026/en/` へ JavaScript でリダイレクト
- basePath 込みのパスで `redirectPath` を組み立てている

### 4. メタデータ・OGP

- `layout.tsx` の `baseUrl` は本番で `https://industrial-art.sd.tmu.ac.jp/ge2026/` にハードコード
- canonical / og:image 等は正しい絶対URLになる

### 5. 出力構造

- `out/` 直下に `index.html`, `ja/`, `en/`, `_next/`, `images/` など
- 配置は「ドキュメントルートを `/ge2026/` に対応させる」想定で問題ない

---

## 対応済み・要対応の懸念

### 1. ロゴのリンク（修正済み）

- **事象**: ロゴが `<motion.a>` のため Next の `Link` ではなく、basePath が付かず `href="/ja/"` のままだった
- **影響**: `/ge2026/ja/` からロゴを押すと `https://.../ja/` に飛び 404 になる
- **対応**: `Header.tsx` で `NEXT_PUBLIC_BASE_PATH` を付与するように変更済み（`href={`${basePath}${localePath(locale, "/")}`}`）

### 2. Static Export ではミドルウェアが動かない

- **事象**: `next-i18n-router` のミドルウェアは Static Export では実行されない
- **影響**:
  - `/ge2026/works` や `/ge2026/works/xxx` に直アクセスすると **404**（`/ja/works` へのリライトがない）
  - アプリ内のリンクはすべて `localePath` で `/ja/works` などになっているため、通常の遷移では問題なし
- **推奨**: Nginx で「ロケールなし works」を `/ge2026/ja/works` へリライト（後述）

### 3. トレイリングスラッシュ

- `next.config.ts` で `trailingSlash: true` のため、実体は `ja/index.html`, `ja/works/index.html` 形式
- `/ge2026/ja` や `/ge2026/ja/works` のように末尾スラッシュなしでアクセスすると、ディレクトリとして扱われない環境では 404 になりうる
- **推奨**: Nginx で「ディレクトリ＋index」または `try_files` で `$uri $uri/ $uri/index.html` を指定（後述）

---

## Nginx 設定の推奨

### 1. /ge2026/ の location と index

```nginx
location /ge2026/ {
    alias /path/to/out/;   # out の中身が ge2026 配下にマップされるように配置
    index index.html;
    try_files $uri $uri/ $uri/index.html =404;
}
```

- `alias` の末尾スラッシュを忘れない
- ディレクトリアクセス（例: `/ge2026/ja/`）で `ja/index.html` が返るようにする

### 2. ロケールなし /works のリライト（任意）

旧リンクやブックマークで `/ge2026/works` が使われる可能性がある場合:

```nginx
location = /ge2026/works {
    return 302 /ge2026/ja/works/;
}
location = /ge2026/works/ {
    return 302 /ge2026/ja/works/;
}
# 作品詳細のため正規表現が必要な場合の例
location ~ ^/ge2026/works/(.+)$ {
    return 302 /ge2026/ja/works/$1/;
}
```

### 3. ルート /ge2026 のみ（スラッシュなし）の扱い

`/ge2026` 単体でアクセスされた場合に `/ge2026/` へ寄せたい場合:

```nginx
location = /ge2026 {
    return 301 /ge2026/;
}
```

---

## デプロイ時のチェックリスト

- [ ] 本番ビルドは Vercel 以外の条件で行い、`basePath: "/ge2026"` が効いていること
- [ ] `out` の内容をサーバの「`/ge2026/` に対応するディレクトリ」にそのまま配置（`out/ja` → `.../ge2026/ja`）
- [ ] Nginx で `index index.html` と `try_files` を設定済み
- [ ] （任意）`/ge2026/works` 系のリライトを入れる場合、上記 location を追加
- [ ] ブラウザで確認: `/ge2026/`, `/ge2026/ja/`, `/ge2026/ja/works/`, 作品詳細、言語切替、ロゴリンク

---

## 参考: ビルド条件

- `VERCEL !== "1"` かつ `NODE_ENV === "production"` 相当で `basePath = "/ge2026"`
- Nginx 用にビルドするときは Vercel 用の環境変数（`VERCEL=1`）を付けないこと
