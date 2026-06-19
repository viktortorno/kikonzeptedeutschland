/* ============================================================
   Viktor Torno AI Consulting — DSGVO-konformes Cookie-Consent
   Self-injecting. Lädt selbst KEIN Tracking.
   Künftige Skripte (GA4, Meta-Pixel …) erst nach Einwilligung:
     if (window.vtConsent.has('statistik')) { ... GA4 laden ... }
     window.addEventListener('vt-consent-change', e => { ... e.detail ... });
   Banner erneut öffnen:  vtConsent.open()
   ============================================================ */
(function () {
  var KEY = "vt-consent-v1";

  var CSS = "" +
    "#vt-consent{position:fixed;inset:auto 16px 16px 16px;z-index:9000;max-width:440px;margin-left:auto;background:#fff;color:#1A1A1A;border:1px solid #E6E6E6;border-radius:18px;box-shadow:0 24px 60px -20px rgba(10,10,10,.45);padding:24px;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;display:none}" +
    "#vt-consent.show{display:block;animation:vtcons .4s cubic-bezier(.2,.7,.2,1)}" +
    "@keyframes vtcons{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}" +
    "#vt-consent .ttl{font-size:16px;font-weight:600;letter-spacing:-.01em;margin-bottom:8px;display:flex;align-items:center;gap:9px}" +
    "#vt-consent .ttl::before{content:'';width:8px;height:8px;border-radius:50%;background:#0F3B2E}" +
    "#vt-consent p{font-size:13.5px;line-height:1.55;color:#4A4A4A;margin:0 0 16px}" +
    "#vt-consent p a{color:#0F3B2E;text-decoration:underline}" +
    "#vt-consent .cats{display:none;flex-direction:column;gap:10px;margin:0 0 16px;border-top:1px solid #ECECEC;padding-top:14px}" +
    "#vt-consent .cats.open{display:flex}" +
    "#vt-consent .cat{display:flex;align-items:flex-start;gap:11px;font-size:13px;line-height:1.45}" +
    "#vt-consent .cat .lbl{font-weight:600;color:#1A1A1A}" +
    "#vt-consent .cat .desc{color:#6E6E6E;font-size:12px}" +
    "#vt-consent .cat input{width:18px;height:18px;margin-top:1px;accent-color:#0F3B2E;flex:none}" +
    "#vt-consent .cat input:disabled{opacity:.55}" +
    "#vt-consent .btns{display:flex;flex-wrap:wrap;gap:10px}" +
    "#vt-consent button{font-family:inherit;font-size:13.5px;font-weight:500;padding:12px 18px;border-radius:999px;border:1px solid transparent;cursor:pointer;transition:all .2s;flex:1 1 auto}" +
    "#vt-consent .b-accept{background:#0A0A0A;color:#F5F4F0}" +
    "#vt-consent .b-accept:hover{background:#0F3B2E}" +
    "#vt-consent .b-reject{background:#fff;color:#1A1A1A;border-color:#CFCFCF}" +
    "#vt-consent .b-reject:hover{background:#F2F2F0}" +
    "#vt-consent .b-settings{flex:1 1 100%;background:none;color:#6E6E6E;border:0;text-decoration:underline;padding:8px 0 0;font-size:12.5px;cursor:pointer}" +
    "#vt-consent .b-save{background:#0F3B2E;color:#F5F4F0}" +
    "@media(max-width:520px){#vt-consent{inset:auto 10px 10px 10px;max-width:none}}";

  var HTML = "" +
    '<div class="ttl">Datenschutz &amp; Cookies</div>' +
    '<p>Wir verwenden nur technisch notwendige Cookies. Statistik- und Marketing-Cookies setzen wir ausschlie\u00dflich mit deiner Einwilligung. Details in der <a href="#">Datenschutzerkl\u00e4rung</a>.</p>' +
    '<div class="cats" id="vt-cats">' +
      '<label class="cat"><input type="checkbox" checked disabled/><span><span class="lbl">Notwendig</span><br/><span class="desc">F\u00fcr den Betrieb der Seite erforderlich. Immer aktiv.</span></span></label>' +
      '<label class="cat"><input type="checkbox" id="vt-statistik"/><span><span class="lbl">Statistik</span><br/><span class="desc">Anonyme Reichweitenmessung (z.&nbsp;B. Analytics).</span></span></label>' +
      '<label class="cat"><input type="checkbox" id="vt-marketing"/><span><span class="lbl">Marketing</span><br/><span class="desc">Personalisierte Anzeigen &amp; Remarketing.</span></span></label>' +
    '</div>' +
    '<div class="btns">' +
      '<button class="b-reject" id="vt-reject">Nur notwendige</button>' +
      '<button class="b-accept" id="vt-accept">Alle akzeptieren</button>' +
      '<button class="b-settings" id="vt-toggle">Einstellungen anpassen</button>' +
      '<button class="b-save" id="vt-save" style="display:none">Auswahl speichern</button>' +
    '</div>';

  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function emit(c) { window.dispatchEvent(new CustomEvent("vt-consent-change", { detail: c })); }

  function init() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var el = document.createElement("div");
    el.id = "vt-consent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie-Einstellungen");
    el.innerHTML = HTML;
    document.body.appendChild(el);

    var cats = el.querySelector("#vt-cats");
    var cbStat = el.querySelector("#vt-statistik");
    var cbMark = el.querySelector("#vt-marketing");
    var saveBtn = el.querySelector("#vt-save");

    function save(c) {
      c.ts = new Date().toISOString();
      localStorage.setItem(KEY, JSON.stringify(c));
      el.classList.remove("show");
      emit(c);
    }
    function open() {
      var c = read() || {};
      cbStat.checked = !!c.statistik;
      cbMark.checked = !!c.marketing;
      cats.classList.add("open");
      saveBtn.style.display = "";
      el.classList.add("show");
    }

    el.querySelector("#vt-accept").onclick = function () { save({ necessary: true, statistik: true, marketing: true }); };
    el.querySelector("#vt-reject").onclick = function () { save({ necessary: true, statistik: false, marketing: false }); };
    saveBtn.onclick = function () { save({ necessary: true, statistik: cbStat.checked, marketing: cbMark.checked }); };
    el.querySelector("#vt-toggle").onclick = function () {
      cats.classList.toggle("open");
      saveBtn.style.display = cats.classList.contains("open") ? "" : "none";
    };

    window.vtConsent = {
      get: read,
      has: function (cat) { var c = read(); return !!(c && c[cat]); },
      open: open
    };

    var existing = read();
    if (!existing) { el.classList.add("show"); } else { emit(existing); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
