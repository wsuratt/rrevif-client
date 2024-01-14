import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './addtask.css'
import './review.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const API_BASE: string = "http://localhost:8080/";

interface EditProfileProps {
  token: string | null;
  setEditPopup: (arg0: boolean) => void;
  getUserInfo: () => void;
  user: User;
} 

interface User {
  username: string;
  wallet_address: string;
  bio: string;
  links: any[]
}

interface EditedProfile {
  wallet_address: string;
  bio: string;
  linkUrl: string,
  linkdisplay: string
}

async function editProfile(token: string | null, username: string, edited_profile: EditedProfile) {
  if(token) {
    return fetch(API_BASE + "api/profile/edit" + username, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(edited_profile)
    })
      .then(data => data.json())
  }
}

export default function EditProfile({ token, getUserInfo, setEditPopup, user }: EditProfileProps) {
  const [username, setUsername] = useState<string>(user.username);
  const [wallet_address, setWalletAddress] = useState<string>(user.wallet_address);
  const [bio, setBio] = useState<string>(user.bio);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [linkdisplay, setLinkDisplay] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEditPopup(false);
    const editedProfile = await editProfile(token, username, {
      wallet_address, 
      bio,
      linkUrl,
      linkdisplay
    });
    if(editedProfile.error) {
      alert(editedProfile.error);
    }
    getUserInfo();
  };

  return (
    <>
      <div className="profile-dimmed" />
      <div className="add-task-wrapper">
        <div>
          <p className="bold-text">{`Edit Profile`}</p>
        </div>
        <button className="x-button" onClick={e => setEditPopup(false)}><FontAwesomeIcon className='button-icon' icon={faXmark}/></button>
        <form onSubmit={handleSubmit}>
          <label className='add-task-label'>
            {"Wallet: "}
            <input required className="add-task-input wallet-add" placeholder="Enter wallet address" value={wallet_address} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setWalletAddress(e.target.value)} />
          </label>
          <label className='add-task-label'>
            {"Bio: "}
            <input required className="add-task-input bio-add" placeholder='Enter bio' value={bio} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}/>
          </label>
          <label className='add-task-label'>
            <div className="link-input-container">
              <p className="link-text">Link URL:</p>
              <input className="link-input url" placeholder='Enter link url' type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}/>
            </div>
            <div className="link-input-container">
              <p className="link-text">Link display:</p>
              <input className="link-input display" placeholder='Enter link display' type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkDisplay(e.target.value)}/>
            </div>
          </label>
          <div>
            <button className="add-task-submit" type="submit"><p className="bold-text">Submit Changes</p></button>
          </div>
        </form>
      </div>
    </>
  )
}
