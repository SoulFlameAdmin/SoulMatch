import { profiles } from "./data/profiles.js";

const storageKey = "soulmatch_state_v1";

let state = JSON.parse(localStorage.getItem(storageKey)) || {
  index: 0,
  likes: [],
  matches: [],
  seen: 0,
  lastMatch: null,
  profile: {
    name: "",
    city: "",
    bio: ""
  }
};

const deck = document.getElementById("deck");
const matchModal = document.getElementById("matchModal");
const matchText = document.getElementById("matchText");
const likesCount = document.getElementById("likesCount");
const matchesCount = document.getElementById("matchesCount");
const seenCount = document.getElementById("seenCount");
const matchesList = document.getElementById("matchesList");
const chatHead = document.getElementById("chatHead");
const messages = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateStats();
  renderMatches();
}

function initials(name) {
  return name.slice(0, 2).toUpperCase();
}

function getCurrentProfile() {
  return profiles[state.index];
}

function renderDeck() {
  deck.innerHTML = "";

  const remaining = profiles.slice(state.index, state.index + 3);

  if (remaining.length === 0) {
    deck.innerHTML = `
      <div class="empty">
        <div>
          <h2>Няма повече профили</h2>
          <p>Натисни бутона ↻ горе, за да започнеш отначало. В реалната версия тук ще зареждаме хора от база данни.</p>
        </div>
      </div>
    `;
    return;
  }

  remaining.reverse().forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = p.id;
    card.style.zIndex = i + 1;
    card.style.transform = `scale(${1 - (remaining.length - 1 - i) * 0.035}) translateY(${(remaining.length - 1 - i) * 12}px)`;

    card.innerHTML = `
      <div class="photo" style="--c1:${p.c1}; --c2:${p.c2};">
        ${initials(p.name)}
        <div class="badge like">LIKE</div>
        <div class="badge nope">NOPE</div>
      </div>

      <div class="card-info">
        <div class="name-row">
          <div>
            <div class="name">${p.name} <span class="age">${p.age}</span></div>
            <div class="city">📍 ${p.city}</div>
          </div>
        </div>
        <div class="bio">${p.bio}</div>
        <div class="tags">
          ${p.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
        </div>
      </div>
    `;

    if (i === remaining.length - 1) enableDrag(card);

    deck.appendChild(card);
  });
}

function swipeCurrent(direction) {
  const card = deck.querySelector(".card:last-child");
  const profile = getCurrentProfile();

  if (!card || !profile) return;

  const x = direction === "right" ? 520 : -520;
  const rot = direction === "right" ? 24 : -24;

  card.style.transform = `translateX(${x}px) rotate(${rot}deg)`;
  card.style.opacity = "0";

  setTimeout(() => handleSwipe(direction, profile), 220);
}

function handleSwipe(direction, profile) {
  state.seen += 1;

  if (direction === "right") {
    if (!state.likes.includes(profile.id)) state.likes.push(profile.id);

    const isMatch = Math.random() > 0.45 || state.matches.length === 0;

    if (isMatch && !state.matches.includes(profile.id)) {
      state.matches.push(profile.id);
      state.lastMatch = profile.id;
      showMatch(profile);
    }
  }

  state.index += 1;
  saveState();
  renderDeck();
}

function superLike() {
  const profile = getCurrentProfile();
  if (!profile) return;

  if (!state.likes.includes(profile.id)) state.likes.push(profile.id);
  if (!state.matches.includes(profile.id)) state.matches.push(profile.id);

  state.lastMatch = profile.id;
  state.seen += 1;
  state.index += 1;

  showMatch(profile);
  saveState();
  renderDeck();
}

function showMatch(profile) {
  matchText.textContent = `Ти и ${profile.name} се харесахте. Това е моментът за първо съобщение.`;
  matchModal.classList.add("show");
}

function closeMatch() {
  matchModal.classList.remove("show");
}

function openChatFromMatch() {
  closeMatch();
  showScreen("chat");

  const p = profiles.find(x => x.id === state.lastMatch);
  if (p) {
    chatHead.textContent = `Чат с ${p.name}`;
    messages.innerHTML = `
      <div class="msg them">Хей 👋 Видях профила ти. Какво те доведе тук?</div>
      <div class="msg me">Хареса ми енергията ти. Кажи ми нещо, което не пише в профила.</div>
    `;
  }
}

function enableDrag(card) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", e => {
    dragging = true;
    startX = e.clientX;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!dragging) return;

    currentX = e.clientX - startX;
    const rotate = currentX / 14;

    card.style.transition = "none";
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

    const likeBadge = card.querySelector(".badge.like");
    const nopeBadge = card.querySelector(".badge.nope");

    if (currentX > 0) {
      likeBadge.style.opacity = Math.min(currentX / 120, 1);
      nopeBadge.style.opacity = 0;
    } else {
      nopeBadge.style.opacity = Math.min(Math.abs(currentX) / 120, 1);
      likeBadge.style.opacity = 0;
    }
  });

  card.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;

    card.style.transition = "transform .28s ease, opacity .28s ease";

    if (currentX > 120) {
      swipeCurrent("right");
    } else if (currentX < -120) {
      swipeCurrent("left");
    } else {
      card.style.transform = "translateX(0) rotate(0deg)";
      card.querySelector(".badge.like").style.opacity = 0;
      card.querySelector(".badge.nope").style.opacity = 0;
    }

    currentX = 0;
  });

  card.addEventListener("pointercancel", () => {
    dragging = false;
    currentX = 0;
  });
}

function renderMatches() {
  const matched = profiles.filter(p => state.matches.includes(p.id));

  if (matched.length === 0) {
    matchesList.innerHTML = `
      <div class="empty" style="height:360px;">
        <div>
          <h2>Още няма match</h2>
          <p>Харесай няколко профила и тук ще се появят съвпаденията.</p>
        </div>
      </div>
    `;
    return;
  }

  matchesList.innerHTML = matched.map(p => `
    <div class="person-row" data-chat-id="${p.id}">
      <div class="avatar" style="--c1:${p.c1}; --c2:${p.c2};">${initials(p.name)}</div>
      <div>
        <h3>${p.name}, ${p.age}</h3>
        <p>${p.city} · Натисни за чат</p>
      </div>
    </div>
  `).join("");

  matchesList.querySelectorAll("[data-chat-id]").forEach(row => {
    row.addEventListener("click", () => startChat(Number(row.dataset.chatId)));
  });
}

function startChat(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return;

  state.lastMatch = id;
  saveState();
  showScreen("chat");

  chatHead.textContent = `Чат с ${p.name}`;
  messages.innerHTML = `
    <div class="msg them">Здравей 😊</div>
    <div class="msg them">Кое е най-якото нещо, което ти се случи тази седмица?</div>
  `;
}

function sendMsg(value) {
  const text = value.trim();
  if (!text) return;

  const me = document.createElement("div");
  me.className = "msg me";
  me.textContent = text;
  messages.appendChild(me);

  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "msg them";
    reply.textContent = smartReply(text);
    messages.appendChild(reply);
    messages.scrollTop = messages.scrollHeight;
  }, 450);
}

function smartReply(text) {
  const lower = text.toLowerCase();

  if (lower.includes("здрав") || lower.includes("hi") || lower.includes("hello")) {
    return "Хей 😊 Разкажи ми нещо интересно за себе си.";
  }

  if (lower.includes("кафе")) {
    return "Кафе звучи добре. Аз бих избрала място с хубава атмосфера.";
  }

  if (lower.includes("срещ")) {
    return "Може, но първо искам да усетя енергията в разговора 😄";
  }

  if (lower.includes("как си")) {
    return "Добре съм, но по-важното е каква е твоята енергия днес?";
  }

  return "Харесва ми как мислиш. Продължи.";
}

function updateStats() {
  likesCount.textContent = state.likes.length;
  matchesCount.textContent = state.matches.length;
  seenCount.textContent = state.seen;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".tab, .nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === id);
  });
}

function saveProfile() {
  state.profile = {
    name: document.getElementById("myName").value.trim(),
    city: document.getElementById("myCity").value.trim(),
    bio: document.getElementById("myBio").value.trim()
  };

  saveState();
  alert("Профилът е запазен.");
}

function loadProfile() {
  document.getElementById("myName").value = state.profile.name || "";
  document.getElementById("myCity").value = state.profile.city || "";
  document.getElementById("myBio").value = state.profile.bio || "";
}

function resetApp() {
  if (!confirm("Да рестартирам ли демо приложението?")) return;

  state = {
    index: 0,
    likes: [],
    matches: [],
    seen: 0,
    lastMatch: null,
    profile: state.profile || { name: "", city: "", bio: "" }
  };

  saveState();
  renderDeck();
}

function bindEvents() {
  document.querySelectorAll(".tab, .nav-btn").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.dataset.screen));
  });

  document.getElementById("nopeBtn").addEventListener("click", () => swipeCurrent("left"));
  document.getElementById("likeBtn").addEventListener("click", () => swipeCurrent("right"));
  document.getElementById("superBtn").addEventListener("click", superLike);
  document.getElementById("resetBtn").addEventListener("click", resetApp);
  document.getElementById("continueBtn").addEventListener("click", closeMatch);
  document.getElementById("writeBtn").addEventListener("click", openChatFromMatch);
  document.getElementById("saveProfileBtn").addEventListener("click", saveProfile);

  document.getElementById("chatForm").addEventListener("submit", e => {
    e.preventDefault();
    sendMsg(chatInput.value);
    chatInput.value = "";
  });
}

bindEvents();
renderDeck();
updateStats();
renderMatches();
loadProfile();
