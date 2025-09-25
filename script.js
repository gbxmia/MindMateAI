document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  const path = window.location.pathname.split("/").pop() || "index.html";
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.includes(path.replace('.html',''))) {
      a.classList.add("active");
    }
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const msg = document.getElementById("formMessage");
      msg.textContent = "Thanks! We'll get back to you soon.";
      msg.style.color = "green";
      contactForm.reset();
    });
  }


  const chatForm = document.getElementById("chatForm");
  const chatBox = document.getElementById("chatbox");
  if (chatForm && chatBox) {
    chatForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = document.getElementById("chatInput");
      const txt = input.value.trim();
      if (!txt) return;
      appendUser(txt);
      input.value = "";
      setTimeout(() => {
        const reply = getBotReply(txt);
        appendBot(reply);
      }, 700 + Math.random()*600);
    });
  }

  function appendUser(txt){
    const el = document.createElement("div");
    el.className = "user-msg";
    el.textContent = txt;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function appendBot(txt){
    const el = document.createElement("div");
    el.className = "bot-msg";
    el.textContent = txt;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function getBotReply(input){
    const s = input.toLowerCase();
    if (s.includes("stress") || s.includes("overwhelmed") || s.includes("burnout") || s.includes("too much")) {
      return "Feeling overwhelmed is tough. Try this: list 3 things you can control today. Want help breaking things down?";
    }
    if (s.includes("lonely") || s.includes("alone") || s.includes("isolated")) {
      return "You're not alone in feeling this way. Would you like a small self-connection exercise or a reminder of your strengths?";
    }
    if (s.includes("hello") || s.includes("hi") || s.includes("hey")) {
      return "Hi there — tell me how you're feeling in a few words.";
    }
    if (s.includes("angry") || s.includes("mad") || s.includes("furious") || s.includes("frustrated")) {
      return "Anger is valid. Want to try a quick grounding technique to release some tension?";
    }
    if (s.includes("numb") || s.includes("empty") || s.includes("can't feel")) { 
      return "Feeling disconnected can be unsettling. A sensory check-in might help — want to try one together?";
    }
    if (s.includes("happy") || s.includes("excited") || s.includes("grateful") || s.includes("joy")) {
      return "That's wonderful to hear! Want to log this moment or reflect on what’s fueling your joy?";
    }
    if (s.includes("sleep")) {
      return "Sleep matters a lot. Try a wind-down routine and limit screens 30 mins before bed.";
    }
    return "Thanks for sharing. Would you like a breathing exercise, a mood log, or some quick tips?";
  }

  const moodForm = document.getElementById("moodForm");
  const entriesEl = document.getElementById("entries");
  if (moodForm && entriesEl) {
    renderMoods();
    moodForm.addEventListener("submit", e => {
      e.preventDefault();
      const mood = document.getElementById("mood").value;
      const timeInput = document.getElementById("time").value;
      const time = timeInput ? new Date(timeInput).toString() : new Date().toString();
      saveMood({mood, time});
      renderMoods();
      moodForm.reset();
    });
    document.getElementById("clearMoods").addEventListener("click", () => {
      localStorage.removeItem("mindmate_moods");
      renderMoods();
    });
  }

  function loadMoods(){
    const raw = localStorage.getItem("mindmate_moods");
    return raw ? JSON.parse(raw) : [];
  }
  function saveMood(entry){
    const arr = loadMoods();
    arr.unshift(entry); // newest first
    while(arr.length > 50) arr.pop();
    localStorage.setItem("mindmate_moods", JSON.stringify(arr));
  }
  function renderMoods(){
    const arr = loadMoods();
    if (!entriesEl) return;
    entriesEl.innerHTML = "";
    const show = arr.slice(0,7);
    if (show.length === 0) {
      entriesEl.innerHTML = "<li>No mood logs yet. Add your first mood.</li>";
      return;
    }
    show.forEach(e => {
      const li = document.createElement("li");
      const dt = new Date(e.time);
      li.innerHTML = `<strong>${e.mood}</strong> — <small>${dt.toLocaleString()}</small>`;
      entriesEl.appendChild(li);
    });
  }

  const tipsEl = document.getElementById("tips");
if (tipsEl) {
  const tips = [
    "Start with just 5 minutes of mindfulness each day. It’s not about doing it perfectly, it’s about showing up consistently and giving your mind a moment to reset.",
    "Try gratitude journaling each evening. Write down three things you’re thankful for, no matter how small, this simple habit can shift your perspective over time.",
    "Feeling overwhelmed? Break large tasks into 10 minute chunks. Small wins build momentum and make big goals feel more manageable.",
    "Take two minutes for deep breathing. Inhale slowly for 4 seconds, hold for 4, and exhale for 6. This calms your nervous system and lowers stress hormones.",
    "Reach out to someone daily, even a short message or voice note can lift your mood and strengthen your sense of connection.",
    "Drink a glass of water first thing in the morning. It’s a small act of care that helps your body wake up and sets a healthy tone for the day.",
    "Step outside for a few minutes of fresh air. Nature, even in small doses, can reduce anxiety and improve focus.",
    "Celebrate small wins. Whether you got out of bed, replied to a message, or took a shower, every step counts and deserves recognition.",
    "Limit screen time before bed. Try replacing your phone with a calming activity like reading, stretching, or journaling to improve sleep quality.",
    "Name your emotion when you feel off. Saying 'I feel anxious' or 'I feel low' helps your brain process it and reduces its intensity.",
    "Create a simple morning ritual, even brushing your teeth while listening to music can anchor your day with intention.",
    "Move your body gently. A short walk, a few stretches, or dancing to one song can shift your energy and boost your mood.",
    "Set a tiny goal for today. Something achievable like 'drink two glasses of water' or 'step outside once', progress starts small.",
    "Avoid multitasking when you're stressed. Focus on one thing at a time to reduce mental clutter and feel more in control.",
    "Speak kindly to yourself. Replace 'I messed up' with 'I’m learning', your inner voice shapes your emotional landscape."
  ];
    let tIndex = 0;
    function showTip(){
      tipsEl.textContent = tips[tIndex];
      tIndex = (tIndex + 1) % tips.length;
    }
    showTip();
    setInterval(showTip, 5000); // rotates every 5 seconds
  }
});
