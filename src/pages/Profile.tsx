import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import './profile.css'
import { Link, useNavigate } from 'react-router-dom';
import useToken from "../utils/useToken";
import Task from './Task';
import TaskCard from '../components/TaskCard';
import AddTask from '../components/AddTask';

const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

interface LoginProps {
  setToken: (token: string) => void;
}

export default function Profile() {
  const [username, setUserName] = useState<string | undefined>();
  const [accepted, setAccepted] = useState<any[]>([]);
  const [posted, setPosted] = useState<any[]>([]);
  const { token, setToken } = useToken();
  const [popupActive, setPopupActive] = useState(false)

  useEffect(() => {
    GetUserInfo();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});
  };

  const switchPopup = () => {
    setPopupActive(!popupActive);
  }

  const GetUserInfo = () => {
    if (token) {
      fetch(API_BASE + "api/profile/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Response data:", data);
          setUserName(data.username);
          setPosted([...data.postedTasks]);
            // Handle the case where postedTasks is not an array
        })
        .catch(err => console.error("Error: ", err))
    }
  }

  return (
    <div className="profile-container">
      <Navbar token={token} handleLogout={handleLogout}/>
      <div className="profile-spacer" />
      <div className="profile-head">
        <h1 className="profile-title">{`${username}'s profile`}</h1>
        {!popupActive ? (
          <div className="add-button" onClick={() => setPopupActive(true)}>Create Task</div>
        ): ''}
      </div>
      {popupActive ? (
        <>
          <div className="profile-dimmed"/>
          <AddTask token={token} switchPopup={() => switchPopup()} />
        </>
      ) : ''}
      <h1 className='task-title'>Posted Tasks:</h1>
      {(posted.length > 0 ? 
      <div className="posted-task-container">
      {posted.map((task, index) => (
        <TaskCard token={token} key={index} task={task} />
      ))}
    </div>: <h3 className='task-title'>You have not posted any tasks.</h3>)}
      <h1 className='task-title'>Accepted Tasks:</h1>
      {(accepted.length > 0 ? 
      <div className="accepted-task-container">
      {accepted.map((task, index) => (
        <TaskCard token={token} key={index} task={task} />
      ))}
    </div>: <h3 className='task-title'>You have not accepted any tasks.</h3>)}
      
    </div>
  )
}
