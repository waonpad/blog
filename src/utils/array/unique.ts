/**
 * オブジェクトの配列を、指定したキーの値でユニークになるようMapを使って重複を排除する
 */
export const uniqueByKey = <T>(array: T[], key: keyof T): T[] => {
  const uniqueMap = new Map(array.map((item) => [item[key], item]));

  return Array.from(uniqueMap.values());
};
