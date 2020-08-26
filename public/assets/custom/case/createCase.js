const caseSubmitBtn = document.getElementById('caseSubmitBtn');

caseSubmitBtn.addEventListener('click', ()=>{
  caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitCreateCase = async (event) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('kt_form');
        const formData = new FormData()
        formData.append('file', form.file.files[0])
        formData.append('subject', form.subject.value)
        formData.append('description', form.description.value)
        formData.append('contact_name', form.contact_name.value)
        formData.append('contact_email', form.contact_email.value)
        formData.append('department', form.department.value)
        formData.append('assigned', form.assigned.value)
        formData.append('case_type', form.case_type.value)
        formData.append('priority', form.priority.value)
        formData.append('request_type', form.request_type.value)
        formData.append('note', form.note.value)
        formData.append('SLA_violation', form.SLA_violation.value)

    const casemanager = await createCase(formData);
    let errors = '';
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Case created Successfully!',
        'success'
      )
      location.href = `/case/${casemanager.data.id}/details`;
    } else {
      caseSubmitBtn.innerHTML = 'Create Case';
    casemanager.errors.forEach(error => {
      swal.fire(
        'Oops!',
        error.msg,
        'warning'
      )
      // toastr.error(error.msg);  
    });
    
    }
  } catch (error) {
    // show network error notification
    swal.fire(
      'Oops!',
      'An error was encountered! Please review your network connections.',
      'error'
    )
  }

};

const createCase = async (data) => {
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/create`, {
        // mode: 'no-cors',
        method: 'POST',
        body: data
      });
      return await casemanager.json();
    } catch (error) {
      // show network error notification
      swal.fire(
        'Oops!',
        'An error was encountered! Please review your network connection.',
        'error'
      )
    }
  };