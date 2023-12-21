import { Link } from 'react-router-dom';
import Navbar from "./components/Navbar";
import useToken from "./components/useToken";
import Login from "./Login"
import './tasksview.css'
import { useState, useEffect } from 'react';

const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

const TasksView = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const { token, setToken } = useToken();
  
  useEffect(() => {
    GetTasks();
  }, [])

  const GetTasks = () => {
    fetch(API_BASE + "api/tasks/")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error: ", err))
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
      <div className="tasks-container">
      {tasks.map((task) => (
        <a>
          <div className="task-container">
            <h1>{task.task_title}</h1>
            <p>{task.task_description}</p>
          </div>
        </a>
      ))}
      </div>
    </div>
  )
};

export default TasksView;