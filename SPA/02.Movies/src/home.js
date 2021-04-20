import { showDetails } from './details.js';

export async function getMovies() {
    const response = await fetch('http://localhost:3030/data/movies');
    const movies = await response.json();

    return movies;
}

function createMoviePreview(movie) {
    const element = document.createElement('div');
    element.className = 'card mb-4';
    element.innerHTML = `
        <img class="card-img-top"
            src="${movie.img}"
            alt="Card image cap" width="400">
        <div class="card-body">
            <h4 class="card-title">${movie.title}</h4>
        </div>
        <div class="card-footer">
            <button id="${movie._id}" type="button" class="btn btn-info movieDetailsLink">Details</button>
        </div>`;

    return element;
}

let main;
let section;
let container;

export function setupHome(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
    container = document.querySelector('.card-deck.d-flex.justify-content-center');

    container.addEventListener('click', (ev) => {
        if (ev.target.classList.contains('movieDetailsLink')) {
            showDetails(ev.target.id);
        }
    })
}

export async function showHome() {
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

    container.innerHTML = 'Loading&hellip;';
    main.innerHTML = '';
    main.appendChild(section);

    const movies = await getMovies();
    const cards = movies.map(createMoviePreview);

    const fragment = document.createDocumentFragment();
    cards.forEach(c => fragment.appendChild(c));

    container.innerHTML = '';
    container.appendChild(fragment);
}