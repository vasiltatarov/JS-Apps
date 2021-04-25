import { render } from './node_modules/lit-html/lit-html.js';
import rowTemplate from './rowTemplate.js';

const main = document.querySelector('tbody');
solve();

async function solve() {
   document.querySelector('#searchBtn').addEventListener('click', onClick);

   const data = await fetchData();
   const students = Object.values(data);

   update(students);

   function onClick() {
      const input = document.getElementById('searchField').value;
      update(students, input);
   }
}

function update(list, match = '') {
   const result = list.map(e => rowTemplate(e, compare(e, match)));
   render(result, main);
}

function compare(item, match) {
   return Object.values(item).some(e => match && e.toLowerCase().includes(match.toLowerCase()));
}

async function fetchData() {
   const response = await fetch('http://localhost:3030/jsonstore/advanced/table');
   return await response.json();
}