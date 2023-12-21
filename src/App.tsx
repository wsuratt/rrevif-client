import React from 'react';
import Home from './Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import useToken from "./components/useToken";
import TasksView from './TasksView';

const App = () => {
    const { token, setToken } = useToken();

    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login setToken={(token) => setToken({ token })} />} />
            <Route path="/tasks-view" element={<TasksView />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
};

export default App;
