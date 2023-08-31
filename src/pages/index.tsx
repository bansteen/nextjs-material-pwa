import { Global } from '@emotion/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { initFirebase } from '../../firebaseapp'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {
  initFirebase()
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  const router = useRouter()

  const signIn =async () => {
    const result = await signInWithPopup(auth, provider)
    if (result.user.email?.endsWith("dena.jp") || result.user.email?.endsWith("dena.com")) {
      router.push('/app')
    }else {
      toast("You don't have permission");
    }
  }
  const handleAppLaunch = () => {
    signIn()  
  }

  return (
    <>
      <Global
        styles={{
          body: {
            fontFamily: 'system-ui, sans-serif',
            margin: 0,
            color: '#4c4a4a'
          },
          '@media (prefers-color-scheme: dark)': {
            body: {
              backgroundColor: '#212121',
              color: '#fff'
            }
          }
        }}
      />
      <div
        css={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <h1 css={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 0 }}>
          DeNA Network Science
        </h1>
        <div
          css={{
            maxWidth: '300px',
            '& img': {
              width: '100%',
              height: 'auto'
            }
          }}
        >
          <Image alt="" src="/landing-page.svg" width={400} height={300} />
        </div>
        <div
          css={{
            maxWidth: 400,
            fontSize: '0.8rem',
            padding: '0 12px'
          }}
        >
        </div>
        <a
          onClick={handleAppLaunch}
          css={{
            marginTop: 14,
            padding: 12,
            backgroundColor: 'blue',
            borderRadius: 8,
            color: '#fff',
            fontSize: '1rem',
            textDecoration: 'none',
            textAlign: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          Launch Application
        </a>
        <ToastContainer />
      </div>
    </>
  )
}
