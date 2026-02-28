import type { Work } from "../types/work";

// ─── 定数 ────────────────────────────────────────────────
const CANVAS_W = 1080;
const CANVAS_H = 1920;
const PADDING = 75;
const GAP = 20;
const HEADER_H = 275;

// カード：サムネイル左 + テキスト右（横並び）
const CARD_THUMB_RATIO = 16 / 9; // サムネイルのアスペクト比

// ─── ユーティリティ ──────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

function truncateByWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  // そのまま収まるなら何もしない
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }

  const ellipsis = "…";
  const ellipsisWidth = ctx.measureText(ellipsis).width;

  let truncated = "";

  for (let i = 0; i < text.length; i++) {
    const next = truncated + text[i];
    const width = ctx.measureText(next).width;

    // 「…」を付けた状態で収まるかを判定
    if (width + ellipsisWidth > maxWidth) {
      return truncated + ellipsis;
    }

    truncated = next;
  }

  return truncated;
}

// ─── メイン描画関数 ───────────────────────────────────────
export async function generateBookmarkImage(
  works: Work[],
  onProgress?: (msg: string) => void,
): Promise<string> {
  const progress = onProgress ?? (() => { });
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d")!;

  // ── 背景 ─────────────────────────────────────────────
  progress("背景を読み込み中...");
  try {
    const bg = await loadImage(`${basePath}/images/bookmark_bg.jpg`);
    const scale = Math.max(CANVAS_W / bg.width, CANVAS_H / bg.height);
    const bw = bg.width * scale;
    const bh = bg.height * scale;
    ctx.drawImage(bg, (CANVAS_W - bw) / 2, (CANVAS_H - bh) / 2, bw, bh);
  } catch {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // ── ヘッダー ──────────────────────────────────────────
  progress("ロゴを読み込み中...");
  const LOGO_H = HEADER_H * 0.5;
  const headerMidY = HEADER_H / 2;

  try {
    const logo = await loadImage(`${basePath}/images/logo/ge-logo-white.png`);
    const logoW = Math.round((logo.width / logo.height) * LOGO_H);
    ctx.drawImage(logo, PADDING, headerMidY - LOGO_H / 2, logoW, LOGO_H);
  } catch {
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 28px 'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("GE", PADDING, headerMidY);
  }

  // 「お気に入り一覧」右揃え
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `400 40px "しっぽり明朝", "游明朝", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "HiraMinProN-W3", "Noto Serif JP", serif`;
  ctx.fillText("お気に入り作品リスト", PADDING + LOGO_H * 1.25, headerMidY);
  ctx.font = `500 30px "しっぽり明朝", "游明朝", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "HiraMinProN-W3", "Noto Serif JP", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("東京都立大学 インダストリアルアート卒展 2026", CANVAS_W / 2, CANVAS_H - headerMidY / 2);


  // ── カードレイアウト計算 ──────────────────────────────
  const gridTop = HEADER_H + GAP;
  const gridH = CANVAS_H - gridTop - PADDING;
  const cardCount = works.length;

  // カード高さ：グリッド高さを作品数で均等分割
  const cardH = 150;
  // const cardH = Math.floor((gridH - GAP * (cardCount - 1)) / cardCount);

  // サムネイル幅：カード高さからアスペクト比で算出（4:3）
  const thumbW = Math.round(cardH * (4 / 3));
  const textAreaX_offset = thumbW + 20; // サムネイル幅 + 内側ギャップ
  const cardW = CANVAS_W - PADDING * 2;
  const textAreaW = cardW - thumbW - 20;

  // ── 各作品カード（縦並び・横レイアウト）────────────────
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const cardX = PADDING;
    const cardY = gridTop + i * (cardH + GAP * 3);

    progress(`画像を読み込み中... (${i + 1} / ${works.length})`);
    ctx.save();

    // ── サムネイル（左、4:3）──────────────────────────
    if (work.thumbnail) {
      try {
        const img = await loadImage(work.thumbnail);
        ctx.save();
        // 4:3枠（横幅基準でフィット → はみ出た上下をクロップ）
        const targetRatio = thumbW / cardH; // 4:3
        const imgRatio = img.width / img.height;

        let sx = 0;
        let sy = 0;
        let sWidth = img.width;
        let sHeight = img.height;

        // 画像が縦長 or 比率が4:3より細い → 上下をトリミング
        if (imgRatio < targetRatio) {
          // 必要な高さを計算（横幅はフル使用）
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2; // 中央クロップ（上下）
        } else {
          // 画像が横長 → 左右をトリミング（保険）
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2; // 中央クロップ（左右）
        }

        // クリップして4:3枠に描画
        ctx.drawImage(
          img,
          sx,
          sy,
          sWidth,
          sHeight,
          cardX,
          cardY,
          thumbW,
          cardH
        );
        ctx.restore();
      } catch {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fillRect(cardX, cardY, thumbW, cardH);
      }
    }

    // ── テキストエリア（右）──────────────────────────
    const textX = cardX + textAreaX_offset;
    const textMidY = cardY + cardH / 2;

    // ID
    const idFontSize = Math.round(cardH * 0.22);
    const titleFontSize = Math.round(cardH * 0.235);

    ctx.fillStyle = "rgba(255,255,255)";
    ctx.textAlign = "left";
    ctx.font = `400  ${idFontSize}px "しっぽり明朝", "游明朝", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "HiraMinProN-W3", "Noto Serif JP", serif`;
    ctx.fillText(work.id, textX, textMidY - cardH / 2 + idFontSize);

    // タイトル
    ctx.fillStyle = "#ffffff";
    ctx.font = `400  ${titleFontSize}px "しっぽり明朝", "游明朝", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "HiraMinProN-W3", "Noto Serif JP", serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const title = work.workTitle || "(無題)";
    const truncatedTitle = truncateByWidth(ctx, title, textAreaW);

    ctx.fillText(truncatedTitle, textX, textMidY + titleFontSize);


    ctx.restore();
  }

  return canvas.toDataURL("image/png");
}
