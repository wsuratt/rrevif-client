import './task.css'
import { redirect, useParams, Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Login from './Login';
import useToken from "../utils/useToken";
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Review from '../components/Review';
import EditTask from '../components/EditTask';

const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

interface LoginProps {
  setToken: (token: string) => void;
}

interface TaskId {
  task_id: string | undefined;
}


export default function Task() {
  const { task_id } = useParams();
  const [poster, setPoster] = useState<any[]>([]);
  const [solver, setSolver] = useState<any[]>([]);
  const [task, setTask] = useState<any[]>([]);
  const [isPoster, setIsPoster] = useState<boolean>(false)
  const [isSolver, setIsSolver] = useState<boolean>(false)
  const [taskExists, setTaskExists] = useState<boolean>(false)
  const [ popup, setPopup ] = useState<boolean>(false);
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  const handleClaim = async (e: FormEvent) => {
    e.preventDefault();
    
    const updatedTask = await updateTaskSolver(token, {
      task_id
    });

    if(updatedTask.error) {
      alert(updatedTask.error);

    }
  };

  const handleApprove = async (e: FormEvent) => {
    e.preventDefault();
    
    const approvedTask = await approveTask(token, {
      task_id
    });

    if(approvedTask.error) {
      alert(approvedTask.error);

    }
  };

  async function updateTaskSolver(token: string | null, task_id: TaskId) {
    console.log(task_id);
    if(token) {
      return fetch(API_BASE + "api/update-task-solver", {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task_id)
      })
        .then(data => data.json())
    }
  }

  async function approveTask(token: string | null, task_id: TaskId) {
    if(token) {
      return fetch(API_BASE + "api/approve-task", {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task_id)
      })
        .then(data => data.json())
    }
  }

  useEffect(() => {
    GetTaskInfo();
  });

  if (!token) {
    return <Login />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});
    navigate("/");
  };

  const GetTaskInfo = () => {
    if (token) {
      fetch(API_BASE + "api/task-by-id/" + task_id, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Response Data", data)
        setPoster(data.poster);
        setSolver(data.solver);
        setTask(data.task)
        setIsPoster(data.is_owner);
        setIsSolver(data.is_solver);
        setTaskExists(true);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }
  };

  return (
    <div className="full-task-container">
      <Navbar />
      <div className="full-task-block">
        <div className="full-task-head">
          <h1 className="full-task-title">{task[0]?.task_title}</h1>
          {(!isPoster && !(solver.length > 0) ? 
            <button className="bold-text full-task-claim-button" onClick={handleClaim}>Accept Task</button>
          : <></>)}
          {(isPoster && !(solver.length > 0) ? 
            <div className="edit-task-button" onClick={e => setPopup(true)}>Edit Task</div>
          : <></>)}
          {((isPoster && solver.length > 0) && !(task[0]?.is_complete) ?
              <button className="approve-task-button" onClick={handleApprove}>Approve Solution</button>
            : <></>)}
        </div>
        <div className="task-price-container">
          <p>{`$${(Math.round(task[0]?.task_price * 100) / 100).toFixed(2)}`}</p>
        </div>
        {(poster.length > 0 ? 
          <div className="username-cont">
            {"Poster: "}
            <p className="username">{poster[0]?.username}</p>
            {(isPoster || isSolver ? 
            <p className="username email">{`: ${poster[0]?.email}`}</p>: <></>)}
          </div>: <p>Poster not found</p>)}
        {(solver.length > 0 ? 
        <div className="username-cont">
          {"Solver: "} 
          <p className="username">{solver[0]?.username}</p>
          {(isPoster || isSolver ? 
            <p className="username email">{`: ${solver[0]?.email}`}</p>: <></>)}
        </div>: <></>)}
        <div className="description-container">
          <p className="description-title">Description</p>
          <p>{task[0]?.task_description}</p>
        </div>
        <div style={{"height": "20px"}}></div>
      </div>
      {task[0]?.is_complete && isPoster && !(task[0]?.solver_review_complete) ?
        <Review token={token} reviewee={solver} review_type='solver' task_id={task_id}/>
        : <></>
      }
      {task[0]?.is_complete && isSolver && !(task[0]?.poster_review_complete) ?
        <Review token={token} reviewee={poster} review_type='poster' task_id={task_id} />
        : <></>
      }
      {popup ? 
        <EditTask token={token} setPopup={setPopup} task={task} />
      : <></>}
    </div>
  )
}
  