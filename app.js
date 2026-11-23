// Profile type selection: opens the editor for that type so people can customize everything
document.querySelectorAll(".select-btn").forEach(button => {
  button.addEventListener("click", () => {
    sessionStorage.setItem("selectedProfile", button.dataset.type);
    window.location.href = "editor.html?type=" + encodeURIComponent(button.dataset.type);
  });
});

// Live preview in the hero
const previews = {
  personal:     {init:"A", name:"Alex Rivera", role:"Student · Music lover", tags:["Guitar","Travel","Coffee"], btn:"Follow on Instagram", cover:"linear-gradient(135deg,#641E32,#C07889)"},
  gamer:        {init:"K", name:"Kai Reyes", role:"Valorant Duelist · Radiant", tags:["Valorant","1.42 K/D","Top 500"], btn:"Add on Discord", cover:"linear-gradient(135deg,#1E1245,#7C5CE0)"},
  athletic:     {init:"J", name:"Jaden Cruz", role:"Point Guard · #7", tags:["Varsity","18 PPG","MVP '25"], btn:"View stats", cover:"linear-gradient(135deg,#3B101C,#A94F68)"}
};
const $ = id => document.getElementById(id);
function showPreview(type){
  const p = previews[type]; if(!p) return;
  $("pv-avatar").textContent = p.init;
  $("pv-name").textContent = p.name;
  $("pv-role").textContent = p.role;
  $("pv-btn").textContent = p.btn;
  $("pv-cover").style.background = p.cover;
  $("pv-tags").innerHTML = p.tags.map(t => `<span>${t}</span>`).join("");
  document.querySelectorAll(".profile-card").forEach(c => c.classList.toggle("active", c.dataset.preview === type));
}
document.querySelectorAll(".profile-card").forEach(card => {
  ["mouseenter","focusin","click"].forEach(ev => card.addEventListener(ev, () => showPreview(card.dataset.preview)));
});
showPreview("personal");

// Card color picker: changes the card color, floats gently, and auto-cycles until the visitor picks one
(function(){
  const card = document.getElementById("ccCard"); if(!card) return;
  const name = document.getElementById("ccName");
  const sw = [...document.querySelectorAll(".cc-swatch")];
  function pick(b){
    card.style.setProperty("--cbase", b.dataset.base);
    card.style.setProperty("--cf", b.dataset.fg);
    card.style.setProperty("--ca", b.dataset.ac);
    name.textContent = b.dataset.name;
    sw.forEach(x => x.setAttribute("aria-checked", x === b));
  }
  let i = 0, t = null;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stop = () => { clearInterval(t); t = null; };
  sw.forEach(b => b.addEventListener("click", () => { stop(); pick(b); }));
  if(!still) t = setInterval(() => { i = (i + 1) % sw.length; pick(sw[i]); }, 3000);
})();

// Realistic card: tilt toward the cursor with a moving glare, and flip front/back
(function(){
  const tilt = document.getElementById("ccTilt"), card = document.getElementById("ccCard");
  if(!tilt || !card) return;
  const stage = tilt.closest(".cc-stage");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!still){
    stage.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      tilt.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 12}deg)`;
      card.style.setProperty("--gx", (50 + x * 40) + "%");
      card.style.setProperty("--gy", (50 + y * 40) + "%");
    });
    stage.addEventListener("pointerleave", () => { tilt.style.transform = ""; card.style.setProperty("--gx","30%"); card.style.setProperty("--gy","20%"); });
  }
  const flip = () => card.classList.toggle("flipped");
  card.addEventListener("click", flip);
  document.getElementById("ccFlip").addEventListener("click", flip);
})();
