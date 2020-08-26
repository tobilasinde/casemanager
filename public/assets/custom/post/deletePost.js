// const postSubmitBtn = document.getElementById('postSubmitBtn');

// postSubmitBtn.addEventListener('click', ()=>{
//   postSubmitBtn.innerHTML = '<i class="kt-spinner kt-spinner--md kt-spinner--center px-4 kt-spinner--light"></i>';
// });

const deletePost = async (event, postId) => {
	try {
  event.preventDefault();
    const postmanager = await Post(postId);
    let errors = '';
    console.log(postmanager);
    if (postmanager.status) {
      swal.fire(
        'Awesome!',
        'Post Status updated Successfully!',
        'success'
      )
      location.reload();
    } else {
      swal.fire(
        'Oops!',
        postmanager.message,
        'warning'
      ) 
    }
  } catch (error) {
    console.log(error);
    // show network error notification
    swal.fire(
      'Oopssss!',
      error,
      'error'
    )
  }

};

const Post = async (postId) => {
    try {
      const postmanager = await fetch(`${Route.apiRoot}/post/${postId}/delete`, {
      });
      return await postmanager.json();
    } catch (error) {
      console.log(error);
      // show network error notification
      swal.fire(
        'Oops!',
        error,
        'error'
      )
    }
  };