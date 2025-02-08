import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import 'prismjs/themes/prism-okaidia.css';
import '../public/tailwind.css';  // tailwind.css は最後にインポート


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
