// const caseSubmitBtn = document.getElementById('caseSubmitBtn');

// caseSubmitBtn.addEventListener('click', ()=>{
//   caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
// });

const submitStatus = async (event, caseId, status) => {
	try {
  event.preventDefault();
    const casemanager = await updateCase(caseId, status);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Case Status updated Successfully!',
        'success'
      )
      location.reload();
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

const updateCase = async (caseId, status) => {
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/status/${status}`, {
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