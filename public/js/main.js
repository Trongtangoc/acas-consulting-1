// ==========================================
// MOBILE MENU
// ==========================================
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');

mobileToggle.addEventListener('click', () => {
  mainNav.classList.toggle('active');
});

// ==========================================
// SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      mainNav.classList.remove('active');
    }
  });
});

// ==========================================
// ACTIVE NAV ON SCROLL
// ==========================================
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (window.pageYOffset > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

// ==========================================
// BACK TO TOP
// ==========================================
document.querySelector('.back-to-top').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


// ==========================================
// FORM SUBMISSION - GOOGLE SHEETS via Cloudflare Worker
// ==========================================
const GOOGLE_SCRIPT_URL = "https://acaslawfirm.com/api/proxy";

const form = document.getElementById('consultationForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // ✅ Validate phone trước khi gửi
  const phone = form.querySelector('input[name="phone"]').value.trim();
  const regex = /^\+?\d{9,15}$/;
  if (!regex.test(phone)) {
    formMessage.textContent =
      "❌ Please enter a valid phone number (9–15 digits, may start with +)";
    formMessage.style.color = "red";
    return;
  }

  // ✅ Nếu hợp lệ mới gửi đi
  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'SENDING...';

  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: phone,
    practice_area: formData.get('practice_area') || 'Not specified',
    message: formData.get('message'),
    timestamp: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Network response was not ok');

    formMessage.className = 'form-message success';
    formMessage.textContent = '✅ Thank you! Your consultation request has been received.';
    formMessage.style.color = 'green';
    form.reset();

    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.className = '';
    }, 5000);
  } catch (error) {
    formMessage.className = 'form-message error';
    formMessage.textContent = '❌ Sorry, there was an error. Please try again or call us at 0935.996.043';
    formMessage.style.color = 'red';
    console.error('Error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});


