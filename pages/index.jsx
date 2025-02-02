import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Pagination from '../components/Pagination';
import PostCard from '../components/PostCard';

const PAGE_SIZE = 2;

const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);


export const getStaticProps = () => {
  const postsDirectory = path.join(process.cwd(), 'posts'); // postsフォルダのパス
  const files = fs.readdirSync(postsDirectory); // postsフォルダ内のファイルを取得

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, ''); // ファイル名から拡張子を削除
    const fileContent = fs.readFileSync(path.join(postsDirectory, fileName), 'utf-8'); 
    const { data } = matter(fileContent); // Markdown のメタデータを取得

    return {
      slug,
      frontMatter: data, // frontMatter にタイトルや日付を保存
    };
  });

  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  const pages = range(1, Math.ceil(posts.length / PAGE_SIZE));

  return {
    props: {
      posts,  posts: sortedPosts.slice(0, PAGE_SIZE),
      pages,
    },
  };
};


export default function Home({ posts }) {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
             {posts.length === 0 ? (
              <p>投稿がありません</p>
            ) : (
              posts.map((post) => (
              // ✅ PostCard コンポーネントを正しく使う
             <PostCard key={post.slug} post={post} />
              ))
             )}
            
      </div>
    </div>
  );
}
