# GitHub Issuesを記事管理に使用したブログ

[実際にデプロイしたブログ](https://waonpad.github.io/blog/)

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

### 記事管理用の非公開GitHubリポジトリを作成する

https://github.com/new からリポジトリを作成します。

Issueには自由にコメントできてしまうため、リポジトリは非公開にします。

ソースコードもここで一緒に管理します。

### GitHub Pagesデプロイ先GitHubリポジトリを作成する

https://github.com/new からリポジトリを作成します。

このリポジトリの名前はブログのURLに使用されます。

このリポジトリは公開する必要があります。  
[プランを変更すれば非公開でも可能](https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)で、別途リポジトリを作成する必要はありません。  
以後の手順では別途リポジトリを作成しなかった場合は想定しません。

### リポジトリに変数を設定する

<記事管理用の非公開GitHubリポジトリURL>/settings/variables/actions にアクセスし、変数を設定します。

`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`の設定は任意です。  
不要な場合、この値を使用している箇所を削除して`@next/third-parties`をアンインストールしてください。

| 変数名 | 説明 |
| --- | --- |
| NEXT_PUBLIC_APP_NAME | ブログタイトル |
| NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY | GitHub Pagesデプロイ先GitHubリポジトリ（例：org/repo） |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_ID | Google AnalyticsのID（任意） |

### リポジトリにシークレットを設定する

<記事管理用の非公開GitHubリポジトリURL>/settings/secrets/actions にアクセスし、シークレットを設定します。

`GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_CLIENT_EMAIL`の設定は任意です。  
この2つはサイトマップのアップロードに使用します。  

<details>

<summary>サイトマップのアップロードをする場合<summary>

以下の操作を行ってください。

- Googleから取得したサイト識別用のhtmlファイルを[publicディレクトリ](./public)に配置
- [publicディレクトリ](./public)に元からあったサイト識別用のhtmlファイルを削除

</details>

<details>

<summary>サイトマップのアップロードが不要な場合<summary>

以下の操作を行ってください。

- [サイトマップアップロードスクリプト](scripts/submit-sitemap.ts)を削除
- `GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_CLIENT_EMAIL`の値を使用している箇所を検索して削除
- [publicディレクトリ](./public)からhtmlファイルを削除（`google`から始まるファイル名）
- [コード更新のみ反映ワークフロー](.github/workflows/publish.yml), [記事更新とコード更新反映ワークフロ](.github/workflows/sync.yml)から`Submit sitemap`ステップを削除
- `google-auth-library`, `googleapis`をアンインストール

</details>

| シークレット名 | 説明 |
| --- | --- |
| ACTIONS_DEPLOY_KEY | [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages?tab=readme-ov-file#%EF%B8%8F-deploy-to-external-repository-external_repository)で外部リポジトリへデプロイするためのキー（[作成方法](https://github.com/peaceiris/actions-gh-pages?tab=readme-ov-file#%EF%B8%8F-create-ssh-deploy-key)） |
| GOOGLE_CLOUD_PRIVATE_KEY | Google Cloudのプライベートキー（任意） |
| GOOGLE_CLOUD_CLIENT_EMAIL | Google Cloudのクライアントメール（任意） |

### 特別な役割を持つIssueを作成する

[設定](src/lib/issue/config.ts)により、特定のタイトルを持つIssueは特別な扱いがされます。  

これらは記事として扱われず、Issueのクローズは任意です。

#### Aboutページを作成する

<記事管理用の非公開GitHubリポジトリURL>/issues/new?title=about から、Aboutページの本文となるIssueを作成します。

#### プライバシーポリシーページを作成する

<記事管理用の非公開GitHubリポジトリURL>/issues/new?title=privacy-policy から、プライバシーポリシーページの本文となるIssueを作成します。

### 記事となるIssueを作成する

<記事管理用の非公開GitHubリポジトリURL>/issues/new から、記事となるIssueを作成します。

Issueのタイトルが本文となります。

記事がどう表示されるかは[Markdownのレンダリングに使用する関数](src/lib/issue/markdown.ts)を参照したり、ローカル開発サーバーで確認できます。

### ラベルを作成する

<記事管理用の非公開GitHubリポジトリURL>/labels にアクセスし、ラベルを作成します。

ラベルはブログ内では「タグ」と呼び替えています。

[設定](src/lib/issue/config.ts)により、タグがついた記事一覧を表示するページのパスに使われる文字列を設定できます。  
`Description`を`pathname___説明`とする事で、/tags/pathname/ というパスでアクセスできるようになります。

### 記事にラベルを追加する

<記事管理用の非公開GitHubリポジトリURL>/issues/<Issue番号> にアクセスし、ラベルを追加できます。

関連のある記事をまとめる事ができます。

### ブログをデプロイする

<記事管理用の非公開GitHubリポジトリURL>/actions/workflows/sync.yml にアクセスし、ワークフローを実行します。

ワークフローが完了すると、GitHub Pagesデプロイ先GitHubリポジトリでワークフローが自動実行されます。  
<GitHub Pagesデプロイ先GitHubリポジトリURL>/actions/workflows/pages/pages-build-deployment から実行状況が確認できます。

2つのワークフローが完了すると、以下のURLからブログにアクセスできます。  
https://<GitHubユーザー名>.github.io/<デプロイ先リポジトリ名>/

### TODO: ローカル開発方法

### TODO: 実際に手順をやってみる

### TODO: Google関連のやり方確認

### TODO: ソースコードの公開方法
