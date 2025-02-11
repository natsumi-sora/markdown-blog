import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps, NextPage } from 'next';
import Pagination from '../components/Pagination';
import PostCard from '../components/PostCard';

interface FrontMatter {
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
}

interface Post {
  slug: string;
  frontMatter: FrontMatter;
}

interface HomeProps {
  posts: Post[];
  pages: number[];
  current_page: number;
}

const PAGE_SIZE = 2;

const range = (start: number, end: number, length: number = end - start + 1): number[] =>
  Array.from({ length }, (_, i) => start + i);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory)
   .filter((file) => file.endsWith('.md')); // Markdownファイルのみ取得

  const posts: Post[] = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(path.join(postsDirectory, fileName), 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug,
      frontMatter: data as FrontMatter,
    };
  });

  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  const pages = range(1, Math.ceil(posts.length / PAGE_SIZE));

  return {
    props: {
      posts: sortedPosts.slice(0, PAGE_SIZE),
      pages,
      current_page: 1,
    },
  };
};

const Home: NextPage<HomeProps> = ({ posts, pages, current_page }) => {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {posts.length === 0 ? (
          <p>投稿がありません</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
      <Pagination pages={pages} current_page={current_page} />
    </div>
  );
};

export default Home;
