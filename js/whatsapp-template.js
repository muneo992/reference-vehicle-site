// WhatsApp Template Generator
class WhatsAppTemplateGenerator {
  static generateTemplate(formData) {
    return `Hi! I'm interested in a vehicle similar to:\n\n` +
      `Model: ${formData.model || 'Any'}\n` +
      `Year: ${formData.year_from} - ${formData.year_to}\n` +
      `Max Mileage: ${parseInt(formData.mileage_max).toLocaleString()} km\n` +
      `Budget: $${parseInt(formData.budget_from).toLocaleString()} - $${parseInt(formData.budget_to).toLocaleString()}\n` +
      `Quantity: ${formData.quantity}\n` +
      `Destination: ${formData.destination_country} (${formData.destination_port})\n` +
      `Steering: ${formData.steering}\n\n` +
      `Please let me know about available options.\n\n` +
      `Thank you!`;
  }

  static generateWhatsAppLink(phoneNumber, message) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  static copyToClipboard(text ) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Message copied!');
    });
  }
}

// On success page
document.addEventListener('DOMContentLoaded', () => {
  const rfqs = JSON.parse(localStorage.getItem('rfq_submissions') || '[]');
  if (rfqs.length > 0) {
    const lastRFQ = rfqs[rfqs.length - 1];
    const template = WhatsAppTemplateGenerator.generateTemplate(lastRFQ);
    
    const previewElement = document.getElementById('template-preview');
    if (previewElement) {
      previewElement.innerHTML = '<pre>' + template.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
    }

    const copyButton = document.getElementById('copy-whatsapp');
    if (copyButton) {
      copyButton.addEventListener('click', () => {
        WhatsAppTemplateGenerator.copyToClipboard(template);
      });
    }

    const sendButton = document.getElementById('send-whatsapp');
    if (sendButton) {
      const link = WhatsAppTemplateGenerator.generateWhatsAppLink(lastRFQ.whatsapp_number, template);
      sendButton.href = link;
      sendButton.target = '_blank';
    }
  }
});
