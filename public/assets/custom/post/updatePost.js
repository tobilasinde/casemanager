const submitUpdatePost = async (event, postId) => {
  // const postSubmitBtn = document.getElementById(`postSubmitBtn${postId}`);
  // postSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
	try {
    event.preventDefault();
    //const form = event.target;
    const form = document.getElementById(`post_form${postId}`);
    var categories = [];
    $.each($("input[name='categories']:checked"),function(){
      categories.push(+$(this).val());
    });
    const formData = {
      post_title: form.post_title.value,
      post_body: form.post_body.value,
      categories
    }
    const post = await updatePost(formData, postId);
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
      'An error was encountered! Please review your network connectionssss.',
      'error'
    )
  }

};

const updatePost = async (data, postId) => {
    console.log(data)
    try {
      const post = await fetch(`${Route.apiRoot}/post/${postId}/update`, {
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