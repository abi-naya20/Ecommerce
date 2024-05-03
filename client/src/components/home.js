import React from 'react';
import Nav from '../components/nav.js';
import '../styles/home.css';
import {Link} from 'react-scroll';
function Home() {
    return (
        <div className="container">
            <Nav />
            <div className="img-con">
                <div className="card">
                 <div className="content">
                    <p className="main-heading"> Fresh And Organic Products For You</p>
                    <p className="sub"> We respect your taste and tradition and so we are proud to say
                  that we are a local company.</p>
                  <p className='sub'>.......................We do not sell products which are
                  of low quality but highly priced.......................</p>
                 <div className="btn-1">
                 <Link to='cont' smooth={true} offset={600}>
                     <button className="btn">SHOP NOW</button>
                </Link>
                 </div>
                 </div>
                </div>
            </div>
        
          
       </div> 
    );
} 
 export default Home;

 
