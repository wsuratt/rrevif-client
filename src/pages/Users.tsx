import React, { useEffect, useState } from 'react';
import useToken from '../utils/useToken';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './users.css'

interface User {
  username: string;
  user_id: string;
  email: string;
  wallet_address: string;
  registration_timestamp: string;
}

interface UserTableProps {
  users: User[];
  deleteUser: (user: User) => void;
}

const API_BASE: string = "http://localhost:8080/";

const UserTable: React.FC<UserTableProps> = ({ users, deleteUser }) => {
  return (
    <table className="users-table">
      <thead className="users-table-head">
        <tr>
          <th className="users-header">Username</th>
          <th className="users-header">Email</th>
          <th className="users-header">Wallet</th>
          <th className="users-header">Joined</th>
        </tr>
      </thead>
      <tbody className="users-table-body">
        {users.map((user) => (
          <>
            <tr className="users-table-row" key={user.username}>
              <td className="users-table-data">{user.username}</td>
              <td className="users-table-data">{user.email}</td>
              <td className="users-table-data">{user.wallet_address}</td>
              <td className="users-table-data">{user.registration_timestamp}</td>
              <td><div onClick={e => deleteUser(user)} className="delete-user">Delete</div></td>
            </tr>
          </>
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

  const DeleteUser = (user: User) => {
    if(token) {
      fetch(API_BASE +  "api/user/delete" + user.user_id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    }
  }  
  
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
        .then(data => {
          console.log(data)
          setUsers(data)})
        .catch(err => console.error("Error: ", err))
    }
  }

  return (
    <div className="users-container">
      <Navbar />
      <div className="user-table-container">
        <h1 className="table-title">Users</h1>
        <UserTable users={users} deleteUser={DeleteUser} />
      </div>
    </div>
  );
};

export default Users;
