// Role Selection Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll('.role-card');
    
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const role = card.getAttribute('data-role');
            // Store selected role and redirect to login page
            localStorage.setItem('selectedRole', role);
            // Use Django URL pattern - will be replaced with {% url 'login' %} in template
            // For now, using relative path that works with Django URL routing
            const loginUrl = window.location.origin + '/login/';
            window.location.href = loginUrl;
        });
    });
});

