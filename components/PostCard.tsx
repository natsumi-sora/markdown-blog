import Image from 'next/image';
import Link from 'next/link';
import { Post } from '../types'; // types.ts から Post 型をインポート

interface PostCardProps {
  post: Post; // ここで型を指定
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // description の 100 文字を取得（100 文字以上なら "..." を追加）
  const excerpt =
    post.frontMatter.description.length > 100
      ? post.frontMatter.description.substring(0, 100) + "..."
      : post.frontMatter.description;

  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <div className="border rounded-lg">
        <Image
          src={`/${post.frontMatter.image}`}
          width={1200}
          height={700}
          alt={post.frontMatter.title}
        />
      </div>
      <div className="px-2 py-4">
        <h1 className="font-bold text-lg">{post.frontMatter.title}</h1>
        <p className="mt-2 text-sm text-gray-700">{excerpt}</p>
        <span>{post.frontMatter.date}</span>
      </div>
    </Link>
  );
};

export default PostCard;