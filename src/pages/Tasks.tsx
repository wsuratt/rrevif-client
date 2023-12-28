import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import useToken from "../utils/useToken";
import Login from "./Login"
import './tasksview.css'
import TaskCard from "../components/TaskCard";
import { useState, useEffect } from 'react';
import AddTask from '../components/AddTask';

const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const { token, setToken } = useToken();
  
  useEffect(() => {
    GetTasks();
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});
  };
  
  if (!token) {
    return <Login setToken={(token) => setToken({ token })} />;
  }
  return (
    <div className="tasks-view-container">
      <Navbar token={token} handleLogout={handleLogout} />
      <div className="home-spacer" />
      <h1 className="tasks-explore-head">Explore Tasks:</h1>
      <div className="tasks-container">
      {tasks.map((task) => (
        <TaskCard task={task} token ={token} />
      ))}
      </div>
    </div>
  )
};

export default Tasks;
