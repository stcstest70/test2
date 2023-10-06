import React from 'react';
// import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';
// import { AdminContext } from '../../App';
import validator from 'validator';

const Register = () => {
    const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  // const { state, dispatch } = useContext(AdminContext);

  const navigate = useNavigate();

  const AdminLogin = async () => {
    if (!name || !password) {
      window.alert('Enter All Fields.');
    }
    else if (!validator.isEmail(name)) {
      window.alert("Enter a valid Email");
    }
    else if(password !== cpassword){
        window.alert('Password and Confirm password do not match');
    }
    else {
      try {
        
        const res = await fetch('https://test-api-wr81.onrender.com/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name, password
          })
        });
        if(res.status === 201){

          window.alert('Candidate Redistered Successfully');
          
          navigate('/home');
        }else if(res.status === 422){
          window.alert('User Already exists');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className='login_container'>
      <div className="login_form">
        <div className="login_header">
          <h2>Candidate Register</h2>
        </div>
        <div className="login_body">
          <div className="form_ele"><FontAwesomeIcon icon={faUser} /><input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Email' /></div>
          <div className="form_ele"> <FontAwesomeIcon icon={faLock} /><input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' /></div>
          <div className="form_ele"> <FontAwesomeIcon icon={faLock} /><input type="password" name="cpassword" id="cpassword" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder='Confirm Password' /></div>
          <div className="form_btns"><button  onClick={AdminLogin}>Register</button> </div>
        </div>
      </div>
    </div>
  )
}

export default Register