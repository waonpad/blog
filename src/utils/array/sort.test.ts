import { describe, expect, test } from "vitest";
import { sortByDateKey, sortByKey } from "./sort";

describe(sortByKey, () => {
  test("ソート順序を指定しない場合、指定したキーの値で昇順にソートされる", () => {
    const array = [{ id: 3 }, { id: 1 }, { id: 2 }];

    const sortedArray = sortByKey(array, "id");

    expect(sortedArray).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  test("ソート順序を昇順に指定した場合、指定したキーの値で昇順にソートされる", () => {
    const array = [{ id: 3 }, { id: 1 }, { id: 2 }];

    const sortedArray = sortByKey(array, "id", { order: "asc" });

    expect(sortedArray).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  test("ソート順序を降順に指定した場合、指定したキーの値で降順にソートされる", () => {
    const array = [{ id: 3 }, { id: 1 }, { id: 2 }];

    const sortedArray = sortByKey(array, "id", { order: "desc" });

    expect(sortedArray).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
  });

  test("値が文字列のキーでソートできる", () => {
    const array = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];

    const sortedArray = sortByKey(array, "name");

    expect(sortedArray).toEqual([{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]);
  });
});

describe(sortByDateKey, () => {
  test("ソート順序を指定しない場合、指定したキーの値で昇順にソートされる", () => {
    const array = [{ createdAt: "2000-01-02" }, { createdAt: new Date("2000-01-01") }, { createdAt: 0 }];

    const sortedArray = sortByDateKey(array, "createdAt");

    expect(sortedArray).toEqual([{ createdAt: 0 }, { createdAt: new Date("2000-01-01") }, { createdAt: "2000-01-02" }]);
  });

  test("ソート順序を昇順に指定した場合、指定したキーの値で昇順にソートされる", () => {
    const array = [{ createdAt: "2000-01-02" }, { createdAt: new Date("2000-01-01") }, { createdAt: 0 }];

    const sortedArray = sortByDateKey(array, "createdAt", { order: "asc" });

    expect(sortedArray).toEqual([{ createdAt: 0 }, { createdAt: new Date("2000-01-01") }, { createdAt: "2000-01-02" }]);
  });

  test("ソート順序を降順に指定した場合、指定したキーの値で降順にソートされる", () => {
    const array = [{ createdAt: "2000-01-02" }, { createdAt: new Date("2000-01-01") }, { createdAt: 0 }];

    const sortedArray = sortByDateKey(array, "createdAt", { order: "desc" });

    expect(sortedArray).toEqual([{ createdAt: "2000-01-02" }, { createdAt: new Date("2000-01-01") }, { createdAt: 0 }]);
  });
});
