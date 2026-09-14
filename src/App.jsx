import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [fromdata, setFormData] = useState({
    name: "",
    email: "",
    course: ""
  })

  const [editId, setEditId] = useState(null)

  //tO READ THE STUDENT DATA
  const getstudent = () => {
    fetch("http://localhost:3000/student")
      .then(response => response.json())
      .then(data => {
        setStudents(data)
      })
  };

  useEffect(() => {
    getstudent()
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();

    if(editId === null) {
      //Post Data = Add Student
      fetch("http://localhost:3000/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fromdata)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Student Added:", data)

          setStudents(prevStudents => [...prevStudents, data])

          setFormData({
            name: "",
            email: "",
            course: ""
          })
        })
        .catch(error => {
          console.log("Error:", error)
        })
    }

    else {
      //Put Data = Edit Student Data
      fetch(`http://localhost:3000/student/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fromdata)
      })
        .then(response => response.json())
        .then(data => {
          setStudents(
            students.map(student =>
              student._id === editId ? data : student
            )
          )

          setFormData({
            name: "",
            email: "",
            course: ""
          })

          setEditId(null)
        })
    }

  }

  const hanldeChange = (e) => {
    setFormData({
      ...fromdata,
      [e.target.name]: e.target.value
    })
  }

  const handleDelete = (id) => {

    const deleteStudent = confirm(
      "Are you sure you want to delete the student data?"
    )

    if(!deleteStudent) {
      return
    }

    fetch(`http://localhost:3000/student/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(data => {
        setStudents(
          students.filter(student => student._id !== id)
        )
      })
  }

  return (
    <>
      <nav className="navbar">

        <div className="logo">
          Student<span>Hub</span>
        </div>

        <div className="nav-buttons">

          <button
            className="login-btn"
            onClick={() => alert("Login button clicked")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => alert("Sign Up button clicked")}
          >
            Sign Up
          </button>

        </div>

      </nav>


      <div className="container">

        <h1>
          Student Management System
        </h1>
        <br /><br />

        <p className="subtitle">
          Manage your students easily
        </p>


        <form onSubmit={handleSubmit}>

          <div className="input-box">

            <span className="input-icon">
              👤
            </span>

            <input
              type="text"
              name="name"
              value={fromdata.name}
              placeholder="Enter your name"
              onChange={hanldeChange}
            />

          </div>


          <div className="input-box">

            <span className="input-icon">
              ✉️
            </span>

            <input
              type="text"
              name="email"
              value={fromdata.email}
              placeholder="Enter your email"
              onChange={hanldeChange}
            />

          </div>


          <div className="input-box">

            <span className="input-icon">
              🎓
            </span>

            <input
              type="text"
              name="course"
              value={fromdata.course}
              placeholder="Enter your course"
              onChange={hanldeChange}
            />

          </div>


          <button
            className="submit-btn"
            type="submit"
          >
            {editId === null ? "Add Student" : "Update Student"}
          </button>

        </form>


        <div className="student-list">

          {
            students.map(student => (

              <div
                className="student-card"
                key={student._id}
              >

                <div className="student-avatar">
                  👨‍🎓
                </div>


                <div className="student-info">

                  <p>
                    <span>👤</span>
                    <strong>Name:</strong> {student.name}
                  </p>

                  <p>
                    <span>✉️</span>
                    <strong>Email:</strong> {student.email}
                  </p>

                  <p>
                    <span>🎓</span>
                    <strong>Course:</strong> {student.course}
                  </p>

                </div>


                <div className="buttons">

                  <button
                    className="edit-btn"
                    onClick={() => {

                      setEditId(student._id)

                      setFormData({
                        name: student.name,
                        email: student.email,
                        course: student.course
                      })

                    }}
                  >
                    Edit
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(student._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          }

        </div>

      </div>
    </>
  )
}

export default App