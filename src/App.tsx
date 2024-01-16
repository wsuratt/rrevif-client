import React from 'react';
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tasks from './pages/Tasks';
import Task from './pages/Task';

import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import Users from './pages/Users';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


const App = () => {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/tasks" element={<Tasks />} />
            {/* <Route path="/tasks/:title" element={<Task />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/task/:task_id" element={<Task />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
};

export default App;
