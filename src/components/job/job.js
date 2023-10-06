import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './job.css';
import logo from './logo.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import validator from 'validator';

const Job = () => {

    const [data, setData] = useState();
    const [modalState, setModalState] = useState("close");
    const [Loading, setLoading] = useState(false);
    const handleShowModalOne = () => {
        setModalState("modal-one")
    }
    //   const handleShowModalTwo = () => {
    //     setModalState("modal-two")
    //   }
    const handleClose = () => {
        setModalState("close");
    }
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [exp, setExp] = useState('');
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');


    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleFileUpload = () => {
        if (file) {
            const storageRef = ref(storage, `Uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            }, (error) => {
                console.error('Error uploading file:', error);
            }, () => {
                console.log('File uploaded successfully');
                setUploadProgress(100);
                // Get the download URL
                getDownloadURL(storageRef)
                    .then((url) => {
                        setDownloadURL(url);
                    })
                    .catch((err) => console.error('Error getting download URL:', err));
            });
            console.log(downloadURL);
        }
    };
    const getData = async () => {
        try {
            const res = await fetch('http://localhost:5000/getJobById', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id
                })
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            const title = data[0].title; // Store the 'title' string value
            setTitle(title);
            setDetails(data[0].details);
            setExp(data[0].experience);
            setData(data);

        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        getData();
    }, []);
    const status = 'received';

    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !email || !downloadURL) {
            window.alert("All fields are required");
        }
        else if (!validator.isEmail(email)) {
            window.alert("Enter a valid Email");
        }
        else {
            try {
                const res = await fetch('/apply', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title, details, exp, name, email, downloadURL, status
                    })
                });
                if(res.status === 201){
                    setLoading(false);
                    window.alert('Application Submitted Successfully');
                    handleClose();
                }else{
                    setLoading(false);
                    window.alert("Internal server error");
                    handleClose();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className='jobContainer'>
            {data ? (
                <div>
                    {data.map((item, index) => (
                        <div className="job" key={index}>
                            <div className="jobBody">
                                <div className="jobHead">
                                    <h4>{item.title}</h4>   <FontAwesomeIcon icon={faBookmark} />
                                </div>

                                <div className="jobLogo">
                                    <img src={logo} alt="logo" /> <div>{item.details} <br /> {item.category} {item.type}</div>
                                </div>
                                <div className="jobdes">
                                    <div className="des">
                                        <h5>Job Description : </h5>
                                        {item.description}
                                    </div>
                                    <div className="skills">
                                        <h5>Skills Required : </h5>
                                        {item.skills}
                                    </div>
                                </div>
                                <div className="jobdes">
                                    <div className="des">
                                        <h5>Required Experience  : </h5>
                                        {item.experience}
                                    </div>
                                    <div className="skills">
                                        <h5>Salary : </h5>
                                        Rs. {item.salary}
                                    </div>
                                </div>
                                <div className="other">
                                    <h5>Other Requirements : </h5>
                                    {item.keyValues.map((keyValue, index) => (
                                        <li key={index}>
                                            <strong>{keyValue.key}:</strong> {keyValue.value}
                                        </li>
                                    ))}
                                </div>
                                <div className="submitBtn">
                                    <Button variant="primary" onClick={handleShowModalOne}>Apply Now</Button>
                                    <Modal
                                        show={modalState === "modal-one"} onHide={handleClose}
                                        backdrop="static"
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Apply For : {title} </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={name}
                                                onChange={(e) => { setname(e.target.value) }}
                                                placeholder='Enter name'
                                                required
                                            />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                placeholder='Enter Email'
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                required
                                            />


                                            <label htmlFor="resume">Resume (PDF):</label>
                                            <input type="file" accept=".pdf" onChange={handleFileChange} />
                                            <button onClick={handleFileUpload}>Upload PDF</button>
                                            <p>Upload Progress: {uploadProgress}%</p>


                                            <div className="btns">
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                                {Loading ?<Button variant="primary">Loading...</Button>  : <Button variant="primary" onClick={handleSubmit}>Submit</Button>}
                                                
                                            </div>


                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}






        </div>
    )
}

export default Job