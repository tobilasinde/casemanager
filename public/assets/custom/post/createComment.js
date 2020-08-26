const submitCommentPost = async (event, postId) => {
	try {
  event.preventDefault();
  const commentSubmitBtn = document.getElementById(`commentSubmitBtn${postId}`);
  commentSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
  //const form = event.target;
  const form = document.getElementById(`comment_form${postId}`);
  const formData = {
          title: form.title.value,
          body: form.body.value
        }
    const post = await commentCreate(formData, postId);
    let errors = '';
    console.log(post);
    if (post.status) {
      swal.fire(
        'Awesome!',
        post.message,
        'success'
      )
      location.reload();
    } else {
      postSubmitBtn.innerHTML = 'Create Post';

    post.errors.forEach(error => {
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

const commentCreate = async (data, postId) => {
    console.log(data)
    try {
      const post = await fetch(`${Route.apiRoot}/post/${postId}/comment/create`, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await post.json();
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