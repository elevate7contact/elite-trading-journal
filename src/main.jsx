import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Auth from './Auth.jsx'
import { supabase } from './supabase.js'

function Root() {
  var sessionS = useState(null); var session = sessionS[0], setSession = sessionS[1]
  var loadS = useState(true); var load = loadS[0], setLoad = loadS[1]

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      setSession(res.data.session)
      setLoad(false)
    })
    var sub = supabase.auth.onAuthStateChange(function(event, session) {
      setSession(session)
    })
    return function() { sub.data.subscription.unsubscribe() }
  }, [])

  if (load) return (
    <div style={{background:"#0A0A0F",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#C9A84C",fontFamily:"Georgia,serif",fontSize:14,letterSpacing:"0.1em"}}>Cargando...</div>
    </div>
  )

  if (!session) return (
    <Auth onAuth={function(user, name) { setSession({ user: user, name: name }) }} />
  )

  return <App session={session} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
