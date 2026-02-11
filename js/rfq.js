<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request a Quote</title>
  <link rel="stylesheet" href="css/style.css">
</head>

<body>

<header class="site-header">
  <nav class="navbar">
    <div class="container">
      <a href="index.html" class="logo">Gloria Trading</a>
      <ul class="navbar-menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="catalog.html">Reference Vehicles</a></li>
      </ul>
    </div>
  </nav>
</header>

<section class="page-header">
  <div class="container">
    <h1>Request a Quote</h1>
    <p>Please fill out the form below. We will contact you shortly.</p>
  </div>
</section>

<section>
  <div class="container">

    <form id="rfq-form">

      <!-- Vehicle Reference (auto-filled) -->
      <fieldset>
        <legend>Vehicle Information</legend>

        <div class="form-group">
          <label for="vehicle-ref">Reference ID</label>
          <input type="text" id="vehicle-ref" name="vehicle_ref" readonly>
          <small>This is automatically filled based on the vehicle you selected.</small>
        </div>

        <!-- hidden field for backend -->
        <input type="hidden" id="vehicle-ref-hidden" name="vehicle_ref_hidden">
      </fieldset>

      <!-- Contact Info -->
      <fieldset>
        <legend>Your Information</legend>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
          <label for="phone">Phone / WhatsApp</label>
          <input type="tel" id="phone" name="phone">
        </div>
      </fieldset>

      <!-- Message -->
      <fieldset>
        <legend>Message</legend>

        <div class="form-group">
          <label for="message">Your Request</label>
          <textarea id="message" name="message" rows="5"></textarea>
        </div>
      </fieldset>

      <button type="submit" class="btn btn-primary btn-block">Submit Request</button>

    </form>

  </div>
</section>

<script src="js/rfq.js"></script>

</body>
</html>
