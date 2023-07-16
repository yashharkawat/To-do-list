let to_do_list = [];
let id = 0;

fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then((data) => {
    if (localStorage.length === 0) {
      data.forEach((item) => {
        to_do_list.push({ txt: item.title, id: id });
        id++;
      });
      localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
      localStorage.setItem('id', id);
    } else {
      id = localStorage.getItem('id');
      to_do_list = JSON.parse(localStorage.getItem('to_do_list'));
    }
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });

document.addEventListener('DOMContentLoaded', () => {
  function add(txt) {
    if (txt.length === 0) return;
    to_do_list.push({ txt: txt, id: id });
    id++;
    localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
    localStorage.setItem('id', id);
  }

  function display_on_webpage(txt, id) {
    let item = document.querySelector('.display_list');
    let element_with_delete = document.createElement('ul');
    let element = document.createElement('li');
    let del = document.createElement('button');

    element.innerHTML = txt;

    del.innerHTML = 'Delete';
    del.setAttribute('id', id);
    del.classList.add('delete');
    
    
    element.style.marginRight = '50px';
    element_with_delete.appendChild(element);
    element_with_delete.appendChild(del);

    let new_id = 'delete_' + id;
    element_with_delete.classList.add(new_id);
    element_with_delete.classList.add("to_do_element");

    del.setAttribute('id', new_id);
    item.appendChild(element_with_delete);

    let items = document.querySelectorAll('.delete');
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        let parent = item.parentNode;
        let grand_parent = parent.parentNode;
        grand_parent.removeChild(parent);
        parent.innerHTML = null;
        let idd = item.getAttribute('id');
        let new_idd = idd.slice(7);
        to_do_list[new_idd].txt = -1;
        localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
        display();
      });
    });
    let element_id = 'element' + id;
    element.setAttribute('id', element_id);
    element.addEventListener('click', (e) => {
      let input_id = e.target.getAttribute('id');
      convert_to_input(input_id);
    });
  }

  function convert_to_input(element_id) {
    let arr_id = element_id.slice(7);
    let text_element = document.getElementById(element_id);
    let text_content = text_element.textContent;
    let text_element_parent = text_element.parentNode;

    let parent = text_element_parent.parentNode;

    let input_element = document.createElement('input');
    input_element.value = text_content;

    let save_button = document.createElement('button');
    save_button.textContent = 'Save';
    save_button.classList.add('save_input');

    let input = document.createElement('div');
    input.append(input_element, save_button);
    input.classList.add('element_input');

    parent.replaceChild(input, text_element_parent);
    input_element.focus();

    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        text_element.textContent = input_element.value;
        parent.replaceChild(text_element_parent, input);
        to_do_list[arr_id].txt = input_element.value;
        localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
      }
    });
    save_button.addEventListener('click', (e) => {
      text_element.textContent = input_element.value;
      parent.replaceChild(text_element_parent, input);
      to_do_list[arr_id].txt = input_element.value;
      localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
    });
  }

  function display() {
    let item = document.querySelector('.display_list');
    item.innerHTML = null;
    to_do_list.forEach((item) => {
      if (item.txt !== -1) {
        display_on_webpage(item.txt, item.id);
      }
    });
  }

  document.querySelector('.save_button').addEventListener('click', () => {
    let item = document.querySelector('.save');
    let txt = item.value;
    item.value = null;
    add(txt);
    if (txt.length > 0) display();
  });

  document.querySelector('.display').addEventListener('click', (e) => {
    display();
  });

  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      let item = document.querySelector('.save');
      let txt = item.value;
      item.value = null;
      add(txt);
      if (txt.length > 0) display();
    }
  });

  document.querySelector('.hide').addEventListener('click', (e) => {
    let item = document.querySelector('.display_list');
    item.innerHTML = null;
  });
});
