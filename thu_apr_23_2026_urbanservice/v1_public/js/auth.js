async function handleLogin(event, type) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const endpoint = type === 'user' ? 'user/login' : 'worker/login';
    const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', type);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      closeModal('authModal');
      
      if (type === 'worker') {
        window.location.href = 'worker-dashboard.html';
      } else {
        window.location.href = 'book-service.html';
      }
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

async function handleSignup(event, type) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  
  try {
    const endpoint = type === 'user' ? 'user/signup' : 'worker/signup';
    const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, skills: [], city: '' })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', type);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      closeModal('authModal');
      
      if (type === 'worker') {
        window.location.href = 'worker-dashboard.html';
      } else {
        window.location.href = 'book-service.html';
      }
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}