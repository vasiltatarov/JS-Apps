
import { render } from './node_modules/lit-html/lit-html.js';
import townTemplate from './town.js';

document.getElementById('btnLoadTowns').addEventListener('click', updateList);

function updateList(ev) {
    ev.preventDefault();
    const townsAsStr = document.getElementById('towns').value;
    const body = document.getElementById('root');

    const towns = townsAsStr.split(',').map(el => el.trim());
    const result = townTemplate(towns);

    render(result, body);

    document.getElementById('towns').value = '';
}