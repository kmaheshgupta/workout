/* =============================================================================
   WORKOUT ASSISTANT — APP LOGIC
   Reads everything from window.WORKOUT_DATA (data.js). Nothing hardcoded here.
   State (completed exercises, theme) persists in localStorage.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.WORKOUT_DATA;
  if (!DATA) { console.error("data.js not loaded"); return; }

  var DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // JS getDay() order
  var DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]; // display order
  var DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
  var DAY_FULL = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
  var STORE_PREFIX = "workout:";
  var THEME_KEY = "workout:theme";

  var muscleIcon = {
    Chest: "🎯", Triceps: "💪", Core: "🔥", Back: "🪃", Biceps: "💪",
    Legs: "🦵", Quads: "🦵", Hamstrings: "🦵", Glutes: "🍑", Calves: "🦶",
    Shoulders: "🏔️", "Full body": "⚡", Grip: "✊", Abs: "🔥"
  };

  /* ---------- State helpers ---------- */
  function todayKey() { return DAY_KEYS[new Date().getDay()]; }

  function isoFor(dayKey) {
    // Maps a weekday key to the ISO date of that day in the CURRENT week (Mon-based).
    var now = new Date();
    var jsToday = now.getDay();
    var mondayOffset = (jsToday === 0 ? -6 : 1 - jsToday);
    var monday = new Date(now); monday.setDate(now.getDate() + mondayOffset);
    var idx = DAY_ORDER.indexOf(dayKey);
    var d = new Date(monday); d.setDate(monday.getDate() + idx);
    return d.toISOString().slice(0, 10);
  }

  function loadDone(dayKey) {
    try { return JSON.parse(localStorage.getItem(STORE_PREFIX + isoFor(dayKey)) || "[]"); }
    catch (e) { return []; }
  }
  function saveDone(dayKey, ids) {
    try { localStorage.setItem(STORE_PREFIX + isoFor(dayKey), JSON.stringify(ids)); } catch (e) {}
  }
  function toggleDone(dayKey, exId) {
    var ids = loadDone(dayKey);
    var i = ids.indexOf(exId);
    if (i === -1) ids.push(exId); else ids.splice(i, 1);
    saveDone(dayKey, ids);
    return ids.indexOf(exId) !== -1;
  }

  /* ---------- Small DOM utils ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function workoutDays() { return DAY_ORDER.filter(function (k) { return DATA.days[k] && DATA.days[k].type === "workout"; }); }

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("themeToggleIcon").textContent = t === "dark" ? "🌙" : "☀️";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0a0e1a" : "#eef2fb");
  }
  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY) || (DATA.profile && DATA.profile.defaultTheme) || "dark";
    applyTheme(saved);
    $("themeToggle").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Greeting / quote / date ---------- */
  function renderTopAndHome() {
    var name = (DATA.profile && DATA.profile.name) || "there";
    $("greetingName").textContent = name;
    var h = new Date().getHours();
    var slot = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    $("greetingLine").textContent = slot + ",";

    var now = new Date();
    $("dateLine").textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

    var quotes = (DATA.profile && DATA.profile.quotes) || [];
    if (quotes.length) {
      // Rotate quote by day-of-year so it's stable within a day, fresh across days.
      var dayNum = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
      $("quoteText").textContent = quotes[dayNum % quotes.length];
    } else { $("quoteCard").style.display = "none"; }

    renderTodayCard();
    renderStats();
    renderWeekStrip();
  }

  function estDuration(day) {
    if (!day.exercises) return null;
    // Rough estimate: ~2.5 min per exercise-set block.
    var mins = 0;
    day.exercises.forEach(function (ex) {
      var setsNum = parseInt(String(ex.sets), 10);
      mins += (isNaN(setsNum) ? 2 : setsNum) * 1.6 + 1.5;
    });
    return Math.max(15, Math.round(mins / 5) * 5);
  }

  function renderTodayCard() {
    var key = todayKey();
    var day = DATA.days[key];
    var card = $("todayCard");
    card.innerHTML = "";

    if (!day || day.type === "rest") {
      card.className = "today-card";
      card.innerHTML =
        '<span class="today-tag">Today · ' + DAY_FULL[key] + '</span>' +
        '<h2 class="today-title">' + esc(day ? day.title : "Rest Day") + '</h2>' +
        '<p class="today-note">' + esc(day ? day.message : "Take it easy today.") + '</p>';
      var brest = el("button", "btn-primary rest", "🌿 View recovery ideas");
      brest.addEventListener("click", function () { openDay(key); });
      card.appendChild(brest);
      return;
    }

    var done = loadDone(key).length;
    var total = day.exercises.length;
    var dur = estDuration(day);
    card.className = "today-card";
    card.innerHTML =
      '<span class="today-tag">🔥 Today · ' + DAY_FULL[key] + '</span>' +
      '<h2 class="today-title">' + esc(day.focus) + '</h2>' +
      '<p class="today-note">' + esc(day.note || "") + '</p>' +
      '<div class="today-meta">' +
        '<div><b>' + total + '</b><span>Exercises</span></div>' +
        '<div><b>' + dur + 'm</b><span>Approx</span></div>' +
        '<div><b>' + done + '/' + total + '</b><span>Done</span></div>' +
      '</div>' +
      (day.vibe ? '<p class="today-vibe">🎧 Vibe: <a href="' + esc(day.vibe.link) + '" target="_blank" rel="noopener">' + esc(day.vibe.label) + '</a></p>' : "");
    var btn = el("button", "btn-primary", (done >= total && total > 0 ? "✅ Completed — review" : "▶ Start " + day.focus.split("•")[0].trim() + " session"));
    btn.addEventListener("click", function () { openDay(key); });
    card.appendChild(btn);
  }

  function renderStats() {
    var wDays = workoutDays();
    var totalWorkouts = wDays.length;
    var fullyDone = 0;
    wDays.forEach(function (k) {
      var d = DATA.days[k];
      var done = loadDone(k);
      if (d.exercises.length && done.length >= d.exercises.length) fullyDone++;
    });
    var pct = totalWorkouts ? Math.round((fullyDone / totalWorkouts) * 100) : 0;

    var ring = $("weekRing");
    ring.style.setProperty("--pct", pct);
    countUp($("weekRingLabel"), pct, "%");
    countUp($("statDone"), fullyDone, "");
    countUp($("statStreak"), currentStreak(), "");
  }

  function currentStreak() {
    // Consecutive scheduled workout days (ending today or earlier) fully completed.
    var order = workoutDays();
    var todayIdx = DAY_ORDER.indexOf(todayKey());
    var streak = 0;
    for (var i = order.length - 1; i >= 0; i--) {
      var k = order[i];
      if (DAY_ORDER.indexOf(k) > todayIdx) continue; // future days this week
      var d = DATA.days[k];
      var done = loadDone(k);
      if (d.exercises.length && done.length >= d.exercises.length) streak++;
      else break;
    }
    return streak;
  }

  function countUp(node, target, suffix) {
    if (prefersReduced()) { node.textContent = target + suffix; return; }
    var start = 0, dur = 700, t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var val = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
      node.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function prefersReduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  function renderWeekStrip() {
    var strip = $("weekStrip");
    strip.innerHTML = "";
    var tKey = todayKey();
    DAY_ORDER.forEach(function (k) {
      var d = DATA.days[k];
      var isRest = !d || d.type === "rest";
      var done = !isRest && d.exercises.length && loadDone(k).length >= d.exercises.length;
      var chip = el("button", "day-chip" + (k === tKey ? " today" : "") + (isRest ? " rest" : "") + (done ? " done" : ""));
      var ico = isRest ? "🌿" : (muscleIcon[d.muscles[0]] || "🏋️");
      chip.innerHTML = '<div class="dc-day">' + DAY_LABELS[k] + '</div><div class="dc-ico">' + ico + '</div><div class="dc-dot"></div>';
      chip.addEventListener("click", function () { openDay(k); });
      strip.appendChild(chip);
    });
  }

  /* ---------- Weekly view ---------- */
  function renderWeekly() {
    var grid = $("dayGrid");
    grid.innerHTML = "";
    var tKey = todayKey();
    DAY_ORDER.forEach(function (k) {
      var d = DATA.days[k];
      var isRest = !d || d.type === "rest";
      var card = el("button", "day-card" + (k === tKey ? " today" : "") + (isRest ? " rest" : ""));
      var ico = isRest ? "🌿" : (muscleIcon[d.muscles[0]] || "🏋️");
      var meta = isRest ? "Rest &amp; Recovery" : (d.exercises.length + " exercises · " + estDuration(d) + " min");
      var focus = isRest ? (d ? d.title : "Rest") : d.focus;
      card.innerHTML =
        (k === tKey ? '<span class="badge-today">Today</span>' : "") +
        '<div class="day-card-ico">' + ico + '</div>' +
        '<div class="day-card-body">' +
          '<div class="day-card-day">' + DAY_FULL[k] + '</div>' +
          '<div class="day-card-focus">' + esc(focus) + '</div>' +
          '<div class="day-card-meta">' + meta + '</div>' +
        '</div>' +
        '<div class="day-card-arrow">→</div>';
      card.addEventListener("click", function () { openDay(k); });
      grid.appendChild(card);
    });
  }

  /* ---------- Day detail ---------- */
  var currentDayKey = null;

  function openDay(key) {
    currentDayKey = key;
    var d = DATA.days[key];
    var host = $("dayDetail");
    host.innerHTML = "";

    if (!d || d.type === "rest") {
      host.innerHTML =
        '<div class="rest-hero">' +
          '<div class="rest-emoji">🌿</div>' +
          '<h1>' + esc(d ? d.title : "Rest Day") + '</h1>' +
          '<p>' + esc(d ? d.message : "") + '</p>' +
        '</div>' +
        '<h2 class="section-title">Recovery ideas</h2>' +
        '<ul class="rest-suggestions">' +
          ((d && d.suggestions) || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") +
        '</ul>';
      showView("day");
      return;
    }

    var header = el("div", "day-header");
    header.innerHTML =
      '<span class="today-tag">' + (key === todayKey() ? "🔥 Today · " : "") + DAY_FULL[key] + '</span>' +
      '<h1>' + esc(d.focus) + '</h1>' +
      '<p>' + esc(d.note || "") + '</p>' +
      '<div class="day-progress-bar"><div class="day-progress-fill" id="dayProgFill"></div></div>' +
      '<div class="day-progress-text" id="dayProgText"></div>';
    host.appendChild(header);

    var safety = DATA.globalSafety;
    if (safety) {
      host.appendChild(el("div", "safety-note", '<span class="si">⚠️</span><span>' + esc(safety) + '</span>'));
    }

    var list = el("div", "ex-list");
    d.exercises.forEach(function (ex) {
      var row = el("div", "ex-row");
      var checked = loadDone(key).indexOf(ex.id) !== -1;

      var check = el("button", "ex-check" + (checked ? " checked" : ""), "✓");
      check.setAttribute("aria-label", "Mark " + ex.name + " done");
      check.addEventListener("click", function (e) {
        e.stopPropagation();
        var nowChecked = toggleDone(key, ex.id);
        check.classList.toggle("checked", nowChecked);
        updateDayProgress(key, d);
      });

      var open = el("button", "ex-open");
      var diff = ex.difficulty ? '<span class="diff-badge diff-' + esc(ex.difficulty) + '">' + esc(ex.difficulty) + '</span>' : "";
      open.innerHTML =
        '<div class="ex-name">' + esc(ex.name) + '</div>' +
        '<div class="ex-sub">' + esc(ex.sets || "") + (ex.reps ? " · " + esc(ex.reps) : "") + " " + diff + '</div>';
      open.addEventListener("click", function () { openExercise(key, ex.id); });

      row.appendChild(check);
      if (ex.image) {
        var thumb = el("button", "ex-thumb");
        thumb.setAttribute("aria-label", "Open " + ex.name);
        thumb.innerHTML = '<img src="' + esc(ex.image) + '" alt="" loading="lazy" onerror="this.closest(\'.ex-thumb\').remove()">';
        thumb.addEventListener("click", function () { openExercise(key, ex.id); });
        row.appendChild(thumb);
      }
      row.appendChild(open);
      row.appendChild(el("div", "ex-arrow", "›"));
      list.appendChild(row);
    });
    host.appendChild(list);

    showView("day");
    updateDayProgress(key, d);
  }

  function updateDayProgress(key, d) {
    var done = loadDone(key).length, total = d.exercises.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fill = $("dayProgFill"), txt = $("dayProgText");
    if (fill) fill.style.width = pct + "%";
    if (txt) txt.textContent = done + " of " + total + " done" + (pct === 100 ? " · Workout complete! 💪" : "");
    if (pct === 100 && total > 0 && !d._celebrated) { d._celebrated = true; celebrate(); }
    if (pct < 100) d._celebrated = false;
  }

  /* ---------- Exercise detail (centerpiece) ---------- */
  function openExercise(dayKey, exId) {
    var d = DATA.days[dayKey];
    var ex = d.exercises.filter(function (e) { return e.id === exId; })[0];
    if (!ex) return;
    var host = $("exerciseDetail");
    var f = ex.form || {};
    var checked = loadDone(dayKey).indexOf(ex.id) !== -1;

    var media = '<div class="ex-hero-fallback"><span>' + (muscleIcon[(ex.muscles && ex.muscles[0])] || "🏋️") + '</span></div>';

    var panelBlock = ex.image
      ? '<figure class="ex-panel">' +
          '<img src="' + esc(ex.image) + '" alt="' + esc(ex.name) + ' guide" loading="lazy" onerror="this.closest(\'figure\').remove()">' +
          '<figcaption><span class="fi">🔍</span> Poster guide · tap to zoom</figcaption>' +
        '</figure>'
      : "";

    var tags = (ex.muscles || []).map(function (m) { return '<span class="ex-tag">' + esc(m) + '</span>'; }).join("");

    function list(items, cls) {
      return (items || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") ?
        '<ul class="' + cls + '">' + (items || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' : "";
    }

    var stepsBlock = f.steps ? '<ol class="steps">' + f.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ol>' : '<p class="today-note">Step-by-step guide coming soon for this exercise.</p>';

    host.innerHTML =
      '<div class="ex-hero">' + media +
        '<div class="ex-hero-content">' +
          (ex.difficulty ? '<span class="diff-badge diff-' + esc(ex.difficulty) + '">' + esc(ex.difficulty) + '</span>' : "") +
          '<h1>' + esc(ex.name) + '</h1>' +
          '<div class="ex-hero-tags">' + tags + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="ex-quickbar">' +
        '<div class="ex-quick"><b>' + esc(ex.sets || "—") + '</b><span>Sets/Reps</span></div>' +
        (ex.reps ? '<div class="ex-quick"><b>' + esc(ex.reps) + '</b><span>Note</span></div>' : "") +
        '<div class="ex-quick"><b>' + esc(ex.difficulty || "—") + '</b><span>Level</span></div>' +
      '</div>' +

      panelBlock +

      '<div class="form-block">' +
        '<h3><span class="fi">📋</span> Step-by-step</h3>' + stepsBlock +
      '</div>' +

      '<div class="form-columns">' +
        (f.cues ? '<div class="form-block"><h3><span class="fi">🎯</span> Key form cues</h3>' + list(f.cues, "cue-list") + '</div>' : "") +
        (f.mistakes ? '<div class="form-block"><h3><span class="fi">⚠️</span> Avoid these</h3>' + list(f.mistakes, "mistake-list") + '</div>' : "") +
      '</div>' +

      (f.breathing ? '<div class="form-block breathing"><h3><span class="fi">🌬️</span> Breathing</h3><div class="form-line">' + esc(f.breathing) + '</div></div>' : "") +
      (f.safety ? '<div class="form-block safety"><h3><span class="fi">🛡️</span> Safety</h3><div class="form-line">' + esc(f.safety) + '</div></div>' : "") +

      '<div class="ex-actions">' +
        (ex.tutorial ? '<a class="btn-ghost" href="' + esc(ex.tutorial) + '" target="_blank" rel="noopener">▶ Watch video tutorial</a>' : "") +
        '<button class="btn-primary ' + (checked ? "done-state" : "") + '" id="exDoneBtn">' + (checked ? "✅ Marked as done" : "Mark as done") + '</button>' +
      '</div>';

    $("exDoneBtn").addEventListener("click", function () {
      var nowChecked = toggleDone(dayKey, ex.id);
      this.classList.toggle("done-state", nowChecked);
      this.textContent = nowChecked ? "✅ Marked as done" : "Mark as done";
      updateDayProgress(dayKey, d);
    });

    var panelImg = host.querySelector(".ex-panel img");
    if (panelImg) panelImg.addEventListener("click", function () { openLightbox(this.src, ex.name); });

    $("exerciseBack").onclick = function () { openDay(dayKey); };
    showView("exercise");
    $("view-exercise").scrollIntoView({ block: "start" });
    window.scrollTo(0, 0);
  }

  /* ---------- Nutrition ---------- */
  function renderNutrition() {
    var n = DATA.nutrition || {};
    $("nutritionView").innerHTML =
      '<div class="coming-soon">' +
        '<div class="cs-emoji">🥗</div>' +
        '<h1>' + esc(n.title || "Nutrition") + '</h1>' +
        '<p>' + esc(n.message || "Your personalised diet plan is coming here soon.") + '</p>' +
        '<span class="cs-pill">Coming soon</span>' +
      '</div>';
  }

  /* ---------- Lightbox (zoom poster panels) ---------- */
  function openLightbox(src, alt) {
    var box = el("div", "lightbox");
    box.innerHTML =
      '<button class="lightbox-close" aria-label="Close">✕</button>' +
      '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '">';
    function close() { box.classList.remove("show"); setTimeout(function () { box.remove(); }, 220); }
    box.addEventListener("click", close);
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("show"); });
    var onKey = function (e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); } };
    document.addEventListener("keydown", onKey);
  }

  /* ---------- Celebration ---------- */
  function celebrate() {
    if (prefersReduced()) return;
    var layer = $("celebrate");
    var colors = ["#38bdf8", "#6366f1", "#22d3ee", "#34d399", "#fbbf24"];
    for (var i = 0; i < 80; i++) {
      var c = el("span", "confetti");
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 0.5) + "s";
      c.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      layer.appendChild(c);
    }
    var toast = el("div", "celebrate-toast", '<div class="ct-emoji">🎉</div><h3>Workout complete!</h3><p>Great work, ' + esc(DATA.profile.name) + '. Recovery earned.</p>');
    layer.appendChild(toast);
    setTimeout(function () { layer.innerHTML = ""; }, 2600);
  }

  /* ---------- Navigation ---------- */
  function showView(name) {
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) views[i].classList.remove("is-active");
    var v = $("view-" + name);
    if (v) { v.classList.add("is-active"); v.focus({ preventScroll: true }); }

    var navBtns = document.querySelectorAll(".nav-btn");
    for (var j = 0; j < navBtns.length; j++) {
      var target = navBtns[j].getAttribute("data-nav");
      navBtns[j].classList.toggle("is-active", target === name || (name === "day" && target === "weekly") || (name === "exercise" && target === "weekly"));
    }
    if (name === "home") renderTopAndHome();
    if (name === "weekly") renderWeekly();
    if (name === "nutrition") renderNutrition();
  }

  function bindNav() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-nav]") : null;
      if (t) { showView(t.getAttribute("data-nav")); window.scrollTo(0, 0); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var active = document.querySelector(".view.is-active");
        if (active && active.id === "view-exercise") openDay(currentDayKey);
        else if (active && active.id === "view-day") showView("weekly");
      }
    });
  }

  /* ---------- Init ---------- */
  initTheme();
  bindNav();
  showView("home");
})();
