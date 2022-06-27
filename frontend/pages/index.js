import React from 'react';
import Head from 'next/head'
import Card from '../components/Card'
import cardData from '../lib/data'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import alex from "../public/homeicon.png"

 
export default function Home() {
  const cards = cardData.map(data =>{
    return (
      <Card data={data} key={data.id}/>
    )}
    )

  return (
    <div>
      <Head>
        <title>Manchester United</title>
        <meta name="description" content="ManUtd" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div className="left">
          <Image src={alex} alt="homeicon" width={520} height={420} />
          <h2>Be a part of one of the worlds first Decentralized Football community</h2>
        </div>
        <div className='right'>
          {cards}
        </div>
      </div>

    </div>
  )
}