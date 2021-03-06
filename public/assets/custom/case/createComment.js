const submitCommentCase = async (event, caseId) => {
	try {
  event.preventDefault();
  const commentSubmitBtn = document.getElementById(`commentSubmitBtn${caseId}`);
  commentSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
  //const form = event.target;
  const form = document.getElementById(`comment_form${caseId}`);
        const formData = new FormData()
        formData.append('file', form.file.files[0])
        formData.append('title', form.title.value)
        formData.append('body', form.body.value)
    const casemanager = await commentCreate(formData, caseId);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        casemanager.message,
        'success'
      )
      location.reload();
    } else {
      // caseSubmitBtn.innerHTML = 'Create Case';

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
      'An error was encountered! Please review your network connections.',
      'error'
    )
  }

};

const commentCreate = async (data, caseId) => {
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/comment/create`, {
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