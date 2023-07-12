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
    // Process the received data
    data.forEach((item)=>{
        to_do_list.push({txt:`• ${item.title}`,id:id});
        id++;
        
    })
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request
    console.log('Error:', error.message);
  });

document.addEventListener('DOMContentLoaded', function() {
    function add(txt) {
        if (txt.length == 0) return;

        let text='• ' + txt;
        to_do_list.push({txt:text,id:id})
        id++;
    }
    function display_on_webpage(txt, id) {
        let item = document.querySelector('.display_list');

        let element_with_delete = document.createElement('div');
        let element = document.createElement('div');
        let del = document.createElement('button');

        element.innerHTML = txt;

        del.innerHTML = 'Delete';
        del.setAttribute('id', id);
        del.classList.add('delete');

        del.style.backgroundColor = '#ee3425';
        del.style.color = 'white';
        del.style.border = '1px transparent';
        del.style.borderRadius = '8px';
        del.style.textAlign = 'center';
        del.style.justifyContent = 'center';
        del.style.paddingTop = '5px';
        del.style.paddingLeft = '7px';
        del.style.paddingBottom = '5px';
        del.style.paddingRight = '7px';
        del.style.fontWeight = 'bold';
        del.style.cursor = 'pointer';

        element_with_delete.style.display = 'flex';
        element_with_delete.style.alignItems = 'center';
        element_with_delete.style.justifyContent = 'center';
        element_with_delete.style.marginBottom = '30px';
        element.style.marginRight = '50px';
        element_with_delete.appendChild(element);
        element_with_delete.appendChild(del);

        let new_id = 'delete_' + id;
        element_with_delete.classList.add(new_id);

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
                to_do_list[new_idd].txt=-1;
                display();
            });
        });
    }

    function list_heading() {
        let item = document.createElement('h2');
        item.innerText = 'My List';
        let par = document.querySelector('.display_list');
        par.appendChild(item);
    }


    function display() {
        let item = document.querySelector('.display_list');
        item.innerHTML = null;
        list_heading();
        to_do_list.forEach((item)=>{
            if(item.txt!=-1){
                display_on_webpage(item.txt, item.id);
            }
        })
    }

    document.querySelector('.save_button').addEventListener('click', () => {
        let item = document.querySelector('.save');
        let txt = item.value;
        item.value = null;
        add(txt);
        if(txt.length>0) display();
    });

    document.querySelector('.display').addEventListener('click', (e) => {
        display();
    });

    document.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            let item = document.querySelector('.save');
            let txt = item.value;
            item.value = null;
            add(txt);
            if(txt.length>0) display();
        }
    });

    document.querySelector('.hide').addEventListener('click', (e) => {
        let item = document.querySelector('.display_list');
        item.innerHTML = null;
    });
});


