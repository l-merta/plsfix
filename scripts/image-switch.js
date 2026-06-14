const mainImage = document.querySelector('.hat-visual img');

function switchImage(imageElement) {
  if (imageElement) {
    const mainImageSrc = mainImage.getAttribute('src');
    mainImage.setAttribute('src', imageElement.getAttribute('src'));
    imageElement.setAttribute('src', mainImageSrc);
  }
}