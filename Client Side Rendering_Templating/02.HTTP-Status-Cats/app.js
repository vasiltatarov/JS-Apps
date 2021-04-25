import { render } from './node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';
import catTemplate from './cat.js';

const body = document.getElementById('allCats');

const result = catTemplate(cats);

render(result, body);
