/**
 * 研究室（スタジオ）の key 一覧（13種）
 * スプレッドシートのヘッダーやカテゴリ識別子として利用
 */
export const STUDIO_KEYS = [
  "interface",
  "editing",
  "visual",
  "transportation",
  "equipment",
  "ergonomic",
  "interactive",
  "interior",
  "kinematograph",
  "network",
  "living",
  "software",
  "space",
] as const;

export type StudioKey = (typeof STUDIO_KEYS)[number];

/**
 * 研究室のコア分類
 * - product: プロダクトデザインコア
 * - media: メディアデザインコア
 */
export type StudioCategoryKey = "product" | "media";

export const STUDIO_CATEGORY_LABELS: Record<StudioCategoryKey, string> = {
  product: "プロダクトデザインコア",
  media: "メディアデザインコア",
};

/**
 * 研究室のメタ情報（正式名称・デザイン領域・カテゴリ）
 */
export interface StudioInfo {
  /** 研究室の正式名称 */
  name: string;
  /** 研究室の短縮名称 */
  enName: string;
  /** 研究室が取り組むデザイン領域（ユニーク） */
  designDomain: string;
  /** プロダクトデザインコア or メディアデザインコア */
  category: StudioCategoryKey;
}

/**
 * スタジオ key → 正式名称・デザイン領域・カテゴリ のマップ
 * 必要に応じて正式名称・デザイン領域を更新してください
 */
export const STUDIO_MAP: Record<StudioKey, StudioInfo> = {
  interface: {
    name: "インタフェースデザインスタジオ",
    enName: "Interface Design Studio",
    designDomain: "インタフェースデザイン",
    category: "media",
  },
  editing: {
    name: "エディティングスタジオ",
    enName: "Editorial Design Studio",
    designDomain: "エディティング",
    category: "media",
  },
  visual: {
    name: "ヴィジュアルコミュニケーションデザインスタジオ",
    enName: "Visual Communication Design Studio",
    designDomain: "ビジュアルコミュニケーション",
    category: "media",
  },
  transportation: {
    name: "トランスポーテーションデザインスタジオ",
    enName: "Transportation Design Studio",
    designDomain: "トランスポーテーションデザイン",
    category: "product",
  },
  equipment: {
    name: "製品・サービスデザインスタジオ", // STUDIO_KEYS[4]
    enName: "Equipment & Service Design Studio",
    designDomain: "製品・サービスデザイン",
    category: "product",
  },
  ergonomic: {
    name: "エルゴノミックデザインスタジオ",
    enName: "Ergonomic Design Studio",
    designDomain: "エルゴノミックデザイン",
    category: "product",
  },
  interactive: {
    name: "インタラクティブアートスタジオ",
    enName: "Interactive Art Studio",
    designDomain: "インタラクティブアート",
    category: "media",
  },
  interior: {
    name: "インテリアデザインスタジオ",
    enName: "Interior Design Studio",
    designDomain: "インテリアデザイン",
    category: "product",
  },
  kinematograph: {
    name: "映像デザインスタジオ",
    enName: "Kinematograph Design Studio",
    designDomain: "映像デザイン",
    category: "media",
  },
  network: {
    name: "ネットワークデザインスタジオ",
    enName: "Network Design Studio",
    designDomain: "ネットワークデザイン",
    category: "media",
  },
  living: {
    name: "ソシオリビングデザインスタジオ",
    enName: "Socio Living Design Studio",
    designDomain: "ソシオリビングデザイン",
    category: "product",
  },
  software: {
    name: "ソフトウェアデザインスタジオ",
    enName: "Software Design Studio",
    designDomain: "ソフトウェアデザイン",
    category: "media",
  },
  space: {
    name: "空間デザインスタジオ",
    enName: "Spatial Design Studio",
    designDomain: "空間デザイン",
    category: "product",
  },
};

/** key が有効なスタジオ key かどうか */
export function isStudioKey(key: string): key is StudioKey {
  return STUDIO_KEYS.includes(key as StudioKey);
}

/** スタジオ正式名称（シートに登録されている名前）から key を逆引き。一致しなければ null */
export function getStudioKeyByName(name: string): StudioKey | null {
  const normalized = name.trim();
  const entry = (Object.entries(STUDIO_MAP) as [StudioKey, StudioInfo][]).find(
    ([, info]) => info.name.toLowerCase() === normalized.toLowerCase(),
  );
  return entry ? entry[0] : null;
}

/** スタジオ key から正式名称を取得 */
export function getStudioName(key: StudioKey): string {
  return STUDIO_MAP[key].name;
}

/** スタジオ key から短縮名称を取得 */
export function getStudioEnName(key: StudioKey): string {
  return STUDIO_MAP[key].enName;
}

/** スタジオ key からデザイン領域を取得 */
export function getStudioDesignDomain(key: StudioKey): string {
  return STUDIO_MAP[key].designDomain;
}

/** スタジオ key からカテゴリ key（product | media）を取得 */
export function getStudioCategory(key: StudioKey): StudioCategoryKey {
  return STUDIO_MAP[key].category;
}

/** スタジオ key からカテゴリの表示ラベル（プロダクト/メディアコア）を取得 */
export function getStudioCategoryLabel(key: StudioKey): string {
  return STUDIO_CATEGORY_LABELS[STUDIO_MAP[key].category];
}

/** スタジオ key からメタ情報オブジェクトを取得 */
export function getStudioInfo(key: StudioKey): StudioInfo {
  return STUDIO_MAP[key];
}
