const modal = document.querySelector("[data-modal]");
const form = document.querySelector("[data-booking-form]");
const statusNode = document.querySelector("[data-form-status]");
let lastFocused = null;

function openModal() {
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector("input")?.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocused?.focus();
}

document.querySelectorAll("[data-open-booking]").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-close-booking]").forEach((button) => button.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeModal(); });

function moveSlider(name, direction) {
  const slider = document.querySelector(`[data-slider="${name}"]`);
  slider?.scrollBy({ left: Math.round(slider.clientWidth * .82) * direction, behavior: "smooth" });
}
document.querySelectorAll("[data-prev]").forEach((button) => button.addEventListener("click", () => moveSlider(button.dataset.prev, -1)));
document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => moveSlider(button.dataset.next, 1)));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  data.set("form-name", "loire-noel-booking");
  const message = [
    "Здравствуйте! Хочу оставить заявку на тур «Рождество в долине Луары», 3–6 декабря 2026.", "",
    `Имя: ${data.get("name")}`, `Телефон / WhatsApp: ${data.get("phone")}`,
    `Email: ${data.get("email")}`, `Количество путешественников: ${data.get("travelers")}`,
    `Комментарий: ${data.get("comment") || "—"}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/33667033170?text=${encodeURIComponent(message)}`;
  const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (location.protocol !== "file:") fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() }).then(() => form.reset()).catch(() => {});
  statusNode.textContent = popup ? "Заявка сохранена. Отправьте сообщение в открывшемся WhatsApp." : "Разрешите всплывающее окно и нажмите кнопку ещё раз.";
});
