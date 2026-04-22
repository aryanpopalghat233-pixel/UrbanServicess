async function loadBookings() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/admin/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const bookings = await response.json();
    const tbody = document.getElementById('bookingsBody');
    
    tbody.innerHTML = bookings.map(booking => `
      <tr>
        <td>${booking._id.substring(0, 8)}</td>
        <td>${booking.service}</td>
        <td>${new Date(booking.date).toLocaleDateString()}</td>
        <td>${booking.status}</td>
        <td>
          <button onclick="assignWorker('${booking._id}')" class="btn btn-primary">Assign Worker</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

async function loadWorkers() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/admin/workers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const workers = await response.json();
    const tbody = document.getElementById('workersBody');
    
    tbody.innerHTML = workers.map(worker => `
      <tr>
        <td>${worker.name}</td>
        <td>${worker.skills.join(', ')}</td>
        <td>${worker.city}</td>
        <td>${worker.isApproved ? 'Approved' : 'Pending'}</td>
        <td>
          ${!worker.isApproved ? `<button onclick="approveWorker('${worker._id}')" class="btn btn-primary">Approve</button>` : 'Approved'}
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading workers:', error);
  }
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName).style.display = 'block';
  event.target.classList.add('active');

  if (tabName === 'bookings') {
    loadBookings();
  } else {
    loadWorkers();
  }
}

async function approveWorker(workerId) {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/admin/approve-worker/${workerId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      alert('Worker approved!');
      loadWorkers();
    }
  } catch (error) {
    console.error('Error approving worker:', error);
  }
}

function assignWorker(bookingId) {
  const workerId = prompt('Enter Worker ID:');
  if (workerId) {
    assignWorkerToBooking(bookingId, workerId);
  }
}

async function assignWorkerToBooking(bookingId, workerId) {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/admin/assign/${bookingId}/${workerId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      alert('Worker assigned!');
      loadBookings();
    }
  } catch (error) {
    console.error('Error assigning worker:', error);
  }
}

// Load data on page load
window.addEventListener('load', () => {
  loadBookings();
});