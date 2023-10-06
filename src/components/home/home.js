import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import './home.css'

const Home = () => {

  const { state, dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem('AdminToken');
    const res = await fetch('http://localhost:5000/checkAdminTokenValid', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      const { decoded } = data;
      dispatch({ type: "ADMIN", payload: true });
      //   console.log(decoded);
    }
    else if (res.status === 401) {
      navigate('/');
    }
  }
  useEffect(() => {
    CheckTokenValid();
  }, []);

  const [modalState, setModalState] = useState("close");
  const handleShowModalOne = () => {
    setModalState("modal-one")
  }
  const handleShowModalTwo = () => {
    setModalState("modal-two")
  }
  const handleClose = () => {
    setModalState("close");
  }

  const [cat, setCat] = useState('');
  const [type, setType] = useState('');

  const [loading, setLoading] = useState(true);

  const handleSubmit1 = async () => {
    try {
      const res = await fetch('http://localhost:5000/addJobCategory', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cat
        })
      });
      if (res.status === 201) {
        window.alert('Job Category added successfully');
        getData();
        setModalState("close");
      } else {
        window.alert('Internal server error');
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleSubmit2 = async () => {
    try {
      const res = await fetch('http://localhost:5000/addJobType', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type
        })
      });
      if (res.status === 201) {
        window.alert('Job Type added successfully');
        getData2();
        setModalState("close");
      } else {
        window.alert('Internal server error');
      }
    } catch (error) {
      console.log(error);
    }
  }
  const [data, setData] = useState();
  const [data2, setData2] = useState();
  const getData = async () => {
    try {
      const res = await fetch('http://localhost:5000/getJobCategory', {
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

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getData2 = async () => {
    try {
      const res = await fetch('http://localhost:5000/getJobType', {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // Set the content type to JSON
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setData2(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  //   console.log(data);
  useEffect(() => {
    getData();
    getData2();
  }, []);
  return (
    <div className='home_container'>
      <div className="home_top">
        <h4>Add Job Category and Type </h4> <div className="addbtns"><Button variant="primary" onClick={handleShowModalOne}>Add Category</Button>
        <Button variant="primary" onClick={handleShowModalTwo}>Add Type</Button>
          </div>  
      </div>
      <Modal
        show={modalState === "modal-one"} onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Job Category </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            name="name"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            placeholder='Enter Job Category'
          /><br />

          <div className="btns">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit1}>Submit</Button>
          </div>


        </Modal.Body>
      </Modal>
      <Modal
        show={modalState === "modal-two"} onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Job Type </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <input
            type="text"
            name="level"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder='Enter Job Type'
          /><br />
          <div className="btns">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit2}>Submit</Button>
          </div>


        </Modal.Body>
      </Modal>

      <div className="tables">
        <div className='tablecontainer table table-responsive'>
          <table className='content-table tableC'>
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Job Category</th>
              </tr>
            </thead>
            {data ? (<tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>) : (<tbody>
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            </tbody>)}


          </table>

        </div>
        <div className='tablecontainer table table-responsive'>
          <table className='content-table tableC'>
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Job Type</th>
              </tr>
            </thead>
            {data2 ? (<tbody>
              {data2.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>) : (<tbody>
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            </tbody>)}


          </table>

        </div>
      </div>

    </div>
  )
}

export default Home