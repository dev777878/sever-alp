// ============================================
// НАСТРОЙКИ (ЗАМЕНИ НА СВОИ!)
// ============================================
// 1. Создай бота через @BotFather в Telegram
// 2. Получи токен (например: 7123456789:AAH...)
// 3. Узнай свой chat_id через @userinfobot
const TELEGRAM_CONFIG = {
  botToken: 'СЮДА_ВСТАВЬ_ТОКЕН_БОТА',
  chatId: 'СЮДА_ВСТАВЬ_CHAT_ID'
};

// ============================================
// ОБРАБОТКА ФОРМЫ
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name') || 'не указано';
    const phone = formData.get('phone') || 'не указан';
    const company = formData.get('company') || 'не указана';
    const address = formData.get('address') || 'не указан';
    const service = formData.get('service') || 'не выбран';
    const message = formData.get('message') || 'нет описания';
    
    // Формируем красивое сообщение
    const text = `🔔 *НОВАЯ ЗАЯВКА с сайта Север-Альп*
    
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
🏢 *Организация:* ${company}
📍 *Адрес:* ${address}
🔧 *Тип работ:* ${service}

💬 *Описание:*
${message}

🕐 ${new Date().toLocaleString('ru-RU')}`;
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.chatId,
            text: text,
            parse_mode: 'Markdown'
          })
        }
      );
      
      if (response.ok) {
        alert('✅ Заявка отправлена! Свяжусь с вами в течение 30 минут.');
        contactForm.reset();
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка отправки. Позвоните нам: +7 (999) 123-45-67');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
