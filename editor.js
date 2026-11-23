const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY = t => "nfc_profile_" + t;
const NAMES = {personal:"Personal", gamer:"Gamer", athletic:"Athletic"};

let type = new URLSearchParams(location.search).get("type") || sessionStorage.getItem("selectedProfile") || "personal";
if (!NAMES[type]) type = "personal";
sessionStorage.setItem("selectedProfile", type);

// What each profile type lets people fill in
const SCHEMA = {
  personal: {
    headline: "e.g. BS Information Technology",
    slides: ["Who you are", "What you are up to now", "How people can reach you"],
    sections: [
      {i:"user",  t:"About me", k:"kv", labels:["Birthday","Hometown","Course or work","Year"]},
      {i:"star",  t:"Interests", k:"chips", hint:"Separate with commas, e.g. guitar, travel, coffee"},
      {i:"music", t:"Favorite music", k:"list", a:["Song","Artist"], add:"song"},
      {i:"grid",  t:"Gallery", k:"gal"},
      {i:"wallet",t:"Payment accounts", k:"copy", a:["Account, e.g. GCash","Number"], add:"account"}]},
  gamer: {
    headline: "e.g. Valorant Main · Radiant",
    slides: ["Your gamer tag and main game", "Your team and what you play now", "How to add or squad up with you"],
    sections: [
      {i:"game",  t:"Games I play", k:"list", a:["Game","Rank or hours"], add:"game"},
      {i:"chart", t:"Gaming stats", k:"kv", labels:["Rank","K/D","Win rate","Hours played"]},
      {i:"user",  t:"Gaming IDs", k:"copy", a:["Platform, e.g. Discord","Username or ID"], add:"ID"},
      {i:"trophy",t:"Achievements", k:"list", a:["Title or tournament","Year"], add:"achievement"},
      {i:"grid",  t:"Clips and screenshots", k:"gal"},
      {i:"star",  t:"Setup", k:"list", a:["Item, e.g. Mouse","Model"], add:"item"}]},
  athletic: {
    headline: "e.g. Point Guard · #7",
    slides: ["Your sport and role", "Your team and goals", "Where to find your stats"],
    sections: [
      {i:"chart", t:"Season stats", k:"kv", labels:["Points","Assists","Steals","FG %"]},
      {i:"user",  t:"Team and position", k:"list", a:["Team or coach","Role"], add:"entry"},
      {i:"trophy",t:"Achievements", k:"list", a:["Award or title","Year"], add:"achievement"},
      {i:"grid",  t:"Highlights", k:"gal"},
      {i:"ruler", t:"Physical", k:"kv", labels:["Height","Weight","Wingspan","Vertical"]}]}
}[type];

let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY(type))) || {}; } catch {}
let photo = saved.photo || "";
const remote = {signedIn:false, userId:null, email:"", profileId:null, slug:"", published:false, cards:[]};

const row = (k, a, v = []) => k === "skills"
  ? `<div class="erow"><input data-f aria-label="Skill" placeholder="Skill" value="${esc(v[0])}"><input data-f class="pct" type="number" min="0" max="100" aria-label="Skill level, 0 to 100" placeholder="Level 0-100" value="${esc(v[1])}"><button type="button" class="rm" aria-label="Remove row">×</button></div>`
  : `<div class="erow"><input data-f aria-label="${esc(a[0])}" placeholder="${esc(a[0])}" value="${esc(v[0])}"><input data-f aria-label="${esc(a[1])}" placeholder="${esc(a[1])}" value="${esc(v[1])}"><button type="button" class="rm" aria-label="Remove row">×</button></div>`;
const thumb = src => `<figure><img src="${esc(src)}" alt=""><button type="button" class="rm" aria-label="Remove photo">×</button></figure>`;

function sectionHTML(s, i) {
  const d = saved.sections && saved.sections[i] ? saved.sections[i][3] : null;
  let b = "";
  if (s.k === "kv") b = `<div class="two">${s.labels.map((l, j) => `<div class="form-group"><label for="s${i}k${j}">${esc(l)}</label><input id="s${i}k${j}" data-kv="${j}" value="${esc(d && d[j] ? d[j][1] : "")}"></div>`).join("")}</div>`;
  else if (s.k === "chips") b = `<div class="form-group"><input data-chips aria-label="${esc(s.t)}" value="${esc(Array.isArray(d) ? d.join(", ") : "")}"><p class="hint">${esc(s.hint)}</p></div>`;
  else if (s.k === "gal") b = `<div class="gal-edit" data-gal>${(Array.isArray(d) ? d : []).map(thumb).join("")}</div><label class="add-btn">Add photos (up to 6)<input type="file" accept="image/*" multiple hidden data-galin></label>`;
  else {
    const rows = Array.isArray(d) && d.length ? d : [[]];
    b = `<div data-rows>${rows.map(r => row(s.k, s.a, r)).join("")}</div><button type="button" class="add-btn" data-add="${i}">Add ${esc(s.add)}</button>`;
  }
  return `<section class="form-section" data-sec="${i}"><h2>${esc(s.t)}</h2>${b}</section>`;
}

const field = (id, label, v, extra = "") => `<div class="form-group"><label for="${id}">${label}</label><input id="${id}" value="${esc(v)}" ${extra}></div>`;
let L = saved.links || {};

function build() {
  $("#title").textContent = `Build your ${NAMES[type].toLowerCase()} profile`;
  $("#tabs").innerHTML = Object.keys(NAMES).map(t => `<a href="editor.html?type=${t}" ${t === type ? 'aria-current="page"' : ""}>${NAMES[t]}</a>`).join("");
  $("#form").innerHTML = `
  <section class="form-section"><h2>Photo</h2><p>Shown at the top of your profile. It is resized to fit and saved on this device.</p>
    <div class="photo-edit"><img id="pPrev" alt="Profile photo preview" ${photo ? `src="${esc(photo)}"` : "hidden"}><div class="ph" id="pPh" ${photo ? "hidden" : ""}>?</div>
      <div class="photo-actions"><label class="btn-sm" style="cursor:pointer">Choose photo<input type="file" id="pIn" accept="image/*" hidden></label><button type="button" class="btn-sm" id="pRm">Remove</button></div></div></section>
  <section class="form-section"><h2>Basics</h2><p>Your name and how people can contact you.</p>
    ${field("name", "Full name", saved.name)}${field("sub", "Headline", saved.sub, `placeholder="${esc(SCHEMA.headline)}"`)}${field("loc", "Location", saved.loc, 'placeholder="City, Country"')}
    <div class="two">${field("phone", "Phone", saved.phone, 'type="tel" placeholder="+63 917 123 4567"')}${field("email", "Email", saved.email, 'type="email"')}</div></section>
  <section class="form-section"><h2>Intro slides</h2><p>Short text on your profile cover, shown one slide at a time. Leave a slide empty to skip it.</p>
    ${SCHEMA.slides.map((l, i) => `<div class="form-group"><label for="sl${i}">Slide ${i + 1}: ${esc(l)}</label><textarea id="sl${i}" rows="2" maxlength="180">${esc((saved.slides || [])[i])}</textarea></div>`).join("")}</section>
  <section class="form-section"><h2>Links</h2><p>Handles or full links. Only filled ones show on your profile.</p>
    <div class="two">${field("ig", "Instagram", L.ig, 'placeholder="@username"')}${field("fb", "Facebook", L.fb, 'placeholder="username or link"')}${field("tt", "TikTok", L.tt, 'placeholder="@username"')}${field("web", "Website", L.web, 'placeholder="yoursite.com"')}</div></section>
  ${SCHEMA.sections.map(sectionHTML).join("")}${publishHTML()}`;
}

function resize(file, max, q) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => {
      const s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
      c.width = im.width * s; c.height = im.height * s;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(im.src); res(c.toDataURL("image/jpeg", q));
    };
    im.onerror = () => res(null);
    im.src = URL.createObjectURL(file);
  });
}

const link = (v, base) => /^https?:\/\//i.test(v) ? v : base + v.replace(/^@/, "");
function collect() {
  const g = id => $("#" + id).value.trim();
  const links = {ig:g("ig"), fb:g("fb"), tt:g("tt"), web:g("web")}, phone = g("phone"), email = g("email");
  const quick = [];
  if (phone) quick.push(["phone", "tel:" + phone.replace(/\s+/g, "")]);
  if (email) quick.push(["mail", "mailto:" + email]);
  if (links.ig) quick.push(["ig", link(links.ig, "https://instagram.com/")]);
  if (links.fb) quick.push(["fb", link(links.fb, "https://facebook.com/")]);
  if (links.tt) quick.push(["tt", link(links.tt, "https://tiktok.com/@")]);
  if (links.web) quick.push(["web", /^https?:\/\//i.test(links.web) ? links.web : "https://" + links.web]);
  const sections = SCHEMA.sections.map((s, i) => {
    const el = $(`[data-sec="${i}"]`); let d;
    if (s.k === "kv") d = s.labels.map((l, j) => [l, $(`[data-kv="${j}"]`, el).value.trim()]);
    else if (s.k === "chips") d = $("[data-chips]", el).value.split(",").map(x => x.trim()).filter(Boolean);
    else if (s.k === "gal") d = $$("img", el).map(x => x.src);
    else d = $$(".erow", el).map(r => {
      const f = $$("[data-f]", r).map(x => x.value.trim());
      return s.k === "skills" ? [f[0], Math.min(100, Math.max(0, +f[1] || 0))] : f;
    }).filter(f => f[0]);
    return [s.i, s.t, s.k, d];
  });
  return {name:g("name") || "Your name", sub:g("sub"), loc:g("loc"), phone, email, links, quick, photo,
          slides:SCHEMA.slides.map((_, i) => g("sl" + i)).filter(Boolean), sections};
}


// ---- Online account (Supabase) ----
const nextUrl = () => encodeURIComponent("editor.html?type=" + type);
async function loadRemote() {
  if (!window.sb) return;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return;
  remote.signedIn = true; remote.userId = session.user.id; remote.email = session.user.email || "";
  const { data } = await sb.from("profiles").select("id,slug,published,data").eq("owner_id", remote.userId).eq("type", type).maybeSingle();
  if (data) {
    saved = data.data || {}; photo = saved.photo || ""; L = saved.links || {};
    remote.profileId = data.id; remote.slug = data.slug || ""; remote.published = data.published;
  }
  const c = await sb.from("cards").select("public_id,profile_id");
  remote.cards = c.data || [];
}
function publishHTML() {
  if (!remote.signedIn) return `<section class="form-section"><h2>Publish</h2><p>Sign in to save your profile online and get a link you can share. <a class="inline-link" href="activate.html?next=${nextUrl()}">Sign in or activate your card</a></p></section>`;
  const assignOn = !remote.cards.some(c => c.profile_id) || remote.cards.some(c => c.profile_id && c.profile_id === remote.profileId);
  const assign = remote.cards.length ? `<div class="form-group"><label class="check"><input type="checkbox" id="assign" ${assignOn ? "checked" : ""}> Open this profile when my card is tapped</label></div>` : "";
  return `<section class="form-section"><h2>Publish</h2><p>Pick a link name, then turn on Public so people can open your profile.</p>
    <div class="form-group"><label for="slug">Link name</label><input id="slug" value="${esc(remote.slug)}" placeholder="e.g. alex-rivera" maxlength="30" autocapitalize="off" autocomplete="off"><p class="hint" id="pubLink"></p></div>
    <div class="form-group"><label class="check"><input type="checkbox" id="pub" ${remote.published ? "checked" : ""}> Make my profile public</label></div>${assign}</section>`;
}
function showLink() {
  const el = $("#pubLink"), s = $("#slug"); if (!el || !s) return;
  const v = s.value.trim().toLowerCase();
  el.textContent = /^[a-z0-9][a-z0-9-]{2,29}$/.test(v) ? "Your link: " + new URL("profile.html?u=" + v, location.href).href : "3 to 30 letters, numbers or dashes.";
}
function showAcct() {
  const a = $("#acct"); if (!a) return;
  if (remote.signedIn) {
    a.innerHTML = `<span class="acct-mail">${esc(remote.email)}</span><button type="button" class="link-sm" id="signout">Sign out</button>`;
    $("#signout").onclick = async () => { await sb.auth.signOut(); location.reload(); };
  } else a.innerHTML = `<a class="back-link" href="activate.html?next=${nextUrl()}">Sign in</a>`;
}
async function boot() {
  try { await loadRemote(); } catch (e) { console.error(e); }
  build(); showLink(); showAcct();
}

function status(m, err) { const s = $("#status"); s.textContent = m; s.className = err ? "err" : ""; }
async function save() {
  const data = collect();
  let localOk = true;
  try { localStorage.setItem(KEY(type), JSON.stringify(data)); } catch { localOk = false; }
  if (!remote.signedIn) {
    if (localOk) { status("Saved on this device. Sign in to save online."); return true; }
    status("Storage is full. Remove a few photos and try again.", true); return false;
  }
  const slug = ($("#slug") ? $("#slug").value.trim().toLowerCase() : "");
  const published = !!($("#pub") && $("#pub").checked);
  if (slug && !/^[a-z0-9][a-z0-9-]{2,29}$/.test(slug)) { status("Link name: 3 to 30 letters, numbers or dashes.", true); return false; }
  if (published && !slug) { status("Choose a link name to make your profile public.", true); return false; }
  const { data: row, error } = await sb.from("profiles")
    .upsert({ owner_id: remote.userId, type, slug: slug || null, published, data }, { onConflict: "owner_id,type" })
    .select("id").single();
  if (error) {
    status(error.code === "23505" ? "That link name is taken. Try another." : error.code === "23514" ? "Profile is too large. Remove a few photos." : "Could not save online: " + error.message, true);
    return false;
  }
  remote.profileId = row.id;
  if ($("#assign") && $("#assign").checked && remote.cards.length) {
    const r = await sb.from("cards").update({ profile_id: row.id }).eq("owner_id", remote.userId);
    if (!r.error) remote.cards = remote.cards.map(c => ({ ...c, profile_id: row.id }));
  }
  status("All changes saved online"); return true;
}
let timer;
const queue = () => { status("Saving…"); clearTimeout(timer); timer = setTimeout(save, 400); };

const form = $("#form");
boot();
form.addEventListener("input", e => { if (e.target.id === "slug") showLink(); queue(); });
form.addEventListener("click", e => {
  const add = e.target.closest("[data-add]"), rm = e.target.closest(".rm");
  if (add) { const s = SCHEMA.sections[add.dataset.add]; $("[data-rows]", add.closest("section")).insertAdjacentHTML("beforeend", row(s.k, s.a)); $("[data-rows] .erow:last-child input", add.closest("section")).focus(); }
  if (rm) { const r = rm.closest(".erow, figure"); r.remove(); queue(); }
  if (e.target.id === "pRm") { photo = ""; $("#pPrev").hidden = true; $("#pPh").hidden = false; queue(); }
});
form.addEventListener("change", async e => {
  if (e.target.id === "pIn" && e.target.files[0]) {
    const url = await resize(e.target.files[0], 800, .8);
    if (url) { photo = url; $("#pPrev").src = url; $("#pPrev").hidden = false; $("#pPh").hidden = true; queue(); }
  }
  if (e.target.matches("[data-galin]")) {
    const box = $("[data-gal]", e.target.closest("section"));
    for (const f of [...e.target.files]) {
      if ($$("figure", box).length >= 6) { status("You can add up to 6 photos.", true); break; }
      const url = await resize(f, 500, .75);
      if (url) box.insertAdjacentHTML("beforeend", thumb(url));
    }
    e.target.value = ""; queue();
  }
});
$("#view").onclick = async () => { if (await save()) location.href = "profile.html?type=" + type; };
$("#clear").onclick = async () => {
  if (confirm("Clear everything in this " + type + " profile?")) {
    localStorage.removeItem(KEY(type));
    if (remote.signedIn) await sb.from("profiles").delete().eq("owner_id", remote.userId).eq("type", type);
    location.reload();
  }
};
