document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("rfq-form");

  form.addEventListener("submit", (e) => {
    // Formspree に送信するので preventDefault はしない
    // ただし WhatsApp を同時に開くためにデータを取得する

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const make = document.getElementById("vehicle-make").value.trim();
    const model = document.getElementById("vehicle-model").value.trim();
    const year = document.getElementById("vehicle-year").value.trim();

    const message = document.getElementById("message").value.trim();

    // WhatsApp メッセージ生成
    const waText =
      `Request for Quote\n\n` +
      `Make: ${make || "-"}\n` +
      `Model: ${model || "-"}\n` +
      `Year: ${year || "-"}\n\n` +
      `Name: ${name || "-"}\n` +
      `Email: ${email || "-"}\n` +
      `Phone: ${phone || "-"}\n\n` +
      `Message:\n${message || "-"}`;

    const encoded = encodeURIComponent(waText);

    // あなたの WhatsApp 番号に置き換えてください
    const yourNumber = "819076671825";

    const waUrl = `https://wa.me/${yourNumber}?text=${encoded}`;

    // 送信後に WhatsApp を開く
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 500);

    // 送信完了メッセージ
    alert("Your request has been submitted. We will contact you soon.");
  });
});


