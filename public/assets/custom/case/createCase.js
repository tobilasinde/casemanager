const caseSubmitBtn = document.getElementById('caseSubmitBtn');

caseSubmitBtn.addEventListener('click', ()=>{
  caseSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitCreateCase = async (event) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('case_form');
  // const formData = {
  //         subject: form.subject.value,
  //         description: form.description.value,
  //         contact_name: form.contact_name.value,
  //         contact_email: form.contact_email.value,
  //         department: form.department.value,
  //         assigned: form.assigned.value,
  //         case_type: form.case_type.value,
  //         priority: form.priority.value,
  //         request_type: form.request_type.value,
  //         note: form.note.value,
  //         file: form.file.files[0],
  //       }
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
  console.log(formData);
  
  
    const casemanager = await createCase(formData);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Invoice created!',
        'success'
      )
      location.href = `/case/${casemanager.data.id}/details`;
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

const createCase = async (data) => {
    console.log(data)
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/create`, {
        // mode: 'no-cors',
        method: 'POST',
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