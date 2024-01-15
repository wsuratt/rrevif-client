import React, { useState, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import './forgotpassword.css'
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../utils/useToken';

const API_BASE: string = "localhost:3000/";

interface Username {
  username: string | undefined;
}

async function forgotPassword(username: Username) {
  return fetch('http://localhost:8080/api/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(username)
  })
    .then(data => data.json());
}

export default function ForgotPassword() {
  const [username, setUserName] = useState<string | undefined>();
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    forgotPassword({username});
  };

  return (
    <div className="login-wrapper">
      <h1>WORK3</h1>
      <p className="bold-text">Enter username to reset password</p>
      <form onSubmit={handleSubmit}>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your username" type="text" required onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
        </label>
        <div>
          <button className="login-submit" type="submit"><p className="bold-text">Continue</p></button>
        </div>
      </form>
    </div>
  );
}
