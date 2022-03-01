import { useRequireLogin } from 'client/auth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  useRequireLogin();
  const router = useRouter();
  router.push('/dashboard');
  return (
    <div className={styles.container}>
      <Head>
        <title>RS-Webapp-Template</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
