import Link from 'next/link';

interface PaginationProps {
  pages: number[];
  current_page?: number;
}

const Pagination = ({ pages, current_page = 1 }: PaginationProps) => {
  return (
    <div className="flex items-center space-x-1 mt-8">
      {pages.map((page) => (
        <Link href={`/page/${page}`} key={page} legacyBehavior>
        <a
          className={`px-4 py-2 border cursor-pointer transition ${
            current_page === page ? 'bg-black text-white cursor-not-allowed' : 'hover:bg-gray-200'
          }`}
          aria-current={current_page === page ? 'page' : undefined}
        >
          {page}
        </a>
      </Link>
      ))}
    </div>
  );
};

export default Pagination;
