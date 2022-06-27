import React from 'react';
import Link from 'next/link'

const Card = ( {data} ) => {
    return ( 
        <div className="cardWrapper">
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <Link href={data.link}><a>›››</a></Link>
        </div>
     );
}
 
export default Card;