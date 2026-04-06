import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'

const G = "#D4A843"
const G2 = "#F0C866"
const DK = "#07070A"
const S2 = "#0F0F16"
const S3 = "#15151F"
const BD = "rgba(212,168,67,0.18)"
const BD2 = "rgba(212,168,67,0.32)"
const TX = "#F2EDE4"
const TX2 = "#8A8480"
const TX3 = "#3D3B3E"
const RED = "#F87171"
const GREEN = "#4ADE80"

const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${DK};}
  input{font-family:'DM Sans',system-ui,sans-serif!important;}
  input:focus{border-color:${G}!important;box-shadow:0 0 0 3px rgba(212,168,67,0.12)!important;outline:none!important;}
  ::selection{background:rgba(212,168,67,0.25);}

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 30px rgba(212,168,67,0.3), 0 0 60px rgba(212,168,67,0.1); }
    50%      { box-shadow: 0 0 50px rgba(212,168,67,0.5), 0 0 100px rgba(212,168,67,0.2); }
  }
  @keyframes gridShift {
    0%   { background-position: 0px 0px; }
    100% { background-position: 52px 52px; }
  }
  @keyframes orb1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(30px,-20px) scale(1.08); }
  }
  @keyframes orb2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-20px,30px) scale(0.93); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 100%; }
  }

  .auth-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(0,0,0,0.5);
    border: 1px solid ${BD2};
    color: ${TX};
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 14px;
    font-family: 'DM Sans', system-ui, sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }
  .auth-input::placeholder { color: ${TX3}; }
  .auth-input:focus {
    border-color: ${G} !important;
    box-shadow: 0 0 0 3px rgba(212,168,67,0.12) !important;
  }

  .auth-btn-primary {
    cursor: pointer;
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid ${G};
    background: linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05));
    color: ${G};
    font-size: 14px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .auth-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent);
    background-size: 400px 100%;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .auth-btn-primary:hover {
    background: linear-gradient(135deg, rgba(212,168,67,0.25), rgba(212,168,67,0.10));
    box-shadow: 0 8px 32px rgba(212,168,67,0.25);
    transform: translateY(-1px);
  }
  .auth-btn-primary:hover::after { opacity: 1; animation: shimmer 1.5s infinite; }
  .auth-btn-primary:active { transform: translateY(0); }
  .auth-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .tab-btn {
    flex: 1;
    padding: 9px;
    border: none;
    background: transparent;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 8px;
    position: relative;
  }
  .tab-btn.active {
    background: rgba(212,168,67,0.12);
    color: ${G};
  }
  .tab-btn.inactive {
    color: ${TX3};
  }
  .tab-btn.inactive:hover { color: ${TX2}; }

  .card-wrap {
    animation: fadeInUp 0.55s ease both;
    animation-delay: 0.1s;
  }
`

const QUOTES = [
  "Tu edge no sirve si tu mente no está alineada.",
  "El plan es la única protección real.",
  "Consistencia primero. Ganancias después.",
  "El mercado no te debe nada. Tú sí le debes respeto.",
]

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [name, setName] = useState("")
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState("")
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)

  useEffect(function() {
    var iv = setInterval(function() {
      setQuoteVisible(false)
      setTimeout(function() {
        setQuoteIdx(function(i) { return (i + 1) % QUOTES.length })
        setQuoteVisible(true)
      }, 400)
    }, 5000)
    return function() { clearInterval(iv) }
  }, [])

  async function handle() {
    setLoad(true); setErr("")
    if (mode === "login") {
      var res = await supabase.auth.signInWithPassword({ email: email, password: pass })
      if (res.error) { setErr(res.error.message); setLoad(false); return; }
      onAuth(res.data.user)
    } else {
      if (!name.trim()) { setErr("Escribe tu nombre o apodo"); setLoad(false); return; }
      var res = await supabase.auth.signUp({ email: email, password: pass })
      if (res.error) { setErr(res.error.message); setLoad(false); return; }
      var user = res.data.user
      await supabase.from("traders").insert({ id: user.id, name: name })
      onAuth(user, name)
    }
    setLoad(false)
  }

  function handleKey(e) {
    if (e.key === "Enter") handle()
  }

  return (
    <div style={{
      background: DK,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{GCSS}</style>

      {/* Animated grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(212,168,67,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.035) 1px,transparent 1px)",
        backgroundSize: "52px 52px",
        animation: "gridShift 12s linear infinite",
      }} />

      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: "-120px", right: "-80px",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(212,168,67,0.10) 0%, transparent 65%)",
        pointerEvents: "none", animation: "orb1 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", left: "-60px",
        width: 380, height: 380,
        background: "radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 65%)",
        pointerEvents: "none", animation: "orb2 11s ease-in-out infinite",
      }} />

      {/* Corner decorations */}
      <div style={{position:"absolute",top:24,left:24,pointerEvents:"none"}}>
        <div style={{fontSize:10,color:TX3,letterSpacing:"0.2em",fontFamily:"'Syne',sans-serif"}}>ELITE TRADING JOURNAL</div>
        <div style={{width:40,height:1,background:"linear-gradient(to right,"+G+",transparent)",marginTop:6}} />
      </div>
      <div style={{position:"absolute",bottom:24,right:24,pointerEvents:"none",textAlign:"right"}}>
        <div style={{fontSize:10,color:TX3,letterSpacing:"0.1em"}}>POWERED BY IA</div>
        <div style={{width:40,height:1,background:"linear-gradient(to left,"+G+",transparent)",marginTop:6,marginLeft:"auto"}} />
      </div>

      {/* Main card */}
      <div className="card-wrap" style={{
        width: "100%",
        maxWidth: 420,
        padding: "0 1.5rem",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Logo + título */}
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg,"+G+","+G2+")",
            fontSize: 30, color: DK, fontWeight: 800,
            marginBottom: 20,
            animation: "glowPulse 3s ease-in-out infinite",
          }}>◈</div>

          <div style={{
            fontSize: 11, letterSpacing: "0.3em", color: G,
            marginBottom: 10, textTransform: "uppercase",
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
          }}>Elite Trading Journal</div>

          <div style={{
            fontSize: 28, color: TX, fontFamily: "'Syne', sans-serif",
            fontWeight: 800, lineHeight: 1.2, marginBottom: 8,
          }}>
            {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
          </div>

          {/* Quote rotatorio */}
          <div style={{
            fontSize: 12, color: TX2,
            opacity: quoteVisible ? 1 : 0,
            transform: quoteVisible ? "translateY(0)" : "translateY(4px)",
            transition: "all 0.4s ease",
            fontStyle: "italic",
            minHeight: 18,
            letterSpacing: "0.01em",
          }}>
            "{QUOTES[quoteIdx]}"
          </div>
        </div>

        {/* Card glassmorphism */}
        <div style={{
          background: "rgba(15,15,22,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid " + BD2,
          borderRadius: 20,
          padding: "1.75rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,168,67,0.08)",
        }}>

          {/* Tabs login / registro */}
          <div style={{
            display: "flex", gap: 4,
            background: "rgba(0,0,0,0.35)",
            borderRadius: 10, padding: 4,
            marginBottom: "1.5rem",
            border: "1px solid " + BD,
          }}>
            {[
              {id: "login", label: "Iniciar sesión"},
              {id: "register", label: "Registrarse"},
            ].map(function(t) {
              return (
                <button
                  key={t.id}
                  className={"tab-btn " + (mode === t.id ? "active" : "inactive")}
                  onClick={function() { setMode(t.id); setErr(""); }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Campos */}
          <div style={{display: "flex", flexDirection: "column", gap: 14}}>

            {mode === "register" && (
              <div style={{animation: "fadeInUp 0.3s ease both"}}>
                <label style={{
                  fontSize: 10, color: TX2, display: "block",
                  marginBottom: 7, letterSpacing: "0.15em", textTransform: "uppercase",
                  fontFamily: "'Syne', sans-serif", fontWeight: 600,
                }}>Nombre o apodo</label>
                <input
                  className="auth-input"
                  value={name}
                  onChange={function(e) { setName(e.target.value) }}
                  onKeyDown={handleKey}
                  placeholder="Ej: Juan, El Cóndor, Trader07..."
                />
              </div>
            )}

            <div>
              <label style={{
                fontSize: 10, color: TX2, display: "block",
                marginBottom: 7, letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "'Syne', sans-serif", fontWeight: 600,
              }}>Email</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={function(e) { setEmail(e.target.value) }}
                onKeyDown={handleKey}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label style={{
                fontSize: 10, color: TX2, display: "block",
                marginBottom: 7, letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "'Syne', sans-serif", fontWeight: 600,
              }}>Contraseña</label>
              <input
                className="auth-input"
                type="password"
                value={pass}
                onChange={function(e) { setPass(e.target.value) }}
                onKeyDown={handleKey}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

          </div>

          {/* Error */}
          {err && (
            <div style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 10,
              color: RED,
              fontSize: 12,
              textAlign: "center",
            }}>{err}</div>
          )}

          {/* Decorative line */}
          <div style={{
            height: 1,
            background: "linear-gradient(to right, transparent, " + BD2 + ", transparent)",
            margin: "1.5rem 0",
          }} />

          {/* Submit */}
          <button className="auth-btn-primary" onClick={handle} disabled={load}>
            {load ? "Verificando..." : (mode === "login" ? "Iniciar sesión →" : "Crear cuenta →")}
          </button>

          {/* Stats decorativas */}
          {mode === "login" && (
            <div style={{
              display: "flex", justifyContent: "space-around",
              marginTop: "1.5rem",
              padding: "14px 0 4px",
              borderTop: "1px solid " + BD,
            }}>
              {[
                {v: "MT5", l: "Integrado"},
                {v: "IA", l: "Mentor"},
                {v: "100%", l: "Privado"},
              ].map(function(s) {
                return (
                  <div key={s.l} style={{textAlign: "center"}}>
                    <div style={{fontSize: 14, color: G, fontWeight: 700, fontFamily: "'Syne',sans-serif"}}>{s.v}</div>
                    <div style={{fontSize: 10, color: TX3, marginTop: 2, letterSpacing: "0.08em"}}>{s.l}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Switch mode */}
        <div style={{textAlign: "center", marginTop: 20, fontSize: 13, color: TX3}}>
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <span
            onClick={function() { setMode(mode === "login" ? "register" : "login"); setErr("") }}
            style={{color: G, cursor: "pointer", fontWeight: 600, transition: "opacity 0.2s"}}
            onMouseEnter={function(e) { e.currentTarget.style.opacity = "0.7" }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity = "1" }}
          >
            {mode === "login" ? "Regístrate aquí" : "Inicia sesión"}
          </span>
        </div>

      </div>
    </div>
  )
}
