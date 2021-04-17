function attachEvents() {
  let ulElement = document.getElementById('phonebook');
  let createPersonElement = document.getElementById('person');
  let createPhoneElement = document.getElementById('phone');
  let url = 'http://localhost:3030/jsonstore/phonebook';

  window.addEventListener('click', function (e) {
    if (e.target.textContent === 'Load') {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (ulElement.hasChildNodes()) {
            while (ulElement.hasChildNodes()) {
              ulElement.lastElementChild.remove();
            }
          }
          loadContacts(data);
        });
    } else if (e.target.textContent === 'Delete') {
      e.target.parentNode.remove();
      fetch(url + '/' + e.target.parentNode.id, {
        method: 'DELETE',
      });
    } else if (e.target.textContent === 'Create') {
      let data = {
        person: createPersonElement.value,
        phone: createPhoneElement.value,
      };
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      createPhoneElement.value = '';
      createPersonElement.value = '';
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (ulElement.hasChildNodes()) {
            while (ulElement.hasChildNodes()) {
              ulElement.lastElementChild.remove();
            }
          }
          loadContacts(data);
        });
    }
  });

  function generateElement(type, content, id) {
    const result = document.createElement(type);
    result.textContent = content;
    result.id = id;

    return result;
  }

  function loadContacts(data) {
    Object.entries(data).forEach(([key, value]) => {
      let name = value.person;
      let phone = value.phone;
      let id = value._id;

      let newElement = generateElement('li', `${name}: ${phone}`, id);
      let delBtn = generateElement('button', 'Delete');
      newElement.appendChild(delBtn);
      ulElement.appendChild(newElement);
    });
  }
}

attachEvents();
