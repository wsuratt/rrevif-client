import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import './profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate, useParams } from 'react-router-dom';
import useToken from "../utils/useToken";
import Task from './Task';
import TaskCard from '../components/TaskCard';
import AddTask from '../components/AddTask';
import Login from './Login';
import EditProfile from '../components/EditProfile';

const CLIENT_BASE: string = "localhost:3000/";
const API_BASE: string = "http://localhost:8080/";

interface LoginProps {
  setToken: (token: string) => void;
}

export default function Profile() {
  const { username } = useParams<string>();
  const [name, setName] = useState<string>("")
  const [accepted, setAccepted] = useState<any[]>([]);
  const [posted, setPosted] = useState<any[]>([]);
  const [posterRating, setPosterRating] = useState<any[]>([]);
  const [solverRating, setSolverRating] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [bio, setBio] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isUser, setIsUser] = useState<boolean>(false);
  const { token, setToken } = useToken();
  const [popupActive, setPopupActive] = useState(false);
  const [ edit_popup, setEditPopup ] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    GetUserInfo();
    if(username != undefined) {
        setName(username)
      }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});

    navigate("/");
  };

  const switchPopup = () => {
    setPopupActive(!popupActive);
  }


  const DeleteLink = (link_id: string) => {
    if(token) {
      fetch(API_BASE +  "api/link/delete" + link_id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    }
  }

  const GetUserInfo = () => {
    // refactor to use User objects
    if (token) {
      fetch(API_BASE + "api/profile" + username, {
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
          setPosted([...data.postedTasks]);
          setAccepted([...data.tasksToSolve]);
          setPosterRating([...data.posterRating]);
          setSolverRating([...data.solverRating]);
          setWalletAddress(data.walletAddress);
          setBio(data.bio);
          setLinks([...data.links]);
          setIsUser(data.isUser)
        })
        .catch(err => console.error("Error: ", err))
    }
  }

  if (!token) {
    return <Login />;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-block">
        <div className="profile-head">
          <h1 className="profile-title">{username}</h1>
          <div className="add-button" onClick={() => setPopupActive(true)}>Create Task</div>
          { isUser ? 
            <div className="edit-profile-button" onClick={e => setEditPopup(true)}>Edit Profile</div>
          : <></>}
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
                <div className="link-inner-container">
                  <a key={i} href={`https://${link.link_url}`} target="_blank" className="profile-link-display">{link.link_display}</a>
                  {isUser ? <FontAwesomeIcon onClick={e => DeleteLink(link.link_id)} icon={faXmark} className="font-x" />: <></>}
                </div>
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
    </div>: <h3 className='task-title'>This user has not posted any tasks.</h3>)}
      <h1 className='task-title'>Accepted Tasks:</h1>
      {(accepted?.length > 0 ? 
      <div className="accepted-task-container">
      {accepted.map((task, index) => (
        <TaskCard token={token} key={index} task={task} />
      ))}
    </div>: <h3 className='task-title'>This user has not accepted any tasks.</h3>)}
    {edit_popup ? <EditProfile token={token} setEditPopup={setEditPopup} user={{username: name, wallet_address: walletAddress, bio: bio, links: links}} />: <></>}
    </div>
  )
}
