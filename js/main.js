// ============================================
// Плавная прокрутка к якорям
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length <= 1) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('.header').offsetHeight;
      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// Маска для телефона
// ============================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value[0] === '7' || value[0] === '8') value = value.substring(1);
      let formatted = '+7';
      if (value.length > 0) formatted += ' (' + value.substring(0, 3);
      if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
      if (value.length >= 6) formatted += '-' + value.substring(6, 8);
      if (value.length >= 8) formatted += '-' + value.substring(8, 10);
      e.target.value = formatted;
    }
  });
}

// ============================================
// FAQ аккордеон
// ============================================
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ============================================
// Калькулятор стоимости
// ============================================
function calculatePrice() {
  const serviceSelect = document.getElementById('calcService');
  const volumeInput = document.getElementById('calcVolume');
  const complexitySelect = document.getElementById('calcComplexity');
  const urgencySelect = document.getElementById('calcUrgency');
  const priceElement = document.getElementById('calcPrice');
  const resultBlock = document.getElementById('calcResult');
  const breakdown = document.getElementById('calcBreakdown');

  if (!serviceSelect || !volumeInput || !priceElement) return;

  const basePrice = parseInt(serviceSelect.value);
  const volume = parseInt(volumeInput.value);
  const complexity = parseFloat(complexitySelect.value);
  const urgency = parseFloat(urgencySelect.value);

  if (!volume || volume <= 0) {
    alert('Пожалуйста, введите объём работ');
    volumeInput.focus();
    return;
  }

  const totalPrice = Math.round(basePrice * volume * complexity * urgency);

  document.getElementById('breakBase').textContent = (basePrice * volume).toLocaleString('ru-RU') + ' ₽';
  document.getElementById('breakComplexity').textContent = '×' + complexity;
  document.getElementById('breakUrgency').textContent = '×' + urgency;
  breakdown.style.display = 'block';

  animatePrice(priceElement, totalPrice);
  resultBlock.style.transform = 'scale(1.03)';
  setTimeout(() => { resultBlock.style.transform = 'scale(1)'; }, 200);
}

function animatePrice(element, targetPrice) {
  const duration = 500;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentPrice = Math.floor(targetPrice * easeOut);
    element.textContent = currentPrice.toLocaleString('ru-RU') + ' ₽';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const calcVolumeInput = document.getElementById('calcVolume');
if (calcVolumeInput) {
  calcVolumeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); calculatePrice(); }
  });
}

// ============================================
// Pop-up exit-intent
// ============================================
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');
let popupShown = false;

function closePopup() {
  if (popup) {
    popup.classList.remove('active');
    sessionStorage.setItem('popupClosed', 'true');
  }
}

if (popup && !sessionStorage.getItem('popupClosed')) {
  // Показ при попытке уйти со страницы (десктоп)
  document.addEventListener('mouseout', function(e) {
    if (!popupShown && e.clientY < 10 && !e.relatedTarget) {
      popup.classList.add('active');
      popupShown = true;
    }
  });
  // Запасной вариант: через 60 секунд
  setTimeout(() => {
    if (!popupShown && !sessionStorage.getItem('popupClosed')) {
      popup.classList.add('active');
      popupShown = true;
    }
  }, 60000);
}

if (popupClose) popupClose.addEventListener('click', closePopup);
if (popup) popup.addEventListener('click', (e) => { if (e.target === popup) closePopup(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popup && popup.classList.contains('active')) closePopup();
});

// ============================================
// Анимация появления при скролле
// ============================================
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.safety-card, .service-card, .process-card, .portfolio-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
