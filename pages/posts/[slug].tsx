import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';
import { createElement, Fragment, ReactNode } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { toc } from 'mdast-util-toc';
import { Parent } from 'unist';
import Sidebar from 'components/Sidebar';// Sidebar をインポート
import { visit } from 'unist-util-visit';
import { Root } from 'mdast'; // 追加
import { getPostsByTag } from 'lib/posts'; // タグ検索用関数をインポート

interface Params extends ParsedUrlQuery {
  slug: string;
  tag?: string; // tag パラメータを追加
}

interface PostProps {
  frontMatter: {
    title: string;
    description: string;
    date: string;
    image: string;
    categories: string[];
    tags: string[];
  };
  content: string;
  slug: string;
  toc: string;
  relatedPosts: {  // 関連投稿の型を追加
    slug: string;
    title: string;
  }[];
}

export const getStaticProps: GetStaticProps<PostProps, Params> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }
 
  const filePath = path.join(process.cwd(), 'posts', `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);

  
  const frontMatter: PostProps['frontMatter'] = data as PostProps['frontMatter'];

  // 1. Markdown を HTML に変換
  const result = await unified()
    .use(remarkParse)
    .use(remarkPrism, { plugins: ['line-numbers'] })
    .use(remarkToc, { heading: '目次', tight: true })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(customCode)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  // 2. 目次を生成
  const tocResult = await unified()
  .use(remarkParse)
  .use(() => (node) => {
    const tocData = toc(node as Root, { heading: '目次', tight: true });
    if (tocData.map) {
      (node as Root).children = [tocData.map];
    }
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(content);

  console.log('TOC Output:', tocResult.toString()); // デバッグ用

  // 3. タグで絞り込んだ関連投稿を取得
  const relatedPosts = params.tag ? getPostsByTag(params.tag) : [];

  // 3. 返却
  return {
    props: {
      frontMatter,
      content: result.toString(),
      toc: tocResult.toString(), 
      slug: params.slug,
      relatedPosts, // 関連投稿を渡す
    },
  };
};


export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md')); // Markdownファイルのみ取得
  
  const paths = files.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
};

const toReactNode = (content: string): ReactNode => {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        a: MyLink,
        img: MyImage,
      },
    })
    .processSync(content).result as ReactNode;  // 型アサーションで修正
};


const MyLink = ({ children, href }: { children: ReactNode; href: string }) => {
  if (href === '') href = '/';
  return href.startsWith('/') || href.startsWith('#') ? (
    <Link href={href} legacyBehavior>
      <a>{children}</a>
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const MyImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative max-w-full h-96">
      <Image src={src} alt={alt} layout="fill" objectFit="contain" />
    </div>
  );
};


const customCode = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'p' && node.children[0]?.type === 'text') {
        if (node.children[0].value.startsWith('[commen]')) {
          node.tagName = 'div';
          node.properties = {
            className: ['alert'],
          };
          const value = node.children[0].value.replace(/\[\/?comment\]/g, '');
          node.children = [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['alert-2'] },
              children: [{ type: 'text', value }],
            },
          ];
        }
      }
    });
  };
};



const Post: NextPage<PostProps> = ({ frontMatter, content, slug, toc, relatedPosts }) => {
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
      
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* 記事ヘッダー */}
        <div className="relative w-full max-h-[500px] overflow-hidden rounded-lg">
          <Image
            src={`/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
            className="w-full h-auto object-cover"
          />
        </div>

        <h1 className="mt-12 text-3xl font-bold">{frontMatter.title}</h1>
        <p className="mt-2 text-lg text-gray-500">{frontMatter.description}</p>
        <span className="text-gray-600">{frontMatter.date}</span>

        {/* カテゴリータグ */}
        <div className="space-x-2 mt-2">
          {frontMatter.categories.map((category) => (
            <span key={category}>
              <Link href={`/categories/${category}`} legacyBehavior>
                <a className="text-blue-600 hover:underline">{category}</a>
              </Link>
            </span>
          ))}
        </div>

        {/* 記事内容 & サイドバー */}
        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* 記事本文 */}
          <div className="col-span-12 lg:col-span-9">
            {/* 記事上部に目次を表示 */}
            <div
              className="sticky top-[50px] mb-6"
              dangerouslySetInnerHTML={{ __html: toc }}
            />
            <div className="prose prose-lg max-w-none">{toReactNode(content)}</div>
          </div>

          {/* サイドバー */}
          <aside className="col-span-12 lg:col-span-3">
　          <Sidebar toc={toReactNode(toc)} relatedPosts={relatedPosts} />
          </aside>
        </div>
        
         {/* 関連投稿 */}
         {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold">関連記事</h3>
            <div className="mt-4 space-y-4">
              {relatedPosts.map((post) => (
                <div key={post.slug}>
                  <Link href={`/posts/${post.slug}`}>
                    <a className="text-blue-600 hover:underline">{post.title}</a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;