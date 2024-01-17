import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from 'lib/server/createEmotionCache'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initFirebase } from '../../firebaseapp'
import { ReactNode } from 'react'
import React from 'react';
import {createContext,useEffect } from 'react';
export const UserEmailContext = createContext<string | null>(null);
export function getUserEmail(): Promise<string | null> {
  return new Promise((resolve) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const email = user?.email || null;
      resolve(email);
      unsubscribe();
    });
  });
}
const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

interface AuthCheckerProps {
  children: ReactNode
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const router = useRouter()
  const auth = getAuth()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authUser = user?.email?.endsWith("dena.jp") || user?.email?.endsWith("dena.com")
      const isAppRoute = router.pathname.startsWith('/app');
      if (isAppRoute && !authUser) {
        router.replace('/');
      }
    })
    
    return () => unsubscribe()
  }, [router, auth])

  return <>{children}</>
}

export type NextApplicationPage<P = {}, IP = P> = NextPage<P, IP> & {
  desktopSidebar?: (
    defaultMenuItems: JSX.Element | JSX.Element[]
  ) => JSX.Element
  mobileSidebar?: (defaultMenuItems: JSX.Element | JSX.Element[]) => JSX.Element
  layout?: (page: NextApplicationPage, props: any) => JSX.Element
}
initFirebase();
export default function MyApp(props: MyAppProps) {
  const {
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache
  }: {
    Component: NextApplicationPage
    pageProps: any
    emotionCache?: EmotionCache
  } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="description"
          content="LiveLink application to view user networks"
          key="description"
        />
        <meta
          name="keywords"
          content="pwa,nextjs,material,design"
          key="keywords"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="LiveLink" />
        {/* Include other meta tags or head elements as needed */}
      </Head>
      <AuthChecker>
        {Component.layout ? (
          Component.layout(Component, pageProps)
        ) : (
          <Component {...pageProps} />
        )}
      </AuthChecker>
    </CacheProvider>
  )
}
