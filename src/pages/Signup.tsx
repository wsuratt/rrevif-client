import React, { useState, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import './login.css'
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'

const CLIENT_BASE: string = "localhost:3000/";
const SERVER_BASE: string = "localhost:8080/";

interface Credentials {
  username: string | undefined;
  password_hash: string | undefined;
  email: string | undefined;
  wallet_address: string | undefined;
}

async function signupUser(credentials: Credentials) {
  return fetch('http://localhost:8080/api/signup', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json());
}

interface LoginProps {
  setToken: (token: string) => void;
}

export default function Signup({ setToken }: LoginProps) {
  const [username, setUserName] = useState<string | undefined>();
  const [password_hash, setPassword] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [wallet_address, setWallet] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    console.log("submission")
    e.preventDefault();
    const token = await signupUser({
      username,
      password_hash,
      email,
      wallet_address
    });

    if(token.error) {
      alert(token.error);
      return;
    }

    setToken(token);
    navigate("/");
  };

  return (
    <div className="login-wrapper">
      <h1>rrevif</h1>
      <p className="bold-text">Sign up to continue</p>
      <form onSubmit={handleSubmit}>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your email" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
        </label>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your username" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} required />
        </label>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your password" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(bcrypt.hashSync(e.target.value, 10))} required />
        </label>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your wallet address" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setWallet(e.target.value)} required />
        </label>
        <div>
          <button className="login-submit" type="submit"><p className="bold-text">Continue</p></button>
        </div>
        <p className="bold-text grey-text">Or continue with:</p>
        <div>
          <button className="google-button">
            <span className="google-span">
            <img className="google-img" src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.522/google-logo.5867462c.svg" alt="" />
            <p className="g-text">Google</p>
            </span>
          </button>
        </div>
      </form>
      <p>Already have an account?</p>
      <Link to="/login/"><p className="login-create">Log in</p></Link>
    </div>
  );
}

Signup.propTypes = {
  setToken: PropTypes.func.isRequired
};
