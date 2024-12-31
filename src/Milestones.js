import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function MilestoneApp() {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newMilestone, setNewMilestone] = useState({
    project_id: "",
    project_name: "",
    milestone_name: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    axios.get('http://localhost:5000/milestone')
      .then(response => {
        setMilestones(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the milestones!', error);
      });

    axios.get('http://localhost:5000/projects')
      .then(response => {
        console.log('Projects:', response.data); 
        setProjects(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the projects!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMilestone(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/milestone', newMilestone)
      .then(response => {
        setMilestones([...milestones, response.data]);
        setNewMilestone({
          project_id: '',
          milestone_name: '',
          start_date: '',
          end_date: ''
        });
      })
      .catch(error => {
        console.error('There was an error adding the milestone!', error);
      });
  };

  const deleteMilestone = (id) => {
    axios.delete(`http://localhost:5000/milestone/${id}`)
      .then(() => {
        setMilestones(milestones.filter(milestone => milestone.milestone_id !== id));
      })
      .catch(error => {
        console.error('There was an error removing the milestone!', error);
      });
  };

  return (
    <div className="MilestoneApp">
      <header className="MilestoneApp-header">
        <h1>Milestones</h1>
        <form onSubmit={handleSubmit}>
          <select
            name="project_id"
            value={newMilestone.project_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="milestone_name"
            value={newMilestone.milestone_name}
            onChange={handleChange}
            placeholder="Milestone Name"
            required
          />
          <input
            type="date"
            name="start_date"
            value={newMilestone.start_date}
            onChange={handleChange}
          />
          <input
            type="date"
            name="end_date"
            value={newMilestone.end_date}
            onChange={handleChange}
          />
          <button type="submit">Add Milestone</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Task Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map(milestone => (
              <tr key={milestone.milestone_id}>
                <td>{milestone.project_id}</td>
                <td>{milestone.milestone_name}</td>
                <td>{new Date(milestone.start_date).toLocaleDateString()}</td>
                <td>{new Date(milestone.end_date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteMilestone(milestone.milestone_id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default MilestoneApp;