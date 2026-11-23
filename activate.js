const $ = s => document.querySelector(s);
const qs = new URLSearchParams(location.search);
// only allow simple relative pages so this can't redirect to another site
const NEXT = /^[\w.\-?=&%]+$/.test(qs.get("next") || "") ? qs.get("next") : "editor.html?type=personal";
const back = location.origin + location.pathname + location.search;

function say(id, text, err) { const m = $(id); m.textContent = text; m.className = "msg" + (err ? " err" : ""); }

function render(session) {
  $("#signin").hidden = !!session;
  $("#codebox").hidden = !session;
  if (session) $("#who").textContent = "Signed in as " + (session.user.email || "your account");
  if (qs.get("c") && !session) $("#intro").textContent = "This card isn't set up yet. Sign in, then enter the Lifetime Code that came with it.";
}

if (!window.sb) {
  say("#msg1", "Could not connect. Check your internet connection and reload.", true);
  $("#signin").hidden = false;
} else {
  sb.auth.getSession().then(({ data }) => render(data.session));
  sb.auth.onAuthStateChange((_e, s) => render(s));

  $("#google").onclick = async () => {
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: back } });
    if (error) say("#msg1", error.message, true);
  };
  $("#magic").onclick = async () => {
    const email = $("#email").value.trim();
    if (!email) return say("#msg1", "Enter your email first.", true);
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: back } });
    say("#msg1", error ? error.message : "Check your email for the sign-in link.", !!error);
  };
  $("#activate").onclick = async () => {
    const code = $("#code").value.trim();
    if (!code) return say("#msg2", "Enter your Lifetime Code.", true);
    $("#activate").disabled = true; say("#msg2", "Checking…");
    const { error } = await sb.rpc("activate_card", { p_code: code });
    $("#activate").disabled = false;
    if (error) return say("#msg2", error.message, true);
    say("#msg2", "Card activated! Opening the profile builder…");
    setTimeout(() => location.href = NEXT, 900);
  };
  $("#signout").onclick = async () => { await sb.auth.signOut(); location.reload(); };
}
