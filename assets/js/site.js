/* =====================================================================
   WHITE SAGE · site script (no libraries, no build step)
   Progressive enhancement: every page reads fine without JavaScript.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var NL = String.fromCharCode(10);

  /* ---------- SETTINGS (edit here) ----------
     Anything left empty simply stays hidden on the site.                                      */
  var EMAIL     = "office@whitesagehealth.com";    /* whitesagehealth.com, Get in touch */
  var PHONE     = "+91 92057 73937";               /* whitesagehealth.com, Get in touch */
  var WHATSAPP  = "";   /* digits only with country code, e.g. "919205773937", ONLY once White Sage confirms the number takes WhatsApp */
  var LINKEDIN  = "https://www.linkedin.com/company/white-sage-health/";
  var YOUTUBE   = "";
  var FACEBOOK  = "";
  var INSTAGRAM = "";
  var TWITTER   = "";
  var SEND_URL  = "";   /* optional: FormSubmit endpoint, e.g. "https://formsubmit.co/ajax/office@whitesagehealth.com" (one-time Activate click in their inbox). Empty = the form opens email / WhatsApp */
  var FORM_URL  = "";   /* optional Google Form link (used only if SEND_URL is empty) */
  var SITE = "https://drbankata.github.io/white-sage/";

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function ref() { var d = new Date(); return "WS-" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + Math.floor(100 + Math.random() * 900); }
  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* ---------- Contact details: show only what has been filled in ---------- */
  var LINKS = {
    email: EMAIL && "mailto:" + EMAIL,
    phone: PHONE && "tel:" + PHONE.replace(/[^+0-9]/g, ""),
    whatsapp: WHATSAPP && "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hello White Sage, I would like to talk about a hospital project."),
    linkedin: LINKEDIN, youtube: YOUTUBE, facebook: FACEBOOK, instagram: INSTAGRAM, twitter: TWITTER
  };
  var TEXT = { email: EMAIL, phone: PHONE, whatsapp: PHONE };
  function external(a, url) { a.href = url; if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; } }
  $$("[data-show]").forEach(function (el) {
    var k = el.getAttribute("data-show");
    if (!LINKS[k]) { el.hidden = true; return; }
    el.hidden = false;
    if (el.tagName === "A") external(el, LINKS[k]);
    $$("[data-fill]", el).forEach(function (f) { if (TEXT[k]) f.textContent = TEXT[k]; });
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  var toggle = $(".menu-btn"), nav = $("#site-nav");
  var ICON_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="sr-only">Open menu</span>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="sr-only">Close menu</span>';
  if (toggle && nav) {
    var setOpen = function (open) { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open ? "true" : "false"); toggle.innerHTML = open ? ICON_CLOSE : ICON_OPEN; document.body.style.overflow = open ? "hidden" : ""; };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); } });
    addEventListener("resize", function () { if (innerWidth >= 1100 && nav.classList.contains("open")) setOpen(false); });
  }

  /* ---------- Header shadow, back-to-top, mobile bar ---------- */
  var header = $(".site-header"), toTop = $(".to-top"), mbar = $(".mbar");
  function onScroll() {
    var y = window.scrollY, h = doc.scrollHeight - innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 900);
    if (mbar) mbar.classList.toggle("show", y > 420 && (h - y) > 200);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }); });

  /* ---------- Showpiece: "Where is your hospital today?" tabs (WAI-ARIA tabs pattern) ---------- */
  $$("[data-picker]").forEach(function (box) {
    var tabs = $$("[role=tab]", box), panes = $$("[role=tabpanel]", box);
    function show(i, focus) {
      tabs.forEach(function (t, j) { var on = j === i; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; });
      panes.forEach(function (p, j) { p.hidden = j !== i; p.classList.toggle("on", j === i); });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(i); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, to = null;
        if (k === "ArrowRight" || k === "ArrowDown") to = (i + 1) % n;
        else if (k === "ArrowLeft" || k === "ArrowUp") to = (i - 1 + n) % n;
        else if (k === "Home") to = 0; else if (k === "End") to = n - 1;
        if (to !== null) { e.preventDefault(); show(to, true); }
      });
    });
    show(0);
  });

  /* ---------- Toast ---------- */
  var toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var tt;
  function say(t) { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 3200); }

  /* ---------- Dialog helpers ---------- */
  var lastFocus;
  function openDlg(d) { if (!d) return; lastFocus = document.activeElement; if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", ""); }
  function closeDlg(d) { if (!d) return; if (d.close) d.close(); else d.removeAttribute("open"); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) closeDlg(d); });
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDlg(d); }); });
  });

  /* =================================================================
     ENQUIRY (no backend needed): the form writes a message; the visitor sends it by email / WhatsApp or copies it
     ================================================================= */
  var sendDlg = $("#send-dlg");
  var lastMsg = { subject: "", body: "" };
  function val(f, n) { var el = f.elements[n]; return el ? (el.value || "").trim() : ""; }
  function label(sel) { return sel && sel.selectedIndex > -1 ? sel.options[sel.selectedIndex].text : ""; }

  function compose(form) {
    var r = ref(), topic = label(form.elements.topic) || "General";
    var lines = ["Message from the White Sage website " + r, "", "Topic: " + topic, "Name: " + val(form, "name")];
    if (val(form, "org")) lines.push("Hospital / organisation: " + val(form, "org"));
    if (val(form, "city")) lines.push("City: " + val(form, "city"));
    lines.push("Phone: " + (val(form, "phone") || "-"), "Email: " + (val(form, "email") || "-"), "", val(form, "message"));
    lastMsg = { subject: "Website enquiry: " + topic + " (" + r + ")", body: lines.join(NL) };
    return lastMsg;
  }

  function showSend(msg, sentOk) {
    if (!sendDlg) return;
    $(".msg-preview", sendDlg).textContent = msg.body;
    var ok = $("[data-sent]", sendDlg), pending = $("[data-unsent]", sendDlg);
    if (ok) ok.hidden = !sentOk; if (pending) pending.hidden = !!sentOk;
    var em = $("[data-send=email]", sendDlg), wa = $("[data-send=whatsapp]", sendDlg), fm = $("[data-send=form]", sendDlg);
    if (em) { em.hidden = !EMAIL || sentOk; em.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(msg.subject) + "&body=" + encodeURIComponent(msg.body); }
    if (wa) { wa.hidden = !WHATSAPP || sentOk; if (WHATSAPP) external(wa, "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg.body)); }
    if (fm) { fm.hidden = !FORM_URL || !!SEND_URL || sentOk; if (FORM_URL) external(fm, FORM_URL); }
    openDlg(sendDlg);
  }

  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("[required]", form).filter(function (el) { return !el.value.trim(); });
      $$(".form-err", form).forEach(function (x) { x.remove(); });
      if (bad.length) {
        bad.forEach(function (el) { el.setAttribute("aria-invalid", "true"); });
        var p = document.createElement("p"); p.className = "form-err"; p.setAttribute("role", "alert");
        p.textContent = "Please fill in the highlighted fields."; form.querySelector("[type=submit]").insertAdjacentElement("beforebegin", p);
        bad[0].focus(); return;
      }
      var em = form.elements.email; if (em && em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { em.setAttribute("aria-invalid", "true"); em.focus(); say("Please check the email address"); return; }
      var ph = form.elements.phone; if (ph && ph.value && ph.value.replace(/[^0-9]/g, "").length < 8) { ph.setAttribute("aria-invalid", "true"); ph.focus(); say("Please check the phone number"); return; }
      $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
      var msg = compose(form);
      if (SEND_URL) {
        var btn = form.querySelector("[type=submit]"); btn.disabled = true;
        var data = { _subject: msg.subject, message: msg.body, _template: "box", _captcha: "false" };
        if (em && em.value) data.email = em.value;
        fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function () { showSend(msg, true); form.reset(); })
          .catch(function () { showSend(msg, false); })
          .then(function () { btn.disabled = false; });
      } else showSend(msg, false);
    });
    $$("input,select,textarea", form).forEach(function (el) { el.addEventListener("input", function () { el.removeAttribute("aria-invalid"); }); });
  });

  var copyBtn = sendDlg && $("[data-copy]", sendDlg);
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var t = lastMsg.body;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { say("Copied. Paste it into an email or WhatsApp"); }, function () {
      var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); say("Copied"); } catch (e) {} ta.remove();
    });
  });

  /* contact page: ?about=build|revive|advise|careers pre-selects the topic (the home picker links here) */
  var topicSel = $("#ct-topic"), about = new URLSearchParams(location.search).get("about");
  if (topicSel && about) { for (var i = 0; i < topicSel.options.length; i++) if (topicSel.options[i].value === about) topicSel.value = about; }
})();
