import json
import requests
import numpy as np
from sklearn.decomposition import PCA

OLLAMA_API_URL = "http://localhost:11434/api/embeddings"
EMBEDDING_MODEL = "qwen3-embedding:4b"
TARGET_DIMENSIONS = 10


def get_ollama_embedding(text, model=EMBEDDING_MODEL):
    """Ollama APIを使ってembeddingを取得"""
    try:
        response = requests.post(
            OLLAMA_API_URL, json={"model": model, "prompt": text}, timeout=30
        )

        if response.status_code == 200:
            data = response.json()
            return data.get("embedding")
        else:
            print(f"Error: HTTP {response.status_code}")
            return None

    except requests.exceptions.ConnectionError:
        print(f"✗ Error: Ollamaに接続できません")
        return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None


def load_works_from_json(json_path):
    """JSONから作品データを読み込み"""
    with open(json_path, "r", encoding="utf-8") as f:
        works = json.load(f)

    for work in works:
        text_parts = []

        if "title" in work:
            title = work["title"].get("en") or work["title"].get("ja", "")
            if title:
                text_parts.append(title)

        for key in ["keyword1", "keyword2", "keyword3"]:
            if key in work and work[key]:
                keyword_en = work[key].get("en", "")
                if keyword_en:
                    text_parts.append(keyword_en)

        work["embedding_text"] = " ".join(text_parts)

    return works


def generate_embeddings(works):
    """Ollama APIを使ってembeddingを生成（元の次元）"""
    print(f"Processing {len(works)} works with model '{EMBEDDING_MODEL}'...")
    print()

    embeddings = []
    successful_indices = []

    for i, work in enumerate(works):
        try:
            embedding = get_ollama_embedding(work["embedding_text"])

            if embedding:
                embeddings.append(embedding)
                successful_indices.append(i)

                title = work.get("title", {}).get("en") or work.get("title", {}).get(
                    "ja", "No title"
                )
                print(f"✓ {i + 1}/{len(works)}: {work['id']} - {title[:50]}...")
            else:
                print(f"✗ {i + 1}/{len(works)}: {work['id']} - Failed")

        except Exception as e:
            print(f"✗ {i + 1}/{len(works)}: Error processing {work['id']}: {e}")

    return embeddings, successful_indices


def reduce_dimensions(embeddings, target_dim=TARGET_DIMENSIONS):
    """PCAで次元削減"""
    print(f"\nReducing dimensions from {len(embeddings[0])} to {target_dim}...")

    embeddings_array = np.array(embeddings)

    pca = PCA(n_components=target_dim)
    reduced_embeddings = pca.fit_transform(embeddings_array)

    explained_variance = sum(pca.explained_variance_ratio_) * 100
    print(f"Explained variance: {explained_variance:.2f}%")

    return reduced_embeddings.tolist()


def save_to_json(works, output_path):
    """結果をJSONファイルに保存"""
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(works, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")

    import os

    file_size = os.path.getsize(output_path) / 1024
    print(f"File size: {file_size:.1f} KB")

    successful = sum(1 for w in works if w.get("embedding") is not None)
    print(f"Successfully processed: {successful}/{len(works)} works")


def main():
    print("=" * 60)
    print(f"Ollama Embedding Generator (10D)")
    print("=" * 60)
    print()

    json_path = "./list.json"
    output_path = "./embeddings.json"

    print("Step 1: Loading JSON...")
    works = load_works_from_json(json_path)
    print(f"Loaded {len(works)} works\n")

    print("Step 2: Generating embeddings...")
    embeddings, successful_indices = generate_embeddings(works)

    if not embeddings:
        print("Error: No embeddings generated")
        return

    print(f"\nStep 3: Reducing dimensions to {TARGET_DIMENSIONS}...")
    reduced_embeddings = reduce_dimensions(embeddings, TARGET_DIMENSIONS)

    print("\nStep 4: Saving results...")
    for i, work_idx in enumerate(successful_indices):
        works[work_idx]["embedding"] = reduced_embeddings[i]
        works[work_idx]["embedding_dim"] = TARGET_DIMENSIONS

    save_to_json(works, output_path)

    print("\n✓ Done!")
    print(f"\nEmbedding dimensions: {TARGET_DIMENSIONS}")
    print(f"File is much smaller and faster to process!")


if __name__ == "__main__":
    main()
