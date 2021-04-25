import { html, render } from './node_modules/lit-html/lit-html.js';

const dropdownTemplate = (list) => html`
<select id="menu">
    ${list.map(t => html`<option value="${t._id}">${t.text}</option>`)}
</select>`;

const url = 'http://localhost:3030/jsonstore/advanced/dropdown';
const main = document.querySelector('div');
const input = document.getElementById('itemText');
start();

async function start() {
    document.querySelector('form').addEventListener('submit', (ev) => addItem(ev, list));

    const response = await fetch(url);
    const data = await response.json();
    const list = Object.values(data);

    update(list);
}


async function update(list) {
    const result = dropdownTemplate(list);
    render(result, main);
}

async function addItem(ev, list) {
    ev.preventDefault();

    if (input.value == '') {
        return alert('Input field cannot be empty!');
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input.value.trim() })
    });
    const result = await response.json();

    list.push(result);

    input.value = '';
    update(list);
}