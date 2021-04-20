import { showHome } from "./home.js";

let main;
let section;

async function onSubmit(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const repass = formData.get('repeatPassword');

    if (email == '' || password == '') {
        return alert('All fields are required!');
    } else if (password != repass) {
        return alert('Password and Repeat Password must be the same');
    }

    const response = await fetch('http://localhost:3030/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('authToken', data.accessToken);
        sessionStorage.setItem('userId', data._id);
        sessionStorage.setItem('email', data.email);

        [...document.querySelectorAll('nav .user')].forEach(l => l.getElementsByClassName.display = 'block');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.getElementsByClassName.display = 'none');

        showHome();
    }
    else {
        const error = await response.json();
        alert(error.message);
    }
}

export function setupRegister(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showRegister() {
    main.innerHTML = '';
    main.appendChild(section);
}