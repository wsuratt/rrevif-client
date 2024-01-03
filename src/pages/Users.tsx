import React, { useEffect, useState } from 'react';
import useToken from '../utils/useToken';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface User {
  username: string;
  email: string;
  wallet_address: string;
  registration_timestamp: string;
}

interface UserTableProps {
  users: User[];
}

const API_BASE: string = "http://localhost:8080/";

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Wallet</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.username}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.wallet_address}</td>
            <td>{user.registration_timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Users = () => {
  const { token, setToken } = useToken();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken({token: null});

    navigate("/");
  };

  useEffect(() => {
    GetUsers();
  }, [])

  const GetUsers = () => {
    if(token) {
      fetch(API_BASE + "api/users/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error: ", err))
    }
  }

  return (
    <div>
      <Navbar token={token} handleLogout={handleLogout} />
      <h1>User Table</h1>
      <UserTable users={users} />
    </div>
  );
};

export default Users;
