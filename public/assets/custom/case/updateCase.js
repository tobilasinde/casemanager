const caseSubmitBtn = document.getElementById('caseSubmitBtn');

caseSubmitBtn.addEventListener('click', ()=>{
  caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitUpdateCase = async (event, caseId) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('case_form');
  const formData = {
          subject: form.subject.value,
          description: form.description.value,
          contact_name: form.contact_name.value,
          contact_email: form.contact_email.value,
          department: form.department.value,
          assigned: form.assigned.value,
          case_type: form.case_type.value,
          priority: form.priority.value,
          request_type: form.request_type.value,
          origin: form.origin.value,
          note: form.note.value,
          SLA_violation: form.SLA_violation.value
        }
    const casemanager = await updateCase(formData, caseId);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Case updated Successfully!',
        'success'
      )
      location.href = `/case/${caseId}/details`;
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

const updateCase = async (data, caseId) => {
    console.log(data)
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/update`, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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