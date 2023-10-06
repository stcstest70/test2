import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const JobApplications = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AdminContext);
    const [modalState, setModalState] = useState("close");
    const handleShowModalOne = () => {
        setModalState("modal-one")
    }
    const handleShowModalTwo = () => {
        setModalState("modal-two")
    }
    const handleShowModalThree = () => {
        setModalState("modal-three")
    }
    const handleClose = () => {
        setModalState("close");
    }

    const [data, setData] = useState();
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
            const res = await fetch('https://test-api-wr81.onrender.com/getJobApplies', {
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
    useEffect(() => {
        getData();
    }, []);
    //   console.log(data);
    const [id, setid] = useState('');
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [title, settitle] = useState('');
    const [details, setdetails] = useState('');
    const [exp, setexp] = useState('');
    const [url, seturl] = useState('');
    const [status, setstatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };
    const handleReasonChange = (e) => {
        setRejectReason(e.target.value);
    };
    const handleEdit1 = async (id, name, email, title, details, exp) => {
        setid(id);
        setname(name);
        setemail(email);
        settitle(title);
        setdetails(details);
        setexp(exp);
        handleShowModalOne();
    }
    const handleEdit2 = async (id, url) => {
        setid(id);
        seturl(url);
        handleShowModalTwo();
    }
    const handleEdit3 = async (id, status, email) => {
        setid(id);
        setstatus(status);
        setemail(email);
        handleShowModalThree();
    }
    //   console.log(id,name,email,title,details,exp);
    const handleEditSubmit1 = async () => {
        if (!name || !email || !title || !details || !exp) {
            window.alert("Enter All fields");
        }
        else {
            try {
                const res = await fetch('https://test-api-wr81.onrender.com/editApplication1', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id, title, details, exp, name, email
                    })
                })
                if (res.status === 200) {
                    window.alert("Application Edited Successfully");
                    handleClose();
                    getData();
                }
                else {
                    window.alert("Application Edited Successfully");
                    handleClose();
                    getData();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };
    // console.log("new download url", downloadURL);

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

    const handleEditSubmit2 = async () => {
        if (!downloadURL) {
            window.alert("Enter All fields");
        }
        else {
            try {
                const res = await fetch('https://test-api-wr81.onrender.com/editApplication2', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id, downloadURL
                    })
                })
                if (res.status === 200) {
                    window.alert("Resume Edited Successfully");
                    handleClose();
                    getData();
                }
                else {
                    window.alert("Resume Edited Successfully");
                    handleClose();
                    getData();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleEditSubmit3 = async () => {
        
            try {
                const res = await fetch('https://test-api-wr81.onrender.com/editApplication3', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id, selectedStatus, rejectReason, email
                    })
                })
                if (res.status === 200) {
                    window.alert("Status Edited Successfully");
                    handleClose();
                    getData();
                }
                else {
                    window.alert("Status Edited Successfully");
                    handleClose();
                    getData();
                }
            } catch (error) {
                console.log(error);
            }
        
    }
    return (
        <div className='home_container'>
            <h4>Job Applications</h4>
            <div className='tablecontainer table table-responsive'>
                <table className='content-table tableC'>
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Job</th>
                            <th>Company</th>
                            <th>Exp required</th>
                            <th>Edit</th>
                            <th>Resume</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    {data ? (<tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.title}</td>
                                <td>{item.details}</td>
                                <td>{item.exp}</td>
                                <td><FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit1(item._id, item.name, item.email, item.title, item.details, item.exp)} /></td>
                                <Modal
                                    show={modalState === "modal-one"} onHide={handleClose}
                                    backdrop="static"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Application </Modal.Title>
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
                                            onChange={(e) => { setemail(e.target.value) }}
                                            required
                                        />
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={title}
                                            placeholder='Enter Title'
                                            onChange={(e) => { settitle(e.target.value) }}
                                            required
                                        />
                                        <input
                                            type="text"
                                            id="details"
                                            name="details"
                                            value={details}
                                            placeholder='Enter details'
                                            onChange={(e) => { setdetails(e.target.value) }}
                                            required
                                        />
                                        <input
                                            type="text"
                                            id="exp"
                                            name="exp"
                                            value={exp}
                                            placeholder='Enter Experience'
                                            onChange={(e) => { setexp(e.target.value) }}
                                            required
                                        />

                                        <div className="btns">
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => handleEditSubmit1()} >Update</Button>
                                        </div>


                                    </Modal.Body>
                                </Modal>
                                <td><a href={item.downloadURL} rel="noreferrer" target="_blank">pdf url</a> &nbsp;&nbsp; <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit2(item._id, item.downloadURL)} /></td>
                                <Modal
                                    show={modalState === "modal-two"} onHide={handleClose}
                                    backdrop="static"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Resume </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Previous Resume : <a href={item.downloadURL} rel="noreferrer" target="_blank">pdf url</a><br />
                                        <label htmlFor="resume">Update Resume (PDF):</label>
                                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                                        <button onClick={handleFileUpload}>Upload PDF</button>
                                        <p>Upload Progress: {uploadProgress}%</p>

                                        <div className="btns">
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => handleEditSubmit2()} >Update</Button>
                                        </div>


                                    </Modal.Body>
                                </Modal>
                                <td>{item.status} <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit3(item._id, item.status, item.email)} /></td>
                                <Modal
                                    show={modalState === "modal-three"} onHide={handleClose}
                                    backdrop="static"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update Status </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Status : {status} <br />
                                        <select id="status" value={selectedStatus} onChange={handleStatusChange}>
                                            <option value="">Select an option</option>
                                            <option value="Under Review">Under Review</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        {selectedStatus === 'Rejected' && (
                                            <div>
                                                <label htmlFor="reason">Reason for Rejection:</label>
                                                <input
                                                    type="text"
                                                    id="reason"
                                                    value={rejectReason}
                                                    onChange={handleReasonChange}
                                                />
                                            </div>
                                        )}
                                        <div className="btns">
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => handleEditSubmit3()} >Update</Button>
                                        </div>


                                    </Modal.Body>
                                </Modal>

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

export default JobApplications