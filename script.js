// НАСТРОЙКА TELEGRAM:
// 1) Впишите username вашего Telegram-бота без символа @ в BOT_USERNAME.
// 2) Если бота нет, можно вместо этого использовать ссылку на ваш Telegram username:
//    https://t.me/ВАШ_USERNAME?text=... — см. инструкцию рядом с сайтом.
// Важно: Telegram не отправляет сообщение автоматически. Девушка увидит текст и сама нажмёт «Отправить».
const BOT_USERNAME = ""; // Например: "my_date_invite_bot" — без @. Оставьте пустым, если бота пока нет.

const intro = document.getElementById("intro");
const planner = document.getElementById("planner");
const finalScreen = document.getElementById("final");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const backBtn = document.getElementById("backBtn");
const confirmBtn = document.getElementById("confirmBtn");
const sendBtn = document.getElementById("sendBtn");
const editBtn = document.getElementById("editBtn");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const noteInput = document.getElementById("noteInput");
const formError = document.getElementById("formError");
const summary = document.getElementById("summary");
const telegramHint = document.getElementById("telegramHint");
let selectedIdea = "";

const localToday = new Date();
const yyyy = localToday.getFullYear();
const mm = String(localToday.getMonth() + 1).padStart(2, "0");
const dd = String(localToday.getDate()).padStart(2, "0");
dateInput.min = `${yyyy}-${mm}-${dd}`;

const noMessages = [
  "Может, всё-таки подумаешь? 🥺",
  "Кнопка немного смущена 🙈",
  "А если кофе и хорошая компания? ☕",
  "Ладно, не тороплю 💗",
  "«Нет» — тоже нормальный ответ ❤️"
];
let noClicks = 0;

function showScreen(screen) {
  [intro, planner, finalScreen].forEach(el => el.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function hearts(amount = 18) {
  const container = document.getElementById("floatingHearts");
  const symbols = ["♡", "♥", "✧", "💕"];
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${14 + Math.random() * 22}px`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * 1.2}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 9000);
  }
}
yesBtn.addEventListener("click", () => { hearts(24); showScreen(planner); });
noBtn.addEventListener("click", () => {
  noClicks++;
  noBtn.textContent = noMessages[Math.min(noClicks - 1, noMessages.length - 1)];
  if (noClicks >= noMessages.length) {
    noBtn.textContent = "Нет, спасибо ❤️";
    noBtn.onclick = () => {
      intro.innerHTML = `
        <div class="hero-heart">💗</div>
        <p class="script">Спасибо, что честно ответила</p>
        <h2>Всё хорошо</h2>
        <p class="lead">Никакого давления — твоё решение важно. Если когда-нибудь захочешь, приглашение остаётся в силе 🌷</p>
        <button class="btn btn-back" id="restartBtn">Вернуться</button>`;
      document.getElementById("restartBtn").addEventListener("click", () => location.reload());
    };
  }
});
backBtn.addEventListener("click", () => showScreen(intro));
document.querySelectorAll(".date-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedIdea = button.dataset.idea;
    document.querySelectorAll(".date-option").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  });
});
function readableDate(value) {
  if (!value) return "договоримся отдельно";
  const [y, m, d] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(y, m - 1, d));
}
function currentPlan() {
  return {
    idea: selectedIdea || "Пока не выбрано",
    date: readableDate(dateInput.value),
    time: timeInput.value || "договоримся отдельно",
    note: noteInput.value.trim()
  };
}
confirmBtn.addEventListener("click", () => {
  if (!selectedIdea) {
    formError.textContent = "Выбери, пожалуйста, что тебе больше нравится 💗";
    return;
  }
  if (!dateInput.value) {
    formError.textContent = "Выбери дату — или обсудим её лично 😊";
    dateInput.focus();
    return;
  }
  if (dateInput.value < dateInput.min) {
    formError.textContent = "Эта дата уже прошла. Выбери сегодняшнюю или будущую 🌷";
    return;
  }
  formError.textContent = "";
  const p = currentPlan();
  summary.innerHTML = `<div>💞 <strong>Наш вариант:</strong> ${escapeHtml(p.idea)}</div>
    <div>📅 <strong>Дата:</strong> ${escapeHtml(p.date)}</div>
    <div>🕰️ <strong>Время:</strong> ${escapeHtml(p.time)}</div>
    ${p.note ? `<div>💌 <strong>Примечание:</strong> ${escapeHtml(p.note)}</div>` : ""}`;
  showScreen(finalScreen);
  hearts(30);
});
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
sendBtn.addEventListener("click", () => {
  const p = currentPlan();
  const message = `Привет! 💗 Я посмотрела приглашение на свидание.\nМой ответ: ДА!\nИдея: ${p.idea}\nДата: ${p.date}\nВремя: ${p.time}${p.note ? `\nМой комментарий: ${p.note}` : ""}\n\nДавай уточним детали 😊`;
  if (BOT_USERNAME.trim()) {
    const username = BOT_USERNAME.trim().replace(/^@/, "");
    window.open(`https://t.me/${encodeURIComponent(username)}?start=${encodeURIComponent(message)}`, "_blank", "noopener");
    telegramHint.textContent = "Telegram открылся. Если бот настроен на приём сообщений, отправь ему сообщение. Для обычного бота параметр start передаёт только короткий код, поэтому лучше использовать личный чат ниже.";
    // Universal share fallback is more reliable for a prefilled message.
    window.location.href = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(message)}`;
  } else {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(message)}`, "_blank", "noopener");
    telegramHint.textContent = "Откроется выбор чата в Telegram с подготовленным текстом. Выбери свой чат и нажми «Отправить».";
  }
});
const petalField = document.getElementById("lilacPetals");

if (petalField) {
  for (let i = 0; i < 24; i++) {
    const petal = document.createElement("span");
    petal.className = "lilac-petal";

    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration =
      (7 + Math.random() * 9) + "s";
    petal.style.animationDelay =
      (-Math.random() * 16) + "s";

    const size = 8 + Math.random() * 10;
    petal.style.width = size + "px";
    petal.style.height = size * 1.4 + "px";

    petalField.appendChild(petal);
  }
}

const butterflyField = document.getElementById("butterflies");

if (butterflyField) {
  for (let i = 0; i < 5; i++) {
    const butterfly = document.createElement("div");
    butterfly.className = "butterfly";

    const art = document.createElement("div");
    art.className = "butterfly-art";

    // Четыре крыла
    ["left", "right"].forEach(side => {
      ["upper", "lower"].forEach(position => {
        const wing = document.createElement("div");
        wing.className =
          `butterfly-wing ${side}` +
          (position === "lower" ? " lower" : "");
        art.appendChild(wing);
      });
    });

    // Светлые узоры на крыльях
    ["left", "right"].forEach(side => {
      const mark = document.createElement("span");
      mark.className = `butterfly-mark ${side}`;
      mark.textContent = "✦";
      art.appendChild(mark);
    });

    const body = document.createElement("div");
    body.className = "butterfly-body";
    art.appendChild(body);

    butterfly.appendChild(art);

    butterfly.style.top = `${10 + Math.random() * 75}%`;
    butterfly.style.animationDuration =
      `${14 + Math.random() * 12}s`;
    butterfly.style.animationDelay =
      `${-Math.random() * 24}s`;

    const size = 0.7 + Math.random() * 0.45;
    butterfly.style.scale = String(size);

    butterflyField.appendChild(butterfly);
  }
}

editBtn.addEventListener("click", () => showScreen(planner));
hearts(12);
