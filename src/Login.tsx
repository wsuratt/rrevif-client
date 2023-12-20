import React, { useState, ChangeEvent, FormEvent } from 'react';
import PropTypes from 'prop-types';

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
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
