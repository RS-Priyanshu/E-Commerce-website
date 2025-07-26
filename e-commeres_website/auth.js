// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');

// Email/Password Login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('userRole').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Get user data from Firestore
                return db.collection('users').doc(userCredential.user.uid).get();
            })
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // Save user data to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Redirect based on role
                    if (userData.isFarmer) {
                        window.location.href = 'farmer-dashboard.html';
                    } else {
                        window.location.href = 'products.html';
                    }
                } else {
                    alert('User data not found!');
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// Email/Password Registration
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const phone = document.getElementById('regPhone').value;
        const address = document.getElementById('regAddress').value;
        const role = document.getElementById('regRole').value;
        const isFarmer = role === 'farmer';
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Create user in Firebase Auth
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Prepare user data for Firestore
                const userData = {
                    id: user.uid,
                    name,
                    email,
                    phone,
                    address,
                    isFarmer,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                // Add farmer-specific fields if farmer
                if (isFarmer) {
                    userData.farmName = document.getElementById('regFarmName').value;
                    userData.location = document.getElementById('regLocation').value;
                    userData.verified = false; // Farmers need to be verified
                }
                
                // Save user data to Firestore
                return db.collection('users').doc(user.uid).set(userData);
            }   
            ,then(() => {
                // Save user data to localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    ...userData,
                    id: user.uid
                }));
                
                // Show success message
                alert(`Registration successful! ${isFarmer ? 'Your farmer account is pending verification.' : ''}`);
                
                // Redirect based on role
                if (isFarmer) {
                    window.location.href = 'farmer-dashboard.html';
                } else {
                    window.location.href = 'products.html';
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    }
    );
}
// Google Login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                
                // Prepare user data for Firestore
                const userData = {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    isFarmer: false, // Default to false, can be updated later
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                // Save user data to Firestore
                return db.collection('users').doc(user.uid).set(userData);
            })
            .then(() => {
                // Save user data to localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Redirect to products page
                window.location.href = 'products.html';
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}