import { Link } from 'react-router-dom';
import './navbar.css'

interface NavbarProps {
  token: string | null;
  handleLogout: () => void;
}

const CLIENT_BASE: string = "localhost:3000/";

const Navbar = ({ token, handleLogout }: NavbarProps) => {
  return (
    <div className="navbar">
      <h1 className='nav-logo'>rrevif</h1>
      <div className="nav-links">
        <Link className="no-style" to={CLIENT_BASE}><h4 className='nav-link'>Features</h4></Link>
        <Link className="no-style" to="/tasks-view"><h4 className='nav-link'>Listings</h4></Link>
        <Link className="no-style" to={CLIENT_BASE}><h4 className='nav-link'>About</h4></Link>
        <Link className="no-style" to={CLIENT_BASE}><h4 className='nav-link'>Home</h4></Link>
      </div>
      <div className="nav-btn-lgn">
        {token ? (
          <a href={API_BASE} onClick={handleLogout} className='nav-link nav-login no-style'>Log out</a>
        ) : (
          <div>
            <Link to="/login" className='nav-link nav-login no-style'>Log in</Link>
            <Link to="/login" className="no-style">
            <div className="nav-exclamation">
              Join rrivef for free
            </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
};

export default Navbar;
