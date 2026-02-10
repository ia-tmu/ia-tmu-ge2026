import requests
import json
import numpy as np
from sklearn.decomposition import PCA


OLLAMA_URL = "http://localhost:11434/api/embeddings"
MODEL_NAME = "qwen3-embedding:4b"
TARGET_DIM = 3

design_fields = [
    {"key": "product_design", "ja": "プロダクトデザイン", "en": "Product Design"},
    {"key": "service_design", "ja": "サービスデザイン", "en": "Service Design"},
    {"key": "graphic_design", "ja": "グラフィックデザイン", "en": "Graphic Design"},
    {"key": "spatial_design", "ja": "空間デザイン", "en": "Spatial Design"},
    {"key": "interior_design", "ja": "インテリアデザイン", "en": "Interior Design"},
    {"key": "ux_design", "ja": "UXデザイン", "en": "UX Design"},
    {"key": "media_art", "ja": "メディアアート", "en": "Media Art"},
    {
        "key": "editorial_design",
        "ja": "エディトリアルデザイン",
        "en": "Editorial Design",
    },
    {"key": "interactive_art", "ja": "インタラクティブアート", "en": "Interactive Art"},
    {
        "key": "interface_design",
        "ja": "インターフェースデザイン",
        "en": "Interface Design",
    },
    {"key": "community_design", "ja": "コミュニティデザイン", "en": "Community Design"},
    {"key": "sound_design", "ja": "音響デザイン", "en": "Sound Design"},
    {"key": "animation", "ja": "アニメーション", "en": "Animation"},
    {"key": "game_design", "ja": "ゲームデザイン", "en": "Game Design"},
    {
        "key": "information_design",
        "ja": "インフォメーションデザイン",
        "en": "Information Design",
    },
    {"key": "mobility_design", "ja": "モビリティデザイン", "en": "Mobility Design"},
    {"key": "robotics_design", "ja": "ロボティクスデザイン", "en": "Robotics Design"},
    {
        "key": "landscape_design",
        "ja": "ランドスケープデザイン",
        "en": "Landscape Design",
    },
    {"key": "urban_design", "ja": "都市デザイン", "en": "Urban Design"},
    {
        "key": "interactive_architecture",
        "ja": "インタラクティブアーキテクチャー",
        "en": "Interactive Architecture",
    },
    {"key": "fashion_design", "ja": "ファッションデザイン", "en": "Fashion Design"},
    {
        "key": "furniture_design",
        "ja": "ファーニチャーデザイン",
        "en": "Furniture Design",
    },
    {"key": "ui_design", "ja": "UIデザイン", "en": "UI Design"},
    {"key": "branding_design", "ja": "ブランディングデザイン", "en": "Branding Design"},
    {"key": "web_design", "ja": "Webデザイン", "en": "Web Design"},
    {"key": "app_design", "ja": "アプリデザイン", "en": "App Design"},
    {"key": "book_design", "ja": "ブックデザイン", "en": "Book Design"},
    {"key": "book_art", "ja": "ブックアート", "en": "Book Art"},
    {"key": "package_design", "ja": "パッケージデザイン", "en": "Package Design"},
    {
        "key": "typography_design",
        "ja": "タイポグラフィデザイン",
        "en": "Typography Design",
    },
    {"key": "optical_art", "ja": "オプティカルアート", "en": "Optical Art"},
    {"key": "kinetic_art", "ja": "キネティックアート", "en": "Kinetic Art"},
    {"key": "performance", "ja": "パフォーマンス", "en": "Performance"},
    {"key": "digital_archive", "ja": "デジタルアーカイブ", "en": "Digital Archive"},
    {"key": "craft_design", "ja": "クラフトデザイン", "en": "Craft Design"},
    {"key": "pattern_design", "ja": "パターンデザイン", "en": "Pattern Design"},
    {"key": "haptics_design", "ja": "ハプティクスデザイン", "en": "Haptics Design"},
    {
        "key": "human_computer_interaction",
        "ja": "ヒューマンコンピュータインタラクション",
        "en": "Human Computer Interaction",
    },
    {"key": "ar_vr", "ja": "AR/VR", "en": "AR / VR"},
    {"key": "image_processing", "ja": "画像処理", "en": "Image Processing"},
    {"key": "generative_art", "ja": "ジェネラティブアート", "en": "Generative Art"},
    {"key": "welfare_design", "ja": "福祉デザイン", "en": "Welfare Design"},
    {
        "key": "interaction_design",
        "ja": "インタラクションデザイン",
        "en": "Interaction Design",
    },
    {
        "key": "human_centered_design",
        "ja": "人間中心デザイン",
        "en": "Human-Centered Design",
    },
    {"key": "universal_design", "ja": "ユニバーサルデザイン", "en": "Universal Design"},
    {
        "key": "sustainable_design",
        "ja": "サスティナブルデザイン",
        "en": "Sustainable Design",
    },
    {"key": "ethical_design", "ja": "エシカルデザイン", "en": "Ethical Design"},
    {
        "key": "speculative_design",
        "ja": "スペキュラティブデザイン",
        "en": "Speculative Design",
    },
    {"key": "co_design", "ja": "コ・デザイン", "en": "Co-design"},
    {"key": "meta_design", "ja": "メタデザイン", "en": "Meta Design"},
    {"key": "bio_design", "ja": "バイオデザイン", "en": "Bio Design"},
    {
        "key": "conceptual_design",
        "ja": "コンセプチュアルデザイン",
        "en": "Conceptual Design",
    },
    {
        "key": "research_through_design",
        "ja": "リサーチスルーデザイン",
        "en": "Research Through Design",
    },
    {
        "key": "narrative_research",
        "ja": "ナラティブリサーチ",
        "en": "Narrative Research",
    },
    {
        "key": "design_prototyping",
        "ja": "デザインプロトタイピング",
        "en": "Design Prototyping",
    },
    {
        "key": "multimodal_design",
        "ja": "マルチモーダルデザイン",
        "en": "Multimodal Design",
    },
    {"key": "ai", "ja": "AI", "en": "AI"},
]


def get_embedding(text: str) -> list[float]:
    response = requests.post(OLLAMA_URL, json={"model": MODEL_NAME, "prompt": text})
    response.raise_for_status()
    return response.json()["embedding"]


embeddings = {}

# ─── 1. Embedding取得 ─────────────────────────────
labels = []  # 出力用（日本語）
keys = []  # 任意：内部識別子
vectors = []

for item in design_fields:
    calc_text = item["en"]  # ← 計算は英語
    label_ja = item["ja"]  # ← 出力は日本語（デザイン含む）

    embedding = get_embedding(calc_text)

    keys.append(item["key"])
    labels.append(label_ja)
    vectors.append(embedding)

    print(f"{label_ja} -> {calc_text}: {len(embedding)} dim")

X = np.array(vectors)

print("before PCA:", X.shape)

# ─── 2. PCAで次元削減 ─────────────────────────────
pca = PCA(n_components=TARGET_DIM, random_state=42)
X_reduced = pca.fit_transform(X)

print("after PCA :", X_reduced.shape)

# ─── 3. 辞書に戻して保存 ─────────────────────────
reduced_embeddings = [
    {"title": label, "embedding": X_reduced[i].tolist()}
    for i, label in enumerate(labels)
]

with open("embeddings.json", "w", encoding="utf-8") as f:
    json.dump(reduced_embeddings, f, ensure_ascii=False, indent=2)
