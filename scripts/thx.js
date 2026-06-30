const metadata = JSON.parse(localStorage.getItem('preorderMetadata'));

console.log(metadata);

if (!metadata) {
  window.location.href = '/';
}

document.getElementById('product-title').textContent = metadata.product;
document.getElementById('product-price').textContent = "€" + metadata.price.toFixed(2);

if (metadata.product == "Pls Fix (Me) — Green") {
  document.getElementById('product-desc').textContent = "Bruce is calm. Bruce is structured. Bruce still has 17 unresolved comments and pretends this is fine. thx for aligning emotionally.";
} else if (metadata.product == "Pls Fix (Me) — Navy") {
  document.getElementById('product-desc').textContent = "James is for quiet professionals, late calls, and feedback that begins with “small thing.” It was never a small thing. thx for your continued resilience.";
} else if (metadata.product == "Pls Fix (Me) — Black") {
  document.getElementById('product-desc').textContent = "Final_v7 is for people who know the deck was final three versions ago. Thanks for keeping the illusion alive. thx, pls don’t reopen the file.";
} else if (metadata.product == "Out of scope") {
  document.getElementById('product-desc').textContent = "You didn’t buy a cap. You approved the distortion. Limited piece. Absolute escalation. No rollback available. thx for leaving the scope.";
} else {
  document.getElementById('product-desc').textContent = metadata.productDesc || "";
}

postOrder();

async function postOrder() {
  const res = await fetch('/server/main.php?action=order', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(metadata)
  });
  
  console.log(res);

  localStorage.removeItem('preorderMetadata');
}