

const db = {
    users: [
        { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' }
    ],
    alerts: [
        { 
            id: 1, 
            type: 'Code Blue', 
            priority: 'High Priority', 
            message: 'Cardiac arrest in Room 405', 
            timestamp: new Date().toISOString(),
            createdBy: 1
        }
    ]
};

// Simple router
const routes = {
    '/': renderLogin,
    '/register': renderRegister,
    '/dashboard': renderDashboard
};

// Current user session
let currentUser = null;

// Application initialization
function initApp() {
    // Check if user is logged in (would use localStorage in a real app)
    const path = window.location.hash.substring(1) || '/';
    navigate(path);
    
    // Set up navigation event listener
    window.addEventListener('hashchange', () => {
        const path = window.location.hash.substring(1) || '/';
        navigate(path);
    });
}

// Navigation function
function navigate(path) {
    const route = routes[path] || renderLogin;
    
    // Check if user is authenticated for protected routes
    if (path === '/dashboard' && !currentUser) {
        window.location.hash = '#/';
        return;
    }
    
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    route(appContainer);
}

// Login 
function renderLogin(container) {
    container.innerHTML = `
        <div class="login-container">
            <h2 class="mt-4 text-center">Hospital Alerts Login</h2>
            <form class="p-5" id="loginForm">
                <div class="mb-3">

                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required>
                </div>
                <div id="loginError" class="alert alert-danger d-none"></div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <div class="mt-3 text-center">
                    <a href="#/register">Need an account? Register</a>
                </div>
            </form>
        </div>
    `;
    

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        
        
        
        const user = db.users.find(user => user.username === username && user.password === password);
        
        if (user) {
            currentUser = user;
            window.location.hash = '#/dashboard';
        } else {
            const errorElement = document.getElementById('loginError');
            errorElement.textContent = 'Invalid username or password';
            errorElement.classList.remove('d-none');
        }
    });
}

// Registration page 
function renderRegister(container) {
    container.innerHTML = `
        <div class="login-container">
            <h2 class="mb-4 text-center">Create Account</h2>
            <form class="p-5" id="registerForm">
                <div class="mb-3">
                    <label for="fullName" class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="fullName" required>
                </div>
                <div class="mb-3">
                    <label for="newUsername" class="form-label">Username</label>
                    <input type="text" class="form-control" id="newUsername" required>
                </div>
                <div class="mb-3">
                    <label for="newPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="newPassword" required>
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Role</label>
                    <select class="form-select" id="role" required>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <div id="registerError" class="alert alert-danger d-none"></div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
                <div class="mt-3 text-center">
                    <a href="#/">Already have an account? Login</a>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const role = document.getElementById('role').value;
        
        
        if (db.users.some(user => user.username === username)) {
            const errorElement = document.getElementById('registerError');
            errorElement.textContent = 'Username already taken';
            errorElement.classList.remove('d-none');
            return;
        }
        
        
        const newUser = {
            id: db.users.length + 1,
            username,
            password,
            name: fullName,
            role
        };
        
    
        db.users.push(newUser);
        
        
        window.location.hash = '#/';
        
        
        alert('Registration successful! Please login.');
    });
}

// Dashboard page 
function renderDashboard(container) {
    container.innerHTML = `
        <nav class=" navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Hospital Alerts System</a>
                <div class="d-flex">
                    <span class="navbar-text me-3">Welcome, ${currentUser.name}</span>
                    <button id="logoutBtn" class="btn btn-outline-light btn-sm">Logout</button>
                </div>
            </div>
        </nav>
        
        <div class="main-container">
            <div class="row">
                <!-- Left Panel -->
                <div class="col-md-6">
                    <div class="card shadow">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h3 class="mb-0">Create Alert</h3>
                                <span class="badge bg-info">${currentUser.role}</span>
                            </div>
                            
                            <form class="p-5" id="alertForm">
                                <div class="mb-3">
                                    <label class="form-label">Alert Type</label>
                                    <select id="alertType" class="form-select">
                                        <option>Code Blue</option>
                                        <option>Code Red</option>
                                        <option>Code Pink</option>
                                        <option>Rapid Response</option>
                                        <option>Staff Emergency</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Priority</label>
                                    <select id="priority" class="form-select">
                                        <option>Low Priority</option>
                                        <option selected>Medium Priority</option>
                                        <option>High Priority</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Message</label>
                                    <textarea id="message" class="form-control" rows="3" placeholder="Enter alert message..."></textarea>
                                </div>
                                
                                <button type="submit" class="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send me-2" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                                    </svg>
                                    Send Alert
                                </button>
                            </form>
                            
                            <div class="mt-4">
                                <h5>Recent Alerts</h5>
                                <div id="recentAlertsList" class="list-group mt-2">
                                    <!-- Recent alerts will be added here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Panel - Devices -->
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card shadow">
                                <div class="card-body text-center">
                                    <h5 class="card-title">Mobile App</h5>
                                    <div class="phone-mockup">
                                        <div class="phone-header">
                                            <span id="phoneTime">22:06:25</span>
                                            <span><span class="green-dot"></span></span>
                                        </div>
                                        <div class="phone-content">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span>Room Search</span>
                                                <span>▲</span>
                                            </div>
                                            
                                            <div class="suggestion-item">
                                                <span>Room 405</span>
                                                <span>⋯</span>
                                            </div>
                                            <div class="suggestion-item">
                                                <span>Room 406</span>
                                                <span>⋯</span>
                                            </div>
                                            <div id="mobileAlerts">
                                                <!-- Mobile alerts appear here -->
                                            </div>
                                        </div>
                                        <div class="phone-footer">
                                            <div class="home-button"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card shadow">
                                <div class="card-body text-center">
                                    <h5 class="card-title">Wearable Device</h5>
                                    <div class="watch-mockup">
                                        <div class="watch-content">
                                            <div id="watchTime" class="mb-2" style="font-size: 1.2rem; font-weight: bold;">22:06</div>
                                            <div id="watchDate" class="mb-3" style="font-size: 0.8rem; opacity: 0.8;">Feb 21, 2025</div>
                                            <div id="watchAlert" style="background-color: rgba(220, 53, 69, 0.2); padding: 5px; border-radius: 4px; max-width: 100%;">
                                                <strong>Code Blue</strong>
                                                <div style="font-size: 0.7rem;">Room 405</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card shadow mt-3">
                        <div class="card-body">
                            <h5 class="card-title">System Status</h5>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6>Active Users</h6>
                                            <h3>${db.users.length}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6>Alerts Today</h6>
                                            <h3 id="alertCount">${db.alerts.length}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6>Response Time</h6>
                                            <h3>1.8 min</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        currentUser = null;
        window.location.hash = '#/';
    });
    
    
    loadAlerts();
    

    updateDeviceTime();
    setInterval(updateDeviceTime, 1000);
    
    // Set up alert form
    document.getElementById('alertForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const alertType = document.getElementById('alertType').value;
        const priority = document.getElementById('priority').value;
        const message = document.getElementById('message').value;
        
        createAlert(alertType, priority, message);
        
        // Clear form
        document.getElementById('message').value = '';
    });
}

// Create a new alert
function createAlert(type, priority, message) {
    const newAlert = {
        id: db.alerts.length + 1,
        type,
        priority,
        message,
        timestamp: new Date().toISOString(),
        createdBy: currentUser.id
    };
    
    // Add to database
    db.alerts.push(newAlert);
    
    // Update UI
    loadAlerts();
    updateDeviceAlerts(newAlert);
    
    // Update alerts count
    const alertCountElement = document.getElementById('alertCount');
    if (alertCountElement) {
        alertCountElement.textContent = db.alerts.length;
    }
}

// Load alerts from database
function loadAlerts() {
    const alertsList = document.getElementById('recentAlertsList');
    if (!alertsList) return;
    
    alertsList.innerHTML = '';
    
    // Sort alerts by timestamp (newest first)
    const sortedAlerts = [...db.alerts].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    sortedAlerts.forEach(alert => {
        const alertDate = new Date(alert.timestamp);
        const timeStr = alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let priorityClass = 'alert-low';
        if (alert.priority.includes('High')) priorityClass = 'alert-urgent';
        else if (alert.priority.includes('Medium')) priorityClass = 'alert-medium';
        
        const alertItem = document.createElement('div');
        alertItem.className = `list-group-item ${priorityClass}`;
        alertItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <strong>${alert.type}</strong>
                <small>${timeStr}</small>
            </div>
            <div>${alert.message || 'No message'}</div>
            <small class="text-muted">${alert.priority}</small>
        `;
        
        alertsList.appendChild(alertItem);
    });
    
    // Update mobile alerts
    const mobileAlerts = document.getElementById('mobileAlerts');
    if (mobileAlerts && sortedAlerts.length > 0) {
        const recentAlert = sortedAlerts[0];
        mobileAlerts.innerHTML = `
            <div class="suggestion-item" style="background-color: rgba(220, 53, 69, 0.2);">
                <span>${recentAlert.type}: ${recentAlert.message}</span>
                <span style="position: relative;">
                    <span class="notification-badge">!</span>
                    ⋯
                </span>
            </div>
        `;
    }
}

// Update device alerts
function updateDeviceAlerts(alert) {
    // Update watch alert
    const watchAlert = document.getElementById('watchAlert');
    if (watchAlert) {
        const bgColor = alert.priority.includes('High') ? 'rgba(220, 53, 69, 0.2)' : 
                        alert.priority.includes('Medium') ? 'rgba(255, 193, 7, 0.2)' : 'rgba(13, 110, 253, 0.2)';
        
        watchAlert.style.backgroundColor = bgColor;
        watchAlert.innerHTML = `
            <strong>${alert.type}</strong>
            <div style="font-size: 0.7rem;">${alert.message.substring(0, 20)}${alert.message.length > 20 ? '...' : ''}</div>
        `;
    }
}

// Update time on devices
function updateDeviceTime() {
    const now = new Date();
    
    // Update phone time
    const phoneTimeElement = document.getElementById('phoneTime');
    if (phoneTimeElement) {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        phoneTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Update watch time and date
    const watchTimeElement = document.getElementById('watchTime');
    const watchDateElement = document.getElementById('watchDate');
    
    if (watchTimeElement) {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        watchTimeElement.textContent = `${hours}:${minutes}`;
    }
    
    if (watchDateElement) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        watchDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', initApp);
