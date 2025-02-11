import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import PostCard from 'components/PostCard';


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

interface PageProps {
  posts: Post[];
  pages: number[];
  current_page: number;
}

const PAGE_SIZE = 2;

// range 関数はページ番号の配列を生成
const range = (start: number, end: number, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const current_page = parseInt(params?.page as string, 10); // ページ番号を取得
  console.log(current_page)

 const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md')); // Markdownファイルのみ取得
  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(path.join('posts', fileName), 'utf-8');
    const { data } = matter(fileContent);
    return {
      frontMatter: data as FrontMatter,
      slug,
    };
  });

  // 投稿を日付でソート
  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  // トータルページ数を計算
  const pages = Math.ceil(posts.length / PAGE_SIZE);  

  // 現在のページに基づいて投稿を抽出
  const slicedPosts = sortedPosts.slice(
    (current_page - 1) * PAGE_SIZE,
    current_page * PAGE_SIZE
  );

  return {
    props: {
      posts: slicedPosts,
      pages: range(1, pages), // ページ番号の配列を渡す
      current_page,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync('posts'); // 'posts' ディレクトリ内のファイルを取得
  const totalPages = Math.ceil(files.length / PAGE_SIZE); // ページ数を計算

  // 各ページのパスを生成
  const paths = range(1, totalPages).map((page) => ({
    params: { page: page.toString() },
  }));

  return {
    paths,
    fallback: false, // 存在しないページにアクセスすると 404 ページが表示されます
  };
};

const Page: NextPage<PageProps> = ({ posts, pages, current_page }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.slug}>
            <PostCard key={post.slug} post={post} />
          </div>
        ))}
      </div>

      {/* ページネーションコンポーネント */}
      <div className="my-4">
        <div className="flex justify-center space-x-4">
          {pages.map((page) => (
            <a
              key={page}
              href={`/page/${page}`}
              className={`px-4 py-2 rounded ${current_page === page ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              {page}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
