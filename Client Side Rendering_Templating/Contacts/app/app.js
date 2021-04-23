import { render } from './node_modules/lit-html/lit-html.js';
import { contacts } from './contacts.js';
import cardTemplate from './card.js';

const cardsResult = contacts.map(cardTemplate);

const body = document.getElementById('contacts');

render(cardsResult, body);