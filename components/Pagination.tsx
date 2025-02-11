import Link from 'next/link';
import Button from '@mui/material/Button'; // MUIのButtonをインポート

interface PaginationProps {
  pages: number[];
  current_page?: number;
}

const Pagination = ({ pages, current_page = 1 }: PaginationProps) => {
  console.log("current_page:", current_page);
  return (
    <div className="flex justify-center mt-10 space-x-4">
      {pages.map((page) => (
        <Link href={`/page/${page}`} key={page} passHref>
          <Button
            variant={current_page === page ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: current_page === page ? '#f06292' : 'transparent',
              color: current_page === page ? 'white' : '#f06292',
              borderColor: '#f06292',
              '&:hover': {
                backgroundColor: '#e91e63',
                borderColor: '#e91e63',
                color: 'white',
              },
            }}
          >
            {page}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
