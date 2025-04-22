import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Editor from "./components/Editor";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Presentation from "./components/Presentation";
import 'antd/dist/reset.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/dashboard" element={<Presentation />} />
        </Routes>
      </Router>
    </Provider>
  )
};
export default App;
