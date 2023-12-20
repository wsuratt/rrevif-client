import React, { useState, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';
import Navbar from './components/Navbar';
import './login.css'

const API_BASE: string = "localhost:3000/"

interface Credentials {
  username: string | undefined;
  password: string | undefined;
}

async function loginUser(credentials: Credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
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

export default function Login({ setToken }: LoginProps) {
  const [username, setUserName] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  };

  return (
    <div className="login-wrapper">
      <h1>rrevif</h1>
      <p className="bold-text">Log in to continue</p>
      <form onSubmit={handleSubmit}>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your email" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
        </label>
        <label className="login-label">
          <input className="login-input" placeholder="Enter your password" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
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
      <a href={API_BASE}><p className="login-create">Create an account</p></a>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
