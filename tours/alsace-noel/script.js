const bookingModal = document.querySelector("[data-booking-modal]");
const bookingForm = document.querySelector("[data-booking-form]");
const statusNode = document.querySelector("[data-form-status]");
let lastFocusedElement = null;

function openBooking() {
  lastFocusedElement = document.activeElement;
  bookingModal.hidden = false;
  document.body.style.overflow = "hidden";
  const firstInput = bookingModal.querySelector("input");
  if (firstInput) firstInput.focus();
}

function closeBooking() {
  bookingModal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll("[data-open-booking]").forEach((button) => {
  button.addEventListener("click", openBooking);
});

document.querySelectorAll("[data-close-booking]").forEach((button) => {
  button.addEventListener("click", closeBooking);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !bookingModal.hidden) closeBooking();
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  formData.set("form-name", "alsace-booking");
  const message = [
    "Здравствуйте! Хочу оставить заявку на тур «Рождество в Эльзасе», 7–10 декабря.",
    "",
    `Имя: ${formData.get("name")}`,
    `Телефон / WhatsApp: ${formData.get("phone")}`,
    `Email: ${formData.get("email")}`,
    `Количество путешественников: ${formData.get("travelers")}`,
    `Комментарий: ${formData.get("comment") || "—"}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/33667033170?text=${encodeURIComponent(message)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (window.location.protocol !== "file:") {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    }).then(() => bookingForm.reset()).catch(() => {});
  }

  if (whatsappWindow) {
    statusNode.textContent = "Заявка сохранена. Отправьте сообщение в открывшемся WhatsApp.";
  } else {
    statusNode.innerHTML = `Разрешите всплывающее окно или <a href="${whatsappUrl}" target="_blank" rel="noopener">откройте заявку в WhatsApp</a>.`;
  }
});

function moveSlider(name, direction) {
  const slider = document.querySelector(`[data-slider="${name}"]`);
  if (!slider) return;
  const amount = Math.round(slider.clientWidth * 0.82) * direction;
  slider.scrollBy({ left: amount, behavior: "smooth" });
}

document.querySelectorAll("[data-slider-prev]").forEach((button) => {
  button.addEventListener("click", () => moveSlider(button.dataset.sliderPrev, -1));
});

document.querySelectorAll("[data-slider-next]").forEach((button) => {
  button.addEventListener("click", () => moveSlider(button.dataset.sliderNext, 1));
});
