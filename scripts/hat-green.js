/* ============================================================
  CONFIG — the only block to edit for this colorway page.
  DROP_DEADLINE : when pre-orders close (then you ship).
  STRIPE_LINK   : this colorway's Stripe Payment Link URL.
  PRODUCT_NAME  : label stored with the email signup.
============================================================ */

const DROP_DEADLINE = '2026-07-01T23:59:59'; // <-- SET ORDER CLOSE DATE
const STRIPE_LINK   = 'https://buy.stripe.com/28E5kDbUT3yV2wxafj1oI01'; // <-- PASTE STRIPE PAYMENT LINK
const PRODUCT_NAME  = 'Pls Fix (Me) — Green';

(function(){
  const d = new Date(DROP_DEADLINE);
  const s = d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  document.querySelectorAll('#drop-date').forEach(el => el.textContent = s);
})();

function openModal(){ document.getElementById('modal').classList.add('open'); validateForm(); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }

function validateForm(){
  const email = document.getElementById('email');
  const terms = document.getElementById('agree-terms');
  const btn   = document.getElementById('reserve-btn');
  if(!email || !terms || !btn) return;
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
  email.classList.toggle('invalid', email.value.length > 0 && !emailOk);
  btn.disabled = !(emailOk && terms.checked);
}

function reserveViaStripe(){
  const email = document.getElementById('email').value.trim();
  const newsletter = document.getElementById('agree-news').checked;

  /* ----------------------------------------------------------
    DEV: send {email, newsletter, product, consentAt} to your
    email tool / order log BEFORE redirecting to Stripe.
    Example (replace with Mailchimp/Brevo/your endpoint):

    fetch('/api/preorder-signup', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        email, newsletter, product: PRODUCT_NAME,
        termsConsent: true, consentAt: new Date().toISOString()
      })
    });

    Store termsConsent + timestamp — GDPR requires proof of consent.
    Only add to the newsletter list if newsletter === true.
  ---------------------------------------------------------- */
  console.log('PRE-ORDER SIGNUP', { email, newsletter, product: PRODUCT_NAME, consentAt: new Date().toISOString() });

  if(!STRIPE_LINK){
    document.getElementById('modal-body').innerHTML =
      '<div class="modal-body"><div class="confirm"><div class="ck">!</div>' +
      '<p><em>Prototype mode.</em><br>Captured: ' + email + '<br>Newsletter: ' + (newsletter ? 'yes' : 'no') +
      '<br><br>Add STRIPE_LINK to enable real checkout.</p>' +
      '<button class="d-btn primary" style="margin-top:14px" onclick="closeModal()">OK</button></div></div>';
    return;
  }
  const sep = STRIPE_LINK.includes('?') ? '&' : '?';
  window.location.href = STRIPE_LINK + sep + 'prefilled_email=' + encodeURIComponent(email);
}

document.getElementById('modal').addEventListener('click',e=>{ if(e.target===document.getElementById('modal')) closeModal(); });