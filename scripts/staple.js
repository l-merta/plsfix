const stapleDontShowCheckbox = document.getElementById('staple-dont-show');

if (stapleDontShowCheckbox && localStorage.getItem('stapleDontShow') === 'true') {
  closeModal('staple-modal')
}

document.getElementById('staple-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    if (stapleDontShowCheckbox && stapleDontShowCheckbox.checked) {
      localStorage.setItem('stapleDontShow', 'true');
    }
    closeModal(e.target.id);
  }
});