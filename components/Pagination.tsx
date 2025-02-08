import Link from 'next/link';

interface PaginationProps {
  pages: number[];
  current_page?: number;
}

const Pagination = ({ pages, current_page = 1 }: PaginationProps) => {
  return (
    <div className="flex items-center space-x-1 mt-8">
      {pages.map((page) => (
        <Link
          href={`/page/${page}`}  // ページ番号に基づくリンク
          key={page}
          className={`px-4 py-2 border hover:bg-black hover:text-white ${
            current_page === page ? 'bg-black text-white cursor-not-allowed' : ''
          }`}
          aria-current={current_page === page ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
