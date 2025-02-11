import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import PostCard from '../../components/PostCard';

interface Params extends ParsedUrlQuery {
  category: string;
}

interface Post {
  frontMatter: {
    title: string;
    description: string;
    date: string;
    image: string;
    categories: string[];
  };
  slug: string;
}

interface CategoryProps {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<CategoryProps, Params> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }

  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md')); // Markdownファイルのみ取得

  const posts: Post[] = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(path.join(process.cwd(), 'posts', fileName), 'utf-8');
    const { data } = matter(fileContent);
    return {
      frontMatter: data as Post['frontMatter'],
      slug,
    };
  });

  const category = params.category;

  const filteredPosts = posts.filter((post) => post.frontMatter.categories.includes(category));

  const sortedPosts = filteredPosts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  return {
    props: {
      posts: sortedPosts,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = ['react', 'laravel'];
  const paths = categories.map((category) => ({ params: { category } }));

  return {
    paths,
    fallback: false,
  };
};

const Category: NextPage<CategoryProps> = ({ posts }) => {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Category;
