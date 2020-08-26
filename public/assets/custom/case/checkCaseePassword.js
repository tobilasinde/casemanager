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
    case_id: form.case_id.value,
    password: form.password.value
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
      caseSubmitBtn.innerHTML = 'Check Case';
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
    try {
      const casemanager = await fetch(`${Route.root}/case/${caseId}/details`, {
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