import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import ReactMarkdown from 'react-markdown';

interface FrontMatter {
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
}

interface PostProps {
  frontMatter: FrontMatter;
  content: string;
  slug: string; // slugの型をstringに変更
}

export const getStaticProps: GetStaticProps<PostProps, ParsedUrlQuery> = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return {
      notFound: true,
    };
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const post = {
    frontMatter: data as FrontMatter,
    content,
    slug,
  };

  return {
    props: post,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
};

const SlugPage: NextPage<PostProps> = ({ frontMatter, content, slug }) => {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <p>{frontMatter.description}</p>
      {/* Markdown コンテンツを HTML に変換して表示 */}
      <div className="prose">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SlugPage;
