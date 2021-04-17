function start() {
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('loadBooks').addEventListener('click', loadAllBooks);
  document.getElementById('createForm').addEventListener('submit', createBook);
  document.querySelector('table').addEventListener('click', handleClickEvent);
  document.getElementById('editForm').addEventListener('submit', updateBook);
}

start();

async function handleClickEvent(event) {
  if (event.target.className == 'editBtn') {
    document.getElementById('createForm').style.display = 'none';
    document.getElementById('editForm').style.display = 'block';
    const id = event.target.parentNode.parentNode.dataset.id;
    await loadBookForEdit(id);
  } else if (event.target.className == 'deleteBtn') {
    const confirmed = confirm('Are you sure you want to DELETE this book?');
    if (confirmed) {
      const bookId = event.target.parentNode.parentNode.dataset.id;
      deleteBook(bookId);
    }
  }
}

async function loadBookForEdit(bookId) {
  const book = await request(
    'http://localhost:3030/jsonstore/collections/books/' + bookId
  );
  document.querySelector('#editForm [name="id"]').value = bookId;
  document.querySelector('#editForm [name="title"]').value = book.title;
  document.querySelector('#editForm [name="author"]').value = book.author;
}

function createRow([id, book]) {
  const result = `
    <tr data-id="${id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        </td>
    </tr>`;

  return result;
}

async function loadAllBooks() {
  const books = await request(
    'http://localhost:3030/jsonstore/collections/books'
  );
  const rows = Object.entries(books).map(createRow).join('');
  document.querySelector('tbody').innerHTML = rows;
}

async function createBook(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const book = {
    title: formData.get('title'),
    author: formData.get('author'),
  };

  if (book.title == '' || book.author == '') {
    return alert('Title or Author cannot be white space!');
  }

  await request('http://localhost:3030/jsonstore/collections/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });

  event.target.reset();
  loadAllBooks();
}

async function deleteBook(id) {
  await request('http://localhost:3030/jsonstore/collections/books/' + id, {
    method: 'DELETE',
  });

  loadAllBooks();
}

async function updateBook(event) {
  event.preventDefault();
  formData = new FormData(event.target);
  const id = formData.get('id');

  const book = {
    title: formData.get('title'),
    author: formData.get('author'),
  };

  await request('http://localhost:3030/jsonstore/collections/books/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });

  document.getElementById('createForm').style.display = 'block';
  document.getElementById('editForm').style.display = 'none';

  loadAllBooks();
}

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    alert(error.message);
    throw new Error(error.message);
  }
  return await response.json();
}
