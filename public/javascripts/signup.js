const alert = document.querySelector('.alert');
document.querySelectorAll('input')
  .forEach(function (el) {
    console.log(el);
    el.addEventListener('change', function () {
      if (!alert.classList.contains('hide'))
        alert.classList.add('hide');
    });
  });