const fetchConfig = {
  method: 'post',
  // req.body (in express) will be empty if I don't add these headers
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

var reviewEditShowBtn = document.querySelector('.review_show_edit_btn');
var review = document.querySelector('.review_text');
var reviewEditContainer = document.querySelector('.review_edit_container');
var reviewEditInput = document.querySelector('.review_edit_input');
var saveReviewBtn = document.querySelector('.save_review_btn');
var isShown = false;

reviewEditShowBtn.addEventListener('click', function (e) {
  if (!isShown) {
    reviewEditInput.value = review.innerHTML;
    reviewEditContainer.classList.remove('hide');
    review.classList.add('hide');
  }
  else {
    reviewEditContainer.classList.add('hide');
    review.classList.remove('hide');
  }
  isShown = !isShown;
});

saveReviewBtn.addEventListener('click', function (e) {
  var reviewValue = reviewEditInput.value.trim();
  if (!reviewValue) return;
  var appointmentId = reviewEditInput.getAttribute('data-appointmentid');
  var reviewid = reviewEditInput.getAttribute('data-reviewid');
  var config = { 
    ...fetchConfig, 
    body: JSON.stringify({ reviewValue, appointmentId }) 
  };
  (reviewid ?
    fetch(`/reviews/${reviewid}/edit`, config) :
    fetch(`/reviews/create`, config))
    .then(result => result.json())
    .then(result => {
      reviewEditContainer.classList.add('hide');
      review.classList.remove('hide');
      review.innerHTML = reviewValue;
    })
    .catch(e => console.log(e));
});