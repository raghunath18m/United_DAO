import React from 'react';
import Link from "next/link";
import Image from 'next/image'


const Navbar = () => {
    return ( 
        <nav>
            <div className="logo">
                <Image src="/../public/logo.jpeg" alt="site logo" width={128} height={77} />
                <h1>Manchester United DAO</h1>
            </div>
            <div className="navigation">
                <Link href="/Whitelist"><a>Join Whitelist</a></Link>
                <Link href="/NFT"><a>NFT</a></Link>
                <Link href="/DAO"><a>DAO</a></Link>
            </div>
        </nav>
     );
}
 
export default Navbar;