const stripe = Stripe (PublishableKey);

let elements;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize(){
  const { clientSecret } = await clientS; 
  //   const { clientSecret } =await fetch("/create.php", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ items }),
  // }).then((r) => r.json());

  
  elements = stripe.elements({ clientSecret });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const response = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: confirmationURL,
     },
    redirect: 'if_required'
   }
  )
  
   if (response.error) {
    showMessage(response.error.message);
   } else {
    document.getElementById('checkoutConfirmDefaultHeading').textContent = PaymentSuccess;
    showMessage(PaymentSuccess);
    document.getElementById("btn_submit").click();
}
  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      document.getElementById('checkoutConfirmDefaultHeading').textContent = PaymentSuccess;
      showMessage(PaymentSuccess);
      document.getElementById("btn_submit").click();
      break;
    case "processing":
      document.getElementById('checkoutConfirmDefaultHeading').textContent='Your payment is processing.';
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      document.getElementById('checkoutConfirmDefaultHeading').textContent='Your payment was not successful, please try again.';
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      document.getElementById('checkoutConfirmDefaultHeading').textContent='Something went wrong.';
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}