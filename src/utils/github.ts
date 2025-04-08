/**
 * @example
 * buildPagesUrlFromRepo("owner/repo")
 * // => "https://owner.github.io/repo"
 */
export const buildPagesUrlFromRepo = (repo: string) => {
  const { owner, name } = extractOwnerAndNameFromRepo(repo);

  return `https://${owner}.github.io/${name}` as const;
};

/**
 * @example
 * extractOwnerAndNameFromRepo("owner/repo")
 * // => { owner: "owner", name: "repo" }
 */
export const extractOwnerAndNameFromRepo = (repo: string) => {
  const [owner, name] = repo.split("/");

  if (!owner || !name) {
    throw new Error("リポジトリ名のフォーマットが不正です");
  }

  return {
    owner,
    name,
  } as const;
};
