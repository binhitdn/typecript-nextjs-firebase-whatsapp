import Loading from '../components/Loading'
import '@/styles/globals.css'
import { auth, db } from 'config/firebase'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login'
import { useEffect } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser,loading,_error] = useAuthState(auth)
  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.uid as string),
          {
            email: loggedInUser?.email,
            lastSeen: Date.now(),
            photoURL: loggedInUser?.photoURL as string,
          },
          { merge: true }
        )
      } catch (error) {
        console.log("Loi: ", error  )
      }
    }
    if (loggedInUser) {
      setUserInDb()
      console.log('User is logged in')
    }
  }, [loggedInUser])
  if (loading) return <Loading />
  if (!loggedInUser) return <Login />
  return <Component {...pageProps} />
}
