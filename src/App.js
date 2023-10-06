import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/login/adminLogin";
import Nav from "./components/nav/nav";
import Home from "./components/home/home";
import JobApplications from "./components/JobApplications/JobApplications";
import { createContext, useReducer } from 'react';
import { initialState, reducer } from "./components/reducer";
import Register from './components/register/register.js';
import CandidateHome from "./components/candidateHome/candidateHome";
import Listing from "./components/jobListing/Listing";
import Job from "./components/job/job";

export const AdminContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  if ("AdminToken" in sessionStorage) {
    //Do nothing
  } else {
    sessionStorage.setItem("AdminToken", JSON.stringify([]));
  }
  return (
    <>
     <AdminContext.Provider value={{state, dispatch}}>
    <Nav />
      <Routes>
          <Route path="/" element={<AdminLogin />} exact />
          <Route path="/home" element={<Home />} />
          <Route path="/candidate" element={<CandidateHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/jobDetails/:id" element={<Job />} />
          <Route path="/jobApplies" element={<JobApplications />} />

      </Routes>
      </AdminContext.Provider>
    </>
  );
}

export default App;
