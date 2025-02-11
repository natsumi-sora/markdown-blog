import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// posts ディレクトリのパス
const postsDirectory = path.join(process.cwd(), 'posts');

// タグで投稿を絞り込む関数
export function getPostsByTag(tag: string) {
    const allPosts = fs.readdirSync(postsDirectory);
  
    return allPosts
      .map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
  
        return {
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          slug: fileName.replace(/\.md$/, ''),
        };
      })
      .filter((post) => post.tags.includes(tag));
  }

// 全ての投稿を取得する関数（任意で使用）
export function getAllPosts() {
  const allPosts = fs.readdirSync(postsDirectory)
  .filter((file) => file.endsWith('.md'));
  return allPosts.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      slug: fileName.replace(/\.md$/, ''),
    };
  });
}
