import { Link } from 'react-router-dom';
import './navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMugSaucer } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

interface NavbarProps {
  token: string | null;
  handleLogout: () => void;
}

const CLIENT_BASE: string = "/";

const Navbar = ({ token, handleLogout }: NavbarProps) => {
  const [popupActive, setPopupActive] = useState<boolean>(false);
  
  const switchPopup = () => {
    setPopupActive(!popupActive)
  }
  
  return (
    <>
      <div className="navbar">
        <Link to={CLIENT_BASE}><h1 className='nav-logo'><FontAwesomeIcon className="nav-title-icon" icon={faMugSaucer} />WORK3</h1></Link>
        <div className="nav-links">
          <Link className="no-style" to={CLIENT_BASE}><h4 className='nav-link home-link'>Home</h4></Link>
          <Link className="no-style" to="/tasks"><h4 className='nav-link'>Listings</h4></Link>
          <Link className="no-style" to={CLIENT_BASE}><h4 className='nav-link'>Features</h4></Link>
          <Link className="no-style" to="/about"><h4 className='nav-link'>About</h4></Link>
        </div>
        <div className="nav-btn-lgn">
          {token ? (
            <>
              <Link to="/profile" className='nav-link nav-login no-style'>Profile</Link>
              <a href={CLIENT_BASE} onClick={handleLogout} className='nav-link nav-login no-style logout'>Log out</a>
            </>
          ) : (
            <div className="nav-btn-lgn">
              <Link to="/login" className='nav-link nav-login no-style'>Log in</Link>
              <Link to="/sign-up" className="no-style">
                <div className="nav-exclamation">
                  Join rrivef for free
                </div>
              </Link>
            </div>
          )}
          <div className="hamburger-button" onClick={switchPopup}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
      <div className="spacer" />
      {popupActive ?  
          <div className="hamburger-menu-container">
            <Link className="no-style" to="/tasks"><h4 className='hamburger-nav-link'>Listings</h4></Link>
            <Link className="no-style" to="/about"><h4 className='hamburger-nav-link'>About</h4></Link>
            {token ? (
            <div className="hamburger-logout-container">
              <Link to="/profile" className='hamburger-nav-link hamburger-nav-login no-style'>Profile</Link>
              <a href={CLIENT_BASE} onClick={handleLogout} className='hamburger-nav-link hamburger-nav-login no-style hamburger-logout'>Log out</a>
            </div>
          ) : (
            <div className="nav-btn-lgn">
              <Link to="/login" className='hamburger-nav-link hamburger-nav-login no-style'>Log in</Link>
            </div>
          )}
          </div> : <></>
        }
    </>
  )
};

export default Navbar;
