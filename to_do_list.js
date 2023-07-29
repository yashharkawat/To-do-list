let to_do_list = [];
let id = 0;
let activity_log=[];


fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then((data) => {
    const list=localStorage.getItem('to_do_list');

    if (list==null) {
      data.forEach((item) => {
        
        to_do_list.push({ txt: item.title, id: id, done:0 ,due_date:'',category:'',subtasks:[],priority:'None',tags:[]});
        id++;
        try {
          activity_log.push( `This task ${item.title} was added`);
        } catch (error) {
          console.log(error);
        }
      });
      
      localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
      localStorage.setItem('id', id);
      localStorage.setItem('activity_log',JSON.stringify(activity_log));
    } else {
      id = localStorage.getItem('id');
      to_do_list = JSON.parse(localStorage.getItem('to_do_list'));
      activity_log=JSON.parse(localStorage.getItem('activity_log'));
    }
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });

document.addEventListener('DOMContentLoaded', () => {

  function add(txt) {
    if (txt.length === 0) return;
    to_do_list.push({ txt: txt, id: id,done:0,due_date:'',category:'',subtasks:[],priority:'None',tags:[]});
    id++;
    localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
    localStorage.setItem('id', id);
    
    try {
      activity_log.push( `This task ${txt} was added`);
    } catch (error) {
      console.log(error);
    }
    localStorage.setItem('activity_log',JSON.stringify(activity_log));
  }

  function add_sub_task(task_id, subtask) {
    const task = to_do_list.find((item) => item.id === task_id);
    if (task) {
      task.subtasks.push(subtask);
      localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
    }
  }

  function sort_by_due_date() {
    to_do_list.sort((a, b) => {
      const date_a = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_VALUE;
      const date_b = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_VALUE;
      return date_a - date_b;
    });
  }

  function sort_by_priority() {
    const priority_order = { None:0,Low: 1, Medium: 2, High: 3 };
    to_do_list.sort((a, b) => {
      return -priority_order[a.priority]+priority_order[b.priority];
    });
  }

  function sort_by_none() {
    to_do_list.sort((a, b) => {
      return a.id-b.id;
    });
  }

  function handle_sorting() {
    const sort_by = document.getElementById('sort_by').value;
    if (sort_by === 'due_date') {
      sort_by_due_date();
    } else if (sort_by === 'priority') {
      sort_by_priority();
    } else {
      sort_by_none();
    }
    display();
  }

  //drag and drop
  function display_on_webpage(task) {
    const act=document.querySelector('.activity')
    act.innerText=null;
    let txt=task.txt;
    let id=task.id;
    let item = document.querySelector('.display_list');
    let element_with_delete = document.createElement('ul');
    let element = document.createElement('li');
    element.classList.add('task');
    let del = document.createElement('button');

    element.innerHTML = txt;
    del.innerHTML = 'Delete';
    del.setAttribute('id', id);
    del.classList.add('delete');
    element.style.marginRight = '50px';
    let to_do_item=task;
    const done_button = document.createElement('button');
    done_button.textContent = to_do_item.done ? 'Completed' : 'Incomplete';
    done_button.classList.add('done_button');
    done_button.addEventListener('click', (e) => {
      
      to_do_item.done=1^to_do_item.done;
      done_button.textContent=to_do_item.done ? 'Completed' : 'Incomplete';
      localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
      if(to_do_item.done){
        try {
          activity_log.push( `This task ${to_do_item.txt} was marked as completed`);
        } catch (error) {
          console.log(error);
        }
      } 
      else{
        try {
          activity_log.push( `This task ${to_do_item.txt} was marked as not completed`);
        } catch (error) {
          console.log(error);
        }
      } 
      
      localStorage.setItem('activity_log',JSON.stringify(activity_log));
    });

    const due_date_element = document.createElement('button');
    due_date_element.textContent = to_do_item.due_date || 'No Due Date';
    due_date_element.classList.add('due_date');
    due_date_element.addEventListener('click', (e) => {
      const input_due_date_element = document.createElement('input');
      input_due_date_element.type = 'date';
      input_due_date_element.value = to_do_item.due_date ;
      due_date_element.textContent = '';
      due_date_element.appendChild(input_due_date_element);
      input_due_date_element.focus();
      input_due_date_element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          
          if(input_due_date_element.value!==''){
          
            const new_due_date = input_due_date_element.value;
            to_do_item.due_date=input_due_date_element.value;
            due_date_element.textContent = new_due_date ;
            localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
            
            try {
              activity_log.push( `This task ${to_do_item.txt} due date changed to ${new_due_date}`);
            } catch (error) {
              console.log(error);
            }
            localStorage.setItem('activity_log',JSON.stringify(activity_log));
          }
          else{
            due_date_element.textContent = to_do_item.due_date || 'No Due Date';
          }
          due_date_element.removeChild(input_due_date_element);
          }
      });
    });

    const category_element = document.createElement('div');
    category_element.textContent = `Category: ${to_do_item.category}`|| 'Category: ';
    category_element.classList.add('category');
    category_element.addEventListener('click', (e) => {
      const input_category_element = document.createElement('input');
      input_category_element.type = 'text';
      input_category_element.value = to_do_item.category;
      input_category_element.placeholder = "Add category" ;
      category_element.textContent = '';
      category_element.appendChild(input_category_element);
      input_category_element.focus();
      input_category_element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const new_category = input_category_element.value;
          to_do_item.category=input_category_element.value;
          category_element.textContent = `Category: ${new_category}` ;
          localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
          try {
            activity_log.push( `This task ${to_do_item.txt} category changed to ${new_category}`);
          } catch (error) {
            console.log(error);
          }
          
          localStorage.setItem('activity_log',JSON.stringify(activity_log));
        }
      });
    });

    const priority_element = document.createElement('button');
    priority_element.textContent = to_do_item.priority ? `Priority: ${to_do_item.priority}` : 'No Priority';
    priority_element.classList.add('priority');
    const priority_input_element = document.createElement('select');
    priority_element.addEventListener('click', (e) => {
      const priority_options = ['None','Low', 'Medium', 'High'];
      priority_options.forEach((option) => {
        const option_element = document.createElement('option');
        option_element.textContent = option;
        option_element.value = option;
        priority_input_element.appendChild(option_element);
      });
      priority_input_element.value = to_do_item.priority || 'Low';
      priority_element.textContent = '';
      priority_element.appendChild(priority_input_element);
      priority_input_element.focus();
      priority_element.addEventListener('keypress', (e) => {
        if(e.key==='Enter'){
          const new_priority = priority_input_element.value;
          to_do_item.priority=new_priority;
          priority_element.innerText = `priority: ${new_priority}`;
          localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
          display();
          try {
            activity_log.push( `This task ${to_do_item.txt} priority changed to ${new_priority}`);
          } catch (error) {
            console.log(error);
          }
          localStorage.setItem('activity_log',JSON.stringify(activity_log));
        }
      });
    });

    const subtask_container = document.createElement('div');
    subtask_container.classList.add('subtask_container');

    const subtask_button = document.createElement('button');
    subtask_button.textContent = 'Subtask';
    subtask_button.classList.add('subtask_btn');

    const subtask_input = document.createElement('input');
    subtask_input.type = 'text';
    subtask_input.placeholder = 'Add Subtask';
    subtask_input.classList.add('subtask_input');

    subtask_input.style.display = 'none';
    subtask_button.addEventListener('click', (e) => {
      subtask_input.style.display = 'block';
      subtask_input.focus();
    });

    subtask_input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const subtask = subtask_input.value.trim();
        if (subtask) {
          add_sub_task(to_do_item.id, subtask);
          subtask_input.value = '';
        }
        subtask_input.style.display = 'none';
        try {
          activity_log.push( `This task ${to_do_item.txt} subtask added ${subtask}`);
        } catch (error) {
          console.log(error);
        }
        localStorage.setItem('activity_log',JSON.stringify(activity_log));
      }
    });

    subtask_container.appendChild(subtask_button);
    subtask_container.appendChild(subtask_input);

    

    to_do_item.subtasks.forEach((subtask) => {
      const subtaskElement = document.createElement('div');
      subtaskElement.textContent = subtask;
      subtaskElement.classList.add('subtask_element');
      subtask_container.appendChild(subtaskElement);
    });

    const tag_element = document.createElement('div');
    let tag_text='';
          to_do_item.tags.forEach((tag)=>{
            tag_text+=`#${tag} `;
          })
    tag_element.textContent = `Tags: ${tag_text}`;
    tag_element.classList.add('tag');
    tag_element.addEventListener('click', (e) => {
      const input_tag_element = document.createElement('input');
      input_tag_element.type = 'text';
      input_tag_element.value = '';
      input_tag_element.placeholder = "Add tag" ;
      
      tag_element.appendChild(input_tag_element);
      input_tag_element.focus();
      input_tag_element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const new_tag = input_tag_element.value;
          const tags=new_tag.split(',');
          
          let tag_text='Tags: ';

          tags.forEach((tag)=>{
            to_do_item.tags.push(tag);
          })
          to_do_item.tags.forEach((tag)=>{
            tag_text+=`#${tag} `;
          })
          tag_element.textContent = tag_text;
          localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
        }
      });
    });

    //draggable
    element_with_delete.append(element,subtask_container,done_button,due_date_element,priority_element,category_element,tag_element,del);
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
        const index = to_do_list.findIndex((item) => item.id == new_idd);
        
        to_do_list.splice(index, 1);
        
        localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
        localStorage.setItem('activity_log',JSON.stringify(activity_log));
        
        display();
      });
    });

    let element_id = 'element' + id;
    element.setAttribute('id', element_id);
    element.addEventListener('click', (e) => {
      let input_id = e.target.getAttribute('id');
      convert_to_input(input_id);
    });



    //drag and drop

    const list_items=document.querySelectorAll('.to_do_element');
    
    list_items.forEach((item)=>{
    item.draggable=true;
    item.addEventListener('dragstart',drag_start);
    item.addEventListener('drop',drag_drop);
    item.addEventListener('dragover',drag_over);
    item.addEventListener('dragenter',drag_enter);
    item.addEventListener('dragleave',drag_leave);
  })
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
    let task;
    to_do_list.forEach((item)=>{
      if(item.id==arr_id) task=item;
    })
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        text_element.textContent = input_element.value;
        parent.replaceChild(text_element_parent, input);
        task.txt = input_element.value;
        localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
      }
    });
    save_button.addEventListener('click', (e) => {
      text_element.textContent = input_element.value;
      parent.replaceChild(text_element_parent, input);
      let task;
      to_do_list.forEach((item)=>{
        if(item.id==arr_id) task=item;
      })
      task.txt = input_element.value;
      
      localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
    });
  }

  function display() {
    let item = document.querySelector('.display_list');
    item.innerHTML = null;
    to_do_list.forEach((item) => {
      display_on_webpage(item);
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
    const act=document.querySelector('.activity')
    act.innerText=null;
  });

  document.querySelector('.add_filter').addEventListener('click', () => {
    const element=document.querySelector('.add_filter');
    const parent=element.parentNode;
    parent.innerHTML=null;
    parent.appendChild(element);

    const due_date_filter=document.createElement('div');
    const due_date_filter_text=document.createElement('div');
    due_date_filter_text.innerText="Enter the due date range";

    const from_due_date_element=document.createElement('input');
    from_due_date_element.placeholder='From due date';
    from_due_date_element.type='Date';
    from_due_date_element.classList.add('from_due_date');
    const to_due_date_element=document.createElement('input');
    to_due_date_element.placeholder='To due date';
    to_due_date_element.type='Date';
    to_due_date_element.classList.add('to_due_date');
    due_date_filter.append(due_date_filter_text,from_due_date_element,to_due_date_element);

    const category_filter=document.createElement('div');
    const category_filter_text=document.createElement('div');
    category_filter_text.innerText="Enter the category";

    const input_category_element=document.createElement('input');
    input_category_element.placeholder='enter category';
    input_category_element.type='Text';
    input_category_element.classList.add('input_category');

    category_filter.append(category_filter_text,input_category_element);

    const priority_filter=document.createElement('div');
    const priority_filter_text=document.createElement('div');
    priority_filter_text.innerText='Select the priority';
    const priority_input_element = document.createElement('select');
    const priority_options = ['None','Low', 'Medium', 'High'];
    priority_options.forEach((option) => {
      const option_element = document.createElement('option');
      option_element.textContent = option;
      option_element.value = option;
      priority_input_element.appendChild(option_element);
    });
    priority_filter.classList.add('priority_filter')
    priority_filter.append(priority_filter_text,priority_input_element);

    const apply_button=document.createElement('button');
    apply_button.innerText="Apply Filters";

    parent.append(due_date_filter,category_filter,priority_filter,apply_button);
    apply_button.classList.add('apply_button')
    apply_button.addEventListener('click',(e)=>{

      const start_due_date=from_due_date_element.value;
      const end_due_date=to_due_date_element.value;
      let filtered_tasks=filter_by_due_date(start_due_date,end_due_date,to_do_list);

      filtered_tasks=filter_by_priority(priority_input_element.value,filtered_tasks);

      if(input_category_element.value!==''){
        filtered_tasks=filter_by_category(input_category_element.value,filtered_tasks);
      }

      filtered_tasks.forEach((task)=>{
        display_on_webpage(task);
      });

      parent.removeChild(due_date_filter);
      parent.removeChild(category_filter);
      parent.removeChild(priority_filter);
      parent.removeChild(apply_button);
    });
  });

  document.getElementById('sort_by').addEventListener('change', handle_sorting);

  document.getElementById('search').addEventListener('keyup',(e)=>{
    const search_string=e.target.value;
    if(search_string==''){
      display();
    }
    else{
      searchTasks(search_string);
    }
  });

  function searchTasks(string) {
    const filtered_tasks = to_do_list.filter((task) => {
      const txt_match = task.txt.toLowerCase().includes(string.toLowerCase());
      const subtask_match = task.subtasks.some((subtask) => subtask.toLowerCase().includes(string.toLowerCase()));
      return txt_match || subtask_match;
    });
    const display_list = document.querySelector('.display_list');
    display_list.innerHTML = null;
    filtered_tasks.forEach((task) => {
      display_on_webpage(task);
    });
  }

  //tag search
  document.getElementById('search_tags').addEventListener('keyup',(e)=>{
    const search_string=e.target.value;
    if(search_string==''){
      display();
    }
    else{
      search_by_tag(search_string);
    }
  });

  function search_by_tag(searchTag) {
    const search_tag = searchTag.toLowerCase();
    const filtered_tasks = to_do_list.filter((task) => {
      if (task.tags && task.tags.length > 0) {
        return task.tags.some((tag) => tag==search_tag);
      }
      return false; 
    });
  
    const display_list = document.querySelector('.display_list');
    display_list.innerHTML = '';
    filtered_tasks.forEach((task) => {
      display_on_webpage(task);
    });
  }
  
  document.getElementById('search_category').addEventListener('keyup',(e)=>{
    const search_string=e.target.value;
    if(search_string==''){
      display();
    }
    else{
      search_by_category(search_string);
    }
  });



  function search_by_category(search_category) {
    search_category = search_category.toLowerCase();
    const filtered_tasks = to_do_list.filter((task) => {
      if (task.category) {
        return task.category.toLowerCase().includes(search_category);
      }
      return false; 
    });
  
    const display_list = document.querySelector('.display_list');
    display_list.innerHTML = '';
    filtered_tasks.forEach((task) => {
      display_on_webpage(task);
    });
  }


  function filter_by_due_date(start_due_date, end_due_date,to_do_list) {
    if(start_due_date==''||end_due_date==''){
      return to_do_list;
    }
    const start_date = start_due_date ? new Date(start_due_date).getTime() : 0;
    const end_date = end_due_date ? new Date(end_due_date).getTime() : Number.MAX_VALUE;
    const filtered_tasks = to_do_list.filter((task) => {
      const task_due_date = task.due_date ? new Date(task.due_date).getTime() : null;
      return task_due_date && task_due_date >= start_date && task_due_date <= end_date;
    });
    const display_list = document.querySelector('.display_list');
    display_list.innerHTML = '';
    return filtered_tasks;
  }

  function filter_by_priority(priority,to_do_list) {
    if(priority=='None'){
      return to_do_list;
    }
    else{
      const filtered_tasks = to_do_list.filter((task) => {
        return task.priority === priority;
      });
      const display_list = document.querySelector('.display_list');
      display_list.innerHTML = '';
      return filtered_tasks;
    }
  }

  function filter_by_category(category,to_do_list) {
    const filtered_tasks = to_do_list.filter((task) => {
      return task.category === category;
    });
    const display_list = document.querySelector('.display_list');
    display_list.innerHTML = '';
    return filtered_tasks;
  }

  document.querySelector('.view_backlogs').addEventListener('click',(e)=>{
    display_backlogs();
  });

  function display_backlogs() {
    const backlogs = to_do_list.filter((task) => {
      const due_date=new Date(task.due_date);
      //console.log(due_date);
      if(due_date<Date.now()){
        return true;
      }
      else{
        return task.done==0;
      }
    });
    const display_list = document.querySelector('.display_list');
    display_list.innerHTML = '';
    backlogs.forEach((task) => {
      display_on_webpage(task);
    });
  }

  function reverseString(str) {
    return str.split("\n").reverse().join("\n");
  }
  document.querySelector('.activity_log').addEventListener('click',(e)=>{
    
    let activity='';
    try{
      activity_log.forEach((log)=>{
        activity+=log;
        activity+='\n';
      })
    }
    catch(e){
      console.log(e);
    }
    activity=reverseString(activity);
    const item=document.querySelector('.activity')
    item.innerText=activity;
    const display_list=document.querySelector('.display_list');
    display_list.innerHTML=null;
  });

  //drag and drop

  let drag_start_index,drag_end_index;
  function drag_enter(){
   this.classList.add('over');
  }
  function drag_over(e){
    e.preventDefault();
  }
  function drag_drop(){
    this.classList.remove('over');
    drag_end_index=+this.closest('ul').getAttribute('class').split(' ')[0].slice(7);

    const item_one=document.querySelector(`.delete_${drag_start_index}`);
    const item_two=document.querySelector(`.delete_${drag_end_index}`);
    
    const parent = item_one.parentNode;
    const reference = item_two.nextSibling;
  
    if(reference!==item_one){
      parent.insertBefore(item_two, item_one);
      parent.insertBefore(item_one, reference);
    }
    else{
      parent.insertBefore(item_one, item_two);
    }


    let index1,index2;
    to_do_list.forEach((item,index)=>{
      if(item.id==drag_start_index){
        index1=index;
        task1=item;
      } 
      else if(item.id==drag_end_index){
        index2=index;
        task2=item;
      } 
    })
    to_do_list[index1]=task2;
    to_do_list[index2]=task1;
    
    localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
    
  }
  function drag_leave(){
    this.classList.remove('over');
  }
  function drag_start(){
    drag_start_index=+this.closest('ul').getAttribute('class').split(' ')[0].slice(7);
  }
  

});
