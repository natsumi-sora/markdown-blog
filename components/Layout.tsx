import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar'; // サイドバーコンポーネントをインポート
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-8">{children}</main>
      <Footer />
    </div>
  );
}
