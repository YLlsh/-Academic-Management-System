from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods

# Demo user credentials (replace with database authentication)
DEMO_USERS = {
    'admin': [
        {'username': 'admin', 'password': 'admin123', 'name': 'Admin User'},
        {'username': 'administrator', 'password': 'admin', 'name': 'System Administrator'}
    ],
    'faculty': [
        {'username': 'faculty', 'password': 'faculty123', 'name': 'Faculty Member'},
        {'username': 'professor', 'password': 'prof123', 'name': 'Professor'},
        {'username': 'teacher', 'password': 'teacher123', 'name': 'Teacher'}
    ],
    'student': [
        {'username': 'student', 'password': 'student123', 'name': 'Student'},
        {'username': 'student1', 'password': 'student', 'name': 'Student One'},
        {'username': 'student2', 'password': 'student', 'name': 'Student Two'}
    ]
}


def index(request):
    """Role selection page (home page)"""
    return render(request, 'index.html')


@require_http_methods(["GET", "POST"])
def login_view(request):
    """Login page with role-based authentication"""
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        role = request.GET.get('role') or request.session.get('selected_role')
        remember_me = request.POST.get('remember-me') == 'on'
        
        if not username or not password:
            messages.error(request, 'Please enter both username and password.')
            return render(request, 'login.html', {'role': role})
        
        # Check credentials against demo users
        if role and role in DEMO_USERS:
            user_list = DEMO_USERS[role]
            user = next(
                (u for u in user_list if u['username'].lower() == username.lower() and u['password'] == password),
                None
            )
            
            if user:
                # Set session data
                request.session['user_role'] = role
                request.session['user_name'] = user['name']
                request.session['username'] = user['username']
                request.session['user'] = user['name']
                
                
                # Set session expiry based on remember me
                if remember_me:
                    request.session.set_expiry(86400 * 30)  # 30 days
                else:
                    request.session.set_expiry(0)  # Session cookie (until browser closes)
                
                # Clear selected role from session
                if 'selected_role' in request.session:
                    del request.session['selected_role']
                
                return redirect('dashboard')
        
        messages.error(request, 'Invalid username or password. Please try again.')
    
    # GET request or failed login
    role = request.GET.get('role') or request.session.get('selected_role')
    if role:
        request.session['selected_role'] = role
    
    return render(request, 'login.html', {'role': role})


def dashboard(request):
    """Dashboard page - requires authentication"""
    # Get user data from session
    user_role = request.session.get('user_role')
    user_name = request.session.get('user_name', 'User')
    username = request.session.get('username', 'user')
    
    # If no session data, redirect to login
    # if not user_role:
    #     messages.info(request, 'Please login to access the dashboard.')
    #     return redirect('index')
    
    context = {
        'user_role': user_role,
        'user_name': user_name,
        'username': username,
    }
    
    return render(request, 'dashbaord.html', context)

def student_regi(request):
    """Dashboard page - requires authentication"""
    user_role = request.session.get('user_role')
    user_name = request.session.get('user_name', 'User')
    username = request.session.get('username', 'user')
    # Get user data from session
 
    # If no session data, redirect to login
    # if not user_role:
    #     messages.info(request, 'Please login to access the dashboard.')
    #     return redirect('index')
    # if not request.session.get('user'):
    #     return redirect('academic_app:login')
    context = {
        'user_role': user_role,
        'user_name': user_name,
        'username': username,
    }
    
    
    return render(request, 'student_regi.html',context )


def logout_view(request):
    """Logout and clear session"""
    request.session.flush()
    messages.success(request, 'You have been logged out successfully.')
    return redirect('index')

