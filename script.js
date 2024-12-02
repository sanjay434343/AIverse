// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-nKyC-hpcOj1e0IKMh9E8VqOKvkKr3L4",
    authDomain: "chatzi-96d60.firebaseapp.com",
    databaseURL: "https://chatzi-96d60-default-rtdb.firebaseio.com",
    projectId: "chatzi-96d60",
    storageBucket: "chatzi-96d60.appspot.com",
    messagingSenderId: "8860860390",
    appId: "1:8860860390:android:9583a63e784a116e3c6027",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth state observer
let currentUser = null;
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        hideAuthModal();
        enableInterface();
        updateUserWelcome(user);
    } else {
        currentUser = null;
        disableInterface();
        hideUserWelcome();
    }
});

// Update user welcome message
function updateUserWelcome(user) {
    const welcomeDiv = document.getElementById('userWelcome');
    const userProfilePic = document.getElementById('userProfilePic');
    const userName = document.getElementById('userName');

    if (welcomeDiv && userProfilePic && userName && user) {
        userProfilePic.src = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName);
        userName.textContent = ` ${user.displayName}`;
        welcomeDiv.classList.remove('d-none');
    }
}

function hideUserWelcome() {
    const welcomeDiv = document.getElementById('userWelcome');
    if (welcomeDiv) {
        welcomeDiv.classList.add('d-none');
    }
}

// Show/Hide auth modal
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('show');
    }
}

function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('show');
    }
}

// Enable/Disable interface
function enableInterface() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    if (messageInput && sendButton) {
        messageInput.disabled = false;
        sendButton.disabled = false;
    }
}

function disableInterface() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    if (messageInput && sendButton) {
        messageInput.disabled = true;
        sendButton.disabled = true;
    }
}

// Google Sign In
const googleSignInButton = document.getElementById('googleSignIn');
if (googleSignInButton) {
    googleSignInButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).catch((error) => {
            console.error('Error signing in:', error);
        });
    });
}

// Check auth before actions
function checkAuth() {
    if (!currentUser) {
        showAuthModal();
        return false;
    }
    return true;
}

// Handle Explore Button Click
const exploreButtons = document.querySelectorAll('.explore-btn');
exploreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent immediate redirection
        console.log('Explore button clicked. Current user:', currentUser);
        if (!currentUser) {
            console.log('User not logged in. Showing auth modal.');
            showAuthModal(); // Show modal if not logged in
        } else {
            console.log('Access granted to Explore page');
            // Redirect to the desired section or page
            window.open(button.getAttribute('href'), '_blank');
        }
    });
});

// Login Button in Modal
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error('Error signing in:', error);
    });
});

// Add auth check to try buttons
const tryButtons = document.querySelectorAll('.try-button, .explore-btn');
if (tryButtons) {
    tryButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (checkAuth()) {
                    // Continue with the action
                    const targetSection = document.querySelector(button.getAttribute('href'));
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    });
}

// Smooth scroll for navigation links
const navigationLinks = document.querySelectorAll('a[href^="#"]');
if (navigationLinks) {
    navigationLinks.forEach(anchor => {
        if (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetSection = document.querySelector(this.getAttribute('href'));
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

// Smooth scrolling for navigation buttons
const navButtons = document.querySelectorAll('a[href^="#"]');
navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add hover effects and animations for tool cards
const toolCards = document.querySelectorAll('.tool-card');
if (toolCards) {
    toolCards.forEach(card => {
        if (card) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        }
    });
}

// Add intersection observer for smooth fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards for scroll animations
const sectionsAndCards = document.querySelectorAll('section, .tool-card, .feature-card');
if (sectionsAndCards) {
    sectionsAndCards.forEach(element => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        }
    });
}

// Update login/logout button based on auth status
firebase.auth().onAuthStateChanged((user) => {
    const signOutBtn = document.getElementById('signOutBtn');
    if (user) {
        signOutBtn.textContent = 'Sign Out';
        signOutBtn.classList.remove('btn-success');
        signOutBtn.classList.add('text-danger');
    } else {
        signOutBtn.textContent = 'Login';
        signOutBtn.classList.remove('text-danger');
        signOutBtn.classList.add('btn-success');
        signOutBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).catch((error) => {
                console.error('Error signing in:', error);
            });
        });
    }
});

// Sign Out
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
        if (signOutBtn.textContent === 'Sign Out') {
            firebase.auth().signOut().then(() => {
                console.log('User signed out successfully.');
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        }
    });
}

// Basic Hamburger Menu Toggle
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Close navbar when clicking outside of it
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar-collapse');
    const isClickInside = navbar.contains(event.target);

    if (!isClickInside && navbar.classList.contains('show')) {
        $(navbar).collapse('hide');
    }
});
