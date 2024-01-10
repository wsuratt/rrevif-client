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
    </div>
  )
}

export default About;
