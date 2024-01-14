import Navbar from "../components/Navbar";
import { Link } from 'react-router-dom';
import useToken from "../utils/useToken";
import TaskCard from "../components/TaskCard";
import { useState, useEffect } from 'react';
import Login from "./Login"
import './home.css'

const CLIENT_BASE: string = "localhost:3000"
const API_BASE: string = "http://localhost:8080/";

const Home = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const { token, setToken } = useToken();
  
  useEffect(() => {
    GetTasks();
  }, [token])

  const GetTasks = () => {
    if(token) {
      fetch(API_BASE + "api/tasks/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error("Error: ", err))
    }
  }

  return (
    <main>
      <div className="home-body">
        <Navbar />
        <div className="home-content">
          <p id="home-content-title">
            rrevif brings work to freelance developers, 
            and employees to businesses
          </p>
          <p className="home-content-desc">
            Build up your portfolio and make money
          </p>
          <Link className="a-btn" to="/sign-up">
            <div className="submit-button">
              <p className="submit-text">Sign up - it's free</p>
            </div>
          </Link>
          <div className="home-spacer" />
        </div>
      </div>
      <h1 className="home-tasks-title">Featured Tasks:</h1>
      <div className="home-tasks-container">
      {tasks.map((task) => (
        (task.solver_id == null ? 
          <div className="task-block"><TaskCard task={task} token ={token} /></div>
        : <></>)
      ))}
      </div>
      <Link className="view-more-link" to="/tasks">View more</Link>
      <div className="home-spacer" />
    </main>
  )
};

export default Home;
