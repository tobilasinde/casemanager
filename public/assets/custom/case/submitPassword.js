const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');

passwordSubmitBtn.addEventListener('click', ()=>{
  PasswordSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitPassword = async (event, caseId) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('password_form');
  const formData = {
    password: form.password.value
  }
    const guest = await submitPass(formData, caseId);
    let errors = '';
    console.log(guest);
    if (guest.status) {
      swal.fire(
        'Awesome!',
        guest.message,
        'success'
      )
      location.href = `/guest/${caseId}/details`;
    } else {
      guestSubmitBtn.innerHTML = 'Check Case';
    guest.errors.forEach(error => {
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

const submitPass = async (data, caseId) => {
    try {
      const guest = await fetch(`${Route.apiRoot}/guest/${caseId}/password`, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await guest.json();
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