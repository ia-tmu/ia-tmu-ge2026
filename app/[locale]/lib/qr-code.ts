import QRCode from "qrcode";

/** QRコード生成オプション */
export interface QRCodeOptions {
  /** 画像サイズ（ピクセル）。デフォルト: 256 */
  size?: number;
  /** 誤り訂正レベル。デフォルト: "M" */
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  /** マージン（モジュール数）。デフォルト: 4 */
  margin?: number;
}

/**
 * URLを引数にQRコード画像（Data URL形式）を生成して返却する
 * @param url - QRコードにエンコードするURL
 * @param options - QRコードのオプション設定
 * @returns Data URL形式のQRコード画像（img要素のsrcにそのまま指定可能）
 */
export async function generateQRCodeImage(
  url: string,
  options?: QRCodeOptions,
): Promise<string> {
  const { size = 256, errorCorrectionLevel = "M", margin = 4 } = options ?? {};

  return QRCode.toDataURL(url, {
    width: size,
    errorCorrectionLevel,
    margin,
  });
}
