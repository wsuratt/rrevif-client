import Navbar from "./components/Navbar";
import useToken from "./components/useToken";
import Login from "./Login"
import './home.css'

const API_BASE: string = "localhost:3000"

const Home = () => {
  const { token, setToken } = useToken();
  
  if (!token) {
    return <Login setToken={(token) => setToken({ token })} />;
  }

  return (
    <main>
      <div className="home-body">
        <Navbar />
        <div className="home-spacer" />
        <div className="home-content">
          <p id="home-content-title">
            rrevif brings work to freelance developers, 
            and employees to businesses
          </p>
          <p className="home-content-desc">
            Build up your portfolio and make money
          </p>
          <a href={API_BASE} className="a-btn">
            <div className="submit-button">
              <p className="submit-text">Sign up - it's free</p>
            </div>
          </a>
          <div className="home-spacer" />
        </div>
      </div>
    </main>
  )
};

export default Home;
