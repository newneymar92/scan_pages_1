import { ReactElement, ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { Session } from 'next-auth';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/_app.scss';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout | any) => {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page: any) => page);

  useEffect(() => {
    router.push({ pathname: '/meta-community-standard' });
  }, []);

  return (
    <main>
      <ToastContainer limit={1} />
      <AuthProvider session={session} refetchOnWindowFocus={false}>
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </main>
  );
};

export default appWithTranslation(MyApp);
