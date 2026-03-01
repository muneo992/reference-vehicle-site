// rfq-form.js — Formspree版（EmailJS不要）
// Formspree endpoint: https://formspree.io/f/mlgwobkw

document.addEventListener("DOMContentLoaded", function () {

  var submitBtn = document.getElementById("emailSubmitBtn");
  var statusMsg = document.getElementById("status-message");

  if (!submitBtn) return;

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // 必須項目チェック
    var name  = document.getElementById("name")  ? document.getElementById("name").value.trim()  : "";
    var email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";

    if (!name || !email) {
      showStatus("error", "Please enter your Full Name and Email Address.");
      return;
    }

    // フォームデータを収集
    var formData = {
      name:          name,
      email:         email,
      phone:         getVal("phone"),
      vehicle_make:  getVal("make"),
      vehicle_model: getVal("model"),
      vehicle_year:  getVal("year"),
      destination:   getVal("destination"),
      message:       getVal("message")
    };

    // ボタンを送信中に変更
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Formspree へ送信
    fetch("https://formspree.io/f/mlgwobkw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(function (response) {
      if (response.ok) {
        showStatus("success", "Your message has been sent successfully! We will contact you shortly.");
        clearForm();
      } else {
        return response.json().then(function (data) {
          var errMsg = (data && data.errors)
            ? data.errors.map(function (e) { return e.message; }).join(", ")
            : "Failed to send. Please try again.";
          showStatus("error", errMsg);
        });
      }
    })
    .catch(function () {
      showStatus("error", "Network error. Please check your connection and try again.");
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "📧 Send via Email";
    });
  });

  // ---- ヘルパー関数 ----

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function showStatus(type, message) {
    if (!statusMsg) return;
    statusMsg.style.display = "block";
    statusMsg.className = "status-message " + (type === "success" ? "status-success" : "status-error");
    statusMsg.innerText = message;
    // 画面上部にスクロール
    statusMsg.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearForm() {
    ["make", "model", "year", "destination", "name", "email", "phone", "message"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
  }

});
