import React from 'react';
import Link from 'next/link'

const Card = ( {data} ) => {
    return ( 
        <div className="cardWrapper">
            <i></i>
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <Link href={data.link}><a>visit</a></Link>
        </div>
     );
}
 
export default Card;