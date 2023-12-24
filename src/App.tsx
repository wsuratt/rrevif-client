import React from 'react';
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tasks from './pages/Tasks';
import Task from './pages/Task';

import Login from './pages/Login';
import useToken from "./utils/useToken";
import Signup from './pages/Signup';
import About from './pages/About';


const App = () => {
    const { token, setToken } = useToken();

    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login setToken={(token) => setToken({ token })} />} />
            <Route path="/sign-up" element={<Signup setToken={(token) => setToken({ token })} />} />
            <Route path="/tasks" element={<Tasks />} />
            {/* <Route path="/tasks/:title" element={<Task />} /> */}
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
};

export default App;
