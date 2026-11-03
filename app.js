/*
 * Frontend starter only.
 * Your server must create an authorized CAPTCHA session and validate completion
 * through the CAPTCHA provider's supported integration. Do not collect/replay
 * DataDome clearance cookies or treat a client postMessage as proof by itself.
 */
const API_BASE = ""; // Same-origin backend, e.g. https://api.example.com
const CAPTCHA_ORIGIN = "https://geo.captcha-delivery.com";

const form = document.querySelector("#verify-form");
const emailInput = document.querySelector("#email");
const statusEl = document.querySelector("#status");
const startBtn = document.querySelector("#start-btn");
const modal = document.querySelector("#captcha-modal");
const frame = document.querySelector("#challenge-frame");
const placeholder = document.querySelector("#placeholder");
const closeBtn = document.querySelector("#close-modal");

function showModal(url) {
  const parsed = new URL(url);
  if (parsed.origin !== CAPTCHA_ORIGIN) {
    throw new Error("Unexpected CAPTCHA provider URL.");
  }
  placeholder.hidden = false;
  frame.src = parsed.href;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}
function hideModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  frame.src = "about:blank";
}
closeBtn.addEventListener("click", hideModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) hideModal();
});
frame.addEventListener("load", () => {
  if (frame.src !== "about:blank") placeholder.hidden = true;
});

// Only accept a completion notification from the expected provider origin.
// A message is not sufficient proof: the backend must validate the session
// using the provider's documented server-side integration.
window.addEventListener("message", async (event) => {
  if (event.origin !== CAPTCHA_ORIGIN || !event.data || typeof event.data !== "object") return;
  if (event.data.eventType !== "passed") return;

  hideModal();
  statusEl.textContent = "Security check completed. Confirming with the server…";
  try {
    const response = await fetch(`${API_BASE}/api/captcha/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ completion: "passed" })
    });
    if (!response.ok) throw new Error("The server could not validate the security check.");
    statusEl.textContent = "Security check verified. You can now request the email code.";
  } catch (error) {
    statusEl.textContent = error.message || "Verification could not be confirmed.";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return;

  startBtn.disabled = true;
  statusEl.textContent = "Preparing secure verification…";
  try {
    const response = await fetch(`${API_BASE}/api/captcha/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to start verification.");
    if (!data.challengeUrl) throw new Error("The server did not return a challenge URL.");
    showModal(data.challengeUrl);
    statusEl.textContent = "Complete the security check to continue.";
  } catch (error) {
    statusEl.textContent = error.message || "Something went wrong.";
  } finally {
    startBtn.disabled = false;
  }
});
