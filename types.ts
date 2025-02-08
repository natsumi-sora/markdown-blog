export interface FrontMatter {
    title: string;
    description: string;
    date: string;
    categories: string[];
    image: string;
  }
  
  export interface Post {
    slug: string;
    frontMatter: FrontMatter;
  }  