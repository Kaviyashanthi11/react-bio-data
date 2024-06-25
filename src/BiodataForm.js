import React, { useState, useEffect } from 'react';

const BiodataForm = () => {
  const initialFormData = {
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submittedData, setSubmittedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    // Fetch initial data from API or local storage on component mount
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const response = await fetch('https://apigenerator.dronahq.com/api/HIXll5G8/bio');
      if (response.ok) {
        const data = await response.json();
        setSubmittedData(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentIndex !== null) {
        // Update existing data in API and UI
        const updatedData = [...submittedData];
        updatedData[currentIndex] = formData;
        setSubmittedData(updatedData);

        const response = await fetch(`https://apigenerator.dronahq.com/api/HIXll5G8/bio/${submittedData[currentIndex].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Data updated successfully!');
        } else {
          console.error('Failed to update data');
          alert('Failed to update data');
        }

        setIsEditing(false);
        setCurrentIndex(null);
      } else {
        // Submit new data to API and update UI
        const response = await fetch('https://apigenerator.dronahq.com/api/HIXll5G8/bio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();
          setSubmittedData([...submittedData, responseData]);
          alert('Form submitted successfully!');
        } else {
          console.error('Failed to submit form');
          alert('Failed to submit form');
        }
      }

      setFormData(initialFormData); // Reset form data after submission
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting the form');
    }
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setCurrentIndex(index);
    setFormData(submittedData[index]);
  };
  const clearFields = () => {
    setFormData(initialFormData);
  };
  return (
    <div className='form-container'>
    <form onSubmit={handleSubmit} className="form-container">
      <center>
        <table className="form-table">
          <tbody>
            <tr>
              <td>Name:</td>
              <td><input type="text" name="name" value={formData.name} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Age:</td>
              <td><input type="number" name="age" value={formData.age} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Email:</td>
              <td><input type="email" name="email" value={formData.email} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Address:</td>
              <td><textarea name="address" value={formData.address} onChange={handleChange} required></textarea></td>
            </tr>
            
              <tr>
              <td colSpan="2"><button type="submit" name="s1">{isEditing ? 'Update' : 'Submit'}
                </button></td>
                </tr><tr>
                  <td> <button type="button" name="s2" onClick={clearFields}>Reset
                </button>
                </td>
            </tr>
          </tbody>
        </table>
    

        <div>
          <h2>Data Table</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.gender}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.address}</td>
                  <td>
                    <button type="button" onClick={() => handleEdit(index)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>
    </form>
    </div>
  );
};

export default BiodataForm;
