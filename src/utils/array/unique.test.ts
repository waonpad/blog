import { describe, expect, test } from "vitest";
import { uniqueByKey } from "./unique";

describe(uniqueByKey, () => {
  test("重複があった場合、後から出現した要素で上書きする", () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 1, name: "Charlie" },
    ];

    const uniqueArray = uniqueByKey(array, "id");

    expect(uniqueArray).toEqual([
      { id: 1, name: "Charlie" },
      { id: 2, name: "Bob" },
    ]);
  });

  test("空の配列を渡した場合、空の配列を返す", () => {
    const array: { id: number }[] = [];

    const uniqueArray = uniqueByKey(array, "id");

    expect(uniqueArray).toEqual([]);
  });

  test("重複がない場合、元の配列をそのまま返す", () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    const uniqueArray = uniqueByKey(array, "id");

    expect(uniqueArray).toEqual(array);
  });

  test("重複排除に使うキーが配列要素に存在しない場合、その要素は削除されない", () => {
    const array = [{ id: 1, name: "Alice" }, { name: "Bob" }, { id: 1, name: "Charlie" }];

    const uniqueArray = uniqueByKey(array, "id");

    expect(uniqueArray).toEqual([{ id: 1, name: "Charlie" }, { name: "Bob" }]);
  });
});
