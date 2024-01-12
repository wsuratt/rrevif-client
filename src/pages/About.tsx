import Navbar from '../components/Navbar';
import useToken from '../utils/useToken';
import './about.css'
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});

    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <div className='about-us-container'>
        <div className="about-us-card">
          <div className="about-us-header-wrapper">
            <p className="about-us-header">About Us</p>
          </div>
          <p className="about-us-description">We are cool.</p>
        </div>
     </div>
    </div>
  )
}

export default About;
