import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import {Provider} from 'react-redux'
import {store} from './redux/store'
import Editor from "./components/Editor";


import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register"
import Presentation from "./components/Presentation";

const App = () => {
  
  return(
  <Provider store={store}>
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/presentation" element={<Presentation/>}/>
      <Route path="/editor" element={<Editor/>}/>
      </Routes>
    </Router>
    
    </Provider>
  // <LandingPage/>
  // <Login/>
  // <Register/>
    // <Router>
    //     <Routes>
    //       <Route path="/" element={<LandingPage />} />
    //       <Route path="/register" element={< />} />

    //       <Route element={<PrivateRoute />}>
    //         <Route path="/dashboard" element={<Dashboard />} />
    //       </Route>
    //     </Routes>
    // </Router>
  
  )
};
export default App;
