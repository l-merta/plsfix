/* ============================================================
PLS FIX (ME) — CONFIG  (the only block a developer needs to edit)
============================================================

1. DROP_DEADLINE — when the pre-order window closes. After this date
    you tally orders, produce exactly that quantity, and ship.
    Format: 'YYYY-MM-DDTHH:MM:SS' in 24h local time.

2. STRIPE_LINKS — one Stripe Payment Link per colorway.
    Create them in Stripe Dashboard → Payment Links (no backend needed).
    Set each link's "after payment" redirect to your /thank-you page.
    Until a link is filled in, that button shows prototype mode.

3. To mark a colorway sold out, set its link to null AND update the
    product card status text in the HTML.
============================================================ */

const DROP_DEADLINE = '2026-07-31T23:59:59'; // <-- SET ORDER WINDOW CLOSE DATE

const STRIPE_LINKS = {
'Pls Fix (Me) — Green': 'https://buy.stripe.com/28E5kDbUT3yV2wxafj1oI01', // <-- paste Stripe Payment Link URL
'Pls Fix (Me) — Navy':  'https://buy.stripe.com/fZubJ1f75edzc775Z31oI00', // <-- paste Stripe Payment Link URL
'Pls Fix (Me) — Black': 'https://buy.stripe.com/7sY9AT0cb1qN6MN87b1oI02', // <-- paste Stripe Payment Link URL
};

// ── DROP DATE DISPLAY + COUNTDOWN ──────────────────────────
(function () {
const deadline = new Date(DROP_DEADLINE);
const dateStr = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const dEl = document.getElementById('drop-date');
const mEl = document.getElementById('modal-drop-date');
if (dEl) dEl.textContent = dateStr;
if (mEl) mEl.textContent = dateStr;

function tick() {
  const now = new Date();
  const diff = deadline - now;
  const el = document.getElementById('countdown');
  if (!el) return;
  if (diff <= 0) { el.textContent = 'ORDERS CLOSED'; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  el.textContent = d + 'd ' + h + 'h ' + m + 'm left';
}
tick();
setInterval(tick, 60000);
})();

// ── VISITOR COUNTER (cosmetic) ─────────────────────────────
let count = 836;
setInterval(() => {
count++;
const el = document.getElementById('counter');
if (el) el.textContent = String(count).padStart(6, '0');
}, 7000);

// ── PRE-ORDER MODAL ────────────────────────────────────────
let currentProduct = null;

function openModal(product, price, modalId) {
currentProduct = product;
document.getElementById('modal-product').textContent = product;
document.getElementById('modal-price').textContent = price;
document.getElementById('modal-title').textContent = 'reserve — ' + product;
document.getElementById('step-form').style.display = 'block';
document.getElementById('step-loading').style.display = 'none';
document.getElementById('step-confirm').style.display = 'none';
// reset form
document.getElementById('email').value = '';
document.getElementById('agree-terms').checked = false;
document.getElementById('agree-news').checked = false;
validateForm();
document.getElementById(modalId).classList.remove('disabled');
}

function closeModal(modalId) {
document.getElementById(modalId).classList.add('disabled');
}

// Enable reserve only when email valid AND terms accepted
function validateForm() {
const email = document.getElementById('email');
const terms = document.getElementById('agree-terms');
const btn = document.getElementById('reserve-btn');
if (!email || !terms || !btn) return;
const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
btn.disabled = !(emailOk && terms.checked);
}

function reserveViaStripe() {
const email = document.getElementById('email').value.trim();
const newsletter = document.getElementById('agree-news').checked;
const link = STRIPE_LINKS[currentProduct];

/* ----------------------------------------------------------
  DEV: send {email, newsletter, product, consentAt} to your
  email tool / order log BEFORE redirecting to Stripe.
  Store the terms consent + timestamp (GDPR: keep proof).
  Only add to newsletter list if newsletter === true.
  Example:
  fetch('/api/preorder-signup', { method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, newsletter, product: currentProduct,
      termsConsent:true, consentAt:new Date().toISOString() }) });
---------------------------------------------------------- */
console.log('PRE-ORDER SIGNUP', { email, newsletter, product: currentProduct, consentAt: new Date().toISOString() });

// No link set yet → prototype message
if (!link) {
  document.getElementById('step-form').style.display = 'none';
  document.getElementById('step-confirm').style.display = 'block';
  return;
}

// Redirect to Stripe, pre-filling the email
document.getElementById('step-form').style.display = 'none';
document.getElementById('step-loading').style.display = 'block';
const bar = document.getElementById('progress');
let w = 0;
const interval = setInterval(() => {
  w += Math.random() * 25 + 10;
  if (w >= 100) {
    w = 100;
    clearInterval(interval);
    const sep = link.includes('?') ? '&' : '?';
    window.location.href = link + sep + 'prefilled_email=' + encodeURIComponent(email);
  }
  bar.style.width = w + '%';
}, 200);
}

// Close modal on overlay click
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal(e.target.id);
});