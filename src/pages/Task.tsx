import './task.css'
import { redirect, useParams, Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Login from './Login';
import useToken from "../utils/useToken";
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

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
  const [poster, setPoster] = useState<any[]>([])
  const [solver, setSolver] = useState<any[]>([]);
  const [taskName, setTaskName] = useState<string>("");
  const [taskDesc, setTaskDesc] = useState<string>("");
  const [taskPrice, setTaskPrice] = useState<number>(-1);
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [taskExists, setTaskExists] = useState<boolean>(false)
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
  }, [token]);

  if (!token) {
    return <Login setToken={(token) => setToken({ token })} />;
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
        setTaskName(data.task_name);
        setTaskDesc(data.task_desc);
        setTaskPrice(data.task_price);
        setIsOwner(data.is_owner);
        setTaskExists(true);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }
  };

  return (
    <div className="full-task-container">
      <Navbar token={token} handleLogout={handleLogout}/>
      <div className="full-task-spacer" />
      <div className="full-task-block">
        <div className="full-task-head">
          <h1 className="full-task-title">{taskName}</h1>
          {(/*!isOwner && !*/(solver.length > 0) ? 
            <button className="bold-text full-task-claim-button" onClick={handleClaim}>Claim Task</button>
          : <></>)}
          {(isOwner && !solver ? 
            <div className="edit-task-button">Edit Task</div>
          : <></>)}
          {(solver ?
              <button className="edit-task-button" onClick={handleApprove}>Approve</button>
            : <></>)}
        </div>
        <div className="task-price-container">
          <p>{`$${(Math.round(taskPrice * 100) / 100).toFixed(2)}`}</p>
        </div>
        {(poster.length > 0 ? 
          <div className="username-cont">
            {"Posted by: "}
            <p className="username">{poster[0].username}</p>
          </div>: <p>Poster not found</p>)}
        {(solver.length > 0 ? 
        <div className="username-cont">
          {"Being solved by: "} 
          <p className="username">{solver[0].username}</p>
        </div>: <></>)}
        <div className="description-container">
          <p className="description-title">Description</p>
          <p>{taskDesc}</p>
        </div>
        <div style={{"height": "20px"}}></div>
      </div>

    </div>
  )
}
  