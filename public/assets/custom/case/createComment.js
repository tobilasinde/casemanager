const commentSubmitBtn = document.getElementById('commentSubmitBtn');

commentSubmitBtn.addEventListener('click', ()=>{
  commentSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
});

const submitCommentCase = async (event, caseId) => {
	try {
  event.preventDefault();
  //const form = event.target;
  const form = document.getElementById('case_form');
  const formData = {
          title: form.title.value,
          description: form.description.value
        }
    const casemanager = await commentCreate(formData, caseId);
    let errors = '';
    console.log(casemanager);
    if (casemanager.status) {
      swal.fire(
        'Awesome!',
        'Comment added Successfully!',
        'success'
      )
      location.reload();
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
      'An error was encountered! Please review your network connections.',
      'error'
    )
  }

};

const commentCreate = async (data, caseId) => {
    console.log(data)
    try {
      const casemanager = await fetch(`${Route.apiRoot}/case/${caseId}/comment/create`, {
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