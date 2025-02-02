import { unified } from 'unified';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import React from 'react';
import Link from 'next/link';
import { toc } from 'mdast-util-toc';

// 🔹 目次を生成する関数
const getToc = (options) => {
  return (tree) => {
    const result = toc(tree, options);
    if (result.map) {
      tree.children.unshift(result.map); // 目次をツリーの先頭に追加
    }
  };
};

// 🔹 aタグを変換するカスタムリンク
const MyLink = ({ children, href }) => {
  if (!href) href = '/';
  return href.startsWith('/') || href.startsWith('#') ? (
    <Link href={href}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

// 🔹 next/image を使ったカスタム画像
const MyImage = ({ src, alt }) => (
  <div className="relative max-w-full h-96">
    <Image src={src} alt={alt} layout="fill" objectFit="contain" />
  </div>
);

// JSXを有効にするための設定
const toReactNode = (content) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      components: {
        a: MyLink,
        img: MyImage,
      },
      // JSX オプションを追加
      jsx: true,
    })
    .processSync(content).result;
    

export async function getStaticProps({ params }) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
  const { data, content } = matter(file);

  // 🔹 目次を生成
  const tocResult = await unified()
    .use(remarkParse)
    .use(getToc, { heading: '目次', tight: true }) // ここで getToc を適用
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  // 🔹 MarkdownをHTMLに変換
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true }) // HTMLを許可
    .use(rehypeSlug)
    .use(remarkPrism) // コードハイライト
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    props: {
      frontMatter: data,
      content: result.toString(), // 正しく文字列化
      toc: tocResult.toString(), // 目次も props に渡す
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory);

  return {
    paths: files.map((fileName) => ({
      params: { slug: fileName.replace(/\.md$/, '') },
    })),
    fallback: false,
  };
}

const Post = ({ frontMatter, content, toc, slug }) => {
  return (
    <>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          type: 'website',
          url: `http://localhost:3000/posts/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `http://localhost:3000/${frontMatter.image}`,
              width: 1200,
              height: 700,
              alt: frontMatter.title,
            },
          ],
        }}
      />
      <div className="prose prose-lg max-w-none">
        <div className="border">
          <Image src={`/${frontMatter.image}`} width={1200} height={700} alt={frontMatter.title} />
        </div>
        <h1 className="mt-12">{frontMatter.title}</h1>
        <span>{frontMatter.date}</span>
        <div className="space-x-2">
          {frontMatter.categories.map((category) => (
            <span key={category}>
              <Link href={`/categories/${category}`}>{category}</Link>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-9">{toReactNode(content)}</div>
          <div className="col-span-3">
            <div className="sticky top-[50px]" dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
