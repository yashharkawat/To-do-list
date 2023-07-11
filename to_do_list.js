document.addEventListener('DOMContentLoaded', function() {
    let to_do_list = {};
    let id = 1;

    function add(txt) {
        if (txt.length == 0) return;
        to_do_list[id] = '• ' + txt;
        id++;
    }

    function del(id) {
        to_do_list.id = null;
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
        del.style.paddingTop = '6px';
        del.style.paddingLeft='7px';
        del.style.paddingBottom = '6px';
        del.style.paddingRight='7px';
        del.style.fontWeight='bold';
        del.style.cursor = 'pointer';

        element_with_delete.style.display = 'flex';
        element_with_delete.style.alignItems='center';
        element_with_delete.style.justifyContent='center';
        element_with_delete.style.marginBottom = '30px';
        element.style.marginRight = '50px';
        element_with_delete.appendChild(element);
        element_with_delete.appendChild(del);

        let new_id = 'a' + id;
        element_with_delete.classList.add(new_id);
        
        del.setAttribute('id', new_id);
        item.appendChild(element_with_delete);

        var items=document.querySelectorAll('.delete')
        items.forEach((item)=>{
        item.addEventListener('click',(e)=>{
        var parent=item.parentNode;
        var grand_parent=parent.parentNode;
        grand_parent.removeChild(parent);
        parent.innerHTML=null;
        let idd=item.getAttribute('id');
        let new_idd=idd.slice(1);
        console.log(new_idd);
        delete to_do_list[new_idd];
    })})
    }

    function display() {
        let item = document.querySelector('.display_list');
        item.innerHTML = null;
        for (let key in to_do_list) {
            display_on_webpage(to_do_list[key], key);
        }
    }

    document.querySelector('.save_button').addEventListener('click', () => {
        let item = document.querySelector('.save');
        let txt = item.value;
        item.value = null;
        add(txt);
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
        }
    });

    

    document.querySelector('.hide').addEventListener('click', (e) => {
        let item = document.querySelector('.display_list');
        item.innerHTML = null;
    });
    
});
