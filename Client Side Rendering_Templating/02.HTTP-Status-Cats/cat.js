import { html } from './node_modules/lit-html/lit-html.js';

const catTemplate = (data) => html`
<ul>
    ${data.map(c => html`
    <li>
        <img src="./images/${c.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
        <div class="info">
            <button @click=${onClick} class="showBtn">Show status code</button>
            <div class="status" style="display: none" id="${c.id}">
                <h4>Status Code: ${c.statusCode}</h4>
                <p>${c.statusMessage}</p>
            </div>
        </div>
    </li>`)}
</ul>`;

function onClick(ev) {
    const element = ev.target.parentNode;
    const currentStyle = element.querySelector('.status').style.display;
    const currentText = element.querySelector('.showBtn');

    if (currentStyle == 'none') {
        element.querySelector('.status').style.display = 'block';
        currentText.textContent = 'Hide status code';
    } else {
        element.querySelector('.status').style.display = 'none';
        currentText.textContent = 'Show status code';
    }
}

export default catTemplate;