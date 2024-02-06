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
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [taskExists, setTaskExists] = useState<boolean>(false)
  const [ popup, setPopup ] = useState<boolean>(false);
  const [ notreviewed, setNotReviewed ] = useState<boolean>(true);
  const [ approve_popup, setApprovePopup ] = useState<boolean>(false);
  const { token, setToken } = useToken();
  const [ workTask, setWorkTask ] = useState<boolean>(false);
  const [taskGeneration, setTaskGeneration] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("task effect")
    GetTaskInfo();
  }, [token]);

  const handleClaim = async (e: FormEvent) => {
    e.preventDefault();
    
    const updatedTask = await updateTaskSolver(token, {
      task_id
    });

    if(updatedTask.error) {
      alert(updatedTask.error);
    }
    GetTaskInfo();
  };

  const handleApprove = async (e: FormEvent) => {
    setApprovePopup(false);
    e.preventDefault();
    
    const approvedTask = await approveTask(token, {
      task_id
    });

    if(approvedTask.error) {
      alert(approvedTask.error);
    }
    GetTaskInfo();
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
    GetTaskInfo();
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
    GetTaskInfo();
  }


  if (!token) {
    return <Login />;
  }

  const GetTaskInfo = () => { // need to check for 403
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
        setPoster(data.poster);
        setSolver(data.solver);
        setTask(data.task)
        setIsPoster(data.is_owner);
        setIsSolver(data.is_solver);
        setTaskExists(true);
        setIsAdmin(data.is_admin);
        if(data.poster[0]?.length > 0) {
          setTaskExists(true)
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }
  };

  const deleteTask = () => {
    if(token) {
      fetch(API_BASE +  "api/task/delete" + task[0].id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    }
    setTaskExists(false)
  }

  return (
    <div className="full-task-container">
      <Navbar />
      { taskExists ?
      <>
      <div className="full-task-block">
        <div className="full-task-head">
          <h1 className="full-task-title">{task[0]?.task_title}</h1>
          {(!isPoster && !(solver.length > 0) ? 
            <button className="bold-text full-task-claim-button" onClick={handleClaim}>Accept Task</button>
          : <></>)}
          {(isPoster && !(solver.length > 0) ? 
            <div className="edit-task-button" onClick={e => setPopup(true)}>Edit Task</div>
          : <></>)}
          {(isSolver ? // isSolver
            <div className="edit-task-button" onClick={e => setWorkTask(true)}>Save</div>
          : <></>)}
          {(isSolver ? // isSolver
            <div className="edit-task-button" onClick={e => setWorkTask(true)}>Mark as Done</div>
          : <></>)}
          {((isPoster && solver.length > 0) && !(task[0]?.is_complete) ?
              <button className="approve-task-button" onClick={e => setApprovePopup(true)}>Approve Solution</button>
            : <></>)}
            {(isAdmin ? 
              <div onClick={e => deleteTask()} className="delete-task">Delete Task</div>: <></>
            )}
        </div>
        <div className="task-price-container">
          {`$${(Math.round(task[0]?.task_price * 100) / 100).toFixed(2)}`}
        </div>
        <div className="task-timestamp-container">
          Posted: <p className="username">{`${(new Date(task[0]?.task_timestamp))?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}</p>
        </div>
        {(poster.length > 0 ? 
          <div className="username-cont">
            {"Poster: "}
            <Link to={'/profile/' + poster[0]?.username}><p className="username">{poster[0]?.username}</p></Link>
            {(isPoster || isSolver ? 
            <p className="username email">{`: ${poster[0]?.email}`}</p>: <></>)}
          </div>: <p>Poster not found</p>)}
        {(solver.length > 0 ? 
        <div className="username-cont">
          {"Solver: "} 
          <Link to={'/profile/' + solver[0]?.username}><p className="username">{solver[0]?.username}</p></Link>
          {(isPoster || isSolver ? 
            <p className="username email">{`: ${solver[0]?.email}`}</p>: <></>)}
        </div>: <></>)}
        <div className="description-container">
          <p className="description-title">Description</p>
          <p>{task[0]?.task_description}</p>
        </div>
        <div className="description-container">
          <p className="description-title">AI Generation</p>
          {isSolver ? (
            <form>
                <textarea required className="task-generation-input" value={task[0]?.task_generation} rows={10} cols={60} />
            </form>
          ) : ( <p>{task[0]?.task_generation}</p> )}
        </div>
        <div style={{"height": "20px"}}></div>
      </div>
      {notreviewed && (task[0]?.is_complete && isPoster && !(task[0]?.solver_review_complete)) ?
        <Review token={token} setNotReviewed={setNotReviewed} reviewee={solver} review_type='solver' task_id={task_id}/>
        : <></>
      }
      {notreviewed && (task[0]?.is_complete && isSolver && !(task[0]?.poster_review_complete)) ?
        <Review token={token} setNotReviewed={setNotReviewed} reviewee={poster} review_type='poster' task_id={task_id} />
        : <></>
      }
      {popup ? 
        <EditTask token={token} getTaskInfo={GetTaskInfo} setPopup={setPopup} task={task} />
      : <></>}
      {approve_popup ? 
      <>
        <div className="profile-dimmed"></div>
        <div className="approve-container">
          <div className="approve-confirm-text">
            Are you sure you would like to accept this solution? 
            If you approve this task, you will be accepting this 
            project as complete, and the payment to the solver 
            will be processed.  Only approve the payment and solution
            if both you and the solver have come to a consensus.
          </div>
          <div className="buttons-container">
            <button className="approve-task-button approve-task-button-inner" onClick={handleApprove}>Approve Solution</button>
            <div className="cancel-approve edit-task-button" onClick={e => setApprovePopup(false)}>Cancel</div>
          </div>
        </div>
      </>: 
      <></>
      }
      </>
      : <h1>This task does not exist.</h1>}
    </div>
  )
}
  