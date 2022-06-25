import React from 'react';
import Head from 'next/head'
import Card from '../components/Card'
import cardData from '../lib/data'
 
export default function Home() {
  const cards = cardData.map(data =>{
    return (
      <Card data={data} key={data.id}/>
    )}
    )

  return (
    <div className=''>
      <Head>
        <title>Manchester United</title>
        <meta name="description" content="ManUtd" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=''>
        <h1>Be a part of one of the worlds first Blockchain based Football community</h1>
        <img src="" alt="" />
        <div className=''>
          {cards}
        </div>
      </div>

    </div>
  )
}