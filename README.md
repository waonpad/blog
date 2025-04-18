# GitHub Issuesを記事管理に使用したブログ

[実際にデプロイしたブログ](https://waonpad.github.io/blog/)

## 目次

- [構成](#構成)
  - [デプロイ先](#デプロイ先)
  - [使用パッケージ](#使用パッケージ)
- [セットアップ](#セットアップ)
  - [パッケージのインストール等](#パッケージのインストール等)
  - [記事管理用GitHubリポジトリを作成する](#記事管理用githubリポジトリを作成する)
  - [GitHub Pagesデプロイ先GitHubリポジトリを作成する](#github-pagesデプロイ先githubリポジトリを作成する)
  - [リポジトリに変数を設定する](#リポジトリに変数を設定する)
  - [リポジトリにシークレットを設定する](#リポジトリにシークレットを設定する)
- [ブログの運用](#ブログの運用)
  - [特別な役割を持つIssueを作成する](#特別な役割を持つissueを作成する)
    - [Aboutページを作成する](#aboutページを作成する)
    - [プライバシーポリシーページを作成する](#プライバシーポリシーページを作成する)
  - [記事となるIssueを作成する](#記事となるissueを作成する)
  - [ラベルを作成する](#ラベルを作成する)
  - [記事にラベルを追加する](#記事にラベルを追加する)
  - [ブログをデプロイする](#ブログをデプロイする)
- [ローカル開発](#ローカル開発)
  - [環境変数を設定する](#環境変数を設定する)
  - [GitHub REST APIからIssueを取得する](#github-rest-apiからissueを取得する)
  - [開発サーバーを起動する](#開発サーバーを起動する)
  - [ビルド結果をプレビューする](#ビルド結果をプレビューする)
- [ソースコードの公開](#ソースコードの公開)
- [注意点](#注意点)
  - [ブログタイトルとOGPのレイアウト](#ブログタイトルとogpのレイアウト)

## 構成

### デプロイ先

GitHub Pagesのみを想定しています。

### 使用パッケージ

[package.json](package.json)を参照してください。

## セットアップ

### パッケージのインストール等

```sh
bun run setup
```

### 記事管理用GitHubリポジトリを作成する

<https://github.com/new> からリポジトリを作成します。

**Issueには自由にコメントできてしまうため、リポジトリは非公開にします。**

ソースコードもここで一緒に管理します。

### GitHub Pagesデプロイ先GitHubリポジトリを作成する

<https://github.com/new> からリポジトリを作成します。

このリポジトリの名前はブログのURLに使用されます（例：owner/repo -> `https://owner.github.io/repo/`）。

**このリポジトリは公開する必要があります。**  
[プランを変更すれば非公開でも可能](https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)で、別途リポジトリを作成する必要はありませんが、このセットアップ方法では想定していません。

### リポジトリに変数を設定する

<記事管理用GitHubリポジトリURL>/settings/variables/actions にアクセスし、変数を設定します。

| 変数名 | 説明 |
| --- | --- |
| NEXT_PUBLIC_APP_NAME | ブログタイトル（[注意点](#ブログタイトルとogpのレイアウト)） |
| NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY | GitHub Pagesデプロイ先GitHubリポジトリ（例：owner/repo） |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_ID | Google AnalyticsのID（任意） |

`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`の設定は任意です。  
不要な場合、この値を使用している箇所を削除して`@next/third-parties`をアンインストールしてください。

### リポジトリにシークレットを設定する

<記事管理用GitHubリポジトリURL>/settings/secrets/actions にアクセスし、シークレットを設定します。

| シークレット名 | 説明 |
| --- | --- |
| ACTIONS_DEPLOY_KEY | [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages?tab=readme-ov-file#%EF%B8%8F-deploy-to-external-repository-external_repository)で外部リポジトリへデプロイするためのキー（[作成方法](https://github.com/peaceiris/actions-gh-pages?tab=readme-ov-file#%EF%B8%8F-create-ssh-deploy-key)） |
| GOOGLE_CLOUD_PRIVATE_KEY | Google Cloudのプライベートキー（任意） |
| GOOGLE_CLOUD_CLIENT_EMAIL | Google Cloudのクライアントメール（任意） |

`GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_CLIENT_EMAIL`の設定は任意です。  
この2つはサイトマップのアップロードに使用します。  

<details>
<summary>サイトマップのアップロードをする場合</summary>

以下の操作を行ってください。

- Googleから取得したサイト識別用のhtmlファイルを[publicディレクトリ](./public)に配置
- [publicディレクトリ](./public)に元からあったサイト識別用のhtmlファイルを削除

</details>

<details>
<summary>サイトマップのアップロードが不要な場合</summary>

以下の操作を行ってください。

- [サイトマップアップロードスクリプト](scripts/submit-sitemap.ts)を削除
- `GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_CLIENT_EMAIL`の値を使用している箇所を検索して削除
- [publicディレクトリ](./public)からhtmlファイルを削除（`google`から始まるファイル名）
- [コード更新のみ反映ワークフロー](.github/workflows/publish.yml)、[記事更新とコード更新反映ワークフロー](.github/workflows/sync.yml)から`Submit sitemap`ステップを削除
- `google-auth-library`, `googleapis`をアンインストール

</details>

## ブログの運用

### 特別な役割を持つIssueを作成する

特定のタイトルを持つIssueは特別な扱いがされます（[設定](src/lib/issue/config.ts)によるもの）。  

これらは記事として扱われず、Issueのクローズは任意です。

#### Aboutページを作成する

<記事管理用GitHubリポジトリURL>/issues/new?title=about から、Aboutページの本文となるIssueを作成します。

#### プライバシーポリシーページを作成する

<記事管理用GitHubリポジトリURL>/issues/new?title=privacy-policy から、プライバシーポリシーページの本文となるIssueを作成します。

### 記事となるIssueを作成する

<記事管理用GitHubリポジトリURL>/issues/new から、記事となるIssueを作成します。

Issueのタイトルが記事タイトルとなります。  
Issueをクローズする事で、記事として表示されるようになります。

記事がどう表示されるかは[Markdownのレンダリングに使用する関数](src/lib/issue/markdown.ts)を参照したり、[ローカル開発](#ローカル開発)サーバーを起動して確認できます。

### ラベルを作成する

<記事管理用GitHubリポジトリURL>/labels にアクセスし、ラベルを作成できます。

ラベルはブログ内では「タグ」と呼び替えています。

タグがついた記事一覧を表示するページのパス部分に使われる文字列を設定できます（[設定](src/lib/issue/config.ts)によるもの）。  
ラベルの`Description`を`pathname___説明`とする事で、/tags/pathname/ というパスでアクセスできるようになります。

### 記事にラベルを追加する

<記事管理用GitHubリポジトリURL>/issues/<Issue番号> にアクセスし、ラベルを追加できます。

関連のある記事をまとめる事ができます。

### ブログをデプロイする

<記事管理用GitHubリポジトリURL>/actions/workflows/sync.yml にアクセスし、ワークフローを実行します。

ワークフローが完了すると、GitHub Pagesデプロイ先GitHubリポジトリでGitHub Pagesの公開をするワークフローが自動実行されます。  
<GitHub Pagesデプロイ先GitHubリポジトリURL>/actions/workflows/pages/pages-build-deployment から実行状況が確認できます。

2つのワークフローが完了すると、以下のURLからブログにアクセスできます。  
https://<GitHubユーザー名>.github.io/<デプロイ先リポジトリ名>/

## ローカル開発

GitHub REST APIからリポジトリのデータを取得して、ローカルで記事の表示のされ方等の挙動を確認しながらソースコードを編集できます。

### 環境変数を設定する

ローカルからリポジトリにアクセスするため、[.env](.env)に環境変数を設定します。

| 環境変数名 | 説明 |
| --- | --- |
| GITHUB_TOKEN | [アクセストークン](https://github.com/settings/tokens) |
| GITHUB_REPOSITORY | 記事管理用GitHubリポジトリ（例：owner/repo） |

### GitHub REST APIからIssueを取得する

```sh
bun run scripts/get-issues.ts && bun run scripts/compute-issue-references.ts
```

### 開発サーバーを起動する

```sh
bun dev
```

### ビルド結果をプレビューする

```sh
bun run build && bun run start
```

## ソースコードの公開

記事管理用のGitHubリポジトリは非公開で、ソースコードもこのリポジトリで管理しているため同じく非公開です。

GitHub Pagesデプロイ先GitHubリポジトリをリモートリポジトリに追加して適宜Pushする事で、ソースコードを公開できます。

## 注意点

### ブログタイトルとOGPのレイアウト

ブログタイトル（NEXT_PUBLIC_APP_NAME）はOGPに表示されます。

ご自身のブログタイトルが綺麗に表示されるようレイアウトを調整してください。

現在以下のルーティングでOGPが生成されます。

- [デフォルトOGP](src/app/default-opengraph-image.png/route.tsx)
- [記事OGP](src/app/(frontend)/articles/[issueNumber]/opengraph-image.png/route.tsx)
