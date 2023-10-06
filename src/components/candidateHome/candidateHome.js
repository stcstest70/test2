import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './candidaeHome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

const CandidateHome = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      const res = await fetch('http://localhost:5000/getListing', {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // Set the content type to JSON
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setData(data);

    } catch (error) {
      console.error('Error:', error);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="home_container">
      <h3>
        Aply Here
      </h3>
      {data ? (
        <div className="cardContainer">
          {data.map((item, index) => (
            <Link to={`/jobDetails/${item._id}`}>
            <div className="cards" key={index}>
              <div className="cardLogo">
                <img src="./img/logo.jpeg" alt="logo" />
              </div>
              <div className="cardBody">
                <h4>{item.title}</h4>
                <h5>Category : {item.category}, Job Type: {item.type}</h5>
                <h5>
                  <FontAwesomeIcon icon={faMapMarker} /> {item.details}
                </h5>
              </div>
              <div className="cardEnd">
                <FontAwesomeIcon icon={faBookmark} />
              </div>
            </div>
            </Link>
            
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}







    </div>

  )
}

export default CandidateHome