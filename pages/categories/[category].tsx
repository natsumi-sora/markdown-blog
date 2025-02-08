import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';

interface FrontMatter {
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
}

interface Post {
  frontMatter: FrontMatter;
  slug: string;
}

interface CategoryProps {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<CategoryProps> = async ({ params }) => {
  const category = params?.category as string;
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(path.join(postsDirectory, fileName), 'utf-8');
    const { data } = matter(fileContent);
    return {
      frontMatter: data as FrontMatter,
      slug,
    };
  });

  const filteredPosts = posts.filter((post) =>
    post.frontMatter.categories.includes(category)
  );

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
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((fileName) => {
    const fileContent = fs.readFileSync(path.join(postsDirectory, fileName), 'utf-8');
    const { data } = matter(fileContent);
    return data.categories;
  });

  const categories = Array.from(new Set(posts.flat()));

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return {
    paths,
    fallback: false,
  };
};

const Category: NextPage<CategoryProps> = ({ posts }) => {
  return (
    <div>
      <h1>{posts[0]?.frontMatter?.categories[0]}</h1>
      {/* カテゴリに紐づいた投稿を表示 */}
    </div>
  );
};

export default Category;