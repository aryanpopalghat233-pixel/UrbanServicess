const socket = io();

// Worker Registration
if (document.getElementById('workerForm')) {
  document.getElementById('workerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const worker = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      password: document.getElementById('password').value,
      skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
      city: document.getElementById('city').value
    };

    try {
      const response = await fetch(`${API_BASE}/auth/worker/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worker)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'worker');
        alert('Signup successful! Please wait for admin approval.');
        window.location.href = 'worker-dashboard.html';
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Worker Dashboard
if (document.getElementById('jobsList')) {
  loadWorkerJobs();
}

async function loadWorkerJobs() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/bookings/user/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const jobs = await response.json();
    const jobsList = document.getElementById('jobsList');
    
    jobsList.innerHTML = jobs.map(job => `
      <div class="card">
        <h3>${job.service}</h3>
        <p>Address: ${job.address}</p>
        <p>Date: ${new Date(job.date).toLocaleDateString()}</p>
        <p>Status: <strong>${job.status}</strong></p>
        <button onclick="updateJobStatus('${job._id}', 'On the way')" class="btn btn-primary">On the way</button>
        <button onclick="updateJobStatus('${job._id}', 'Completed')" class="btn btn-primary">Completed</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading jobs:', error);
  }
}

async function updateJobStatus(jobId, status) {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/bookings/${jobId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      alert('Status updated!');
      loadWorkerJobs();
      
      // Send location update
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit('updateLocation', {
            bookingId: jobId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            workerId: JSON.parse(localStorage.getItem('user'))._id
          });
        });
      }
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

function toggleStatus() {
  const statusSpan = document.getElementById('status');
  const newStatus = statusSpan.textContent === 'Online' ? 'Offline' : 'Online';
  statusSpan.textContent = newStatus;
}