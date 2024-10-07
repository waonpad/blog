export const sortByKey = <T>(array: T[], key: keyof T, { order = "asc" }: { order?: "asc" | "desc" } = {}): T[] => {
  const _order = order === "asc" ? 1 : -1;

  return array.sort((a, b) => {
    if (a[key] < b[key]) return -1 * _order;

    if (a[key] > b[key]) return 1 * _order;

    return 0;
  });
};

export const sortByDateKey = <T>(array: T[], key: keyof T, { order = "asc" }: { order?: "asc" | "desc" } = {}): T[] => {
  const _order = order === "asc" ? 1 : -1;

  return array.sort((a, b) => {
    const _a = new Date(a[key] as string).getTime();
    const _b = new Date(b[key] as string).getTime();

    if (_a < _b) return -1 * _order;

    if (_a > _b) return 1 * _order;

    return 0;
  });
};
