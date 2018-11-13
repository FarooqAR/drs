const alert = document.querySelector('.alert');
document.querySelectorAll('input[type="text"]')
  .forEach(function (el) {
    el.addEventListener('change', function () {
      if (!alert.classList.contains('hide'))
        alert.classList.add('hide');
    });
  });