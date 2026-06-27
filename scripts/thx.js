const metadata = JSON.parse(localStorage.getItem('preorderMetadata'));

console.log(metadata);

// post to api
fetch('/api/order', {
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify(metadata)
});

//localStorage.removeItem('preorderMetadata');