import { showDetails } from './details.js';

async function getMovie(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const movie = await response.json();
    return movie;
}

let main;
let section;
let movieId;

export function setupEdit(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');
    form.addEventListener('submit', (ev) => onSubmit(ev));

    async function onSubmit(ev) {
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

        const token = sessionStorage.getItem('authToken');
        if (token == null) {
            return alert('You\'re not logged in!');
        }

        try {
            const response = await fetch('http://localhost:3030/data/movies/' + movieId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                body: JSON.stringify(movie)
            });

            if (response.ok) {
                showDetails(movieId);
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (err) {
            alert(err.message);
        }
    }
}

export async function showEdit(id) {
    main.innerHTML = '';
    main.appendChild(section);

    movieId = id;
    const movie = await getMovie(id);

    // Fill current movie data
    section.querySelector('[name="title"]').value = movie.title;
    section.querySelector('[name="description"]').value = movie.description;
    section.querySelector('[name="imageUrl"]').value = movie.img;
}