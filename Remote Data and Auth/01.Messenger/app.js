function attachEvents() {
  document.getElementById('submit').addEventListener('click', async () => {
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    if (author == '' || content == '') {
      return alert('Invalid data!');
    }

    await sendMessage({ author, content });

    document.getElementById('author').value = '';
    document.getElementById('content').value = '';

    getMessages();
  });

  document.getElementById('refresh').addEventListener('click', getMessages);
  getMessages();

  //it will get information about new messages for every 10 seconds without refresh page!
  setInterval(getMessages, 10000);
}

attachEvents();

async function getMessages() {
  const url = 'http://localhost:3030/jsonstore/messenger';
  const response = await fetch(url);
  const data = await response.json();

  document.getElementById('messages').value = Object.values(data)
    .map((m) => `${m.author}: ${m.content}`)
    .join('\n');
}

async function sendMessage(message) {
  const response = await fetch('http://localhost:3030/jsonstore/messenger', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
