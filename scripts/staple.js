const stapleDontShowCheckbox = document.getElementById('staple-dont-show');

if (stapleDontShowCheckbox && localStorage.getItem('stapleDontShow') === 'true') {
  closeModal('staple-modal')
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