import React, { useState } from 'react'
import { supabase } from './supabase'

const G = "#C9A84C"
const DK = "#0A0A0F"
const S2 = "#16161F"
const BD = "rgba(201,168,76,0.18)"
const BD2 = "rgba(201,168,76,0.35)"
const TX = "#F0EDE8"
const TX2 = "#9E9A93"
const TX3 = "#5A5750"

const styInp = {width:"100%",boxSizing:"border-box",background:"#000",border:"1px solid "+BD2,color:"#fff",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"Georgia,serif",outline:"none",marginBottom:12}
const styBtnP = {cursor:"pointer",padding:"10px 24px",borderRadius:8,border:"1px solid "+G,background:"rgba(201,168,76,0.08)",color:G,fontSize:13,fontFamily:"Georgia,serif",letterSpacing:"0.06em",width:"100%"}

export default function Auth({ onAuth }) {
  var modeS = useState("login"); var mode = modeS[0], setMode = modeS[1]
  var emailS = useState(""); var email = emailS[0], setEmail = emailS[1]
  var passS = useState(""); var pass = passS[0], setPass = passS[1]
  var nameS = useState(""); var name = nameS[0], setName = nameS[1]
  var loadS = useState(false); var load = loadS[0], setLoad = loadS[1]
  var errS = useState(""); var err = errS[0], setErr = errS[1]

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

  return (
    <div style={{background:DK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif"}}>
      <div style={{width:"100%",maxWidth:400,padding:"2rem"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",color:G,marginBottom:12,textTransform:"uppercase"}}>Elite Trading Journal</div>
          <div style={{fontSize:26,color:TX,marginBottom:8}}>{mode==="login"?"Bienvenido de vuelta":"Crea tu cuenta"}</div>
          <div style={{fontSize:13,color:TX2}}>{mode==="login"?"Inicia sesion para continuar":"Empieza tu journey como trader"}</div>
        </div>
        <div style={{background:S2,border:"1px solid "+BD,borderRadius:12,padding:"1.5rem"}}>
          {mode==="register" && (
            <div>
              <label style={{fontSize:11,color:TX3,display:"block",marginBottom:5,letterSpacing:"0.08em",textTransform:"uppercase"}}>Nombre o apodo</label>
              <input value={name} onChange={function(e){setName(e.target.value);}} placeholder="Ej: Juan, El Condor..." style={styInp}/>
            </div>
          )}
          <label style={{fontSize:11,color:TX3,display:"block",marginBottom:5,letterSpacing:"0.08em",textTransform:"uppercase"}}>Email</label>
          <input type="email" value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="tu@email.com" style={styInp}/>
          <label style={{fontSize:11,color:TX3,display:"block",marginBottom:5,letterSpacing:"0.08em",textTransform:"uppercase"}}>Password</label>
          <input type="password" value={pass} onChange={function(e){setPass(e.target.value);}} placeholder="Minimo 6 caracteres" style={{...styInp,marginBottom:16}}/>
          {err && <div style={{color:"#C84B4B",fontSize:12,marginBottom:12,textAlign:"center"}}>{err}</div>}
          <button onClick={handle} disabled={load} style={{...styBtnP,opacity:load?0.5:1}}>
            {load?"Cargando...":(mode==="login"?"Iniciar sesion":"Crear cuenta")}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:TX3}}>
          {mode==="login"?"No tienes cuenta?":"Ya tienes cuenta?"}{" "}
          <span onClick={function(){setMode(mode==="login"?"register":"login");setErr("");}} style={{color:G,cursor:"pointer"}}>
            {mode==="login"?"Registrate aqui":"Inicia sesion"}
          </span>
        </div>
      </div>
    </div>
  )
}
