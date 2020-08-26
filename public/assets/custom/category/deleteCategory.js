// const categorySubmitBtn = document.getElementById('categorySubmitBtn');

// categorySubmitBtn.addEventListener('click', ()=>{
//   categorySubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
// });

const deleteCategory = async (event, categoryId) => {
	try {
  event.preventDefault();
    const categorymanager = await Category(categoryId);
    let errors = '';
    console.log(categorymanager);
    if (categorymanager.status) {
      swal.fire(
        'Awesome!',
        'Category Status updated Successfully!',
        'success'
      )
      location.reload();
    } else {
      swal.fire(
        'Oops!',
        categorymanager.message,
        'warning'
      ) 
    }
  } catch (error) {
    console.log(error);
    // show network error notification
    swal.fire(
      'Oopssss!',
      error,
      'error'
    )
  }

};

const Category = async (categoryId) => {
    try {
      const categorymanager = await fetch(`${Route.apiRoot}/post/category/${categoryId}/delete`, {
      });
      return await categorymanager.json();
    } catch (error) {
      console.log(error);
      // show network error notification
      swal.fire(
        'Oops!',
        error,
        'error'
      )
    }
  };