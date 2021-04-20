import { e } from './dom.js';
import { showHome } from './home.js';
import { showEdit } from './edit.js';

async function getLikesByMovieId(id) {
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`);
    return await response.json();
}

async function getOwnLikesByMovieId(movieId) {
    const userId = sessionStorage.getItem('userId');
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22`);
    return await response.json();
}

async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const movie = await response.json();
    return movie;
}

async function onDelete(ev, movieId) {
    ev.preventDefault();

    const confirmed = confirm('Are you sure you want to delete this movie?');
    if (confirmed) {
        const response = await fetch('http://localhost:3030/data/movies/' + movieId, {
            method: 'DELETE',
            headers: {
                'X-Authorization': sessionStorage.getItem('authToken')
            }
        });
        if (response.ok) {
            alert('Movie deleted successfully');
            showHome();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    }
}

function createMovieCard(movie, likes, ownLikes) {
    const controls = e('div', { className: 'col-md-4 text-center' },
        e('h3', { className: 'my-3' }, 'Movie Description'),
        e('p', {}, movie.description)
    );

    const userId = sessionStorage.getItem('userId');
    if (userId != null) {
        if (userId == movie._ownerId) {
            controls.appendChild(e('a', { className: 'btn btn-danger m-1', href: '#', onClick: (e) => onDelete(e, movie._id) }, 'Delete'));
            controls.appendChild(e('a', { className: 'btn btn-warning m-1', href: '#', onClick: () => showEdit(movie._id) }, 'Edit'));
        } else if (ownLikes.length == 0) {
            controls.appendChild(e('a', { className: 'btn btn-primary m-1', href: '#', onClick: likeMovie }, 'Like'));
        }
    }
    const likesSpan = e('span', { className: 'enrolled-span' }, likes + ' like' + (likes == 1 ? '' : 's'));
    controls.appendChild(likesSpan);

    const element = document.createElement('div');
    element.className = 'container';
    element.appendChild(e('div', { className: 'row bg-light text-dark' },
        e('h1', {}, `Movie title: ${movie.title}`),
        e('div', { className: 'col-md-8' }, e('img', { className: 'img-thumbnail', src: movie.img })),
        controls
    ));

    return element;

    async function likeMovie(ev) {
        const response = await fetch('http://localhost:3030/data/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessionStorage.getItem('authToken')
            },
            body: JSON.stringify({ movieId: movie._id })
        });
        if (response.ok) {
            ev.target.remove();
            likes++;
            likesSpan.textContent = likes + ' like' + (likes == 1 ? '' : 's');
        }
    }
}

let main;
let section;

export function setupDetails(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
}

export async function showDetails(id) {
    section.innerHTML = '';
    main.innerHTML = '';
    main.appendChild(section);

    const [movie, likes, ownLikes] = await Promise.all([
        getMovieById(id),
        getLikesByMovieId(id),
        getOwnLikesByMovieId(id)
    ]);
    const movieCard = createMovieCard(movie, likes, ownLikes);
    section.appendChild(movieCard);
}