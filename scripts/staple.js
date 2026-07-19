const stapleDontShowCheckbox = document.getElementById('staple-dont-show');

const stapleDontShow = localStorage.getItem('stapleDontShow');

if (stapleDontShowCheckbox && !stapleDontShow) {
  setTimeout(function () {
    //openInfoModal('staple-modal');
  }, 5 * 1000);
}

document.getElementById('staple-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal(e.target.id, stapleDontShowFunc);
  }
});

function stapleDontShowFunc() {
  if (stapleDontShowCheckbox && stapleDontShowCheckbox.checked) {
    localStorage.setItem('stapleDontShow', 'true');
  }
}