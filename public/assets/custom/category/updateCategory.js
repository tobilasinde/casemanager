const submitUpdateCategory = async (event, categoryId) => {
  // const categorySubmitBtn = document.getElementById(`categorySubmitBtn${categoryId}`);
  // categorySubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
	try {
    event.preventDefault();
    //const form = event.target;
    const form = document.getElementById(`category_form${categoryId}`);
    const formData = {
      category_name: form.category_name.value
    }
    const category = await updateCategory(formData, categoryId);
    let errors = '';
    console.log(category);
    if (category.status) {
      swal.fire(
        'Awesome!',
        category.message,
        'success'
      )
      location.reload();
    } else {
      categorySubmitBtn.innerHTML = 'Create Category';
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

const updateCategory = async (data, categoryId) => {
    console.log(data)
    try {
      const category = await fetch(`${Route.apiRoot}/post/category/${categoryId}/update`, {
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