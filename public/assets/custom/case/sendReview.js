const sendReview = async (event, commentId) => {
	try {
  event.preventDefault();
  console.log(commentId);
  const form = document.querySelector(`.review${commentId}`).value;
  console.log(form);
    const review = await uploadReview(commentId, form);
    let errors = '';
    console.log(review);
    if (review.status == false) {
      swal.fire(
        'Oops!',
        review.message,
        'warning'
      ) 
      location.reload();
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

const uploadReview = async (commentId, form) => {
  try {
    const review = await fetch(`${Route.apiRoot}/case/comment/${commentId}/review/${form}`, {
    });
    return await review.json();
  } catch (error) {
    // show network error notification
    swal.fire(
      'Oops!',
      error,
      'error'
    )
  }
};