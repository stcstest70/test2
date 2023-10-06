import React, {useEffect, useContext} from 'react'
import './nav.css'
import { useNavigate } from "react-router-dom";
import { AdminContext } from '../../App';

const Nav = () => {


  const { state, dispatch } = useContext(AdminContext);
  const navigate = useNavigate();

  const nav1=()=>{
    navigate('/');
  }
  const nav2=()=>{
    navigate('/register');
  }
  const nav3=()=>{
    sessionStorage.removeItem("AdminToken");
        sessionStorage.setItem("AdminToken", JSON.stringify([]));
        dispatch({type:"ADMIN", payload:false});
        navigate('/');
  }
  const nav4=()=>{
    navigate('/home');
  }
  const nav5=()=>{
    navigate('/listing');
  }
  const nav6=()=>{
    navigate('/jobApplies');
  }

  const NavLinks = ()=>{
    if(state){
      return (<div className='nav_links'>
        <span onClick={nav6}>Applies</span><span onClick={nav4}>Category</span><span onClick={nav5}>Listings</span>  <span onClick={nav3}>Logout</span> 
        </div>)
    }else{
      return (<div className='nav_links'><span onClick={nav1}>Login</span>  <span onClick={nav2}>Register</span></div>);
    }
  }
  return (
    <div className='nav_container'>
        <div className='nav_logo'>
            <span>LOGO</span>
        </div>
        {/* <div>
        <span>Login</span>
        <span>Register</span>
        </div> */}
        
        <NavLinks />
    </div>
  )
}

export default Nav