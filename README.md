<div id="top"></div>

## 使用技術一覧

<!-- シールド一覧 -->
<p style="display: inline">
  <!-- フロントエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-TailwindCSS-000000.svg?logo=tailwindcss&style=for-the-badge">
  <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)
5. [動作確認](#動作確認)


## Markdownファイルを用いたブログ構築

参考サイトを元にマークダウンを使用したブログを構築する


## プロジェクトについて

・参考サイトを元にマークダウンを使用したブログを構築しています。
・動作については開発環境、本番環境で確認済みとなります。
・画像、タイトル部分については自身で作成し直しています。
　また、文章の一部等も変更しています。


## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク・パッケージ | バージョン |
| --------------------- | ---------- |
|　npm                  | 10.9.2     |
| Node.js               | 22.13.0   |
| React                 | 19.0.0    |
| Next.js               | 15.1.6    |
| Prettier              | 11.0.0    |
| Tailwind CSS          | 0.14.3    |

その他のパッケージのバージョンは package.json を参照してください

<p align="right">(<a href="#top">トップへ</a>)</p>

### ディレクトリ構成
|ディレクトリ構成　　　　　　|
| --------------------- |
|   .
|   ├── README.md
|   ├── components
|   │   ├── Footer.tsx
|   │   ├── Header.tsx
|   │   ├── Layout.tsx
|   │   ├── Pagination.tsx
|   │   ├── PostCard.tsx
|   │   └── Sidebar.tsx
|   ├── eslint.config.ts
|   ├── jsconfig.json
|   ├── lib
|   │   └── posts.ts
|   ├── next-env.d.ts
|   ├── next-seo.config.tsx
|   ├── next.config.ts
|   ├── node_modules/
|   │ 
|   ├── package-lock.json
|   ├── package.json
|   ├── pages
|   │   ├── _app.tsx
|   │   ├── api
|   │   ├── categories
|   │   ├── index.tsx
|   │   ├── page
|   │   └── posts
|   ├── postcss.config.tsx
|   ├── posts
|   │   ├── about-corrections-by-aI.md
|   │   ├── break-blog.md
|   │   ├── comments
|   │   ├── create-table-of-contents.md
|   │   ├── next-js-markdown-blog.md
|   │   └── solution.md
|   ├── public
|   │   ├── aboutcorrectionsbyai.png
|   │   ├── breakblog.png
|   │   ├── createtableofcontents.png
|   │   ├── mdblog.png
|   │   ├── solution.png
|   │   ├── tailwind.css
|   │   └── welcomeblog.png
|   ├── styles
|   │   └── globals.css
|   ├── tailwind.config.ts
|   ├── tsconfig.json
|   ├── types
|   │   ├── rehype-react.d.ts
|   │   └── remark-prism.d.ts
|   └── types.ts
| --------------------- |

<p align="right">(<a href="#top">トップへ</a>)</p>


## 実行までのコマンド

◯開発環境の場合
 1 VSCordのダウンロード
　　https://code.visualstudio.com/download

　2 ダウンロードが完了したら拡張機能4つを追加

　　```
　　Japanese Language Pack for Visual Studio Code
　　Live Server
　　Prettier - Code formatter
　　Tailwind CSS IntelliSense
　　```

3 GitHubの以下よりリポジトリをクローン
　https://github.com/natsumi-sora/markdown-blog.git

・ターミナルで　npm run devを実行
　http://localhost:3000/にアクセスする

### 動作確認

◯開発環境
ターミナルで　npm run devを実行
http://localhost:3000/
にアクセスできたら成功

◯本番環境
https://markdown-blog-gamma-puce.vercel.app/
にアクセスできたら成功

記事は全部で5つあり、ページ1〜3までの記事のアクセス、
[react]の先の記事も確認できたら成功

### 停止

以下のコマンドで開発環境サーバーを停止することができます
^C （option+c）

<p align="right">(<a href="#top">トップへ</a>)</p>
