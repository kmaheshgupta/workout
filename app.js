/* =============================================================================
   WORKOUT ASSISTANT — APP LOGIC
   Reads everything from window.WORKOUT_DATA (data.js). Nothing hardcoded here.
   State (completed exercises, theme) persists in localStorage.
   The Today view centres on the current session; exercises open as a guided
   session (Prev / Mark done / Next) so you never hunt for what's next.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.WORKOUT_DATA;
  if (!DATA) { console.error("data.js not loaded"); return; }

  var DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // JS getDay() order
  var DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]; // display order
  var DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
  var DAY_FULL = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
  // One strong colour per day so each session has its own identity.
  var DAY_COLOR = { mon: "#ff6a1a", tue: "#2f7cf6", wed: "#e5484d", thu: "#8b5cf6", fri: "#0ea5a0", sat: "#22a06b", sun: "#22a06b" };
  var STORE_PREFIX = "workout:";
  var THEME_KEY = "workout:theme";

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
  function isDone(dayKey, exId) { return loadDone(dayKey).indexOf(exId) !== -1; }
  function toggleDone(dayKey, exId) {
    var ids = loadDone(dayKey);
    var i = ids.indexOf(exId);
    if (i === -1) ids.push(exId); else ids.splice(i, 1);
    saveDone(dayKey, ids);
    return ids.indexOf(exId) !== -1;
  }
  function doneCount(dayKey) {
    var d = DATA.days[dayKey];
    if (!d || !d.exercises) return 0;
    var ids = loadDone(dayKey);
    return d.exercises.filter(function (ex) { return ids.indexOf(ex.id) !== -1; }).length;
  }
  function isDayComplete(dayKey) {
    var d = DATA.days[dayKey];
    return !!(d && d.exercises && d.exercises.length && doneCount(dayKey) >= d.exercises.length);
  }
  function firstUndone(dayKey) {
    var d = DATA.days[dayKey];
    var ids = loadDone(dayKey);
    var next = d.exercises.filter(function (ex) { return ids.indexOf(ex.id) === -1; })[0];
    return (next || d.exercises[0]).id;
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
  function icon(name) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function isRestDay(d) { return !d || d.type === "rest"; }
  function workoutDays() { return DAY_ORDER.filter(function (k) { return DATA.days[k] && DATA.days[k].type === "workout"; }); }
  function coverImage(d) {
    var ex = (d.exercises || []).filter(function (e) { return e.image; })[0];
    return ex ? ex.image : null;
  }
  function imgTag(src, alt, cls) {
    return '<img' + (cls ? ' class="' + cls + '"' : "") + ' src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy" onerror="this.remove()">';
  }
  function diffBadge(ex) {
    return ex.difficulty ? '<span class="diff-badge diff-' + esc(ex.difficulty) + '">' + esc(ex.difficulty) + '</span>' : "";
  }
  function setsText(ex) { return esc(ex.sets || "") + (ex.reps ? " · " + esc(ex.reps) : ""); }

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("themeToggle").setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0d1117" : "#f7f8fa");
  }
  function initTheme() {
    // Initial theme (saved choice, else device preference) is set in <head> before paint.
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    $("themeToggle").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Today ---------- */
  function renderHome() {
    var name = (DATA.profile && DATA.profile.name) || "there";
    $("greetingName").textContent = name;
    var h = new Date().getHours();
    $("greetingLine").textContent = (h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening") + ",";

    var now = new Date();
    $("dateLine").textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

    var quotes = (DATA.profile && DATA.profile.quotes) || [];
    if (quotes.length) {
      // Rotate quote by day-of-year so it's stable within a day, fresh across days.
      var dayNum = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
      $("quoteText").textContent = quotes[dayNum % quotes.length];
    } else { $("quoteCard").style.display = "none"; }

    renderTodayCard();
    renderSessionPlan();
    renderSessionHelp();
    renderWeekStrip();
    $("statStreak").textContent = currentStreak();
  }

  function estDuration(day) {
    if (!day.exercises) return null;
    // Rough estimate: ~1.6 min per set plus transition time per exercise.
    var mins = 0;
    day.exercises.forEach(function (ex) {
      // Only a leading "3 × 10" / "2 sets" counts as sets; "12 reps" is a single set.
      var m = /^\s*(\d+)\s*(?:×|x|sets?\b)/i.exec(String(ex.sets || ""));
      mins += (m ? parseInt(m[1], 10) : 2) * 1.6 + 1.5;
    });
    return Math.max(15, Math.round(mins / 5) * 5);
  }

  function renderTodayCard() {
    var key = todayKey();
    var day = DATA.days[key];
    var card = $("todayCard");
    card.style.setProperty("--day", DAY_COLOR[key]);

    if (isRestDay(day)) {
      card.className = "today-card rest";
      card.innerHTML =
        '<span class="tag">' + icon("leaf") + 'Today · ' + DAY_FULL[key] + '</span>' +
        '<h2 class="today-title">' + esc(day ? day.title : "Rest Day") + '</h2>' +
        '<p class="today-note">' + esc(day ? day.message : "Take it easy today.") + '</p>' +
        '<div class="today-meta"></div>';
      var brest = el("button", "btn-primary calm", icon("leaf") + "Recovery ideas");
      brest.addEventListener("click", function () { openDay(key); });
      card.appendChild(brest);
      return;
    }

    var total = day.exercises.length;
    var done = doneCount(key);
    var cover = coverImage(day);
    var label = done === 0 ? "Start session" : done >= total ? "Review session" : "Continue session";
    card.className = "today-card";
    card.innerHTML =
      (cover ? '<div class="cover">' + imgTag(cover, "") + '</div>' : "") +
      '<span class="tag">' + icon("flame") + 'Today · ' + DAY_FULL[key] + '</span>' +
      '<h2 class="today-title">' + esc(day.focus) + '</h2>' +
      '<p class="today-note">' + esc(day.note || "") + '</p>' +
      '<div class="today-meta">' +
        '<span class="meta-chip">' + icon("dumbbell") + total + ' exercises</span>' +
        '<span class="meta-chip">' + icon("clock") + '~' + estDuration(day) + ' min</span>' +
        '<span class="meta-chip">' + icon("check") + done + '/' + total + ' done</span>' +
      '</div>' +
      '<div class="today-progress"><span style="width:' + (total ? Math.round(done / total * 100) : 0) + '%"></span></div>';
    var btn = el("button", "btn-primary" + (done >= total ? " done-state" : ""), icon(done >= total ? "check" : "play") + label);
    btn.addEventListener("click", function () { openExercise(key, firstUndone(key)); });
    card.appendChild(btn);
  }

  function planItem(dayKey, ex, idx, withCheck) {
    var done = isDone(dayKey, ex.id);
    var cue = ex.form && ex.form.cues && ex.form.cues[0];
    var row = el(withCheck ? "div" : "button", "plan-item" + (done ? " done" : ""));
    var open = withCheck ? el("button", "plan-open") : row;
    var inner =
      '<div class="plan-thumb">' + (ex.image ? imgTag(ex.image, "") : icon("dumbbell")) + '<span class="plan-num">' + (done ? icon("check") : idx + 1) + '</span></div>' +
      '<div class="plan-body">' +
        '<div class="plan-name">' + esc(ex.name) + '</div>' +
        '<div class="plan-sub">' + setsText(ex) + ' ' + diffBadge(ex) + '</div>' +
        (cue ? '<div class="plan-cue">' + esc(cue) + '</div>' : "") +
      '</div>' +
      '<span class="plan-chev">' + icon("chev-right") + '</span>';
    if (withCheck) {
      open.style.cssText = "display:flex;align-items:center;gap:14px;flex:1;min-width:0;text-align:left";
      open.innerHTML = inner;
      var check = el("button", "check-btn" + (done ? " checked" : ""), icon("check"));
      check.setAttribute("aria-label", "Mark " + ex.name + " done");
      check.addEventListener("click", function () {
        var now = toggleDone(dayKey, ex.id);
        check.classList.toggle("checked", now);
        row.classList.toggle("done", now);
        row.querySelector(".plan-num").innerHTML = now ? icon("check") : idx + 1;
        updateDayProgress(dayKey);
      });
      row.appendChild(open);
      row.appendChild(check);
    } else {
      row.innerHTML = inner;
    }
    open.addEventListener("click", function () { openExercise(dayKey, ex.id); });
    return row;
  }

  function renderSessionPlan() {
    var key = todayKey();
    var day = DATA.days[key];
    var host = $("sessionPlan");
    host.innerHTML = "";
    if (isRestDay(day)) return;
    host.appendChild(el("h2", "section-title", "Today's session<small>" + doneCount(key) + " of " + day.exercises.length + " done</small>"));
    var list = el("div", "plan-list");
    day.exercises.forEach(function (ex, i) { list.appendChild(planItem(key, ex, i, false)); });
    host.appendChild(list);
  }

  function renderSessionHelp() {
    var key = todayKey();
    var day = DATA.days[key];
    var html = "";
    if (isRestDay(day)) {
      var tips = (day && day.suggestions) || [];
      if (tips.length) html += '<div class="help-card"><h3>' + icon("leaf") + 'Recovery today</h3><ul>' +
        tips.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul></div>';
    } else {
      if (DATA.globalSafety) html += '<div class="help-card safety"><h3>' + icon("shield") + 'Before you start</h3><p>' + esc(DATA.globalSafety) + '</p></div>';
      // Muscles worked across today's exercises, in order of first appearance.
      var muscles = [];
      day.exercises.forEach(function (ex) {
        (ex.muscles || []).forEach(function (m) { if (muscles.indexOf(m) === -1) muscles.push(m); });
      });
      if (muscles.length) html += '<div class="help-card"><h3>' + icon("target") + 'Muscles worked</h3><div class="ex-tags">' +
        muscles.map(function (m) { return '<span class="ex-tag">' + esc(m) + '</span>'; }).join("") + '</div></div>';
      if (day.vibe && day.vibe.link) html += '<div class="help-card"><h3>' + icon("music") + 'Session soundtrack</h3>' +
        '<a class="music-link" href="' + esc(day.vibe.link) + '" target="_blank" rel="noopener">' + esc(day.vibe.label || "Open playlist") + icon("chev-right") + '</a></div>';
    }
    $("sessionHelp").innerHTML = html;
  }

  function currentStreak() {
    // Consecutive scheduled workout days (ending today or earlier) fully completed.
    var order = workoutDays();
    var todayIdx = DAY_ORDER.indexOf(todayKey());
    var streak = 0;
    for (var i = order.length - 1; i >= 0; i--) {
      var k = order[i];
      if (DAY_ORDER.indexOf(k) > todayIdx) continue; // future days this week
      if (isDayComplete(k)) streak++;
      else break;
    }
    return streak;
  }
  function prefersReduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  function renderWeekStrip() {
    var strip = $("weekStrip");
    strip.innerHTML = "";
    var tKey = todayKey();
    DAY_ORDER.forEach(function (k) {
      var d = DATA.days[k];
      var rest = isRestDay(d);
      var done = !rest && isDayComplete(k);
      var chip = el("button", "day-chip" + (k === tKey ? " today" : "") + (rest ? " rest" : "") + (done ? " done" : ""));
      chip.style.setProperty("--day", DAY_COLOR[k]);
      chip.setAttribute("aria-label", DAY_FULL[k] + (rest ? ", rest day" : done ? ", completed" : ""));
      chip.innerHTML = '<span>' + DAY_LABELS[k] + '</span><span class="dc-dot">' + (done ? icon("check") : "") + '</span>';
      chip.addEventListener("click", function () { openDay(k); });
      strip.appendChild(chip);
    });
  }

  /* ---------- Week view ---------- */
  function renderWeekly() {
    var grid = $("dayGrid");
    grid.innerHTML = "";
    var tKey = todayKey();
    DAY_ORDER.forEach(function (k) {
      var d = DATA.days[k];
      var rest = isRestDay(d);
      var card = el("button", "day-card" + (k === tKey ? " today" : ""));
      card.style.setProperty("--day", DAY_COLOR[k]);
      var cover = rest ? null : coverImage(d);
      var total = rest ? 0 : d.exercises.length;
      var done = rest ? 0 : doneCount(k);
      card.innerHTML =
        '<div class="day-cover">' + (cover ? imgTag(cover, "") : icon(rest ? "leaf" : "dumbbell")) +
          '<span class="tag">' + (k === tKey ? "Today · " : "") + DAY_FULL[k] + '</span></div>' +
        '<div class="day-card-body">' +
          '<div class="day-card-focus">' + esc(rest ? (d ? d.title : "Rest") : d.focus) + '</div>' +
          '<div class="day-card-meta">' + (rest ? "Rest &amp; recovery" : total + " exercises · ~" + estDuration(d) + " min · " + done + "/" + total + " done") + '</div>' +
          (rest ? "" : '<div class="mini-bar"><span style="width:' + Math.round(done / total * 100) + '%"></span></div>') +
        '</div>';
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
    host.style.setProperty("--day", DAY_COLOR[key]);

    if (isRestDay(d)) {
      host.innerHTML =
        '<div class="rest-hero">' + icon("leaf") +
          '<h1>' + esc(d ? d.title : "Rest Day") + '</h1>' +
          '<p>' + esc(d ? d.message : "") + '</p>' +
        '</div>' +
        '<h2 class="section-title">Recovery ideas</h2>' +
        '<ul class="rest-suggestions">' +
          ((d && d.suggestions) || []).map(function (s) { return '<li>' + icon("leaf") + esc(s) + '</li>'; }).join("") +
        '</ul>';
      showView("day");
      return;
    }

    var wrap = el("div", "day-detail-grid");
    var header = el("div", "day-header");
    header.innerHTML =
      '<span class="tag">' + (key === todayKey() ? icon("flame") + "Today · " : "") + DAY_FULL[key] + '</span>' +
      '<h1>' + esc(d.focus) + '</h1>' +
      '<p>' + esc(d.note || "") + '</p>' +
      '<div class="progress-bar"><span id="dayProgFill"></span></div>' +
      '<div class="progress-text" id="dayProgText"></div>';
    var start = el("button", "btn-primary", "");
    start.id = "dayStartBtn";
    start.addEventListener("click", function () { openExercise(key, firstUndone(key)); });
    header.appendChild(start);
    if (DATA.globalSafety) {
      var note = el("div", "safety-note", icon("alert") + '<span>' + esc(DATA.globalSafety) + '</span>');
      note.style.marginTop = "16px";
      header.appendChild(note);
    }
    wrap.appendChild(header);

    var listWrap = el("div");
    listWrap.appendChild(el("h2", "section-title", "Exercises<small>Tap to open the guide</small>"));
    var list = el("div", "plan-list");
    d.exercises.forEach(function (ex, i) { list.appendChild(planItem(key, ex, i, true)); });
    listWrap.appendChild(list);
    wrap.appendChild(listWrap);
    host.appendChild(wrap);

    showView("day");
    updateDayProgress(key);
  }

  function updateDayProgress(key) {
    var d = DATA.days[key];
    var done = doneCount(key), total = d.exercises.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fill = $("dayProgFill"), txt = $("dayProgText"), btn = $("dayStartBtn");
    if (fill) fill.style.width = pct + "%";
    if (txt) txt.textContent = done + " of " + total + " done" + (pct === 100 ? " · Workout complete!" : "");
    if (btn) {
      btn.innerHTML = icon(pct === 100 ? "check" : "play") + (done === 0 ? "Start guided session" : pct === 100 ? "Review session" : "Continue session");
      btn.classList.toggle("done-state", pct === 100);
    }
    if (pct === 100 && total > 0 && !d._celebrated) { d._celebrated = true; celebrate(); }
    if (pct < 100) d._celebrated = false;
  }

  /* ---------- Guided session: one exercise at a time ---------- */
  var session = null; // { dayKey, index }

  function openExercise(dayKey, exId) {
    var d = DATA.days[dayKey];
    var idx = -1;
    d.exercises.forEach(function (e, i) { if (e.id === exId) idx = i; });
    if (idx === -1) return;
    currentDayKey = dayKey;
    session = { dayKey: dayKey, index: idx };
    renderExercise();
    showView("exercise");
    window.scrollTo(0, 0);
  }

  function goTo(index) {
    var d = DATA.days[session.dayKey];
    if (index < 0 || index >= d.exercises.length) return;
    session.index = index;
    renderExercise();
    window.scrollTo(0, 0);
  }

  function renderExercise() {
    var dayKey = session.dayKey;
    var d = DATA.days[dayKey];
    var ex = d.exercises[session.index];
    var total = d.exercises.length;
    var f = ex.form || {};
    var host = $("exerciseDetail");
    var checked = isDone(dayKey, ex.id);
    var isLast = session.index === total - 1;
    host.style.setProperty("--day", DAY_COLOR[dayKey]);

    function list(items, cls) {
      return items && items.length ? '<ul class="' + cls + '">' + items.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' : "";
    }
    var segments = d.exercises.map(function (e, i) {
      return '<button class="segment' + (isDone(dayKey, e.id) ? " done" : "") + (i === session.index ? " current" : "") +
        '" data-seg="' + i + '" aria-label="Go to ' + esc(e.name) + '"></button>';
    }).join("");

    var media = ex.image
      ? '<figure class="ex-panel">' + imgTag(ex.image, ex.name + " guide") +
          '<figcaption>' + icon("zoom") + 'Poster guide · tap to zoom</figcaption></figure>'
      : '<div class="ex-fallback">' + icon("dumbbell") + '</div>';

    host.innerHTML =
      '<div class="session-head">' +
        '<div class="session-top">' +
          '<button class="back-btn" id="exerciseBack" type="button">' + icon("chev-left") + esc(d.focus) + '</button>' +
          '<span class="session-count">Exercise <b>' + (session.index + 1) + '</b> of ' + total + '</span>' +
        '</div>' +
        '<div class="segments">' + segments + '</div>' +
      '</div>' +

      '<div class="ex-layout">' +
        '<div class="ex-media">' +
          '<div class="ex-title-row">' + diffBadge(ex) +
            '<h1>' + esc(ex.name) + '</h1>' +
            '<div class="ex-tags">' + (ex.muscles || []).map(function (m) { return '<span class="ex-tag">' + esc(m) + '</span>'; }).join("") + '</div>' +
          '</div>' +
          '<div class="ex-quickbar">' +
            '<div class="ex-quick"><b>' + esc(ex.sets || "—") + '</b><span>Sets / reps</span></div>' +
            (ex.reps ? '<div class="ex-quick"><b>' + esc(ex.reps) + '</b><span>Target</span></div>' : "") +
            '<div class="ex-quick"><b>' + esc(ex.difficulty || "—") + '</b><span>Level</span></div>' +
          '</div>' +
          media +
        '</div>' +

        '<div class="ex-content">' +
          '<div class="form-block span-2"><h3>' + icon("list") + 'Step-by-step</h3>' +
            (f.steps ? '<ol class="steps">' + f.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ol>' : '<p class="form-line">Step-by-step guide coming soon for this exercise.</p>') +
          '</div>' +
          (f.cues ? '<div class="form-block cues"><h3>' + icon("target") + 'Key form cues</h3>' + list(f.cues, "cue-list") + '</div>' : "") +
          (f.mistakes ? '<div class="form-block mistakes"><h3>' + icon("alert") + 'Avoid these</h3>' + list(f.mistakes, "mistake-list") + '</div>' : "") +
          (f.breathing ? '<div class="form-block breathing"><h3>' + icon("wind") + 'Breathing</h3><div class="form-line">' + esc(f.breathing) + '</div></div>' : "") +
          (f.safety ? '<div class="form-block safety"><h3>' + icon("shield") + 'Safety</h3><div class="form-line">' + esc(f.safety) + '</div></div>' : "") +
          (ex.tutorial ? '<div class="ex-actions span-2"><a class="btn-ghost" href="' + esc(ex.tutorial) + '" target="_blank" rel="noopener">' + icon("video") + 'Watch video tutorial</a></div>' : "") +
        '</div>' +
      '</div>' +

      '<div class="session-bar"><div class="session-bar-inner">' +
        '<button class="icon-btn" id="exPrev" type="button" aria-label="Previous exercise"' + (session.index === 0 ? " disabled" : "") + '>' + icon("chev-left") + '</button>' +
        '<button class="btn-primary' + (checked ? " done-state" : "") + '" id="exDoneBtn" type="button">' +
          (checked ? icon("check") + "Done" : icon("check") + (isLast ? "Mark done & finish" : "Mark done & next")) + '</button>' +
        '<button class="icon-btn" id="exNext" type="button" aria-label="Next exercise"' + (isLast ? " disabled" : "") + '>' + icon("chev-right") + '</button>' +
      '</div></div>';

    $("exerciseBack").onclick = function () { openDay(dayKey); };
    $("exPrev").onclick = function () { goTo(session.index - 1); };
    $("exNext").onclick = function () { goTo(session.index + 1); };
    $("exDoneBtn").onclick = function () {
      var nowChecked = toggleDone(dayKey, ex.id);
      if (nowChecked && isDayComplete(dayKey)) {
        celebrate();
        setTimeout(function () { openDay(dayKey); }, 900);
        return;
      }
      // Marking done moves straight on to the next exercise; un-marking stays put.
      if (nowChecked && !isLast) goTo(session.index + 1);
      else renderExercise();
    };
    var segs = host.querySelectorAll("[data-seg]");
    for (var i = 0; i < segs.length; i++) {
      segs[i].onclick = function () { goTo(parseInt(this.getAttribute("data-seg"), 10)); };
    }
    var panelImg = host.querySelector(".ex-panel img");
    if (panelImg) panelImg.addEventListener("click", function () { openLightbox(this.src, ex.name); });
  }

  /* ---------- Nutrition ---------- */
  function renderNutrition() {
    var n = DATA.nutrition || {};
    $("nutritionView").innerHTML =
      '<div class="coming-soon">' +
        '<div class="cs-ico">' + icon("apple") + '</div>' +
        '<h1>' + esc(n.title || "Nutrition") + '</h1>' +
        '<p>' + esc(n.message || "Your personalised diet plan is coming here soon.") + '</p>' +
        '<span class="cs-pill">Coming soon</span>' +
      '</div>';
  }

  /* ---------- Lightbox (zoom poster panels) ---------- */
  function openLightbox(src, alt) {
    var box = el("div", "lightbox");
    box.innerHTML =
      '<button class="lightbox-close" aria-label="Close">' + icon("x") + '</button>' +
      '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '">';
    // Capture phase + stopPropagation so Escape closes only the lightbox, not the session too.
    var onKey = function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    function close() {
      document.removeEventListener("keydown", onKey, true);
      box.classList.remove("show");
      setTimeout(function () { box.remove(); }, 220);
    }
    box.addEventListener("click", close);
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("show"); });
  }

  /* ---------- Celebration ---------- */
  function celebrate() {
    if (prefersReduced()) return;
    var layer = $("celebrate");
    var colors = ["#ff6a1a", "#ff9443", "#2557a7", "#6ea8ff", "#34d399"];
    for (var i = 0; i < 80; i++) {
      var c = el("span", "confetti");
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 0.5) + "s";
      c.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      layer.appendChild(c);
    }
    var toast = el("div", "celebrate-toast", '<div class="ct-ico">' + icon("trophy") + '</div><h3>Workout complete!</h3><p>Great work, ' + esc(DATA.profile.name) + '. Recovery earned.</p>');
    layer.appendChild(toast);
    setTimeout(function () { layer.innerHTML = ""; }, 2600);
  }

  /* ---------- Navigation ---------- */
  function showView(name) {
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) views[i].classList.remove("is-active");
    var v = $("view-" + name);
    if (v) { v.classList.add("is-active"); v.focus({ preventScroll: true }); }

    // Day and session views belong to the tab they were opened from.
    var tab = name;
    if (name === "day" || name === "exercise") tab = currentDayKey === todayKey() ? "home" : "weekly";
    var navBtns = document.querySelectorAll("[data-nav]");
    for (var j = 0; j < navBtns.length; j++) {
      if (navBtns[j].classList.contains("back-btn")) continue;
      navBtns[j].classList.toggle("is-active", navBtns[j].getAttribute("data-nav") === tab);
    }
    if (name === "home") renderHome();
    if (name === "weekly") renderWeekly();
    if (name === "nutrition") renderNutrition();
  }

  function bindNav() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-nav]") : null;
      if (t) { showView(t.getAttribute("data-nav")); window.scrollTo(0, 0); }
    });
    document.addEventListener("keydown", function (e) {
      var active = document.querySelector(".view.is-active");
      if (!active) return;
      if (active.id === "view-exercise" && session) {
        if (e.key === "ArrowRight") goTo(session.index + 1);
        else if (e.key === "ArrowLeft") goTo(session.index - 1);
        else if (e.key === "Escape") openDay(currentDayKey);
      } else if (active.id === "view-day" && e.key === "Escape") {
        showView("weekly");
      }
    });
  }

  /* ---------- Init ---------- */
  initTheme();
  bindNav();
  showView("home");
})();
