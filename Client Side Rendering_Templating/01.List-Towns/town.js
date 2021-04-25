import { html } from './node_modules/lit-html/lit-html.js';

const townTemplate = (data) => html`
<ul>
    ${data.map(el => html`<li>${el}</li>`)}
</ul>`;

export default townTemplate;