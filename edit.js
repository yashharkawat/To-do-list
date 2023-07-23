const parent = item_one.parentNode;

    // Create a reference node after item_two to use for swapping
    const reference = item_two.nextSibling;
  
    // Swap the elements using replaceWith method
    if(reference!==item_one){
      parent.insertBefore(item_two, item_one);
      parent.insertBefore(item_one, reference);
    }
    else{
     // console.log(";hi");
      parent.insertBefore(item_one, item_two);
    }