import fs from 'fs';
import matter from 'gray-matter';
import Pagination from '../../components/Pagination';
import PostCard from '../../components/PostCard';

const PAGE_SIZE = 2;

const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);

export async function getStaticProps({ params }) {
//略
}

export async function getStaticPaths() {
//略
}

const Page = ({ posts, pages, current_page }) => {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination pages={pages} current_page={current_page} />
    </div>
  );
};

export default Page;