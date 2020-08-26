const closedStatus = async (event, caseId) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById(`status_form${caseId}`);
  const formData = {
          reason: form.reason.value,
          sol_no: form.sol_no.value
        }
    const casemanager = await closeCase(formData, caseId);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Case updated Successfully!',
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
      'Oops!',
      'An error was encountered! Please review your network connectionssss.',
      'error'
    )
  }

};

const closeCase = async (data, caseId) => {
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/close`, {
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