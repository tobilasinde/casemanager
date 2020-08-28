const caseSubmitBtn = document.getElementById('caseSubmitBtn');

caseSubmitBtn.addEventListener('click', ()=>{
  caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitUpdateCase = async (event, caseId) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('case_form');
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
      caseSubmitBtn.innerHTML = 'Update Case';
      console.log(casemanager.errors);
      
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
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        body: data
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