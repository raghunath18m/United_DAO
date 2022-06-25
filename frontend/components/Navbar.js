import React from 'react';
import Link from "next/link"

const Navbar = () => {
    return ( 
        <nav>
            <div className="logo" href="">
                <i></i>
                <h1>Manchester United DAO</h1>
            </div>
            <ul>
                <li><Link href='/NFT'><a>NFT</a></Link></li>
                <li><Link href='/DAO'><a>Join DAO</a></Link></li>
                <li><Link href='/Whitelist'><a>Join Whitelist Now</a></Link></li>
            </ul>
        </nav>
     );
}
 
export default Navbar;