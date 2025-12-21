// Login Page JavaScript

// Demo user credentials for each role
const demoUsers = {
    admin: [
        { username: 'admin', password: 'admin123', name: 'Admin User' },
        { username: 'administrator', password: 'admin', name: 'System Administrator' }
    ],
    faculty: [
        { username: 'faculty', password: 'faculty123', name: 'Faculty Member' },
        { username: 'professor', password: 'prof123', name: 'Professor' },
        { username: 'teacher', password: 'teacher123', name: 'Teacher' }
    ],
    student: [
        { username: 'student', password: 'student123', name: 'Student' },
        { username: 'student1', password: 'student', name: 'Student One' },
        { username: 'student2', password: 'student', name: 'Student Two' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Get selected role from localStorage
    const selectedRole = localStorage.getItem('selectedRole');
    
    // If no role selected, redirect to index
    if (!selectedRole) {
        // Use Django URL pattern - will be replaced with {% url 'index' %} in template
        const indexUrl = window.location.origin + '/';
        window.location.href = indexUrl;
        return;
    }
    
    // Setup login page based on role
    setupLoginPage(selectedRole);
    
    // Setup form submission
    const loginForm = document.getElementById('login-form');
    const backToRoleBtn = document.getElementById('back-to-role-btn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin(selectedRole);
        });
    }
    
    if (backToRoleBtn) {
        backToRoleBtn.addEventListener('click', () => {
            localStorage.removeItem('selectedRole');
            // Use Django URL pattern - will be replaced with {% url 'index' %} in template
            const indexUrl = window.location.origin + '/';
            window.location.href = indexUrl;
        });
    }
});

function setupLoginPage(role) {
    const roleIcons = {
        admin: '👨‍💼',
        faculty: '👨‍🏫',
        student: '🎓'
    };
    
    const roleTitles = {
        admin: 'Administrator Login',
        faculty: 'Faculty Login',
        student: 'Student Login'
    };
    
    const roleSubtitles = {
        admin: 'Enter your administrator credentials',
        faculty: 'Enter your faculty credentials',
        student: 'Enter your student credentials'
    };
    
    document.getElementById('login-role-icon').textContent = roleIcons[role];
    document.getElementById('login-role-title').textContent = roleTitles[role];
    document.getElementById('login-role-subtitle').textContent = roleSubtitles[role];
    
    // Show demo credentials
    const demoUsersList = demoUsers[role];
    const demoCredentials = demoUsersList.map(user => 
        `Username: ${user.username} | Password: ${user.password}`
    ).join('<br>');
    
    document.getElementById('demo-credentials').innerHTML = demoCredentials;
    
    // Focus on username field
    document.getElementById('username').focus();
}

function handleLogin(role) {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    // Check credentials
    const demoUsersList = demoUsers[role];
    const user = demoUsersList.find(u => 
        (u.username.toLowerCase() === username.toLowerCase() || 
         u.username.toLowerCase() === username.toLowerCase().replace('@example.com', '')) &&
        u.password === password
    );
    
    if (user) {
        // Login successful
        const currentUser = {
            username: user.username,
            name: user.name,
            role: role,
            loginTime: new Date().toISOString()
        };
        
        // Store user and role
        localStorage.setItem('currentRole', role);
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        // Clear selected role
        localStorage.removeItem('selectedRole');
        
        // Redirect to dashboard - Use Django URL pattern
        const dashboardUrl = window.location.origin + '/dashboard/';
        window.location.href = dashboardUrl;
    } else {
        // Login failed
        alert('Invalid username or password. Please try again.\n\nHint: Check the demo credentials below.');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

