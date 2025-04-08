import type { PickByValue } from "utility-types";

/**
 * オブジェクトの配列を、指定したキーの値でソートする
 */
export const sortByKey = <T>(array: T[], key: keyof T, { order = "asc" }: { order?: "asc" | "desc" } = {}): T[] => {
  const _order = order === "asc" ? 1 : -1;

  return array.sort((a, b) => {
    if (a[key] < b[key]) return -1 * _order;

    if (a[key] > b[key]) return 1 * _order;

    return 0;
  });
};

/**
 * オブジェクトの配列を、指定したキーの値で日付順にソートする
 */
export const sortByDateKey = <T, DateConstructorParameter extends number | string | Date>(
  array: T[],
  key: keyof PickByValue<T, DateConstructorParameter>,
  { order = "asc" }: { order?: "asc" | "desc" } = {},
): T[] => {
  const _order = order === "asc" ? 1 : -1;

  return array.sort((a, b) => {
    const _a = new Date(a[key] as DateConstructorParameter).getTime();
    const _b = new Date(b[key] as DateConstructorParameter).getTime();

    if (_a < _b) return -1 * _order;

    if (_a > _b) return 1 * _order;

    return 0;
  });
};
