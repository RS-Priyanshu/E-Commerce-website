// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.querySelector('.modal .close');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const roleCards = document.querySelectorAll('.role-card');
const selectRoleBtns = document.querySelectorAll('.select-role');
const userRoleInput = document.getElementById('userRole');
const regRoleInput = document.getElementById('regRole');
const sellBtn = document.getElementById('sellBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const isFarmerCheckbox = document.getElementById('regIsFarmer');
const farmerFields = document.getElementById('farmerFields');
const googleLoginBtn = document.getElementById('googleLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5ZJ4Q6XQ6XQ6XQ6XQ6XQ6XQ6XQ6XQ6XQ",
    authDomain: "farmers-market-ecommerce.firebaseapp.com",
    projectId: "farmers-market-ecommerce",
    storageBucket: "farmers-market-ecommerce.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || {});
            
            // Update UI for logged in user
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            // Redirect based on role
            if (currentUser.isFarmer && window.location.pathname.includes('index.html')) {
                window.location.href = 'farmer-dashboard.html';
            } else if (!currentUser.isFarmer && window.location.pathname.includes('index.html')) {
                window.location.href = 'products.html';
            }
        } else {
            // User is signed out
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            
            // Clear current user from localStorage
            localStorage.removeItem('currentUser');
        }
    });
}

// Select Role Functionality
selectRoleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const role = e.target.getAttribute('data-role');
        userRoleInput.value = role;
        regRoleInput.value = role;
        
        // Show auth modal with register form
        authModal.style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        
        // Show farmer fields if role is farmer
        farmerFields.style.display = role === 'farmer' ? 'block' : 'none';
    });
});

// Sell Button (for farmers)
if (sellBtn) {
    sellBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'block';
        userRoleInput.value = 'farmer';
        regRoleInput.value = 'farmer';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        farmerFields.style.display = 'block';
    });
}

// Tab Switching in Auth Modal
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        
        // Update active tab
        tabBtns.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding form
        if (tab === 'login') {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
        } else {
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('loginForm').style.display = 'none';
        }
    });
});

// Show Register Form
if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        
        // Update active tab
        tabBtns.forEach(t => t.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="register"]').classList.add('active');
    });
}

// Show Login Form
if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        
        // Update active tab
        tabBtns.forEach(t => t.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
    });
}

// Close Modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        authModal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    });
}

// Toggle farmer fields in registration
if (isFarmerCheckbox) {
    isFarmerCheckbox.addEventListener('change', function() {
        farmerFields.style.display = this.checked ? 'block' : 'none';
    });
}

// Initialize cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateCartCount();
});