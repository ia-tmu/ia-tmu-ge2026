/**
 * Fisher–Yates シャッフル（クヌースのシャッフル）。
 * 元の配列は変更せず、シャッフルした新しい配列を返す。
 * 作品一覧など、システム全体でランダム表示が必要な場合に利用する。
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
