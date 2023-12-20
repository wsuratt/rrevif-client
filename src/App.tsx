import React from 'react';
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import useToken from "./utils/useToken";

const App = () => {
    const { token, setToken } = useToken();

    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login setToken={(token) => setToken({ token })} />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
};

export default App;
