import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Milestones from "./Milestones"; // Assuming you have a Milestones component

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    client_name: "",
    project_type: "",
    project_start_date: "",
    project_expected_end_date: "",
    project_status: "",
    description: "",
  });

  // Fetch all projects from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  // Add a new project
  const addProject = (newProject) => {
    axios.post("http://localhost:5000/projects", newProject)
      .then((response) => {
        setProjects([...projects, response.data]); // Add new project to the list
      })
      .catch((error) => console.error("Error adding project:", error));
  };

  // Delete a project
  const deleteProject = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/projects/${id}`)
        .then(() => {
          setProjects(projects.filter((project) => project.project_id !== id)); // Ensure the correct `id` is used here
        })
        .catch((error) => console.error("Error deleting project:", error));
    }
  };

  // Edit a project (set the project to be edited)
  const editProject = (id) => {
    const projectToEdit = projects.find((project) => project.project_id === id); // Ensure the correct `id` is used here
    setEditingProject(projectToEdit);
    setFormVisible(true);
    setFormData(projectToEdit);
  };

  // Update project
  const updateProject = (updatedProject) => {
    axios
      .put(`http://localhost:5000/projects/${updatedProject.project_id}`, updatedProject)
      .then(() => {
        // Update the project in the state
        const updatedProjects = projects.map((project) =>
          project.project_id === updatedProject.project_id ? updatedProject : project
        );
        setProjects(updatedProjects);
        setFormVisible(false);
        setEditingProject(null); // Reset form visibility and editing state
      })
      .catch((error) => console.error("Error updating project:", error));
  };

  const cancelEdit = () => {
    setFormVisible(false);
    setEditingProject(null); // Reset the editing project
  };

  const toggleFormVisibility = () => {
    setFormVisible((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(formData.project_expected_end_date) < new Date(formData.project_start_date)) {
      alert("Please enter valid dates: The end date cannot be before the start date.");
      return;
    }

    if (editingProject) {
      updateProject(formData);
    } else {
      addProject(formData);
    }

    setFormData({
      project_name: "",
      client_name: "",
      project_type: "",
      project_start_date: "",
      project_expected_end_date: "",
      project_status: "",
      description: "",
    });
  };

  // Function to handle date formatting (DD-MM-YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Router>
      <div className="App">
        <div className="topnav">
        <nav>
          <ul>
              <Link to="/">Home</Link>
              <Link to="/milestones">Milestones</Link>
          </ul>
        </nav>
        </div>
        <Routes>
          <Route path="/" element={<Home 
            projects={projects} s
            formVisible={formVisible} 
            toggleFormVisibility={toggleFormVisibility} 
            handleSubmit={handleSubmit} 
            handleInputChange={handleInputChange} 
            formData={formData} 
            editProject={editProject} 
            deleteProject={deleteProject} 
            formatDate={formatDate} 
            cancelEdit={cancelEdit}
            editingProject={editingProject}
          />} />
          <Route path="/milestones" element={<Milestones />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ projects, formVisible, toggleFormVisibility, handleSubmit, handleInputChange, formData, editProject, deleteProject, formatDate, cancelEdit, editingProject }) {
  return (                                            
    <div className="container">
      <h2>Home</h2>
      <button onClick={toggleFormVisibility}>
        {formVisible ? "Hide Form" : "Add Project"}
      </button>
      {formVisible && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="project_name">Project Name:</label>
              <input
                type="text"
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
                placeholder="Project Name"
                required
              />
            </div>

            <div>
              <label htmlFor="client_name">Client Name:</label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                placeholder="Client Name"
                required
              />
            </div>

            <div>
              <label htmlFor="project_type">Project Type:</label>
              <select
                id="project_type"
                name="project_type"
                value={formData.project_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Implementation">Implementation</option>
                <option value="Change Request">Change Request</option>
                <option value="Support">Support</option>
                <option value="PoC">PoC</option>
              </select>
            </div>

            <div>
              <label htmlFor="project_start_date">Start Date:</label>
              <input
                type="date"
                id="project_start_date"
                name="project_start_date"
                value={formData.project_start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="project_expected_end_date">Expected End Date:</label>
              <input
                type="date"
                id="project_expected_end_date"
                name="project_expected_end_date"
                value={formData.project_expected_end_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="project_status">Status:</label>
              <select
                id="project_status"
                name="project_status"
                value={formData.project_status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Project Description"
              ></textarea>
            </div>

            <div>
              <button type="submit">
                {editingProject ? "Update Project" : "Add Project"}
              </button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client Name</th>
            <th>Project Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td>{project.project_name}</td>
              <td>{project.client_name}</td>
              <td>{project.project_type}</td>
              <td>{formatDate(project.project_start_date)}</td>
              <td>{formatDate(project.project_expected_end_date)}</td>
              <td>{project.project_status}</td>
              <td>{project.description}</td>
              <td>
                <button onClick={() => editProject(project.project_id)}>Edit</button>
                <button onClick={() => deleteProject(project.project_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
