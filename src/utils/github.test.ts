import { describe, expect, test } from "vitest";

import { buildGithubPagesUrl, extractOwnerAndNameFromRepo } from "./github";

describe(buildGithubPagesUrl, () => {
  test("GitHub Pages の URL を生成する", () => {
    const repo = { owner: "owner", name: "repo" };

    const url = buildGithubPagesUrl(repo);

    expect(url).toBe("https://owner.github.io/repo");
  });
});

describe(extractOwnerAndNameFromRepo, () => {
  test("リポジトリ名からオーナー名とリポジトリ名を抽出する", () => {
    const repo = "owner/repo";

    const { owner, name } = extractOwnerAndNameFromRepo(repo);

    expect(owner).toBe("owner");
    expect(name).toBe("repo");
  });

  test("不正なリポジトリ名の場合、エラーをスローする", () => {
    const repo = "invalid-repo-name";

    expect(() => extractOwnerAndNameFromRepo(repo)).toThrow("リポジトリ名のフォーマットが不正です");
  });
});
