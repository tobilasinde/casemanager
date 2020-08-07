const caseSubmitBtn = document.getElementById('caseSubmitBtn');

caseSubmitBtn.addEventListener('click', ()=>{
  caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitUpdateStatus = async (event, caseId, status) => {
	try {
  event.preventDefault();
    const casemanager = await updateCase(caseId, status);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Invoice updated!',
        'success'
      )
      location.href = `#`;
    } else {
      caseSubmitBtn.innerHTML = 'Create Case';
      console.log(casemanager.errors);
      
      toastr.options = {
      "closeButton": true,
      "debug": true,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
    casemanager.errors.forEach(error => {
      toastr.error(error.msg);  
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

const updateCase = async (caseId, status) => {
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/status/${status}`, {
        // mode: 'no-cors',
        method: 'GET',
      });
      return await casemanager.json();
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