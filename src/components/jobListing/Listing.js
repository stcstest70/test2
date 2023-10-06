import React, {useState, useEffect, useContext} from 'react';
import '../home/home.css';
import { AdminContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

const Listing = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AdminContext);
    const [modalState, setModalState] = useState("close");
    const handleShowModalOne = () => {
      setModalState("modal-one")
    }
  //   const handleShowModalTwo = () => {
  //     setModalState("modal-two")
  //   }
    const handleClose = () => {
      setModalState("close");
    }
    const [data, setData] = useState();
    const [data1, setData1] = useState();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const CheckTokenValid = async () => {
        const token = sessionStorage.getItem('AdminToken');
        const res = await fetch('https://test-api-wr81.onrender.com/checkAdminTokenValid', {
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
  const getData = async () => {
    try {
      const res = await fetch('https://test-api-wr81.onrender.com/getJobCategory', {
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
  };
  const getData1 = async () => {
    try {
      const res = await fetch('https://test-api-wr81.onrender.com/getJobType', {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // Set the content type to JSON
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setData1(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [data2, setData2] = useState();
  const getListingData = async () => {
    try {
      const res = await fetch('https://test-api-wr81.onrender.com/getListing', {
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

  useEffect(() => {
    getData();
    getData1();
    getListingData();
  }, []); 
  // console.log(data2);
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [tags, setTags] = useState('');
  const [skills, setSkills] = useState('');
  const [exp, setExp] = useState('');
  const [des, setDes] = useState('');
  const [salary, setSalary] = useState('');

  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const removeKeyValuePair = (index) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs.splice(index, 1);
    setKeyValuePairs(updatedPairs);
  };

  const handleKeyChange = (index, event) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index].key = event.target.value;
    setKeyValuePairs(updatedPairs);
  };

  const handleValueChange = (index, event) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index].value = event.target.value;
    setKeyValuePairs(updatedPairs);
  };

  const handleSubmit = async ()=>{
    if(!selectedCategory || !selectedType || !title || !detail || !tags || !skills || !exp || !des || !salary || !keyValuePairs){
      window.alert("Please Enter all fields");
    }
    else{
      try {
        const newData = {
          category:selectedCategory,
          type:selectedType,
          title:title,
          details:detail,
          tags:tags,
          skills:skills,
          experience:exp,
          description:des,
          salary:salary,
          keyValues:keyValuePairs
        }
        console.log(newData);

        const res = await fetch('https://test-api-wr81.onrender.com/addListing',{
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            newData
          })
        });
        if(res.status === 201){
          window.alert("Listing added successfully");
          handleClose();
          getListingData();
        }
        else if(res.status === 400){
          window.alert("Internal server error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className='home_container'>
         <div className="home_top">
        <h4>Enter Job Listing </h4>  <Button variant="primary" onClick={handleShowModalOne}>Add</Button>
      </div>
         <Modal
        show={modalState === "modal-one"} onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Job Listings </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select Job Category</option>
        {data ? data.map((category) => (
          <option key={category._id} value={category.category}>
            {category.category}
          </option>
        )) : <div>Loading...</div>}
        </select>
        <br/>
        <select id="type" value={selectedType} onChange={handleTypeChange}>
        <option value="">Select Job Type</option>
        {data1 ? data1.map((category) => (
          <option key={category._id} value={category.type}>
            {category.type}
          </option>
        )) : <div>Loading...</div>}
        
        
      </select>
      <br/>
        <input
            type="text"
            name="name"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder='Enter Job Title'
          /><br />
          <input
            type="text"
            name="level"
            value={detail}
            onChange={(e)=>setDetail(e.target.value)}
            placeholder='Enter Company Details'
          /><br />
          <input
            type="text"
            name="name"
            value={tags}
            onChange={(e)=>setTags(e.target.value)}
            placeholder='Enter Tags'
          /><br />
          <input
            type="text"
            name="level"
            value={skills}
            onChange={(e)=>setSkills(e.target.value)}
            placeholder='Enter Skills required'
          /><br />
          <input
            type="text"
            name="name"
            value={exp}
            onChange={(e)=>setExp(e.target.value)}
            placeholder='Enter Experience Required'
          /><br />
          <input
            type="text"
            name="level"
            value={des}
            onChange={(e)=>setDes(e.target.value)}
            placeholder='Enter Description'
          /><br />
          <input
            type="text"
            name="level"
            value={salary}
            onChange={(e)=>setSalary(e.target.value)}
            placeholder='Enter Salary'
          /><br />
          
          
          <div>
      <Button onClick={addKeyValuePair} variant="info">Add Key-Value Pair</Button>
      {keyValuePairs.map((pair, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Key"
            value={pair.key}
            onChange={(event) => handleKeyChange(index, event)}
          />
          <input
            type="text"
            placeholder="Value"
            value={pair.value}
            onChange={(event) => handleValueChange(index, event)}
          />
          <Button onClick={() => removeKeyValuePair(index)} variant="info">Remove</Button>
        </div>
      ))}
      <div>
        <strong>Key-Value Pairs:</strong>
        <ul>
          {keyValuePairs.map((pair, index) => (
            <li key={index}>
              {pair.key}: {pair.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
          
          <div className="btns">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>Submit</Button>
          </div>


        </Modal.Body>
      </Modal>

      <div className='tablecontainer table table-responsive'>
          <table className='content-table tableC'>
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Job Category</th>
                <th>Job Type</th>
                <th>Title</th>
                <th>Company Details</th>
                <th>Tags</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Description</th>
                <th>Salary</th>
                <th>Other Data</th>
              </tr>
            </thead>
            {data2 ? (<tbody>
              {data2.map((item, index) => (
                 <tr key={index}>
                    <td>{index + 1}</td>
                  <td>{item.category}</td>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>{item.details}</td>
                  <td>{item.tags}</td>
                  <td>{item.skills}</td>
                  <td>{item.experience}</td>
                  <td>{item.description}</td>
                  <td>{item.salary}</td>
                  <td><ul>
                    {item.keyValues.map((keyValue, index) => (
                      <li key={index}>
                        <strong>{keyValue.key}:</strong> {keyValue.value}
                      </li>
                    ))}
      </ul></td>
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
  )
}

export default Listing