import React from 'react';
import '../styles/nav.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaRegHeart } from "react-icons/fa";
function Nav() {
  return (
    <div className='header'>
      <div className='icon'>
        <span>Grocery</span>
      </div>
      <div className='navbar'>
        <ul>
          <li>
            <Link to='/' className='nav-link' key="home">HOME</Link> {/* Changed reloadDocument to key */}
          </li>
          <li>
            <Link to='/categories' className='nav-link' key="products">PRODUCTS</Link> {/* Changed reloadDocument to key */}
          </li>
        </ul>
      </div>
      
      <div className='whislist'>
      
        <Link to='/whislist' key="wishlist" className='nav-link'><FaRegHeart size={30} /></Link> {/* Changed reloadDocument to key */}
      </div>
      <div className='cart'>
        <Link to='/cart' key="cart" className='nav-link'><FaShoppingCart size={30} /></Link> {/* Changed reloadDocument to key */}
      </div>
    </div>
  );
}
export default Nav;