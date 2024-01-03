import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import useToken from "../utils/useToken";
import './tasksview.css'
import TaskCard from "../components/TaskCard";
import { useState, useEffect } from 'react';
import AddTask from '../components/AddTask';


const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const { token, setToken } = useToken();
  const navigate = useNavigate();
  
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
        .then(data => {
          console.log(data)
          setTasks(data)})
        .catch(err => console.error("Error: ", err))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});

    navigate("/");
  };
  
  return (
    <div className="tasks-view-container">
      <Navbar token={token} handleLogout={handleLogout} />
      <div className="home-spacer" />
      <h1 className="tasks-explore-head">Explore Tasks:</h1>
      <div className="tasks-container">
      {tasks.map((task) => (
        (task.solver_id == null ? 
          <TaskCard task={task} token ={token} />
        : <></>)
      ))}
      </div>
    </div>
  )
};

export default Tasks;
