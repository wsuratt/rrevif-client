import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import './profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom';
import useToken from "../utils/useToken";
import Task from './Task';
import TaskCard from '../components/TaskCard';
import AddTask from '../components/AddTask';
import Login from './Login';

const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

interface LoginProps {
  setToken: (token: string) => void;
}

export default function Profile() {
  const [username, setUserName] = useState<string | undefined>();
  const [accepted, setAccepted] = useState<any[]>([]);
  const [posted, setPosted] = useState<any[]>([]);
  const [posterRating, setPosterRating] = useState<any[]>([]);
  const [solverRating, setSolverRating] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [bio, setBio] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const { token, setToken } = useToken();
  const [popupActive, setPopupActive] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    GetUserInfo();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});

    navigate("/");
  };

  const switchPopup = () => {
    setPopupActive(!popupActive);
  }

  const GetUserInfo = () => {
    // refactor to use User objects
    if (token) {
      fetch(API_BASE + "api/profile/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(res => {
          if (res.status === 403) {
            handleLogout();
          }
          return res.json();
        })
        .then(data => {
          console.log(data)
          setUserName(data.username);
          setPosted([...data.postedTasks]);
          setAccepted([...data.tasksToSolve]);
          setPosterRating([...data.posterRating]);
          setSolverRating([...data.solverRating]);
          setWalletAddress(data.walletAddress);
          setBio(data.bio);
          setLinks([...data.links]);
        })
        .catch(err => console.error("Error: ", err))
    }
  }

  if (!token) {
    return <Login setToken={(token) => setToken({ token })} />;
  }

  return (
    <div className="profile-container">
      <Navbar token={token} handleLogout={handleLogout}/>
      <div className="profile-block">
        <div className="profile-head">
          <h1 className="profile-title">{username}</h1>
          <div className="add-button" onClick={() => setPopupActive(true)}>Create Task</div>
          <div className="edit-profile-button">Edit Profile</div>
        </div>
        {popupActive ? (
          <>
            <div className="profile-dimmed"/>
            <AddTask token={token} switchPopup={() => switchPopup()} />
          </>
        ) : ''}
        <div className="bio-container">
          <p className="review-title">Bio</p>
        {bio?.length > 0 ? (
          <p>{bio}</p>
        ): <p>No bio yet!</p>}
        </div>
        <div className="profile-item-container">
          <p className="review-title">Ratings</p>
          <div className="review-block">
            <p className="review-words">{`Poster:`}</p>
            <FontAwesomeIcon className="review-star" icon={faStar} />
            {posterRating?.length > 0 ? (
              <p className="review-words">{(Math.round(posterRating.reduce((a, b) => (a.rating)*1 + (b.rating)*1) / (posterRating?.length) * 100) / 100).toFixed(2)}</p>
            ): <p className="review-words">No ratings</p>}
          </div>
          <div className="review-block">
            <p className="review-words">{`Solver:`}</p>
            <FontAwesomeIcon className="review-star" icon={faStar} />
            {solverRating?.length > 0 ? (
              <p className="review-words">{(Math.round(solverRating.reduce((a, b) => (a.rating)*1 + (b.rating)*1) / (solverRating?.length) * 100) / 100).toFixed(2)}</p>
            ): <p className="review-words">No ratings</p>}
          </div>
        </div>
        <div className="profile-item-container">
          <p className="review-title">Wallet Adress</p>
          <div className="hidden">
            <p className="wallet-address">{walletAddress}</p>
          </div>
        </div>
        <div className="profile-item-container">
          <p className="review-title">Links</p>
          <div className="link-container">
              {links.map((link, i)=> (
                <a key={i} href={`https://${link.link_url}`} target="_blank" className="profile-link-display">{link.link_display}</a>
              ))}
          </div>
        </div>
        <div style={{"height": "20px"}}></div>
      </div>
      <h1 className='task-title'>Posted Tasks:</h1>
      {(posted?.length > 0 ? 
      <div className="posted-task-container">
      {posted.map((task, index) => (
        <TaskCard token={token} key={index} task={task} />
      ))}
    </div>: <h3 className='task-title'>You have not posted any tasks.</h3>)}
      <h1 className='task-title'>Accepted Tasks:</h1>
      {(accepted?.length > 0 ? 
      <div className="accepted-task-container">
      {accepted.map((task, index) => (
        <TaskCard token={token} key={index} task={task} />
      ))}
    </div>: <h3 className='task-title'>You have not accepted any tasks.</h3>)}
      
    </div>
  )
}
