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
        <a href={API_BASE + "login/"} className='nav-link nav-login no-style'>Log in</a>
        <a href={API_BASE + "login/"} className="no-style">
        <div className="nav-exclamation">
          Get rrivef for free
        </div>
        </a>
      </div>
    </div>
  )
};

export default Navbar;