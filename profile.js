const I = {
  phone:"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail:"M3 6h18v12H3zM3 7l9 6 9-6",
  ig:"M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01",
  web:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  user:"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  cap:"M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
  brief:"M3 7h18v13H3zM9 7V4h6v3M3 13h18",
  star:"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  music:"M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z",
  wallet:"M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-3v3M16 14h2",
  ruler:"M3 16L16 3l5 5L8 21zM8 11l2 2M11 8l2 2",
  trophy:"M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  chart:"M4 20V10M10 20V4M16 20v-7M22 20H2",
  grid:"M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  game:"M6 9h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.2 2L15 15H9l-1.8 2A3 3 0 0 1 2 15v-2a4 4 0 0 1 4-4zM8 11v4M6 13h4M16 12h.01M18 14h.01",
  fb:"M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1z",
  tt:"M14 3v11a4 4 0 1 1-4-4M14 3c0 3 2 5 5 5"
};
const svg = (n,c="") => `<svg class="${c}" viewBox="0 0 24 24"><path d="${I[n]}"/></svg>`;

const DATA = {
  personal:{name:"Alex Rivera",sub:"BS Information Technology",loc:"Cavite, PH",phone:"+639171234567",email:"alex@example.com",
    slides:["Student and weekend musician. I like building small things that people actually use.","Currently learning mobile design and playing in a campus band.","Tap a link below to message me or follow my projects."],
    quick:[["phone","tel:+639171234567"],["mail","mailto:alex@example.com"],["ig","#"],["web","#"]],
    sections:[
      ["user","About me","kv",[["Birthday","Mar 14"],["Hometown","Dasmariñas"],["Course","BSIT"],["Year","3rd"]]],
      ["star","Interests","chips",["Guitar","Photography","Road trips","Coffee","Gaming"]],
      ["music","Favorite music","list",[["Build My Life","Patrick Barrett"],["Golden Hour","JVKE"]]],
      ["grid","Gallery","gal",6],
      ["wallet","Payment accounts","copy",[["GCash","09171234567"],["GoTyme","014009757223"]]]]},
  gamer:{name:"Kai Reyes",sub:"Valorant Duelist · Radiant",loc:"Manila, PH",phone:"+639181234567",email:"kai@example.com",
    slides:["Duelist main, Radiant peak. I play to win and to hype my squad.","Currently grinding ranked and streaming on weekends.","Add me on Discord and let's queue up."],
    quick:[["phone","tel:+639181234567"],["mail","mailto:kai@example.com"],["web","#"],["ig","#"]],
    sections:[
      ["game","Games I play","list",[["Valorant","Radiant · 1,800 hrs"],["Mobile Legends","Mythic Glory"],["Genshin Impact","AR 60"]]],
      ["chart","Gaming stats","kv",[["Rank","Radiant"],["K/D","1.42"],["Win rate","58%"],["Hours","2,400"]]],
      ["user","Gaming IDs","copy",[["Discord","kai#2026"],["Riot ID","Kai#PH1"]]],
      ["trophy","Achievements","list",[["Campus Cup Champion","2025"],["Top 500 Ranked","2024"]]],
      ["grid","Clips and screenshots","gal",6],
      ["star","Setup","list",[["Mouse","Logitech G Pro X"],["Keyboard","Wooting 60HE"]]]]},
  athletic:{name:"Jaden Cruz",sub:"Point Guard · #7",loc:"Quezon City, PH",phone:"+639191234567",email:"jaden@team.com",
    slides:["Varsity point guard, 3rd season. Fast break and defense are my game.","Team captain, QC Falcons. Looking for college scouting opportunities.","Highlights and full stats are listed below."],
    quick:[["phone","tel:+639191234567"],["mail","mailto:jaden@team.com"],["ig","#"],["web","#"]],
    sections:[
      ["chart","Season stats","kv",[["Points","18.4"],["Assists","7.1"],["Steals","2.6"],["FG %","47"]]],
      ["user","Team and position","list",[["QC Falcons","Point guard · Captain"],["Coach","R. Mendoza"]]],
      ["trophy","Achievements","list",[["Season MVP","2025"],["All-Star Selection","2024, 2025"],["Defensive Player Award","2024"]]],
      ["grid","Highlights","gal",6],
      ["ruler","Physical","kv",[["Height","183 cm"],["Weight","76 kg"],["Wingspan","188 cm"],["Vertical","76 cm"]]]]}
};

const $ = id => document.getElementById(id);
let type = new URLSearchParams(location.search).get("type") || sessionStorage.getItem("selectedProfile") || "personal";
if(!DATA[type]) type = "personal";
let slideIdx = 0, cur = null;

function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),1800)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

// Load order: public link (?u=slug) > signed-in profile > saved on this device > sample
const U = new URLSearchParams(location.search).get("u");
async function getData(){
  if(window.sb){
    try{
      if(U){
        const {data} = await sb.from("profiles").select("type,data").eq("slug",U).eq("published",true).maybeSingle();
        if(data){ type = data.type; return {d:data.data, sample:false}; }
        return {d:{name:"Profile not found", sub:"This link isn't published or doesn't exist.", slides:[], quick:[], sections:[]}, sample:false};
      }
      const {data:{session}} = await sb.auth.getSession();
      if(session){
        const {data} = await sb.from("profiles").select("data").eq("owner_id",session.user.id).eq("type",type).maybeSingle();
        if(data && data.data && Array.isArray(data.data.sections)) return {d:data.data, sample:false};
      }
    }catch{}
  }
  try{
    const s = JSON.parse(localStorage.getItem("nfc_profile_"+type));
    if(s && Array.isArray(s.sections)) return {d:s, sample:false};
  }catch{}
  return {d:DATA[type], sample:true};
}
async function load(){ cur = await getData(); render(); }
function hasData(kind,d){
  if(kind==="gal") return Array.isArray(d) ? d.length>0 : d>0;
  if(kind==="kv") return Array.isArray(d) && d.some(x=>x[1]);
  return Array.isArray(d) && d.length>0;
}

function body(kind,d){
  if(kind==="kv") return `<div class="kv">${d.filter(x=>x[1]).map(([l,v])=>`<div><small>${esc(l)}</small><b>${esc(v)}</b></div>`).join("")}</div>`;
  if(kind==="chips") return `<div class="chips">${d.map(x=>`<span>${esc(x)}</span>`).join("")}</div>`;
  if(kind==="gal") return `<div class="gal">${Array.isArray(d) ? d.map(src=>`<img src="${esc(src)}" alt="">`).join("") : "<div></div>".repeat(d)}</div>`;
  if(kind==="skills") return d.map(([l,v])=>`<div class="bar-skill"><span>${esc(l)}</span><i><em style="width:${Math.min(100,Math.max(0,+v||0))}%"></em></i></div>`).join("");
  if(kind==="copy") return d.map(([l,v])=>`<div class="row"><div><b>${esc(l)}</b><small>${esc(v)}</small></div><button class="copy" data-v="${esc(v)}">Copy</button></div>`).join("");
  return d.map(([a,b])=>`<div class="row"><div><b>${esc(a)}</b>${b?`<small>${esc(b)}</small>`:""}</div></div>`).join("");
}

function setPhoto(src){const p=$("photo");if(src){p.src=src;p.hidden=false}else{p.removeAttribute("src");p.hidden=true}}

function render(){
  const d = cur.d;
  document.body.dataset.type = type;
  document.querySelectorAll(".switcher button").forEach(b=>b.setAttribute("aria-selected",b.dataset.t===type));
  $("editLink").href = $("sampleEdit").href = "editor.html?type=" + type;
  $("sampleNote").hidden = !cur.sample || !!U;
  document.querySelector(".switcher").hidden = !!U;
  $("editLink").hidden = !!U;
  document.title = (d.name||"Profile") + " | TapNext";
  $("name").textContent = d.name; $("sub").textContent = d.sub||""; $("loc").textContent = d.loc||"";
  setPhoto(d.photo);
  const q = d.quick||[];
  $("quick").hidden = !q.length;
  $("quick").innerHTML = q.map(([i,h])=>`<a href="${esc(h)}" aria-label="${esc(i)}"${/^https?:/.test(h)?' target="_blank" rel="noopener"':""}>${svg(i)}</a>`).join("");
  const secs = d.sections.filter(([ic,t,k,data])=>hasData(k,data));
  $("acc").innerHTML = secs.map(([ic,title,kind,data],n)=>`
    <div class="item${n===0?" open":""}">
      <button class="head" aria-expanded="${n===0}"><span class="ico">${svg(ic)}</span>${esc(title)}<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="body"><div><div class="inner">${body(kind,data)}</div></div></div>
    </div>`).join("");
  $("toggleAll").hidden = !secs.length;
  $("editBar").hidden = !!U; $("editBar").href = "editor.html?type=" + type;
  const empty = !secs.length && !(d.slides||[]).length && !q.length;
  $("emptyNote").hidden = !(!U && !cur.sample && empty);
  $("emptyEdit").href = "editor.html?type=" + type;
  slideIdx = 0; showSlide(); syncToggle();
}
function showSlide(){
  const s = cur.d.slides||[];
  document.querySelector(".pager").hidden = s.length<2;
  $("slide").hidden = !s.length;
  $("slide").textContent = s[slideIdx]||"";
  $("pageNo").textContent = `${slideIdx+1} of ${s.length}`;
  $("bars").innerHTML = s.map((_,i)=>`<i class="${i===slideIdx?"on":""}"></i>`).join("");
}
function syncToggle(){
  const all = [...document.querySelectorAll(".item")];
  $("toggleAll").textContent = all.length && all.every(i=>i.classList.contains("open")) ? "Collapse all" : "Expand all";
}
function setOpen(item,open){item.classList.toggle("open",open);item.querySelector(".head").setAttribute("aria-expanded",open)}

document.addEventListener("click",e=>{
  const h=e.target.closest(".head"); if(h){const it=h.parentElement;setOpen(it,!it.classList.contains("open"));syncToggle()}
  const c=e.target.closest(".copy"); if(c){navigator.clipboard?.writeText(c.dataset.v).then(()=>toast("Copied "+c.dataset.v),()=>toast("Copy failed"))}
  const t=e.target.closest(".switcher button"); if(t){type=t.dataset.t;sessionStorage.setItem("selectedProfile",type);history.replaceState(null,"","?type="+type);load()}
});
$("next").onclick = ()=>{const n=((cur&&cur.d.slides)||[]).length;if(n){slideIdx=(slideIdx+1)%n;showSlide()}};
$("toggleAll").onclick = ()=>{
  const all=[...document.querySelectorAll(".item")], open=!all.every(i=>i.classList.contains("open"));
  all.forEach(i=>setOpen(i,open)); syncToggle();
};
$("save").onclick = ()=>{
  if(!cur) return;
  const d=cur.d, clean=x=>String(x||"").replace(/[\r\n]+/g," ");
  let v=`BEGIN:VCARD\nVERSION:3.0\nFN:${clean(d.name)}\n`;
  if(d.sub) v+=`TITLE:${clean(d.sub)}\n`;
  if(d.phone) v+=`TEL:${clean(d.phone)}\n`;
  if(d.email) v+=`EMAIL:${clean(d.email)}\n`;
  v+="END:VCARD";
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([v],{type:"text/vcard"}));
  a.download=String(d.name||"contact").replace(/\s+/g,"_")+".vcf"; a.click(); URL.revokeObjectURL(a.href);
  toast("Contact saved");
};
load();
