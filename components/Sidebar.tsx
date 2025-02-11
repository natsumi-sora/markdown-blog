import Link from 'next/link';
import { ReactNode } from 'react';

interface SidebarProps {
  toc: ReactNode;
  relatedPosts: { slug: string; title: string }[]; // 追加した部分
}

export default function Sidebar({ toc, relatedPosts }: SidebarProps) {
  const categories = ['react', 'laravel', 'nextjs']; // カテゴリーのリスト（動的に取得してもOK）

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">カテゴリー</h2>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link href={`/category/${category}`} className="text-blue-500 hover:underline">
              {category}
            </Link>
          </li>
        ))}
      </ul>

      {/* 目次部分 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">目次</h3>
        <div dangerouslySetInnerHTML={{ __html: String(toc) }} /> {/* 目次を表示 */}
      </div>
    </div>
  );
}
