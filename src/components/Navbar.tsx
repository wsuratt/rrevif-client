import { Link } from 'react-router-dom';
import './navbar.css'

const API_BASE: string = "localhost:3000/";

const Navbar = () => {
  return (
    <div className="navbar">
      <h1 className='nav-logo'>rrevif</h1>
      <div className="nav-links">
        <a className="no-style" href={API_BASE}><h4 className='nav-link'>Features</h4></a>
        <a className="no-style" href={API_BASE}><h4 className='nav-link'>Listings</h4></a>
        <a className="no-style" href={API_BASE}><h4 className='nav-link'>About</h4></a>
        <a className="no-style" href={API_BASE}><h4 className='nav-link'>Home</h4></a>
      </div>
      <div className="nav-btn-lgn">
        <Link to="/login" className='nav-link nav-login no-style'>Log in</Link>
        <Link to="/login" className="no-style">
        <div className="nav-exclamation">
          Join rrivef for free
        </div>
        </Link>
      </div>
    </div>
  )
};

export default Navbar;
