import React, { useState, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import './forgotpassword.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import useToken from '../utils/useToken';

const API_BASE: string = "localhost:3000/";

interface Password {
  password: string | undefined;
}

async function resetPassword(token: string | undefined, password: Password) {
  return fetch('http://localhost:8080/api/reset-password', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(password)
  })
    .then(data => data.json());
}

export default function ResetPassword() {
  const [password, setPassword] = useState<string | undefined>();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    resetPassword(token, {password: password});
  };

  return (
    <div className="login-wrapper">
      <h1>WORK3</h1>
      <p className="bold-text">Enter your new password</p>
      <form onSubmit={handleSubmit}>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your new password" type="text" required onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        </label>
        <div>
          <button className="login-submit" type="submit"><p className="bold-text">Continue</p></button>
        </div>
      </form>
    </div>
  );
}
