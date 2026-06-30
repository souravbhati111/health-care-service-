const API_URL = 'http://localhost:5000/api';

const form      = document.getElementById('contactForm');
const msgBox    = document.getElementById('form-msg');
const submitBtn = document.getElementById('submitBtn');

function showMsg(text, type) {
  msgBox.textContent = text;
  msgBox.className = 'form-feedback ' + type;
  msgBox.style.display = 'block';
  msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgBox.style.display = 'none';

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showMsg('Please fill in all required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message }),
        signal: AbortSignal.timeout(6000)
      });
      const data = await res.json();

      if (data.success) {
        showMsg(data.message, 'success');
        form.reset();
      } else {
        showMsg(data.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showMsg('Unable to connect to the server. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
