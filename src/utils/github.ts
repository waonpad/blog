/**
 * @example
 * buildPagesUrlFromRepo({ owner: "owner", name: "repo" })
 * // => "https://owner.github.io/repo"
 */
export const buildGithubPagesUrl = <Owner extends string, Name extends string>({
  owner,
  name,
}: {
  owner: Owner;
  name: Name;
}) => {
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

  return { owner, name };
};
