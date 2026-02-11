// rfq.js
// 前提：rfq.html のフォーム構造に合わせている
// ・Reference ID は使用しない
// ・model / year をメッセージに含める

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#rfq-form');
  if (!form) return;

  // 必要に応じて実際の番号 / メールアドレスに置き換え
  const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER_WITH_COUNTRY_CODE'; // 例: '233XXXXXXXXX'
  const EMAIL_TO = 'info@example.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = getValue('#name');
    const email = getValue('#email');
    const whatsapp = getValue('#whatsapp');
    const make = getValue('#make');
    const model = getValue('#model');
    const year = getValue('#year');
    const message = getValue('#message');

    const subject = buildEmailSubject(make, model, year);
    const body = buildCommonBody({
      name,
      email,
      whatsapp,
      make,
      model,
      year,
      message,
    });

    // メール（mailto）
    const mailtoUrl = `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // WhatsApp メッセージ
    const waText = buildWhatsAppText({
      name,
      email,
      whatsapp,
      make,
      model,
      year,
      message,
    });
    const waUrl = `https://wa.me/${encodeURIComponent(WHATSAPP_NUMBER)}?text=${encodeURIComponent(
      waText
    )}`;

    // ユーザー環境に合わせて、どちらを優先するかは運用で決める
    // ここでは新しいタブで WhatsApp、その後 mailto をトリガー
    window.open(waUrl, '_blank');
    window.location.href = mailtoUrl;
  });

  function getValue(selector) {
    const el = document.querySelector(selector);
    return el ? el.value.trim() : '';
  }

  function buildEmailSubject(make, model, year) {
    const parts = [];
    if (make) parts.push(make);
    if (model) parts.push(model);
    if (year) parts.push(year);
    if (parts.length === 0) return 'RFQ from Website';
    return `RFQ: ${parts.join(' ')}`;
  }

  function buildCommonBody({ name, email, whatsapp, make, model, year, message }) {
    return [
      `Name: ${name || '-'}`,
      `Email: ${email || '-'}`,
      `WhatsApp: ${whatsapp || '-'}`,
      '',
      `Make: ${make || '-'}`,
      `Model: ${model || '-'}`,
      `Year: ${year || '-'}`,
      '',
      'Message / Requirements:',
      message || '-',
    ].join('\n');
  }

  function buildWhatsAppText({ name, email, whatsapp, make, model, year, message }) {
    return [
      'RFQ from Website',
      '',
      `Name: ${name || '-'}`,
      `Email: ${email || '-'}`,
      `WhatsApp: ${whatsapp || '-'}`,
      '',
      `Make: ${make || '-'}`,
      `Model: ${model || '-'}`,
      `Year: ${year || '-'}`,
      '',
      'Message / Requirements:',
      message || '-',
    ].join('\n');
  }
});

