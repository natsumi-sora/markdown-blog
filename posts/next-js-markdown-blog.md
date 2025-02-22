---
title: 'Next.jsでmarkdownブログを構築'
date: '2022-07-13'
description: 'Next.jsでmarkdownファイルを利用したブログの構築手順を解説しています。今回のブログについては参考先のJavaScriptファイルを参考にして作成していましたが、途中からTypeScriptに変更しています。その過程で目次がサイドバーに行かなかったりとトラブルが発生しました。オンライン勉強会やchatGTPを使用してもなかなか解決せず現状の状態となります。何か良い解決方法があればご教示いただきたいです。また、コンポーネントについても現在の分け方で問題ないか参考までに教えていただけますと幸いです。よろしくお願いいたします。※ページネーションボタンの部分だけMUI CSSを使用しています。※今回の画像は自身で作成したものです。フォントはAdobeフォントOmnesを使用しています。。'
image: mdblog.png
categories: ['react']
tags: ["Next.js", "Markdown", "Tailwind CSS"]
---
## 目次

Next.js を使って Markdown のブログサイトの構築を一から行なっていきます。

## Next.js の準備

### プロジェクトの作成

### Tailwind CSSの設定

## ブログの構築
### レイアウトの設定

npx create-next-app コマンドを利用して Next.js プロジェクトの作成を行います。

[記事一覧](/)

![Next.jsのWelcomeページ](http://localhost:3000/welcomeblog.png)

```js[class="line-numbers"]
import Layout from '../components/layout';
import '../styles/globals.css';
import '../styles/prism.css';
import SEO from '../next-seo.config';
import { DefaultSeo } from 'next-seo';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
```