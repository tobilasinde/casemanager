const categorySubmitBtn = document.getElementById('categorySubmitBtn');

categorySubmitBtn.addEventListener('click', ()=>{
  categorySubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitCreateCategory = async (event) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('category_form');
  const formData = {
          category_name: form.category_name.value
        }
    const category = await createCategory(formData);
    let errors = '';
    console.log(category);
    if (category.status) {
      swal.fire(
        'Awesome!',
        'Category created Successfully!',
        'success'
      )
      location.reload();
    } else {
      categorySubmitBtn.innerHTML = 'Create Category';
      console.log(category.errors);

    category.errors.forEach(error => {
      swal.fire(
        'Oops!',
        error.msg,
        'warning'
      )
    });
    
    }
  } catch (error) {
    console.log(error);
    // show network error notification
    swal.fire(
      'Oops!',
      'An error was encountered! Please review your network connectionssss.',
      'error'
    )
  }

};

const createCategory = async (data) => {
    console.log(data)
    try {
      const category = await fetch(`${Route.apiRoot}/post/category/create`, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await category.json();
    } catch (error) {
      console.log(error);
      // show network error notification
      swal.fire(
        'Oops!',
        'An error was encountered! Please review your network connection.',
        'error'
      )
    }
  };