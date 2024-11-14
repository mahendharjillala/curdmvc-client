import React, { useEffect, useState } from "react";
import axios from "axios";

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL.replace(
    "/students",
    "/faculty"
  ); // Adjust API URL

  // Fetch faculty data on component mount
  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(API_URL);
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const saveFaculty = async () => {
    try {
      const facultyData = { name, department, experience };

      if (editingId) {
        // Update existing faculty
        await axios.put(`${API_URL}/${editingId}`, facultyData);
        setEditingId(null);
      } else {
        // Add new faculty
        await axios.post(API_URL, facultyData);
      }

      // Clear the form and fetch updated faculty list
      setName("");
      setDepartment("");
      setExperience("");
      fetchFaculty();
    } catch (error) {
      console.error("Error saving faculty:", error);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      // Delete the faculty by sending a DELETE request
      await axios.delete(`${API_URL}/${id}`);
      fetchFaculty(); // Refresh the faculty list
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const editFaculty = (facultyMember) => {
    setEditingId(facultyMember._id);
    setName(facultyMember.name);
    setDepartment(facultyMember.department);
    setExperience(facultyMember.experience);
  };

  return (
    <div className="faculty-list">
      <h2 className="faculty-list-title">Faculty List</h2>
      <input
        className="faculty-input"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="faculty-input"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <input
        className="faculty-input"
        placeholder="Experience (years)"
        type="number"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />
      <button className="faculty-button" onClick={saveFaculty}>
        {editingId ? "Update Faculty" : "Add Faculty"}
      </button>
      <ul>
        {faculty.map((facultyMember) => (
          <li key={facultyMember._id}>
            {facultyMember.name} - Department: {facultyMember.department},
            Experience: {facultyMember.experience} years
            <button
              className="edit-button"
              onClick={() => editFaculty(facultyMember)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => deleteFaculty(facultyMember._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FacultyList;
