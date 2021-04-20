import { showHome } from './home.js';

async function onSubmit(ev, movieId) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const movie = {
        title: formData.get('title'),
        description: formData.get('description'),
        img: formData.get('imageUrl')
    };

    if (movie.title == '' || movie.description == '' || movie.img.slice(0, 4) != 'http') {
        return alert('All fields are required!');
    }

    const response = await fetch('http://localhost:3030/data/movies/' + movieId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('authToken')
        },
        body: JSON.stringify(movie)
    });

    if (response.ok) {
        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}

let main;
let section;

export function setupEdit(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
}

export async function showEdit(movieId) {
    main.innerHTML = '';
    main.appendChild(section);

    // Get movie with this id
    const response = await fetch('http://localhost:3030/data/movies/' + movieId);
    const movie = await response.json();

    // Get current movie data
    const form = section.querySelector('form');
    form.title.value = movie.title;
    form.description.value = movie.description;
    form.imageUrl.value = movie.img;

    form.addEventListener('submit', (ev) => onSubmit(ev, movieId));
}