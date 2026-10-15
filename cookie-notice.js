(function () {
  "use strict";
  if (document.getElementById("mt-cookie-notice")) return;
  const key = "matryoshka_cookie_notice_v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let acknowledged = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    const age = Date.now() - (saved && saved.acknowledgedAt);
    acknowledged = !!saved && saved.version === 1 && Number.isFinite(age) && age >= 0 && age < lifetime;
  } catch (_) {}
  const notice = document.createElement("section");
  notice.id = "mt-cookie-notice";
  notice.className = "mt-cookie-notice";
  notice.setAttribute("role", "region");
  notice.setAttribute("aria-labelledby", "mt-cookie-title");
  notice.innerHTML = '<div class="mt-cookie-copy"><h2 id="mt-cookie-title">Cookies и конфиденциальность</h2><p>На этом сайте не подключены рекламные и аналитические cookies. Мы сохраняем в браузере отметку о прочтении этого уведомления на 6 месяцев.</p></div><div class="mt-cookie-actions"><a href="/cookies.html">Подробнее</a><button type="button" class="mt-cookie-dismiss">Понятно</button></div>';
  const reopen = document.createElement("button");
  reopen.type = "button";
  reopen.className = "mt-cookie-reopen";
  reopen.textContent = "Cookies";
  reopen.setAttribute("aria-label", "Открыть уведомление о cookies");
  reopen.setAttribute("aria-controls", notice.id);
  reopen.setAttribute("aria-expanded", "false");
  function show() {
    notice.hidden = false;
    reopen.hidden = true;
    reopen.setAttribute("aria-expanded", "true");
  }
  function dismiss() {
    const restoreFocus = notice.contains(document.activeElement);
    try { localStorage.setItem(key, JSON.stringify({ version: 1, acknowledgedAt: Date.now() })); } catch (_) {}
    notice.hidden = true;
    reopen.hidden = false;
    reopen.setAttribute("aria-expanded", "false");
    if (restoreFocus) reopen.focus();
  }
  notice.querySelector("button").addEventListener("click", dismiss);
  notice.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); }
  });
  reopen.addEventListener("click", function () { show(); notice.querySelector("button").focus(); });
  notice.hidden = acknowledged;
  reopen.hidden = !acknowledged;
  document.body.append(notice, reopen);
})();
