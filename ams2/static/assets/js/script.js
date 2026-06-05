// ============================================
// ROLE MANAGEMENT & NAVIGATION
// ============================================

let currentRole = localStorage.getItem('currentRole') || null;
let currentUser = null;
const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
if (storedUser) {
    try {
        currentUser = JSON.parse(storedUser);
    } catch (e) {
        currentUser = null;
    }
}
let registeredStudents = JSON.parse(localStorage.getItem('registeredStudents')) || [];
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

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
let examSchedules = JSON.parse(localStorage.getItem('examSchedules')) || [
    {
        subject: 'Computer Science - Data Structures',
        date: '2025-03-15',
        timeStart: '09:00',
        timeEnd: '12:00',
        venue: 'Hall A, Building 1',
        semester: '3',
        type: 'Midterm',
        course: 'computer-science'
    },
    {
        subject: 'Engineering - Mathematics',
        date: '2025-04-20',
        timeStart: '14:00',
        timeEnd: '17:00',
        venue: 'Hall B, Building 2',
        semester: '2',
        type: 'Final',
        course: 'engineering'
    },
    {
        subject: 'Business - Marketing Management',
        date: '2025-03-18',
        timeStart: '10:00',
        timeEnd: '13:00',
        venue: 'Hall C, Building 3',
        semester: '4',
        type: 'Midterm',
        course: 'business'
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Role selection handlers
    setupRoleSelection();
    
    // Setup login page
    setupLoginPage();
    
    // If user is already logged in, show dashboard
    if (currentUser && currentRole) {
        showDashboard(currentRole);
    } else {
        showRoleSelection();
    }
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Setup all module functionality
    setupStudentModule();
    setupAttendanceModule();
    setupExaminationModule();
    setupCourseModule();
    setupFacultyModule();
    setupAdminModule();
    
    // Initialize date fields
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

// Role Selection
function setupRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const role = card.getAttribute('data-role');
            selectRole(role);
        });
    });
}

function selectRole(role) {
    currentRole = role;
    localStorage.setItem('currentRole', role);
    showLoginPage(role);
}

function showRoleSelection() {
    document.getElementById('role-selection-page').style.display = 'flex';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'none';
    // Clear current user on role selection
    currentUser = null;
    localStorage.removeItem('currentUser');
}

// Login Page
function setupLoginPage() {
    const loginForm = document.getElementById('login-form');
    const backToRoleBtn = document.getElementById('back-to-role-btn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (backToRoleBtn) {
        backToRoleBtn.addEventListener('click', () => {
            showRoleSelection();
        });
    }
}

function showLoginPage(role) {
    document.getElementById('role-selection-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('main-dashboard').style.display = 'none';
    
    // Update login page based on role
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
    
    // Clear form
    document.getElementById('login-form').reset();
    document.getElementById('username').focus();
}

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    // Check credentials
    const demoUsersList = demoUsers[currentRole];
    const user = demoUsersList.find(u => 
        (u.username.toLowerCase() === username.toLowerCase() || 
         u.username.toLowerCase() === username.toLowerCase().replace('@example.com', '')) &&
        u.password === password
    );
    
    if (user) {
        // Login successful
        currentUser = {
            username: user.username,
            name: user.name,
            role: currentRole,
            loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        // Show dashboard
        showDashboard(currentRole);
    } else {
        // Login failed
        alert('Invalid username or password. Please try again.\n\nHint: Check the demo credentials below.');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

function showDashboard(role) {
    document.getElementById('role-selection-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    
    // Update user and role display
    const userDisplay = document.getElementById('current-user-display');
    const roleDisplay = document.getElementById('current-role-display');
    
    if (userDisplay && currentUser) {
        userDisplay.textContent = currentUser.name;
    }
    
    if (roleDisplay) {
        roleDisplay.textContent = role;
    }
    
    // Add role class to body for CSS targeting
    document.body.className = `role-${role}`;
    
    // Show/hide admin-only items
    updateRoleBasedVisibility(role);
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
    
    // Show dashboard page
    showPage('dashboard');
    updateDashboardStats();
}

function logout() {
    currentUser = null;
    currentRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    sessionStorage.removeItem('currentUser');
    showRoleSelection();
}

function updateRoleBasedVisibility(role) {
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    adminOnlyItems.forEach(item => {
        if (role === 'admin') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Sidebar Navigation
function setupSidebarNavigation() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const menuLinks = document.querySelectorAll('.menu-link');
    const submenuLinks = document.querySelectorAll('.submenu-link');
    
    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Menu link clicks
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.getAttribute('data-module');
            
            // Toggle submenu
            const menuItem = link.closest('.menu-item');
            const submenu = menuItem.querySelector('.submenu');
            
            if (submenu) {
                menuItem.classList.toggle('active');
            } else {
                // If no submenu, show module page
                showPage(module);
            }
            
            // Update active states
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Submenu link clicks
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            // Check role-based access
            if (!checkPageAccess(page)) {
                alert('You do not have access to this page.');
                return;
            }
            
            showPage(page);
            
            // Update active states
            submenuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function checkPageAccess(page) {
    if (page.startsWith('admin-') && currentRole !== 'admin') {
        return false;
    }
    if (page.startsWith('faculty-') && currentRole === 'student') {
        return false;
    }
    return true;
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page-specific data
        loadPageData(pageId);
    }
}

function loadPageData(pageId) {
    switch(pageId) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'student-list':
            displayStudentList();
            break;
        case 'course-list':
            displayCourseList();
            break;
        case 'student-examination':
            displayExams();
            break;
        default:
            if (pageId.startsWith('course-')) {
                const course = pageId.replace('course-', '');
                displayCourseDetails(course);
            }
            break;
    }
}

// Dashboard Stats
function updateDashboardStats() {
    const studentsCount = registeredStudents.length;
    const facultyCount = JSON.parse(localStorage.getItem('facultyMembers') || '[]').length;
    
    const studentsCountEl = document.getElementById('dashboard-students-count');
    const facultyCountEl = document.getElementById('dashboard-faculty-count');
    const attendancePercentEl = document.getElementById('dashboard-attendance-percent');
    
    if (studentsCountEl) studentsCountEl.textContent = studentsCount;
    if (facultyCountEl) facultyCountEl.textContent = facultyCount;
    
    // Calculate average attendance
    let totalAttendance = 0;
    let attendanceRecords = 0;
    
    Object.keys(attendanceData).forEach(key => {
        const data = attendanceData[key];
        const students = Object.keys(data);
        if (students.length > 0) {
            const present = students.filter(s => data[s] === 'present').length;
            totalAttendance += (present / students.length) * 100;
            attendanceRecords++;
        }
    });
    
    const avgAttendance = attendanceRecords > 0 ? Math.round(totalAttendance / attendanceRecords) : 0;
    if (attendancePercentEl) attendancePercentEl.textContent = `${avgAttendance}%`;
}

// ============================================
// STUDENT MODULE
// ============================================

function setupStudentModule() {
    const registrationForm = document.getElementById('registration-form');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registerStudent();
        });
    }
    
    // Student list search and filter
    const searchInput = document.getElementById('search-student');
    const filterCourse = document.getElementById('filter-course-list');
    
    if (searchInput) {
        searchInput.addEventListener('input', displayStudentList);
    }
    
    if (filterCourse) {
        filterCourse.addEventListener('change', displayStudentList);
    }
}

function registerStudent() {
    const studentData = {
        studentId: document.getElementById('student-id').value,
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('date-of-birth').value,
        gender: document.getElementById('gender').value,
        course: document.getElementById('course').value,
        semester: document.getElementById('semester').value,
        address: document.getElementById('address').value,
        guardianName: document.getElementById('guardian-name').value,
        guardianPhone: document.getElementById('guardian-phone').value,
        registrationDate: new Date().toLocaleDateString()
    };

    registeredStudents.push(studentData);
    localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
    
    alert('Student registered successfully!');
    document.getElementById('registration-form').reset();
    updateDashboardStats();
}

function displayStudentList() {
    const searchTerm = document.getElementById('search-student')?.value.toLowerCase() || '';
    const filterCourse = document.getElementById('filter-course-list')?.value || '';
    
    let filteredStudents = registeredStudents;
    
    if (searchTerm) {
        filteredStudents = filteredStudents.filter(student => 
            student.fullName.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterCourse) {
        filteredStudents = filteredStudents.filter(student => 
            student.course === filterCourse
        );
    }
    
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No students found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredStudents.map(student => `
        <tr>
            <td>${student.studentId}</td>
            <td>${student.fullName}</td>
            <td>${student.email}</td>
            <td>${formatCourseName(student.course)}</td>
            <td>Semester ${student.semester}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewStudentDetails('${student.studentId}')">View</button>
            </td>
        </tr>
    `).join('');
}

function formatCourseName(course) {
    const names = {
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'business': 'Business Administration',
        'medicine': 'Medicine',
        'arts': 'Arts & Humanities',
        'science': 'Natural Sciences'
    };
    return names[course] || course;
}

// ============================================
// ATTENDANCE MODULE
// ============================================

let currentStudents = [];

function setupAttendanceModule() {
    const loadStudentsBtn = document.getElementById('load-students-btn');
    const saveAttendanceBtn = document.getElementById('save-attendance-btn');
    
    if (loadStudentsBtn) {
        loadStudentsBtn.addEventListener('click', loadStudentsForAttendance);
    }
    
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', saveAttendance);
    }
}

function loadStudentsForAttendance() {
    const date = document.getElementById('attendance-date').value;
    const course = document.getElementById('attendance-course').value;
    const semester = document.getElementById('attendance-semester').value;

    if (!date || !course || !semester) {
        alert('Please fill in all filter fields.');
        return;
    }

    currentStudents = registeredStudents.filter(student => 
        student.course === course && student.semester === semester
    );

    const attendanceTbody = document.getElementById('attendance-tbody');
    const attendanceSummary = document.getElementById('attendance-summary');
    
    if (currentStudents.length === 0) {
        attendanceTbody.innerHTML = '<tr class="no-data"><td colspan="4">No students found for selected course and semester.</td></tr>';
        attendanceSummary.style.display = 'none';
        return;
    }

    const dateKey = `${date}_${course}_${semester}`;
    const savedAttendance = attendanceData[dateKey] || {};

    attendanceTbody.innerHTML = currentStudents.map((student, index) => {
        const savedStatus = savedAttendance[student.studentId] || '';
        return `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.fullName}</td>
                <td>
                    <div class="status-buttons">
                        <button class="status-btn present ${savedStatus === 'present' ? 'active' : ''}" 
                                data-student-id="${student.studentId}" 
                                data-status="present">Present</button>
                        <button class="status-btn absent ${savedStatus === 'absent' ? 'active' : ''}" 
                                data-student-id="${student.studentId}" 
                                data-status="absent">Absent</button>
                    </div>
                </td>
                <td>
                    <span class="status-indicator" id="status-${student.studentId}">${savedStatus || 'Not marked'}</span>
                </td>
            </tr>
        `;
    }).join('');

    // Add event listeners to status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = this.getAttribute('data-student-id');
            const status = this.getAttribute('data-status');
            
            this.parentElement.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const statusIndicator = document.getElementById(`status-${studentId}`);
            if (statusIndicator) {
                statusIndicator.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            }
            
            updateAttendanceSummary();
        });
    });

    updateAttendanceSummary();
    attendanceSummary.style.display = 'flex';
}

function updateAttendanceSummary() {
    const presentCount = document.querySelectorAll('.status-btn.present.active').length;
    const absentCount = document.querySelectorAll('.status-btn.absent.active').length;
    const total = currentStudents.length;

    document.getElementById('total-students').textContent = total;
    document.getElementById('present-count').textContent = presentCount;
    document.getElementById('absent-count').textContent = absentCount;
    
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    document.getElementById('attendance-percentage').textContent = `${percentage}%`;
}

function saveAttendance() {
    const date = document.getElementById('attendance-date').value;
    const course = document.getElementById('attendance-course').value;
    const semester = document.getElementById('attendance-semester').value;

    if (!date || !course || !semester) {
        alert('Please fill in all filter fields.');
        return;
    }

    const dateKey = `${date}_${course}_${semester}`;
    const attendance = {};

    document.querySelectorAll('.status-btn.active').forEach(btn => {
        const studentId = btn.getAttribute('data-student-id');
        const status = btn.getAttribute('data-status');
        attendance[studentId] = status;
    });

    attendanceData[dateKey] = attendance;
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    
    alert('Attendance saved successfully!');
    updateDashboardStats();
}

// ============================================
// EXAMINATION MODULE
// ============================================

function setupExaminationModule() {
    const addExamBtn = document.getElementById('add-exam-btn');
    const addExamForm = document.getElementById('add-exam-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtn2 = document.querySelector('.close-modal-btn');
    const examSemesterFilter = document.getElementById('exam-semester');
    const examCourseFilter = document.getElementById('exam-course');
    const addExamModal = document.getElementById('add-exam-modal');
    
    if (addExamBtn) {
        addExamBtn.addEventListener('click', () => {
            addExamModal.classList.add('active');
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            addExamModal.classList.remove('active');
        });
    }
    
    if (closeModalBtn2) {
        closeModalBtn2.addEventListener('click', () => {
            addExamModal.classList.remove('active');
        });
    }
    
    if (addExamModal) {
        addExamModal.addEventListener('click', (e) => {
            if (e.target === addExamModal) {
                addExamModal.classList.remove('active');
            }
        });
    }
    
    if (addExamForm) {
        addExamForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewExam();
        });
    }
    
    if (examSemesterFilter) {
        examSemesterFilter.addEventListener('change', displayExams);
    }
    
    if (examCourseFilter) {
        examCourseFilter.addEventListener('change', displayExams);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function displayExams() {
    const examSemesterFilter = document.getElementById('exam-semester');
    const examCourseFilter = document.getElementById('exam-course');
    const examCards = document.getElementById('exam-cards');
    
    if (!examCards) return;
    
    const semesterFilter = examSemesterFilter?.value || '';
    const courseFilter = examCourseFilter?.value || '';

    let filteredExams = examSchedules;

    if (semesterFilter) {
        filteredExams = filteredExams.filter(exam => exam.semester === semesterFilter);
    }

    if (courseFilter) {
        filteredExams = filteredExams.filter(exam => 
            exam.course === courseFilter || exam.subject.toLowerCase().includes(courseFilter.toLowerCase())
        );
    }

    if (filteredExams.length === 0) {
        examCards.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No exams found for selected filters.</p>';
        return;
    }

    examCards.innerHTML = filteredExams.map(exam => `
        <div class="exam-card">
            <div class="exam-header">
                <h3>${exam.subject}</h3>
                <span class="exam-type">${exam.type}</span>
            </div>
            <div class="exam-details">
                <div class="exam-detail-item">
                    <span class="detail-icon">📅</span>
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formatDate(exam.date)}</span>
                </div>
                <div class="exam-detail-item">
                    <span class="detail-icon">⏰</span>
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${formatTime(exam.timeStart)} - ${formatTime(exam.timeEnd)}</span>
                </div>
                <div class="exam-detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-label">Venue:</span>
                    <span class="detail-value">${exam.venue}</span>
                </div>
                <div class="exam-detail-item">
                    <span class="detail-icon">📚</span>
                    <span class="detail-label">Semester:</span>
                    <span class="detail-value">Semester ${exam.semester}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function addNewExam() {
    const newExam = {
        subject: document.getElementById('exam-subject').value,
        date: document.getElementById('exam-date').value,
        timeStart: document.getElementById('exam-time-start').value,
        timeEnd: document.getElementById('exam-time-end').value,
        venue: document.getElementById('exam-venue').value,
        semester: document.getElementById('exam-semester-select').value,
        type: document.getElementById('exam-type-select').value,
        course: document.getElementById('exam-subject').value.toLowerCase().includes('computer') ? 'computer-science' :
                document.getElementById('exam-subject').value.toLowerCase().includes('engineering') ? 'engineering' :
                document.getElementById('exam-subject').value.toLowerCase().includes('business') ? 'business' : 'computer-science'
    };

    examSchedules.push(newExam);
    localStorage.setItem('examSchedules', JSON.stringify(examSchedules));
    
    displayExams();
    document.getElementById('add-exam-modal').classList.remove('active');
    document.getElementById('add-exam-form').reset();
    alert('Examination added successfully!');
}

// ============================================
// COURSE MODULE
// ============================================

function setupCourseModule() {
    // Course module is set up through page navigation
}

function displayCourseList() {
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) return;
    
    const courses = [
        { id: 'computer-science', name: 'Computer Science', icon: '💻', students: registeredStudents.filter(s => s.course === 'computer-science').length },
        { id: 'engineering', name: 'Engineering', icon: '⚙️', students: registeredStudents.filter(s => s.course === 'engineering').length },
        { id: 'business', name: 'Business Administration', icon: '💼', students: registeredStudents.filter(s => s.course === 'business').length },
        { id: 'medicine', name: 'Medicine', icon: '⚕️', students: registeredStudents.filter(s => s.course === 'medicine').length },
        { id: 'arts', name: 'Arts & Humanities', icon: '🎨', students: registeredStudents.filter(s => s.course === 'arts').length },
        { id: 'science', name: 'Natural Sciences', icon: '🔬', students: registeredStudents.filter(s => s.course === 'science').length }
    ];
    
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card" onclick="showPage('course-${course.id}')">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${course.icon}</div>
            <h3>${course.name}</h3>
            <p style="margin-top: 1rem; color: #666;">${course.students} Students Enrolled</p>
        </div>
    `).join('');
}

function displayCourseDetails(courseId) {
    const courseDetails = document.querySelector(`[data-course="${courseId}"]`);
    if (!courseDetails) return;
    
    const courseStudents = registeredStudents.filter(s => s.course === courseId);
    const courseExams = examSchedules.filter(e => e.course === courseId);
    
    courseDetails.innerHTML = `
        <div class="course-info-grid">
            <div class="course-info-card">
                <h4>Course Information</h4>
                <p><strong>Course Name:</strong> ${formatCourseName(courseId)}</p>
                <p><strong>Total Students:</strong> ${courseStudents.length}</p>
                <p><strong>Upcoming Exams:</strong> ${courseExams.length}</p>
            </div>
            <div class="course-info-card">
                <h4>Students by Semester</h4>
                ${getSemesterBreakdown(courseStudents)}
            </div>
        </div>
        <div style="margin-top: 2rem;">
            <h3>Enrolled Students</h3>
            <div class="students-table-container" style="margin-top: 1rem;">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${courseStudents.map(s => `
                            <tr>
                                <td>${s.studentId}</td>
                                <td>${s.fullName}</td>
                                <td>${s.email}</td>
                                <td>Semester ${s.semester}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="no-data">No students enrolled</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getSemesterBreakdown(students) {
    const breakdown = {};
    students.forEach(s => {
        breakdown[s.semester] = (breakdown[s.semester] || 0) + 1;
    });
    
    return Object.keys(breakdown).map(sem => 
        `<p><strong>Semester ${sem}:</strong> ${breakdown[sem]} students</p>`
    ).join('') || '<p>No students enrolled</p>';
}

// ============================================
// FACULTY MODULE
// ============================================

function setupFacultyModule() {
    // Faculty module setup
}

// ============================================
// ADMIN MODULE
// ============================================

function setupAdminModule() {
    // Admin module setup
}

// Initialize exams display on load
if (document.getElementById('exam-cards')) {
    displayExams();
}
