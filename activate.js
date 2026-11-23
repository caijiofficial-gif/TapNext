const $ = s => document.querySelector(s);
const qs = new URLSearchParams(location.search);
// only allow simple relative pages so this can't redirect to another site
const NEXT = /^[\w.\-?=&%]+$/.test(qs.get("next") || "") ? qs.get("next") : "editor.html?type=personal";
const back = location.origin + location.pathname + location.search;

function say(id, text, err) { const m = $(id); m.textContent = text; m.className = "msg" + (err ? " err" : ""); }

async function render(session) {
  $("#signin").hidden = !!session;
  $("#codebox").hidden = !session;
  $("#done").hidden = true;
  if (qs.get("c") && !session) $("#intro").textContent = "This card isn't set up yet. Sign in, then enter the Activation Code that came with it.";
  if (!session) return;
  const who = "Signed in as " + (session.user.email || "your account");
  $("#who").textContent = who; $("#who2").textContent = who;
  // already activated a card? show where to go next instead of asking for a code again
  const { data: cards } = await sb.from("cards").select("paid_until");
  if (cards && cards.length) {
    const ends = cards.map(c => c.paid_until ? new Date(c.paid_until) : null).filter(Boolean).sort((a, b) => b - a)[0];
    $("#planline").textContent = ends && ends > new Date()
      ? "Your ₱5 monthly plan is active until " + ends.toLocaleDateString() + "."
      : "Your public link turns on once your ₱5 monthly payment is confirmed (GCash or Maribank 09708131228).";
    $("#done").hidden = false;
    $("#codebox").hidden = true;
    $("#intro").textContent = "Your card is ready. Build your profile, then publish it.";
  }
}

if (!window.sb) {
  say("#msg1", "Could not connect. Check your internet connection and reload.", true);
  $("#signin").hidden = false;
} else {
  sb.auth.getSession().then(({ data }) => render(data.session));
  sb.auth.onAuthStateChange((_e, s) => render(s));

  if ($("#google")) $("#google").onclick = async () => {
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: back } });
    if (error) say("#msg1", error.message, true);
  };
  const creds = () => {
    const email = $("#email").value.trim(), password = $("#pw").value;
    if (!email) { say("#msg1", "Enter your email first.", true); return null; }
    if (password.length < 6) { say("#msg1", "Password must be at least 6 characters.", true); return null; }
    return { email, password };
  };
  $("#signinpw").onclick = async () => {
    const c = creds(); if (!c) return;
    say("#msg1", "Signing in…");
    const { error } = await sb.auth.signInWithPassword(c);
    if (error) say("#msg1", /invalid login/i.test(error.message) ? "Wrong email or password. New here? Tap Create account." : error.message, true);
  };
  $("#signup").onclick = async () => {
    const c = creds(); if (!c) return;
    say("#msg1", "Creating your account…");
    const { data, error } = await sb.auth.signUp(c);
    if (error) return say("#msg1", /already/i.test(error.message) ? "This email already has an account. Tap Sign in." : error.message, true);
    if (!data.session) say("#msg1", "Almost done: check your email and tap the confirmation link.");
  };
  $("#magic").onclick = async () => {
    const email = $("#email").value.trim();
    if (!email) return say("#msg1", "Enter your email first.", true);
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: back } });
    say("#msg1", error ? error.message : "Check your email for the sign-in link.", !!error);
  };
  $("#activate").onclick = async () => {
    const code = $("#code").value.trim();
    if (!code) return say("#msg2", "Enter your Activation Code.", true);
    $("#activate").disabled = true; say("#msg2", "Checking…");
    const { error } = await sb.rpc("activate_card", { p_code: code });
    $("#activate").disabled = false;
    if (error) return say("#msg2", error.message, true);
    say("#msg2", "Card activated! Opening the profile builder…");
    setTimeout(() => location.href = NEXT, 900);
  };
  $("#another").onclick = () => { $("#codebox").hidden = false; $("#codebox").scrollIntoView({ behavior: "smooth" }); };
  $("#signout").onclick = async () => { await sb.auth.signOut(); location.reload(); };
}
