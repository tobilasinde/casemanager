// const caseSubmitBtn = document.getElementById('caseSubmitBtn');

// caseSubmitBtn.addEventListener('click', ()=>{
//   caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
// });

const editCase = async (event, caseId) => {
	try {
  event.preventDefault();
    const casemanager = await edit_case(caseId);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      // swal.fire(
      //   'Awesome!',
      //   'Case Status updated Successfully!',
      //   'success'
      // )
      location.href = `${Route.root}/case/${caseId}/update`
    } else {
      swal.fire(
        'Oops!',
        casemanager.message,
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

const edit_case = async (caseId) => {
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/update`, {
      });
      return await casemanager.json();
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