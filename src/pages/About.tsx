import Navbar from '../components/Navbar';
import useToken from '../utils/useToken';
import './about.css'

const About = () => {
  const { token, setToken } = useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});
  };

  return (
    <div>
      <Navbar token={token} handleLogout={handleLogout} />
    </div>
  )
}

export default About;
