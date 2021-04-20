import { setupHome, showHome } from './home.js';
import { setupCreate, showCreate } from './create.js';
import { setupDetails, showDetails } from './details.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';
import { setupEdit, showEdit } from './edit.js';

const main = document.querySelector('main');
const links = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,
    'createLink': showCreate,
    'movie-example': showDetails,
    'edit-movie': showEdit,
};

setupSection('home-page', setupHome);
setupSection('add-movie', setupCreate);
setupSection('movie-example', setupDetails);
setupSection('edit-movie', setupEdit);
setupSection('form-login', setupLogin);
setupSection('form-sign-up', setupRegister);

setupNavigation();
// Start application in home view
showHome();

function setupSection(sectionId, setup) {
    const section = document.getElementById(sectionId);
    setup(main, section);
}

function setupNavigation() {
    // Chech if user is log-in or not 
    const email = sessionStorage.getItem('email');

    if (email != null) {
        document.getElementById('welcomeMsg').textContent = `Welcome ${email}`;
        [...document.querySelectorAll('nav .user')].forEach(l => l.style.display = 'block');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.style.display = 'none');
    } else {
        [...document.querySelectorAll('nav .user')].forEach(l => l.style.display = 'none');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.style.display = 'block');
    }

    // Clear sessionStorage when user clicked on logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    document.querySelector('nav').addEventListener('click', (ev) => {
        if (ev.target.tagName == 'A') {
            const view = links[ev.target.id];
            if (typeof view == 'function') {
                ev.preventDefault();
                view();
            }
        }
    });
    document.getElementById('createLink').addEventListener('click', (ev) => {
        ev.preventDefault();
        showCreate();
    });
}

async function logout() {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'GET',
        headers: { 'X-Authorization': token }
    });

    if (response.ok) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('email');

        [...document.querySelectorAll('nav .user')].forEach(l => l.style.display = 'none');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.style.display = 'block');

        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}