import React, { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { supabase } from './supabase.js';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const G="#D4A843",G2="#F0C866",DK="#07070A",S2="#0F0F16",S3="#15151F";
const BD="rgba(212,168,67,0.18)",BD2="rgba(212,168,67,0.32)";
const TX="#F2EDE4",TX2="#8A8480",TX3="#3D3B3E";
const GREEN="#4ADE80",RED="#F87171",ORANGE="#FB923C";

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GCSS=`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${DK};}
  input,textarea,select{font-family:'DM Sans',system-ui,sans-serif!important;}
  input:focus,textarea:focus,select:focus{border-color:${G}!important;box-shadow:0 0 0 3px rgba(212,168,67,0.12)!important;outline:none!important;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-thumb{background:rgba(212,168,67,0.25);border-radius:2px;}
  ::selection{background:rgba(212,168,67,0.25);}
  @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  @keyframes fadeInUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 6px rgba(212,168,67,0.4);}50%{box-shadow:0 0 18px rgba(212,168,67,0.7);}}
`;

// ── PSICOTRADING QUOTES ───────────────────────────────────────────────────────
const QUOTES=[
  {t:"El mercado no te debe nada. Tu edge sí.",a:"Diario del trader"},
  {t:"Disciplina no es lo que sientes. Es lo que haces cuando no quieres.",a:"Psicotrader"},
  {t:"Cada pérdida bien gestionada es una inversión en tu mentalidad.",a:"Trading Psychology"},
  {t:"El trader que controla sus emociones controla su cuenta.",a:"Elevate Zeven"},
  {t:"No hay estrategia perfecta. Hay ejecución consistente.",a:"Psicotrader"},
  {t:"El miedo te paraliza. El plan te libera.",a:"Diario del trader"},
  {t:"Un mal trade bien gestionado vale más que un buen trade mal ejecutado.",a:"Trading Psychology"},
  {t:"Tu PnL refleja tus decisiones. Tus decisiones reflejan tu mente.",a:"Psicotrader"},
  {t:"El mercado paga a los pacientes y cobra caro a los impulsivos.",a:"Elevate Zeven"},
  {t:"Sé el trader que quisieras tener enfrente.",a:"Diario del trader"},
  {t:"Operar con miedo es apostar. Operar con plan es hacer negocios.",a:"Psicotrader"},
  {t:"El drawdown no rompe cuentas. El revenge trading sí.",a:"Trading Psychology"},
];

function QuoteRotator(){
  var idxS=useState(function(){return Math.floor(Math.random()*QUOTES.length);});
  var qIdx=idxS[0],setQIdx=idxS[1];
  var visS=useState(true);var visible=visS[0],setVisible=visS[1];
  var hvS=useState(false);var hov=hvS[0],setHov=hvS[1];
  useEffect(function(){
    if(hov)return;
    var iv=setInterval(function(){
      setVisible(false);
      setTimeout(function(){setQIdx(function(i){return(i+1)%QUOTES.length;});setVisible(true);},450);
    },6500);
    return function(){clearInterval(iv);};
  },[hov]);
  var q=QUOTES[qIdx];
  return React.createElement("div",{
    onMouseEnter:function(){setHov(true);},
    onMouseLeave:function(){setHov(false);},
    style:{background:"linear-gradient(135deg,"+S2+" 0%,rgba(212,168,67,0.05) 100%)",border:"1px solid "+BD,borderLeft:"3px solid "+G,borderRadius:14,padding:"20px 24px",position:"relative",overflow:"hidden",transition:"border-color 0.3s"}
  },
    React.createElement("div",{style:{position:"absolute",top:4,right:16,fontSize:72,color:"rgba(212,168,67,0.06)",fontFamily:"Georgia,serif",lineHeight:1,pointerEvents:"none",userSelect:"none"}},'"'),
    React.createElement("div",{style:{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(5px)",transition:"all 0.45s ease"}},
      React.createElement("p",{style:{fontSize:15,color:TX,lineHeight:1.75,fontFamily:"Georgia,serif",fontStyle:"italic",marginBottom:10,paddingRight:40}},q.t),
      React.createElement("p",{style:{fontSize:10,color:G,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}},"— "+q.a)
    ),
    React.createElement("div",{style:{display:"flex",gap:5,marginTop:14}},
      QUOTES.map(function(_,i){
        return React.createElement("div",{key:i,onClick:function(){setQIdx(i);setVisible(true);},style:{width:i===qIdx?18:4,height:3,borderRadius:2,background:i===qIdx?G:TX3,transition:"all 0.4s",cursor:"pointer"}});
      })
    )
  );
}

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const styInp={width:"100%",boxSizing:"border-box",background:"rgba(0,0,0,0.4)",border:"1px solid "+BD2,color:TX,borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:"'DM Sans',system-ui,sans-serif",outline:"none",transition:"border-color 0.2s"};
const styBtn={cursor:"pointer",padding:"8px 18px",borderRadius:10,border:"1px solid "+BD2,background:"transparent",color:G,fontSize:12,fontFamily:"'DM Sans',system-ui,sans-serif",letterSpacing:"0.04em",transition:"all 0.2s"};
const styBtnP={cursor:"pointer",padding:"11px 26px",borderRadius:10,border:"1px solid "+G,background:"rgba(212,168,67,0.09)",color:G,fontSize:13,fontFamily:"'DM Sans',system-ui,sans-serif",letterSpacing:"0.04em",transition:"all 0.2s",boxShadow:"0 0 20px rgba(212,168,67,0.1)"};
const styCard={background:S2,border:"1px solid "+BD,borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:14};
const styCardG={background:"linear-gradient(135deg,"+S2+",rgba(212,168,67,0.04))",border:"1px solid "+BD2,borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:14};

// ── HELPER COMPONENTS ─────────────────────────────────────────────────────────
function StableInput(props){
  var value=props.value,onChange=props.onChange,style=props.style;
  var rest=Object.assign({},props);delete rest.value;delete rest.onChange;delete rest.style;
  var ref=useRef(null);
  var ls=useState(value!=null?value:"");var lv=ls[0],setLv=ls[1];
  useEffect(function(){if(ref.current!==document.activeElement)setLv(value!=null?value:"");},[value]);
  return React.createElement("input",Object.assign({},rest,{ref:ref,value:lv,style:Object.assign({},styInp,style||{}),onChange:function(e){setLv(e.target.value);onChange(e.target.value);}}));
}
function StableTextarea(props){
  var value=props.value,onChange=props.onChange,style=props.style;
  var rest=Object.assign({},props);delete rest.value;delete rest.onChange;delete rest.style;
  var ref=useRef(null);
  var ls=useState(value!=null?value:"");var lv=ls[0],setLv=ls[1];
  useEffect(function(){if(ref.current!==document.activeElement)setLv(value!=null?value:"");},[value]);
  return React.createElement("textarea",Object.assign({},rest,{ref:ref,value:lv,style:Object.assign({},styInp,{resize:"vertical"},style||{}),onChange:function(e){setLv(e.target.value);onChange(e.target.value);}}));
}
function StableSelect(props){
  var value=props.value,onChange=props.onChange,children=props.children,style=props.style;
  return React.createElement("select",{value:value,style:Object.assign({},styInp,style||{}),onChange:function(e){onChange(e.target.value);}},children);
}
function Lbl(props){return React.createElement("label",{style:{fontSize:11,color:TX2,display:"block",marginBottom:6,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}},props.c);}
function Divider(){return React.createElement("div",{style:{height:1,background:"linear-gradient(to right,transparent,"+BD2+",transparent)",margin:"16px 0"}});}
function SecLabel(props){return React.createElement("div",{style:{fontSize:11,letterSpacing:"0.2em",color:G,marginBottom:18,textTransform:"uppercase",fontFamily:"'Syne','DM Sans',sans-serif",fontWeight:700}},props.c);}

// ── TICKER BOTTOM ─────────────────────────────────────────────────────────────
const TICKER_ITEMS=[
  {label:"EUR/USD",v:"1.0847",up:true},{label:"XAU/USD",v:"2,318.40",up:false},
  {label:"NAS100",v:"17,842",up:true},{label:"US30",v:"38,429",up:true},
  {label:"BTC/USD",v:"68,204",up:false},{label:"GBP/USD",v:"1.2661",up:true},
  {label:"ETH/USD",v:"3,481",up:true},{label:"USD/JPY",v:"151.24",up:false},
];

// ── DATA CONSTANTS ────────────────────────────────────────────────────────────
const FUTURES={"MES (Micro E-mini S&P)":{dpp:5,tick:0.25,tv:1.25,note:"1/10 de ES"},"ES (E-mini S&P)":{dpp:50,tick:0.25,tv:12.5,note:"Full e-mini"},"MNQ (Micro E-mini Nasdaq)":{dpp:2,tick:0.25,tv:0.50,note:"1/10 de NQ"},"NQ (E-mini Nasdaq)":{dpp:20,tick:0.25,tv:5,note:"Full e-mini"},"MYM (Micro E-mini Dow)":{dpp:0.5,tick:1,tv:0.50,note:"1/10 de YM"},"YM (E-mini Dow)":{dpp:5,tick:1,tv:5,note:"Full e-mini"},"MGC (Micro Gold)":{dpp:10,tick:0.1,tv:1,note:"10 oz"},"GC (Gold Full)":{dpp:100,tick:0.1,tv:10,note:"100 oz"}};
const FOREX={"EUR/USD":{pv:10},"GBP/USD":{pv:10},"AUD/USD":{pv:10},"USD/CHF":{pv:10},"USD/CAD":{pv:7.7},"USD/JPY":{pv:9.1},"GBP/JPY":{pv:9.1},"EUR/JPY":{pv:9.1},"XAU/USD":{pv:1},"US30/CFD":{pv:1},"NAS100/CFD":{pv:1},"SP500/CFD":{pv:1}};
const CRYPTO_LIST=["BTC/USD","ETH/USD","SOL/USD","BNB/USD"];

function calcPos(opts){
  var market=opts.market,asset=opts.asset,balance=opts.balance,riskPct=opts.riskPct,slMode=opts.slMode,slVal=opts.slVal;
  var rUSD=(parseFloat(balance)||0)*(parseFloat(riskPct)||0)/100;
  if(market==="Futuros"){var sp=FUTURES[asset];if(!sp)return{};var pts=slMode==="puntos"?parseFloat(slVal)||0:slMode==="ticks"?(parseFloat(slVal)||0)*sp.tick:(parseFloat(slVal)||0)/sp.dpp;var rpc=pts*sp.dpp;if(!rpc)return{contracts:0,rpc:0,total:0,sp:sp,pts:0};var contracts=Math.max(1,Math.floor(rUSD/rpc));return{contracts:contracts,rpc:Math.round(rpc*100)/100,total:Math.round(contracts*rpc*100)/100,sp:sp,pts:Math.round(pts*100)/100};}
  if(market==="Forex/CFD"){var pair=FOREX[asset]||{pv:10};var ppl=pair.pv;var pips=slMode==="pips"?parseFloat(slVal)||0:slMode==="usd"?(parseFloat(slVal)||0)/ppl:parseFloat(slVal)||0;var rawLots=pips>0?rUSD/(pips*ppl):0;var lots=Math.max(0.01,Math.round(rawLots*100)/100);return{lots:lots,pvpl:Math.round(ppl*100)/100,total:Math.round(lots*pips*ppl*100)/100,pips:Math.round(pips*10)/10};}
  if(market==="Crypto"){return{units:Math.round(rUSD/(parseFloat(slVal)||1)*10000)/10000,total:Math.round(rUSD*100)/100};}
  return{};
}

const PSY=[
  {id:"q1",text:"Cuando tienes una racha de perdidas, que haces normalmente?",opts:["Detengo y analizo mis errores","Abro mas operaciones para recuperar","Cierro el computador por el dia","Reduzco el tamano de posicion"]},
  {id:"q2",text:"Con que frecuencia operas mas de lo planeado en el dia?",opts:["Nunca, sigo mi plan","A veces cuando veo oportunidades","Frecuentemente, no puedo parar","Siempre termino con mas trades de los planeados"]},
  {id:"q3",text:"Cuando el precio va en tu contra, que sientes?",opts:["Calma, el stop loss esta puesto","Ansiedad pero respeto el SL","Muevo el stop para darle mas espacio","Panico y cierro antes del stop"]},
  {id:"q4",text:"Cuanto tiempo piensas en trading fuera del horario de mercado?",opts:["Solo en horario de mercado","Algunas horas fuera de mercado","La mayoria del dia","Casi todo el tiempo, interfiere con mi vida"]},
  {id:"q5",text:"Cuando tienes una ganancia grande, que haces?",opts:["Cierro el dia, alcance mi meta","Sigo operando pero con cautela","Abro mas trades para maximizar","Subo el lotaje para ganar mas rapido"]},
  {id:"q6",text:"Alguna vez has operado dinero que no podias permitirte perder?",opts:["Nunca","Una o dos veces","Ocasionalmente","Con frecuencia"]},
  {id:"q7",text:"Cuando tienes un trade ganador, cuando cierras?",opts:["Cuando llega al TP definido","Cuando el analisis cambia","Cierro parcial y muevo el SL","Cierro anticipado por miedo"]},
  {id:"q8",text:"Como reaccionas cuando pierdes un movimiento sin haber entrado?",opts:["Lo dejo ir, habra otros","Un poco frustrado pero sigo el plan","Entro tarde persiguiendo el precio","No puedo soportarlo y entro de cualquier forma"]},
];

function scorePsych(a){
  var rv=0,ov=0,fo=0,gr=0,fe=0,ad=0;
  if(a.q1==="1")rv+=3;if(a.q2==="2")ov+=2;if(a.q2==="3")ov+=3;if(a.q3==="2")fe+=2;if(a.q3==="3")fe+=3;if(a.q4==="2")ad+=2;if(a.q4==="3")ad+=3;if(a.q5==="2")gr+=2;if(a.q5==="3")gr+=3;if(a.q6==="2")ad+=2;if(a.q6==="3")ad+=3;if(a.q7==="3")fe+=2;if(a.q8==="2")fo+=2;if(a.q8==="3")fo+=3;
  var p=[];
  if(rv>=2)p.push({name:"Revenge Trading",level:rv>=3?"Alto":"Medio",color:"#C84B4B",desc:"Sobreoperas tras perdidas para recuperar."});
  if(ov>=2)p.push({name:"Overtrading",level:ov>=3?"Alto":"Medio",color:"#C4862A",desc:"Operas mas de lo planeado. Cada trade extra reduce tu edge."});
  if(fo>=2)p.push({name:"FOMO",level:fo>=3?"Alto":"Medio",color:"#C4862A",desc:"Miedo a perderte movimientos. Entradas tardias."});
  if(gr>=2)p.push({name:"Avaricia",level:gr>=3?"Alto":"Medio",color:"#C84B4B",desc:"Maximizar ganancias mas alla del plan."});
  if(fe>=2)p.push({name:"Miedo / Manos de papel",level:fe>=3?"Alto":"Medio",color:"#C4862A",desc:"Gestionas mal posiciones por miedo."});
  if(ad>=2)p.push({name:"Senales de adiccion",level:ad>=3?"Alto":"Medio",color:"#C84B4B",desc:"Patrones similares a ludopatia."});
  if(p.length===0)p.push({name:"Perfil disciplinado",level:"Solido",color:G,desc:"Muestras buenos habitos. Mantente consistente."});
  return p;
}

function getPlan(problems,level){
  var names=problems.map(function(p){return p.name;}),t=[];
  if(level==="Novato"){t.push("Completa 30 dias en demo antes de operar capital real.");t.push("Estudia un solo setup y dominalo completamente.");t.push("Maximo 1-2 trades por dia.");}
  if(level==="Avanzado"){t.push("Analiza tu data: en que sesion y par rindes mejor?");t.push("Trabaja en escalar posiciones sin cambiar tu psicologia.");}
  if(names.some(function(n){return n.includes("Revenge");}))t.push("Regla de 2 perdidas: si pierdes 2 trades seguidos, cierra el dia.");
  if(names.some(function(n){return n.includes("Overtrading");}))t.push("Maximo "+(level==="Novato"?2:3)+" trades por dia.");
  if(names.some(function(n){return n.includes("FOMO");}))t.push("Lista de espera: escribe el trade, espera 10 min, luego decide.");
  if(names.some(function(n){return n.includes("Avaricia");}))t.push("TP fijo e inamovible.");
  if(names.some(function(n){return n.includes("Miedo");}))t.push("Reduce tu tamano de posicion a la mitad hasta respetar el SL al 100%.");
  if(names.some(function(n){return n.includes("adiccion");}))t.push("Establece horarios estrictos. Cero operaciones fuera de ese horario.");
  t.push("Completa el diario pre-trade y post-trade en cada operacion.");
  return t;
}

const SESSIONS=["Asia (00:00-08:00)","Londres (08:00-16:00)","Nueva York (13:00-21:00)","Overlap NY/LDN (13:00-16:00)"];
const ALL_PAIRS=["EUR/USD","GBP/USD","USD/JPY","US30","NAS100","SP500","XAUUSD","BTC/USD","MES","ES","MNQ","NQ","Otro"];
const EMOTIONS=["Calmado","Confiado","Ansioso","Frustrado","Emocionado","Neutral","Cansado","Estresado"];
const ERRORS=["Movi el stop","Cerre antes del TP","Revenge trade","Oversize","No segui el plan","FOMO","Sobreopere","Ninguno"];
const LEVEL_DESC={Novato:"Fundamentos del mercado",Intermedio:"Analisis tecnico, buscas consistencia",Avanzado:"Sistema propio, buscas escalar"};
const EXP_OPTS=["Menos de 1 ano","Mas de 1 ano","Mas de 3 anos"];

function makeAcc(id,name){return{id:id,name:name,balance:"10000",type:"Personal",riskPct:"1",funding:{company:"",maxDailyDD:"",maxTotalDD:"",profitTarget:"",minDays:"",extraRules:""}};}
async function apiCall(body){var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});return r.json();}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App({session}){
  var userId=session&&session.user?session.user.id:null;
  var phaseS=useState("onboarding");var phase=phaseS[0],setPhase=phaseS[1];
  var qIdxS=useState(0);var qIdx=qIdxS[0],setQIdx=qIdxS[1];
  var tlS=useState("");var traderLevel=tlS[0],setTraderLevel=tlS[1];
  var teS=useState("");var traderExp=teS[0],setTraderExp=teS[1];
  var tnS=useState("");var traderName=tnS[0],setTraderName=tnS[1];
  var answS=useState({});var answers=answS[0],setAnswers=answS[1];
  var profS=useState(null);var profile=profS[0],setProfile=profS[1];
  var planS=useState([]);var plan=planS[0],setPlan=planS[1];
  var accS=useState([makeAcc(1,"Cuenta Principal")]);var accounts=accS[0],setAccounts=accS[1];
  var actS=useState(1);var activeAccId=actS[0],setActiveAccId=actS[1];
  var activeAcc=accounts.find(function(a){return a.id===activeAccId;})||accounts[0];
  function updAcc(f,v){setAccounts(function(ac){return ac.map(function(a){return a.id===activeAccId?Object.assign({},a,{[f]:v}):a;});});}
  function updFund(f,v){setAccounts(function(ac){return ac.map(function(a){return a.id===activeAccId?Object.assign({},a,{funding:Object.assign({},a.funding,{[f]:v})}):a;});});}
  var tradesS=useState([]);var trades=tradesS[0],setTrades=tradesS[1];
  var pendingS=useState([]);var pendingTrades=pendingS[0],setPendingTrades=pendingS[1];
  var expandedS=useState(null);var expandedId=expandedS[0],setExpandedId=expandedS[1];
  var fillEmotionS=useState("Calmado");var fillEmotion=fillEmotionS[0],setFillEmotion=fillEmotionS[1];
  var fillFollowedS=useState(true);var fillFollowed=fillFollowedS[0],setFillFollowed=fillFollowedS[1];
  var fillNotesS=useState("");var fillNotes=fillNotesS[0],setFillNotes=fillNotesS[1];
  var accTrades=trades.filter(function(t){return t.accountId===activeAccId;});
  var preS=useState({mood:7,session:"",bias:"",levels:"",plan_text:""});var preTrade=preS[0],setPreTrade=preS[1];
  var curS=useState({pair:"",dir:"Long",entry:"",sl:"",tp:"",result:"",pnl:"",emotion:"Calmado",followed:true,errors:[],notes:""});var curTrade=curS[0],setCurTrade=curS[1];
  var aifS=useState("");var aiFeedback=aifS[0],setAiFeedback=aifS[1];
  var ailS=useState(false);var aiLoading=ailS[0],setAiLoading=ailS[1];
  var spS=useState(false);var savedPre=spS[0],setSavedPre=spS[1];
  var waiS=useState("");var weeklyAI=waiS[0],setWeeklyAI=waiS[1];
  var wlS=useState(false);var weeklyLoading=wlS[0],setWeeklyLoading=wlS[1];
  var cmS=useState([{role:"assistant",content:"Bienvenido. Soy tu mentor de trading personal.\n\nEstoy aqui para acompanarte en tu crecimiento como trader y como persona.\n\nComo te sientes hoy con respecto a tu trading?"}]);var chatMsgs=cmS[0],setChatMsgs=cmS[1];
  var ciS=useState("");var chatInput=ciS[0],setChatInput=ciS[1];
  var clS=useState(false);var chatLoading=clS[0],setChatLoading=clS[1];
  var memS=useState({});var traderMem=memS[0],setTraderMem=memS[1];
  var lcS=useState({market:"Forex/CFD",asset:"EUR/USD",balance:"10000",riskPct:"1",slMode:"pips",slVal:"20"});var lc=lcS[0],setLc=lcS[1];
  var naS=useState("");var newAccName=naS[0],setNewAccName=naS[1];
  var ldS=useState(true);var loadingData=ldS[0],setLoadingData=ldS[1];
  var chatEndRef=useRef(null);
  var chatInputRef=useRef(null);

  useEffect(function(){if(chatEndRef.current)chatEndRef.current.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  useEffect(function(){
    if(!userId){setLoadingData(false);return;}
    apiCall({loadData:userId}).then(function(data){
      if(data.trader&&data.trader.name){
        setTraderName(data.trader.name);
        if(data.trader.level)setTraderLevel(data.trader.level);
        if(data.trader.experience)setTraderExp(data.trader.experience);
        if(data.trader.profile)setProfile(data.trader.profile);
        if(data.trader.plan)setPlan(data.trader.plan);
        if(data.trader.memory)setTraderMem(data.trader.memory);
        if(data.trader.level)setPhase("dashboard");
      }
      if(data.accounts&&data.accounts.length>0){
        setAccounts(data.accounts.map(function(a){return{id:a.id,name:a.name,balance:a.balance,type:a.type,riskPct:a.risk_pct,funding:a.funding||{company:"",maxDailyDD:"",maxTotalDD:"",profitTarget:"",minDays:"",extraRules:""}};}));
        setActiveAccId(data.accounts[0].id);
      }
      if(data.trades&&data.trades.length>0){
        var pending=data.trades.filter(function(t){return t.status==="pending";});
        var complete=data.trades.filter(function(t){return t.status!=="pending";});
        setTrades(complete.map(function(t){return mapTrade(t);}));
        if(pending.length>0){setPendingTrades(pending.map(function(t){return mapTrade(t);}));}
      }
      if(data.messages&&data.messages.length>0){setChatMsgs(data.messages.map(function(m){return{role:m.role,content:m.content};}));}
      setLoadingData(false);
    }).catch(function(){setLoadingData(false);});
  },[userId]);

  useEffect(function(){
    if(!userId)return;
    var interval=setInterval(function(){
      apiCall({checkPending:userId}).then(function(data){
        if(data.pending&&data.pending.length>0){
          setPendingTrades(function(prev){
            var ids=prev.map(function(t){return t.id;});
            var newP=data.pending.filter(function(t){return ids.indexOf(t.id)<0;});
            if(newP.length>0){return prev.concat(newP.map(function(t){return mapTrade(t);}));}
            return prev;
          });
        }
      });
    },8000);
    return function(){clearInterval(interval);};
  },[userId]);

  function mapTrade(t){
    return{id:t.id,date:t.trade_date,pair:t.pair,dir:t.direction,entry:t.entry,exit_price:t.exit_price,lot_size:t.lot_size,duration:t.duration,sl:t.sl,tp:t.tp,result:t.result,pnl:t.pnl,rr:t.rr,emotion:t.emotion,followed:t.followed,errors:t.errors||[],notes:t.notes,accountId:t.account_id,status:t.status};
  }

  function answerQ(v){
    var na=Object.assign({},answers,{[PSY[qIdx].id]:v});setAnswers(na);
    if(qIdx<PSY.length-1){setQIdx(qIdx+1);}
    else{var p=scorePsych(na);var pl=getPlan(p,traderLevel);setPlan(pl);setProfile(p);setPhase("profile_result");}
  }

  function getStats(tArr){
    var wins=tArr.filter(function(t){return t.result==="Win";}).length,total=tArr.length;
    var wr=total>0?Math.round(wins/total*100):0;
    var totalPnl=Math.round(tArr.reduce(function(s,t){return s+(parseFloat(t.pnl)||0);},0));
    var avgRR=total>0?(tArr.reduce(function(s,t){return s+(parseFloat(t.rr)||0);},0)/total).toFixed(2):0;
    var streak=0,sType=null;
    for(var i=tArr.length-1;i>=0;i--){if(!sType)sType=tArr[i].result;if(tArr[i].result===sType)streak++;else break;}
    return{wins:wins,losses:total-wins,total:total,wr:wr,totalPnl:totalPnl,avgRR:avgRR,streak:streak,sType:sType};
  }

  function getEquity(){var b=parseFloat(activeAcc.balance)||10000;return accTrades.map(function(t,i){b+=parseFloat(t.pnl)||0;return{name:"T"+(i+1),balance:Math.round(b)};});}

  // PnL agrupado por día de la semana
  function getWeeklyPnl(){
    var days=["L","M","X","J","V","S","D"];
    var today=new Date();
    var weekStart=new Date(today);weekStart.setDate(today.getDate()-today.getDay()+1);
    var result=days.map(function(d,i){
      var dayDate=new Date(weekStart);dayDate.setDate(weekStart.getDate()+i);
      var iso=dayDate.toISOString().split("T")[0];
      var dayTrades=accTrades.filter(function(t){return t.date===iso;});
      var pnl=Math.round(dayTrades.reduce(function(s,t){return s+(parseFloat(t.pnl)||0);},0));
      return{day:d,pnl:pnl};
    });
    return result;
  }

  // PnL de hoy
  function getTodayPnl(){
    var today=new Date().toISOString().split("T")[0];
    var todayTrades=accTrades.filter(function(t){return t.date===today;});
    var pnl=Math.round(todayTrades.reduce(function(s,t){return s+(parseFloat(t.pnl)||0);},0));
    var wins=todayTrades.filter(function(t){return t.result==="Win";}).length;
    var losses=todayTrades.filter(function(t){return t.result==="Loss";}).length;
    return{pnl:pnl,trades:todayTrades.length,wins:wins,losses:losses};
  }

  function checkHealth(){
    var f=activeAcc.funding;if(!f.maxDailyDD||!f.maxTotalDD)return null;
    var today=new Date().toISOString().split("T")[0];
    var todayPnl=accTrades.filter(function(t){return t.date===today;}).reduce(function(s,t){return s+(parseFloat(t.pnl)||0);},0);
    var totalPnl=accTrades.reduce(function(s,t){return s+(parseFloat(t.pnl)||0);},0);
    var du=Math.abs(Math.min(0,todayPnl)),tl=Math.abs(Math.min(0,totalPnl));
    var dl=parseFloat(f.maxDailyDD)||1,tlt=parseFloat(f.maxTotalDD)||1;
    return{du:Math.round(du),dl:dl,dp:Math.round(du/dl*100),tl:Math.round(tl),tlt:tlt,tp:Math.round(tl/tlt*100)};
  }

  async function saveTraderProfile(lvl,exp,prof,pl,mem){
    if(!userId)return;
    await apiCall({saveTrader:{id:userId,name:traderName,level:lvl||traderLevel,experience:exp||traderExp,profile:prof||profile,plan:pl||plan,memory:mem||traderMem}});
  }

  async function getAIFeedback(trade){
    setAiLoading(true);setAiFeedback("");
    var lvl=traderLevel==="Novato"?"Feedback educativo y motivador.":traderLevel==="Intermedio"?"Feedback tecnico moderado.":"Feedback avanzado y directo.";
    var p="Eres un coach de trading de elite. "+lvl+"\nAnaliza en espanol (max 180 palabras):\nPar: "+trade.pair+", Dir: "+(trade.dir||trade.direction)+", Resultado: "+trade.result+", PL: $"+trade.pnl+", RR: "+(trade.rr||0)+"\nEmocion: "+trade.emotion+", Siguio el plan: "+(trade.followed?"Si":"No")+", Errores: "+(trade.errors||[]).join(", ")+"\n1) Evaluacion 2) Patron psicologico 3) Tarea concreta.";
    try{var d=await apiCall({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:p}]});setAiFeedback(d.content&&d.content[0]?d.content[0].text:"");}
    catch(e){setAiFeedback("Error al conectar.");}
    setAiLoading(false);
  }

  async function completePendingTrade(trade){
    var updated={id:trade.id,emotion:fillEmotion,followed:fillFollowed,notes:fillNotes,status:"complete"};
    await apiCall({completeTrade:updated});
    var completed=Object.assign({},trade,{emotion:fillEmotion,followed:fillFollowed,notes:fillNotes,status:"complete"});
    setTrades(function(prev){return prev.concat([completed]);});
    setPendingTrades(function(prev){return prev.filter(function(t){return t.id!==trade.id;});});
    setExpandedId(null);setFillEmotion("Calmado");setFillFollowed(true);setFillNotes("");
    await getAIFeedback(completed);
    setPhase("post_trade");
  }

  async function saveTrade(){
    var e=curTrade.entry,sl=curTrade.sl,tp=curTrade.tp;
    var rr=e&&sl&&tp?Math.abs((parseFloat(tp)-parseFloat(e))/(parseFloat(e)-parseFloat(sl))).toFixed(2):0;
    var t=Object.assign({},curTrade,{id:Date.now(),date:new Date().toISOString().split("T")[0],rr:rr,accountId:activeAccId,status:"complete"});
    setTrades(function(prev){return prev.concat([t]);});
    var nm=Object.assign({},traderMem);
    if(!t.followed)nm.planAdherence=(nm.planAdherence||0)+1;
    if((t.errors||[]).some(function(x){return x!=="Ninguno";}))nm.errorsCount=(nm.errorsCount||0)+1;
    if(["Ansioso","Frustrado","Estresado"].indexOf(t.emotion)>=0)nm.emotionalTrades=(nm.emotionalTrades||0)+1;
    setTraderMem(nm);
    if(userId){
      await apiCall({saveTrade:{trader_id:userId,account_id:activeAccId,pair:t.pair,direction:t.dir,entry:t.entry,sl:t.sl,tp:t.tp,result:t.result,pnl:t.pnl,rr:t.rr,emotion:t.emotion,followed:t.followed,errors:t.errors,notes:t.notes,trade_date:t.date,status:"complete"}});
      await saveTraderProfile(null,null,null,null,nm);
    }
    setPhase("post_trade");await getAIFeedback(t);
  }

  async function getWeeklyAI(){
    setWeeklyLoading(true);setWeeklyAI("");
    var st=getStats(accTrades);
    var p="Coach de trading de elite. Trader \""+traderName+"\", nivel "+traderLevel+".\nStats: "+st.total+" trades, "+st.wr+"% WR, PL $"+st.totalPnl+", RR "+st.avgRR+"\nEn espanol (max 220 palabras): 1) Diagnostico 2) Error dominante 3) Un logro 4) Dos objetivos proxima semana.";
    try{var d=await apiCall({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:p}]});setWeeklyAI(d.content&&d.content[0]?d.content[0].text:"");}
    catch(e){setWeeklyAI("Error al conectar.");}
    setWeeklyLoading(false);
  }

  async function sendChat(){
    var msg=chatInput.trim();if(!msg||chatLoading)return;
    var newMsgs=chatMsgs.concat([{role:"user",content:msg}]);
    setChatMsgs(newMsgs);setChatInput("");setChatLoading(true);
    var st=getStats(accTrades);
    var sys="Eres mentor de trading y psicologo del rendimiento. Conoces a "+traderName+", nivel "+traderLevel+".\nStats: "+st.total+" trades, "+st.wr+"% WR, PL $"+st.totalPnl+".\nPerfil: "+(profile?profile.map(function(p){return p.name;}).join(", "):"pendiente")+".\nSe directo, empatico, sabio. Max 200 palabras. Responde siempre en espanol.";
    try{
      var d=await apiCall({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:newMsgs.map(function(m){return{role:m.role,content:m.content};})});
      var reply=d.content&&d.content[0]?d.content[0].text:"Error.";
      var finalMsgs=newMsgs.concat([{role:"assistant",content:reply}]);
      setChatMsgs(finalMsgs);
      if(userId){
        await apiCall({saveMessage:{trader_id:userId,role:"user",content:msg}});
        await apiCall({saveMessage:{trader_id:userId,role:"assistant",content:reply}});
      }
      var nm=Object.assign({},traderMem);
      var lc2=msg.toLowerCase();
      if(lc2.includes("miedo")||lc2.includes("ansiedad"))nm.reportedFear=(nm.reportedFear||0)+1;
      if(lc2.includes("perdi"))nm.reportedLosses=(nm.reportedLosses||0)+1;
      if(lc2.includes("gane"))nm.reportedWins=(nm.reportedWins||0)+1;
      setTraderMem(nm);
    }catch(e){setChatMsgs(newMsgs.concat([{role:"assistant",content:"Error al conectar."}]));}
    setChatLoading(false);
    setTimeout(function(){if(chatInputRef.current)chatInputRef.current.focus();},100);
  }

  async function crearCuenta(){
    if(newAccName.trim()){
      var id=Date.now();
      if(userId){
        var r=await apiCall({saveAccount:{trader_id:userId,name:newAccName.trim(),balance:"10000",type:"Personal",risk_pct:"1",funding:{}}});
        if(r&&r.id)id=r.id;
      }
      setAccounts(function(ac){return ac.concat([makeAcc(id,newAccName.trim())]);});
      setNewAccName("");
      setActiveAccId(id);
    }
  }

  var stats=getStats(accTrades);
  var equity=getEquity();
  var health=checkHealth();
  var posResult=calcPos({market:lc.market,asset:lc.asset,balance:lc.balance,riskPct:lc.riskPct,slMode:lc.slMode,slVal:lc.slVal});
  var weeklyPnlData=getWeeklyPnl();
  var todayData=getTodayPnl();
  var pendingCount=pendingTrades.filter(function(t){return t.accountId===activeAccId||!t.accountId;}).length;
  var recentTrades=accTrades.slice(-5).reverse();

  var wrap={background:DK,minHeight:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",color:TX,maxWidth:980,margin:"0 auto"};

  const NAV_ITEMS=[
    {id:"dashboard",label:"Panel"},
    {id:"pre_trade",label:"Pre-Trade"},
    {id:"during_trade",label:"Operar"},
    {id:"post_trade",label:"Post-Trade"},
    {id:"history",label:pendingCount>0?"Historial ("+pendingCount+")":"Historial"},
    {id:"lot_calc",label:"Calculadora"},
    {id:"funding_rules",label:"Fondeo"},
    {id:"chat",label:"Mentor IA"},
    {id:"accounts",label:"Cuentas"}
  ];

  // ── LOADING ────────────────────────────────────────────────────────────────
  if(loadingData)return(
    <div style={{background:DK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{GCSS}</style>
      <div style={{textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,"+G+","+G2+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:DK,fontWeight:800,margin:"0 auto 20px",animation:"glowPulse 2s infinite"}}>◈</div>
        <div style={{color:G,fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif"}}>Cargando tu diario...</div>
      </div>
    </div>
  );

  // ── ONBOARDING ─────────────────────────────────────────────────────────────
  if(phase==="onboarding")return(
    <div style={{background:DK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <style>{GCSS}</style>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(212,168,67,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.03) 1px,transparent 1px)",backgroundSize:"52px 52px",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:-200,right:-150,width:600,height:600,background:"radial-gradient(circle,rgba(212,168,67,0.08) 0%,transparent 65%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:-150,left:-100,width:400,height:400,background:"radial-gradient(circle,rgba(212,168,67,0.05) 0%,transparent 65%)",pointerEvents:"none"}} />
      <div style={{textAlign:"center",padding:"3rem 2rem",maxWidth:480,position:"relative",zIndex:1,animation:"fadeInUp 0.6s ease both"}}>
        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,"+G+","+G2+")",fontSize:28,color:DK,fontWeight:800,marginBottom:28,boxShadow:"0 8px 40px rgba(212,168,67,0.4)"}}>◈</div>
        <div style={{fontSize:11,letterSpacing:"0.3em",color:G,marginBottom:14,textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700}}>Elite Trading Journal</div>
        <div style={{fontSize:34,color:TX,marginBottom:14,lineHeight:1.2,fontFamily:"'Syne',sans-serif",fontWeight:800}}>Tu diario de trading<br/><span style={{color:G}}>con IA</span></div>
        <div style={{color:TX2,fontSize:14,marginBottom:"2.5rem",lineHeight:1.85}}>Analizamos tu psicología, nivel y experiencia para darte un plan personalizado. Todo queda guardado en la nube.</div>
        <div style={{marginBottom:20,textAlign:"left"}}>
          <Lbl c="¿Cómo quieres que te llame?" />
          <StableInput value={traderName} onChange={function(v){setTraderName(v);}} placeholder="Ej: Juan, El Cóndor, Trader07..." style={{textAlign:"center",fontSize:15,padding:"14px 16px"}} />
        </div>
        <button style={Object.assign({},styBtnP,{width:"100%",padding:"15px",fontSize:15,opacity:traderName.trim()?1:0.35,boxShadow:traderName.trim()?"0 8px 32px rgba(212,168,67,0.3)":"none",borderRadius:12})} onClick={function(){if(traderName.trim())setPhase("level_select");}}>Comenzar evaluación →</button>
        <div style={{marginTop:20,fontSize:12,color:TX3}}>Tus datos se guardan de forma segura · Conectado a MT5</div>
      </div>
    </div>
  );

  // ── LEVEL SELECT ───────────────────────────────────────────────────────────
  if(phase==="level_select")return(
    <div style={Object.assign({},wrap,{padding:"2rem 1.5rem"})}>
      <style>{GCSS}</style>
      <div style={{fontSize:11,letterSpacing:"0.2em",color:G,marginBottom:20,textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700}}>Paso 1 de 2 — Tu perfil, {traderName}</div>
      <div style={styCardG}>
        <div style={{fontSize:15,color:TX,marginBottom:18,fontWeight:600}}>¿Cuál es tu nivel actual como trader?</div>
        {["Novato","Intermedio","Avanzado"].map(function(l){return(<div key={l} onClick={function(){setTraderLevel(l);}} style={{padding:"14px 18px",border:"1px solid "+(traderLevel===l?G:BD),borderRadius:12,marginBottom:10,cursor:"pointer",background:traderLevel===l?"rgba(212,168,67,0.08)":"transparent",transition:"all 0.2s"}}><div style={{color:traderLevel===l?G:TX,fontSize:14,fontWeight:traderLevel===l?600:400}}>{l}</div><div style={{fontSize:12,color:TX2,marginTop:3}}>{LEVEL_DESC[l]}</div></div>);})}
      </div>
      <div style={styCardG}>
        <div style={{fontSize:15,color:TX,marginBottom:18,fontWeight:600}}>¿Cuánto tiempo llevas en el mundo del trading?</div>
        {EXP_OPTS.map(function(e){return(<div key={e} onClick={function(){setTraderExp(e);}} style={{padding:"12px 18px",border:"1px solid "+(traderExp===e?G:BD),borderRadius:12,marginBottom:10,cursor:"pointer",background:traderExp===e?"rgba(212,168,67,0.08)":"transparent",transition:"all 0.2s"}}><div style={{color:traderExp===e?G:TX,fontSize:14,fontWeight:traderExp===e?600:400}}>{e}</div></div>);})}
      </div>
      <button style={Object.assign({},styBtnP,{opacity:traderLevel&&traderExp?1:0.35})} onClick={function(){if(traderLevel&&traderExp)setPhase("quiz");}}>Continuar al diagnóstico psicológico →</button>
    </div>
  );

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if(phase==="quiz"){
    var q=PSY[qIdx];
    return(
      <div style={Object.assign({},wrap,{padding:"1.5rem"})}>
        <style>{GCSS}</style>
        <div style={{fontSize:11,letterSpacing:"0.2em",color:G,marginBottom:12,textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700}}>Diagnóstico — {qIdx+1}/{PSY.length}</div>
        <div style={{height:3,background:S3,borderRadius:2,marginBottom:20}}><div style={{height:3,background:"linear-gradient(to right,"+G+","+G2+")",borderRadius:2,width:((qIdx+1)/PSY.length*100)+"%",transition:"width .4s",boxShadow:"0 0 8px rgba(212,168,67,0.5)"}} /></div>
        <div style={styCardG}>
          <div style={{fontSize:15,color:TX,marginBottom:20,lineHeight:1.7,fontWeight:500}}>{q.text}</div>
          {q.opts.map(function(opt,i){return(<div key={i} onClick={function(){answerQ(String(i));}} style={{padding:"13px 16px",borderRadius:10,border:"1px solid "+BD,marginBottom:9,cursor:"pointer",fontSize:13,color:TX2,transition:"all 0.18s"}} onMouseOver={function(e){e.currentTarget.style.borderColor=G;e.currentTarget.style.color=TX;e.currentTarget.style.background="rgba(212,168,67,0.06)";}} onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=TX2;e.currentTarget.style.background="transparent";}}>{opt}</div>);})}
        </div>
      </div>
    );
  }

  // ── PROFILE RESULT ─────────────────────────────────────────────────────────
  if(phase==="profile_result")return(
    <div style={Object.assign({},wrap,{padding:"1.5rem"})}>
      <style>{GCSS}</style>
      <div style={{fontSize:11,letterSpacing:"0.2em",color:G,marginBottom:8,textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700}}>Perfil de {traderName}</div>
      <div style={{fontSize:13,color:TX2,marginBottom:20}}>Nivel: <span style={{color:G,fontWeight:600}}>{traderLevel}</span> — Exp: <span style={{color:G,fontWeight:600}}>{traderExp}</span></div>
      {profile.map(function(p,i){return(<div key={i} style={Object.assign({},styCard,{borderLeft:"3px solid "+p.color})}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{color:TX,fontSize:14,fontWeight:600}}>{p.name}</span><span style={{padding:"3px 10px",borderRadius:20,background:p.color+"22",color:p.color,fontSize:11}}>{p.level}</span></div><div style={{fontSize:13,color:TX2,lineHeight:1.7}}>{p.desc}</div></div>);})}
      <Divider />
      <div style={styCardG}>
        <div style={{color:G,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Plan personalizado para {traderName}</div>
        {plan.map(function(t,i){return(<div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid "+BD}}><span style={{color:G,fontSize:12,minWidth:18,fontWeight:700}}>{i+1}.</span><span style={{fontSize:13,color:TX2,lineHeight:1.7}}>{t}</span></div>);})}
      </div>
      <button style={styBtnP} onClick={async function(){setPhase("account_setup");await saveTraderProfile(traderLevel,traderExp,profile,plan,traderMem);}}>Configurar mi cuenta →</button>
    </div>
  );

  // ── ACCOUNT SETUP ──────────────────────────────────────────────────────────
  if(phase==="account_setup")return(
    <div style={Object.assign({},wrap,{padding:"1.5rem"})}>
      <style>{GCSS}</style>
      <SecLabel c="Configuracion de cuenta inicial" />
      <div style={styCard}>
        <Lbl c="Como llamar a esta cuenta?" /><StableInput value={activeAcc.name} onChange={function(v){updAcc("name",v);}} style={{marginBottom:12}} placeholder="Ej: Cuenta Principal..." />
        <Lbl c="Saldo inicial (USD)" /><StableInput type="number" value={activeAcc.balance} onChange={function(v){updAcc("balance",v);}} style={{marginBottom:12}} />
        <Lbl c="Tipo de cuenta" /><StableSelect value={activeAcc.type} onChange={function(v){updAcc("type",v);}} style={{marginBottom:12}}><option>Personal</option><option>Empresa de fondeo</option></StableSelect>
        <Lbl c="Riesgo por operacion (%)" /><StableInput type="number" step="0.5" min="0.1" max="10" value={activeAcc.riskPct} onChange={function(v){updAcc("riskPct",v);}} />
        <div style={{marginTop:12,padding:"12px 16px",background:"rgba(0,0,0,0.3)",borderRadius:10,fontSize:13,color:TX2,border:"1px solid "+BD}}>Riesgo por trade: <span style={{color:G,fontWeight:700,fontSize:16}}>${Math.round((parseFloat(activeAcc.balance)||0)*(parseFloat(activeAcc.riskPct)||0)/100)}</span></div>
      </div>
      {activeAcc.type==="Empresa de fondeo"&&(<div style={styCard}><div style={{color:G,fontSize:11,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>Reglas de fondeo</div><Lbl c="Empresa" /><StableInput placeholder="FTMO, The5ers..." value={activeAcc.funding.company} onChange={function(v){updFund("company",v);}} style={{marginBottom:12}} /><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><Lbl c="Max DD diario ($)" /><StableInput type="number" value={activeAcc.funding.maxDailyDD} onChange={function(v){updFund("maxDailyDD",v);}} /></div><div><Lbl c="Max DD total ($)" /><StableInput type="number" value={activeAcc.funding.maxTotalDD} onChange={function(v){updFund("maxTotalDD",v);}} /></div><div style={{marginTop:10}}><Lbl c="Profit target ($)" /><StableInput type="number" value={activeAcc.funding.profitTarget} onChange={function(v){updFund("profitTarget",v);}} /></div><div style={{marginTop:10}}><Lbl c="Dias minimos" /><StableInput type="number" value={activeAcc.funding.minDays} onChange={function(v){updFund("minDays",v);}} /></div></div><div style={{marginTop:12}}><Lbl c="Reglas adicionales" /><StableTextarea style={{height:70}} value={activeAcc.funding.extraRules} onChange={function(v){updFund("extraRules",v);}} placeholder="No operar NFP, max 5 trades/dia..." /></div></div>)}
      <button style={styBtnP} onClick={async function(){if(userId){var r=await apiCall({saveAccount:{trader_id:userId,name:activeAcc.name,balance:activeAcc.balance,type:activeAcc.type,risk_pct:activeAcc.riskPct,funding:activeAcc.funding}});if(r&&r.id)setActiveAccId(r.id);}setPhase("dashboard");}}>Entrar al diario →</button>
    </div>
  );

  // ── MAIN APP SHELL ─────────────────────────────────────────────────────────
  return(
    <div style={wrap}>
      <style>{GCSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"linear-gradient(rgba(212,168,67,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.025) 1px,transparent 1px)",backgroundSize:"52px 52px"}} />
      <div style={{position:"fixed",top:-180,right:-120,width:480,height:480,background:"radial-gradient(circle,rgba(212,168,67,0.06) 0%,transparent 68%)",pointerEvents:"none",zIndex:0}} />

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(7,7,10,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+BD}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px 6px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,"+G+","+G2+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:DK,fontWeight:800,flexShrink:0}}>◈</div>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:TX,letterSpacing:"0.06em",fontFamily:"'Syne',sans-serif",lineHeight:1.1}}>ELITE TRADING</div>
              <div style={{fontSize:9,color:G,letterSpacing:"0.2em",fontFamily:"'Syne',sans-serif"}}>JOURNAL PRO</div>
            </div>
            <div style={{marginLeft:6,fontSize:13,color:TX2}}>· {traderName} <span style={{fontSize:11,color:TX3}}>({traderLevel})</span></div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            {accounts.map(function(a){return <button key={a.id} onClick={function(){setActiveAccId(a.id);}} style={{padding:"4px 12px",borderRadius:20,border:"1px solid "+(activeAccId===a.id?G:BD),background:activeAccId===a.id?"rgba(212,168,67,0.12)":"transparent",color:activeAccId===a.id?G:TX3,fontSize:10,cursor:"pointer",transition:"all 0.2s"}}>{a.name}</button>;})}
            <button onClick={async function(){await supabase.auth.signOut();}} style={{padding:"4px 12px",borderRadius:20,border:"1px solid rgba(248,113,113,0.3)",background:"rgba(248,113,113,0.08)",color:RED,fontSize:10,cursor:"pointer"}}>Salir</button>
          </div>
        </div>
        <div style={{display:"flex",gap:2,flexWrap:"wrap",padding:"0 16px",overflowX:"auto"}}>
          {NAV_ITEMS.map(function(n){
            var isPending=n.id==="history"&&pendingCount>0;
            return <button key={n.id} style={{padding:"7px 12px",borderRadius:"10px 10px 0 0",border:"1px solid "+(phase===n.id?BD2:"transparent"),borderBottom:"none",background:phase===n.id?S2:"transparent",color:phase===n.id?G:isPending?G:TX2,cursor:"pointer",fontSize:11,whiteSpace:"nowrap",transition:"all 0.2s",fontWeight:phase===n.id||isPending?"600":"400"}} onClick={function(){setPhase(n.id);}}>{n.label}{isPending&&<span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:G,marginLeft:5,verticalAlign:"middle",boxShadow:"0 0 5px "+G}} />}</button>;
          })}
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{padding:"1.5rem 1.5rem 3rem",position:"relative",zIndex:1}}>

        {/* ── DASHBOARD ── */}
        {phase==="dashboard"&&(
          <div>
            {/* Row 1: Quote + Today card */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 200px",gap:14,marginBottom:16}}>
              <QuoteRotator />
              <div style={{background:"linear-gradient(135deg,rgba(212,168,67,0.1),rgba(212,168,67,0.03))",border:"1px solid "+BD2,borderRadius:14,padding:"18px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,textAlign:"center"}}>
                <div style={{fontSize:10,color:G,textTransform:"uppercase",letterSpacing:"0.2em",fontFamily:"'Syne',sans-serif",fontWeight:700}}>Hoy</div>
                <div style={{fontSize:30,fontWeight:800,color:todayData.pnl>=0?GREEN:RED,fontFamily:"monospace",letterSpacing:"-0.02em"}}>{todayData.pnl>=0?"+":"-"}${Math.abs(todayData.pnl)}</div>
                <div style={{fontSize:11,color:TX2}}>{todayData.trades} trades · {todayData.wins}W {todayData.losses}L</div>
                <button onClick={function(){setPhase("pre_trade");}} style={{marginTop:4,padding:"9px 18px",borderRadius:10,background:"linear-gradient(135deg,"+G+","+G2+")",color:DK,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(212,168,67,0.3)",width:"100%",transition:"transform 0.2s"}}
                  onMouseEnter={function(e){e.currentTarget.style.transform="scale(1.03)";}}
                  onMouseLeave={function(e){e.currentTarget.style.transform="scale(1)";}}>+ Nuevo Trade</button>
              </div>
            </div>

            {/* Pending alert */}
            {pendingCount>0&&<div style={{...styCard,borderLeft:"3px solid "+G,padding:"12px 18px",marginBottom:14,cursor:"pointer",background:"rgba(212,168,67,0.04)"}} onClick={function(){setPhase("history");}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><span style={{color:G,fontSize:13,fontWeight:600}}>{pendingCount} trade{pendingCount>1?"s":""} pendiente{pendingCount>1?"s":""} de completar</span><div style={{fontSize:11,color:TX2,marginTop:2}}>Ir al historial para llenar los datos post-trade</div></div>
                <span style={{color:G,fontSize:20}}>›</span>
              </div>
            </div>}

            {/* Row 2: Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[
                {v:stats.wr+"%",l:"Win rate",c:G,icon:"🎯",sub:"Esta cuenta"},
                {v:(stats.totalPnl>=0?"$":"-$")+Math.abs(stats.totalPnl),l:"P&L total",c:stats.totalPnl>=0?GREEN:RED,icon:"💰",sub:"Todos los trades"},
                {v:stats.total,l:"Trades",c:"#A78BFA",icon:"📊",sub:"Este mes"},
                {v:stats.avgRR+"R",l:"RR promedio",c:"#60A5FA",icon:"⚡",sub:"Risk/Reward"}
              ].map(function(m,i){
                return <div key={i} style={{background:S2,border:"1px solid "+BD,borderRadius:14,padding:"16px 18px",position:"relative",overflow:"hidden",transition:"transform 0.2s,border-color 0.2s",cursor:"default"}}
                  onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=m.c+"55";}}
                  onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=BD;}}>
                  <div style={{position:"absolute",top:0,right:0,width:"55%",height:"100%",background:"radial-gradient(ellipse at top right,"+m.c+"12 0%,transparent 70%)",pointerEvents:"none"}} />
                  <div style={{fontSize:18,marginBottom:6}}>{m.icon}</div>
                  <div style={{fontSize:26,color:m.c,fontFamily:"monospace",fontWeight:700,letterSpacing:"-0.02em"}}>{m.v}</div>
                  <div style={{fontSize:10,color:TX2,marginTop:4,letterSpacing:"0.1em",textTransform:"uppercase"}}>{m.l}</div>
                  <div style={{fontSize:10,color:TX3,marginTop:2}}>{m.sub}</div>
                </div>;
              })}
            </div>

            {/* Streak */}
            {stats.streak>1&&<div style={{...styCard,borderLeft:"3px solid "+(stats.sType==="Win"?GREEN:RED),padding:"12px 18px",marginBottom:14,background:stats.sType==="Win"?"rgba(74,222,128,0.04)":"rgba(248,113,113,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:stats.sType==="Win"?GREEN:RED,boxShadow:"0 0 8px "+(stats.sType==="Win"?GREEN:RED),flexShrink:0}} />
                <span style={{fontSize:13,color:TX2}}>Racha actual: <span style={{color:stats.sType==="Win"?GREEN:RED,fontWeight:600}}>{stats.streak} {stats.sType==="Win"?"wins consecutivos":"losses consecutivos"}</span></span>
                {stats.sType==="Loss"&&stats.streak>=2&&<span style={{fontSize:11,color:RED}}>· Considera pausar el día</span>}
              </div>
            </div>}

            {/* Row 3: Charts side by side */}
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14,marginBottom:14}}>
              {/* Equity curve */}
              <div style={styCard}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div>
                    <div style={{fontSize:11,color:G,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Curva de equity</div>
                    <div style={{fontSize:11,color:TX3,marginTop:2}}>Todos los trades</div>
                  </div>
                  {equity.length>0&&<div style={{padding:"3px 12px",borderRadius:20,background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.2)",fontSize:11,color:GREEN,fontFamily:"monospace"}}>
                    {(((equity[equity.length-1]?.balance-(parseFloat(activeAcc.balance)||10000))/(parseFloat(activeAcc.balance)||10000))*100).toFixed(1)}%
                  </div>}
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={[{name:"Inicio",balance:parseFloat(activeAcc.balance)||10000}].concat(equity)}>
                    <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={G} stopOpacity={0.25}/><stop offset="95%" stopColor={G} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false}/><XAxis dataKey="name" tick={{fontSize:10,fill:TX2}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:TX2}} domain={["auto","auto"]} axisLine={false} tickLine={false}/>
                    <Tooltip formatter={function(v){return "$"+v;}} contentStyle={{background:S3,border:"1px solid "+BD,borderRadius:10,fontSize:11,color:TX}}/>
                    <Area type="monotone" dataKey="balance" stroke={G} fill="url(#gg)" strokeWidth={2} dot={{fill:G,r:3,strokeWidth:0}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* PnL semanal */}
              <div style={styCard}>
                <div style={{fontSize:11,color:G,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:4}}>PnL por día</div>
                <div style={{fontSize:11,color:TX3,marginBottom:14}}>Esta semana</div>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={weeklyPnlData} margin={{top:5,right:5,bottom:0,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false}/>
                    <XAxis dataKey="day" tick={{fontSize:10,fill:TX2}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:TX2}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{background:S3,border:"1px solid "+BD,borderRadius:8,fontSize:11,color:TX}} formatter={function(v){return ["$"+v,"PnL"];}}/>
                    <Bar dataKey="pnl" radius={[4,4,0,0]}>
                      {weeklyPnlData.map(function(entry,index){return <Cell key={index} fill={entry.pnl>=0?GREEN:RED} opacity={0.85}/>;}) }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 4: Recent trades + Streak/Fondeo */}
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14,marginBottom:14}}>
              {/* Trades recientes */}
              <div style={styCard}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:11,color:G,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Trades Recientes</div>
                  <button onClick={function(){setPhase("history");}} style={{fontSize:11,color:TX2,background:"none",border:"none",cursor:"pointer"}}>Ver todos →</button>
                </div>
                {recentTrades.length===0&&<div style={{fontSize:13,color:TX3,textAlign:"center",padding:"1.5rem 0",fontStyle:"italic"}}>Aún no hay trades registrados.</div>}
                {recentTrades.map(function(t,i){
                  var isWin=t.result==="Win";var col=isWin?GREEN:t.result==="Loss"?RED:ORANGE;
                  return <div key={t.id||i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,cursor:"default",borderBottom:"1px solid "+BD,transition:"background 0.2s"}}
                    onMouseEnter={function(e){e.currentTarget.style.background=S3;}}
                    onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:col,boxShadow:"0 0 7px "+col,flexShrink:0}} />
                      <span style={{fontSize:13,color:TX,fontFamily:"monospace",fontWeight:500}}>{t.pair}</span>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:t.dir==="Long"?"rgba(74,222,128,0.12)":"rgba(248,113,113,0.12)",color:t.dir==="Long"?GREEN:RED}}>{t.dir||t.direction}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:16}}>
                      {t.emotion&&<span style={{fontSize:11,color:TX2}}>{t.emotion}</span>}
                      {t.rr&&<span style={{fontSize:11,color:TX2,fontFamily:"monospace"}}>{t.rr}R</span>}
                      <span style={{fontSize:13,fontFamily:"monospace",fontWeight:600,color:col}}>{isWin?"+":"-"}${Math.abs(parseFloat(t.pnl)||0)}</span>
                    </div>
                  </div>;
                })}
              </div>

              {/* Racha + Fondeo */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {stats.streak>1&&<div style={{background:"linear-gradient(135deg,"+S2+",rgba(74,222,128,0.05))",border:"1px solid rgba(74,222,128,0.2)",borderRadius:14,padding:"18px 20px"}}>
                  <div style={{fontSize:10,color:stats.sType==="Win"?GREEN:RED,textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:10}}>Racha actual</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:36,fontWeight:800,color:stats.sType==="Win"?GREEN:RED,fontFamily:"monospace"}}>{stats.streak}{stats.sType==="Win"?"W":"L"}</div>
                    <div>
                      <div style={{fontSize:13,color:TX,fontWeight:500}}>{stats.sType==="Win"?"Wins":"Losses"} consecutivos</div>
                      <div style={{fontSize:11,color:TX2,marginTop:2}}>{stats.sType==="Win"?"Mantén el plan ✓":"Considera pausar ⚠"}</div>
                    </div>
                  </div>
                </div>}
                {health&&<div style={Object.assign({},styCard,{flex:1,marginBottom:0})}>
                  <div style={{fontSize:10,color:G,textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:14}}>Salud Fondeo — {activeAcc.funding.company}</div>
                  {[{l:"DD Diario",u:health.du,lim:health.dl,p:health.dp},{l:"DD Total",u:health.tl,lim:health.tlt,p:health.tp}].map(function(h){
                    var hc=h.p>80?RED:h.p>50?ORANGE:GREEN;
                    return <div key={h.l} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:TX2}}>{h.l}</span><span style={{fontSize:12,color:hc,fontFamily:"monospace"}}>${h.u} / ${h.lim}</span></div>
                      <div style={{height:5,background:S3,borderRadius:3}}><div style={{height:5,borderRadius:3,background:hc,width:Math.min(100,h.p)+"%",transition:"width .6s",boxShadow:"0 0 6px "+hc+"66"}}/></div>
                      <div style={{fontSize:10,color:TX3,marginTop:3}}>{h.p}% utilizado{h.p>80?" — PELIGRO ⚠":""}</div>
                    </div>;
                  })}
                  {activeAcc.funding.profitTarget&&<div style={{padding:"8px 12px",borderRadius:8,background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.15)",fontSize:11,color:GREEN}}>✓ Profit target: ${Math.max(0,stats.totalPnl)} / ${activeAcc.funding.profitTarget} ({Math.round(Math.max(0,stats.totalPnl)/parseFloat(activeAcc.funding.profitTarget)*100)}%)</div>}
                </div>}
              </div>
            </div>

            {/* Weekly AI */}
            <div style={styCard}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:11,color:G,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Análisis semanal — Mentor IA</div>
                <button style={styBtn} onClick={getWeeklyAI}>{weeklyLoading?"Analizando...":"Analizar semana"}</button>
              </div>
              {weeklyAI?<div style={{fontSize:14,color:TX2,lineHeight:1.9,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",fontStyle:"italic"}}>{weeklyAI}</div>:<div style={{fontSize:13,color:TX3,fontStyle:"italic"}}>Haz clic para obtener tu resumen inteligente de la semana.</div>}
            </div>
          </div>
        )}

        {/* ── PRE TRADE ── */}
        {phase==="pre_trade"&&(
          <div>
            <SecLabel c="Preparacion pre-trading" />
            <div style={styCard}>
              <Lbl c="Estado emocional (1=muy mal / 10=peak)" />
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <input type="range" min={1} max={10} step={1} value={preTrade.mood} onChange={function(e){setPreTrade(function(p){return Object.assign({},p,{mood:parseInt(e.target.value)});});}} style={{flex:1,accentColor:G}}/>
                <span style={{fontSize:22,color:G,minWidth:24,fontFamily:"monospace",fontWeight:700}}>{preTrade.mood}</span>
                <span style={{fontSize:11,color:preTrade.mood>=7?GREEN:preTrade.mood>=4?ORANGE:RED,fontWeight:600}}>{preTrade.mood>=8?"PEAK":preTrade.mood>=6?"BIEN":preTrade.mood>=4?"REGULAR":"NO OPERAR"}</span>
              </div>
              {preTrade.mood<5&&<div style={{padding:"10px 14px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:10,color:RED,fontSize:12,marginBottom:12}}>Estado emocional bajo. Operar hoy pone en riesgo tu capital.</div>}
              <Divider />
              <Lbl c="Sesion de mercado" /><StableSelect value={preTrade.session} onChange={function(v){setPreTrade(function(p){return Object.assign({},p,{session:v});});}} style={{marginBottom:12}}><option value="">Seleccionar...</option>{SESSIONS.map(function(s){return <option key={s}>{s}</option>;})}</StableSelect>
              <Lbl c="Bias del dia" />
              <div style={{display:"flex",gap:8,marginBottom:12}}>{["Alcista","Bajista","Neutral"].map(function(b){return <button key={b} onClick={function(){setPreTrade(function(p){return Object.assign({},p,{bias:b});});}} style={Object.assign({},styBtn,{flex:1,borderColor:preTrade.bias===b?G:BD,color:preTrade.bias===b?G:TX2,background:preTrade.bias===b?"rgba(212,168,67,0.08)":"transparent"})}>{b}</button>;})}</div>
              <Lbl c="Niveles clave" /><StableInput style={{marginBottom:12}} placeholder="Soporte 1.0820, Resistencia 1.0900..." value={preTrade.levels} onChange={function(v){setPreTrade(function(p){return Object.assign({},p,{levels:v});});}} />
              <Lbl c="Plan del dia" /><StableTextarea style={{height:80}} placeholder="Describe tu plan para esta sesion..." value={preTrade.plan_text} onChange={function(v){setPreTrade(function(p){return Object.assign({},p,{plan_text:v});});}} />
            </div>
            <button style={styBtnP} onClick={function(){setSavedPre(true);setPhase("during_trade");}}>Guardar y empezar a operar →</button>
          </div>
        )}

        {/* ── DURING TRADE ── */}
        {phase==="during_trade"&&(
          <div>
            <SecLabel c="Registrar operacion" />
            {savedPre&&<div style={Object.assign({},styCard,{borderLeft:"3px solid "+G,padding:"10px 16px",fontSize:12,marginBottom:14,background:"rgba(212,168,67,0.04)"})}><span style={{color:G,fontWeight:600}}>Plan activo</span><span style={{color:TX2,marginLeft:10}}>Bias: {preTrade.bias} — {preTrade.session} — Estado: {preTrade.mood}/10</span></div>}
            <div style={styCard}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><Lbl c="Activo / Par" /><StableSelect value={curTrade.pair} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{pair:v});});}}><option value="">Seleccionar...</option>{ALL_PAIRS.map(function(p){return <option key={p}>{p}</option>;})}</StableSelect></div>
                <div><Lbl c="Direccion" /><div style={{display:"flex",gap:8}}>{["Long","Short"].map(function(d){var isActive=curTrade.dir===d;var col=d==="Long"?GREEN:RED;return <button key={d} onClick={function(){setCurTrade(function(t){return Object.assign({},t,{dir:d});});}} style={Object.assign({},styBtn,{flex:1,borderColor:isActive?col:BD,color:isActive?col:TX2,background:isActive?(d==="Long"?"rgba(74,222,128,0.08)":"rgba(248,113,113,0.08)"):"transparent"})}>{d}</button>;})}</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
                <div><Lbl c="Entrada" /><StableInput type="number" step="any" placeholder="0.00" value={curTrade.entry} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{entry:v});});}} /></div>
                <div><Lbl c="RR estimado" /><div style={{padding:"10px 14px",background:"rgba(0,0,0,0.4)",borderRadius:10,fontSize:16,color:G,border:"1px solid "+BD,fontFamily:"monospace",fontWeight:700}}>{curTrade.entry&&curTrade.sl&&curTrade.tp?Math.abs((parseFloat(curTrade.tp)-parseFloat(curTrade.entry))/(parseFloat(curTrade.entry)-parseFloat(curTrade.sl))).toFixed(2)+"R":"—"}</div></div>
                <div style={{marginTop:10}}><Lbl c="Stop Loss" /><StableInput type="number" step="any" placeholder="0.00" value={curTrade.sl} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{sl:v});});}} /></div>
                <div style={{marginTop:10}}><Lbl c="Take Profit" /><StableInput type="number" step="any" placeholder="0.00" value={curTrade.tp} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{tp:v});});}} /></div>
                <div style={{marginTop:10}}><Lbl c="Resultado" /><StableSelect value={curTrade.result} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{result:v});});}}><option value="">Seleccionar...</option><option>Win</option><option>Loss</option><option>BE</option></StableSelect></div>
                <div style={{marginTop:10}}><Lbl c="P&L ($)" /><StableInput type="number" placeholder="0" value={curTrade.pnl} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{pnl:v});});}} /></div>
              </div>
              <Divider />
              <Lbl c="Emocion durante el trade" />
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{EMOTIONS.map(function(em){return <button key={em} onClick={function(){setCurTrade(function(t){return Object.assign({},t,{emotion:em});});}} style={Object.assign({},styBtn,{padding:"5px 12px",fontSize:11,borderColor:curTrade.emotion===em?G:BD,color:curTrade.emotion===em?G:TX2,background:curTrade.emotion===em?"rgba(212,168,67,0.08)":"transparent"})}>{em}</button>;})}</div>
              <Lbl c="Seguiste el plan?" />
              <div style={{display:"flex",gap:8,marginBottom:14}}>{[true,false].map(function(v){return <button key={String(v)} onClick={function(){setCurTrade(function(t){return Object.assign({},t,{followed:v});});}} style={Object.assign({},styBtn,{borderColor:curTrade.followed===v?G:BD,color:curTrade.followed===v?G:TX2,background:curTrade.followed===v?"rgba(212,168,67,0.08)":"transparent"})}>{v?"Si":"No"}</button>;})}</div>
              <Lbl c="Errores cometidos" />
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{ERRORS.map(function(err){var isActive=(curTrade.errors||[]).includes(err);return <button key={err} onClick={function(){setCurTrade(function(t){var e=t.errors||[];return Object.assign({},t,{errors:e.includes(err)?e.filter(function(x){return x!==err;}):[].concat(e,[err])});});}} style={Object.assign({},styBtn,{padding:"5px 12px",fontSize:11,borderColor:isActive?G:BD,color:isActive?G:TX2,background:isActive?"rgba(212,168,67,0.08)":"transparent"})}>{err}</button>;})}</div>
              <Lbl c="Notas" /><StableTextarea style={{height:60}} placeholder="Que observaste?" value={curTrade.notes} onChange={function(v){setCurTrade(function(t){return Object.assign({},t,{notes:v});});}} />
            </div>
            <button style={Object.assign({},styBtnP,{opacity:curTrade.pair&&curTrade.result?1:0.35})} onClick={function(){if(curTrade.pair&&curTrade.result)saveTrade();}}>Guardar y obtener análisis IA →</button>
          </div>
        )}

        {/* ── POST TRADE ── */}
        {phase==="post_trade"&&(
          <div>
            <SecLabel c="Analisis post-trade" />
            {aiLoading&&<div style={Object.assign({},styCardG,{textAlign:"center",padding:"2.5rem"})}><div style={{color:TX2,fontSize:13,letterSpacing:"0.12em"}}>Tu mentor está analizando la operación...</div></div>}
            {aiFeedback&&!aiLoading&&<div style={Object.assign({},styCardG,{borderLeft:"3px solid "+G})}><div style={{fontSize:11,color:G,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Análisis de tu mentor</div><div style={{fontSize:14,color:TX2,lineHeight:1.9,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",fontStyle:"italic"}}>{aiFeedback}</div></div>}
            <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
              <button style={styBtnP} onClick={function(){setCurTrade({pair:"",dir:"Long",entry:"",sl:"",tp:"",result:"",pnl:"",emotion:"Calmado",followed:true,errors:[],notes:""});setPhase("during_trade");}}>Registrar otra operación</button>
              <button style={styBtn} onClick={function(){setPhase("dashboard");}}>Ver panel</button>
              <button style={styBtn} onClick={function(){setPhase("chat");}}>Hablar con mentor</button>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {phase==="history"&&(
          <div>
            <SecLabel c={"Historial — "+activeAcc.name} />
            {pendingCount>0&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,color:G,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Trades pendientes de completar ({pendingCount})</div>
                {pendingTrades.map(function(t){
                  var isExpanded=expandedId===t.id;
                  var col=t.result==="Win"?G:t.result==="Loss"?RED:ORANGE;
                  return(
                    <div key={t.id} style={{marginBottom:10}}>
                      <div onClick={function(){setExpandedId(isExpanded?null:t.id);setFillEmotion("Calmado");setFillFollowed(true);setFillNotes("");}} style={{...styCard,borderLeft:"3px solid "+G,cursor:"pointer",marginBottom:0,background:isExpanded?"rgba(212,168,67,0.04)":S2}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(212,168,67,0.15)",color:G,fontSize:10,letterSpacing:"0.06em",fontWeight:600}}>PENDIENTE</span>
                            <span style={{fontSize:14,color:TX,fontWeight:500}}>{t.pair}</span>
                            <span style={{fontSize:12,color:t.dir==="Long"?GREEN:RED}}>{t.dir||t.direction}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{color:col,fontSize:13,fontFamily:"monospace",fontWeight:600}}>${t.pnl}</span>
                            <span style={{color:TX3,fontSize:16}}>{isExpanded?"▲":"▼"}</span>
                          </div>
                        </div>
                        <div style={{fontSize:11,color:TX2,marginTop:4}}>{t.date} — Entrada: {t.entry} — Salida: {t.exit_price} — {t.lot_size} lots — {t.duration}</div>
                      </div>
                      {isExpanded&&(
                        <div style={{...styCardG,borderRadius:"0 0 12px 12px",borderTop:"none",marginTop:0}}>
                          <Lbl c="Como te sentiste durante el trade?" />
                          <StableSelect value={fillEmotion} onChange={function(v){setFillEmotion(v);}} style={{marginBottom:12}}>
                            {EMOTIONS.map(function(em){return <option key={em}>{em}</option>;})}
                          </StableSelect>
                          <Lbl c="Seguiste tu plan de trading?" />
                          <div style={{display:"flex",gap:8,marginBottom:12}}>
                            {[true,false].map(function(v){return <button key={String(v)} onClick={function(){setFillFollowed(v);}} style={Object.assign({},styBtn,{flex:1,borderColor:fillFollowed===v?G:BD,color:fillFollowed===v?G:TX2,background:fillFollowed===v?"rgba(212,168,67,0.08)":"transparent"})}>{v?"Si":"No"}</button>;})}
                          </div>
                          <Lbl c="Comentario (opcional)" />
                          <StableTextarea style={{height:60,marginBottom:12}} placeholder="Que observaste en este trade?" value={fillNotes} onChange={function(v){setFillNotes(v);}}/>
                          <button style={Object.assign({},styBtnP,{width:"100%"})} onClick={function(){completePendingTrade(t);}}>Guardar y obtener análisis IA →</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <Divider />
              </div>
            )}
            {accTrades.length===0&&pendingCount===0&&<div style={{fontSize:13,color:TX3,textAlign:"center",padding:"2rem",fontStyle:"italic"}}>No hay operaciones en esta cuenta aún.</div>}
            {accTrades.slice().reverse().map(function(t){
              var col=t.result==="Win"?G:t.result==="Loss"?RED:ORANGE;
              return(
                <div key={t.id} style={Object.assign({},styCard,{borderLeft:"3px solid "+col})}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:14,color:TX,fontWeight:500}}>{t.pair} <span style={{fontSize:12,color:TX2,fontWeight:400}}>{t.dir||t.direction}</span></div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{padding:"3px 10px",borderRadius:20,background:col+"22",color:col,fontSize:11,fontWeight:600}}>{t.result}</span>
                      <span style={{color:t.result==="Win"?GREEN:RED,fontSize:14,fontFamily:"monospace",fontWeight:700}}>{t.result==="Win"?"+":"-"}${Math.abs(parseFloat(t.pnl)||0)}</span>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:TX2}}>{t.date}{t.exit_price?" — Salida: "+t.exit_price:""}{t.lot_size?" — "+t.lot_size+" lots":""}{t.duration?" — "+t.duration:""}{t.emotion?" — "+t.emotion:""}{t.followed!==undefined?" — "+(t.followed?"Siguió el plan":"No siguió el plan"):""}</div>
                  {t.notes&&<div style={{fontSize:11,color:TX2,marginTop:4,fontStyle:"italic"}}>{t.notes}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── LOT CALCULATOR ── */}
        {phase==="lot_calc"&&(
          <div>
            <SecLabel c="Calculadora de tamano de posicion" />
            <div style={styCard}>
              <Lbl c="Mercado" />
              <div style={{display:"flex",gap:8,marginBottom:14}}>{["Forex/CFD","Futuros","Crypto"].map(function(m){return <button key={m} onClick={function(){setLc(function(l){return Object.assign({},l,{market:m,asset:m==="Futuros"?Object.keys(FUTURES)[0]:m==="Forex/CFD"?Object.keys(FOREX)[0]:CRYPTO_LIST[0],slMode:m==="Futuros"?"puntos":"pips",slVal:"20"});});}} style={Object.assign({},styBtn,{flex:1,borderColor:lc.market===m?G:BD,color:lc.market===m?G:TX2,background:lc.market===m?"rgba(212,168,67,0.1)":"transparent",fontSize:12})}>{m}</button>;})}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div><Lbl c="Activo" /><StableSelect value={lc.asset} onChange={function(v){setLc(function(l){return Object.assign({},l,{asset:v});});}}>
                  {lc.market==="Futuros"&&Object.keys(FUTURES).map(function(k){return <option key={k}>{k}</option>;})}
                  {lc.market==="Forex/CFD"&&Object.keys(FOREX).map(function(k){return <option key={k}>{k}</option>;})}
                  {lc.market==="Crypto"&&CRYPTO_LIST.map(function(k){return <option key={k}>{k}</option>;})}
                </StableSelect></div>
                {lc.market==="Futuros"&&FUTURES[lc.asset]&&<div style={{padding:"10px 14px",background:"rgba(0,0,0,0.3)",borderRadius:10,border:"1px solid "+BD,fontSize:11,color:TX2,display:"flex",flexDirection:"column",justifyContent:"center"}}><div style={{color:G,marginBottom:2,fontWeight:600}}>{FUTURES[lc.asset].note}</div><div>${FUTURES[lc.asset].dpp}/punto — tick ${FUTURES[lc.asset].tv}</div></div>}
                {lc.market==="Forex/CFD"&&<div style={{padding:"10px 14px",background:"rgba(0,0,0,0.3)",borderRadius:10,border:"1px solid "+BD,fontSize:11,color:TX2,display:"flex",flexDirection:"column",justifyContent:"center"}}><div style={{color:G,marginBottom:2,fontWeight:600}}>Valor del pip (1 lot)</div><div>${(FOREX[lc.asset]||{pv:10}).pv} por pip por lote</div></div>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div><Lbl c="Balance ($)" /><StableInput type="number" value={lc.balance} onChange={function(v){setLc(function(l){return Object.assign({},l,{balance:v});});}} /></div>
                <div><Lbl c="Riesgo (%)" /><StableInput type="number" step="0.5" min="0.1" max="10" value={lc.riskPct} onChange={function(v){setLc(function(l){return Object.assign({},l,{riskPct:v});});}} /></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <div><Lbl c="Medir SL en" /><StableSelect value={lc.slMode} onChange={function(v){setLc(function(l){return Object.assign({},l,{slMode:v});}); }}>
                  {lc.market==="Futuros"&&<><option value="puntos">Puntos</option><option value="ticks">Ticks</option><option value="usd">USD ($)</option></>}
                  {lc.market==="Forex/CFD"&&<><option value="pips">Pips</option><option value="puntos">Puntos</option><option value="usd">USD ($)</option></>}
                  {lc.market==="Crypto"&&<option value="usd">USD por unidad</option>}
                </StableSelect></div>
                <div><Lbl c={"SL en "+lc.slMode} /><StableInput type="number" step="any" value={lc.slVal} onChange={function(v){setLc(function(l){return Object.assign({},l,{slVal:v});});}} /></div>
              </div>
              <div style={{padding:"20px",background:"rgba(0,0,0,0.35)",borderRadius:12,border:"1px solid "+BD2,textAlign:"center",marginBottom:14}}>
                {lc.market==="Futuros"&&<div><div style={{fontSize:11,color:TX2,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Contratos recomendados</div><div style={{fontSize:40,color:G,fontFamily:"monospace",fontWeight:700}}>{posResult.contracts||0}</div><div style={{fontSize:11,color:TX2,marginTop:4}}>Riesgo por contrato: ${posResult.rpc||0} — Stop: {posResult.pts||0} pts<br/>Riesgo total: <span style={{color:G,fontWeight:600}}>${posResult.total||0}</span></div></div>}
                {lc.market==="Forex/CFD"&&<div><div style={{fontSize:11,color:TX2,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Tamaño de posición</div><div style={{fontSize:40,color:G,fontFamily:"monospace",fontWeight:700}}>{posResult.lots||0} <span style={{fontSize:18}}>lots</span></div><div style={{fontSize:11,color:TX2,marginTop:4}}>Valor del pip: ${posResult.pvpl||0}/pip — Stop: {posResult.pips||0} pips<br/>Riesgo real: <span style={{color:G,fontWeight:600}}>${posResult.total||0}</span></div></div>}
                {lc.market==="Crypto"&&<div><div style={{fontSize:11,color:TX2,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Unidades</div><div style={{fontSize:40,color:G,fontFamily:"monospace",fontWeight:700}}>{posResult.units||0}</div><div style={{fontSize:11,color:TX2,marginTop:4}}>Riesgo total: <span style={{color:G,fontWeight:600}}>${posResult.total||0}</span></div></div>}
              </div>
              <div style={{fontSize:11,color:TX2,letterSpacing:"0.1em",marginBottom:10,textTransform:"uppercase",fontWeight:600}}>Tabla de riesgo rápido</div>
              {[0.5,1,1.5,2].map(function(r){var res=calcPos({market:lc.market,asset:lc.asset,balance:lc.balance,riskPct:String(r),slMode:lc.slMode,slVal:lc.slVal});return(<div key={r} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+BD,fontSize:12}}><span style={{color:TX2}}>{r}% — ${Math.round((parseFloat(lc.balance)||0)*r/100)}</span><span style={{color:TX}}>{lc.market==="Futuros"&&((res.contracts||0)+" contratos")}{lc.market==="Forex/CFD"&&((res.lots||0)+" lots")}{lc.market==="Crypto"&&((res.units||0)+" unidades")}<span style={{color:G,marginLeft:8,fontFamily:"monospace",fontWeight:600}}>${Math.round((parseFloat(lc.balance)||0)*r/100)}</span></span></div>);})}
            </div>
          </div>
        )}

        {/* ── FUNDING RULES ── */}
        {phase==="funding_rules"&&(
          <div>
            <SecLabel c={"Fondeo — "+activeAcc.name} />
            <div style={styCard}>
              <Lbl c="Empresa" /><StableInput style={{marginBottom:12}} placeholder="FTMO, The5ers..." value={activeAcc.funding.company} onChange={function(v){updFund("company",v);}} />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><Lbl c="Max DD diario ($)" /><StableInput type="number" value={activeAcc.funding.maxDailyDD} onChange={function(v){updFund("maxDailyDD",v);}} /></div>
                <div><Lbl c="Max DD total ($)" /><StableInput type="number" value={activeAcc.funding.maxTotalDD} onChange={function(v){updFund("maxTotalDD",v);}} /></div>
                <div style={{marginTop:10}}><Lbl c="Profit target ($)" /><StableInput type="number" value={activeAcc.funding.profitTarget} onChange={function(v){updFund("profitTarget",v);}} /></div>
                <div style={{marginTop:10}}><Lbl c="Dias minimos" /><StableInput type="number" value={activeAcc.funding.minDays} onChange={function(v){updFund("minDays",v);}} /></div>
              </div>
              <div style={{marginTop:12}}><Lbl c="Reglas adicionales" /><StableTextarea style={{height:80}} value={activeAcc.funding.extraRules} onChange={function(v){updFund("extraRules",v);}} placeholder="No operar NFP, max 5 trades/dia..." /></div>
            </div>
            {health&&<div style={styCard}><div style={{fontSize:11,color:G,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Estado actual</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{[{l:"DD diario",u:health.du,lim:health.dl,p:health.dp},{l:"DD total",u:health.tl,lim:health.tlt,p:health.tp}].map(function(h){var hc=h.p>80?RED:h.p>50?ORANGE:GREEN;return <div key={h.l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:TX2}}>{h.l}</span><span style={{fontSize:12,color:hc,fontFamily:"monospace"}}>${h.u} / ${h.lim}</span></div><div style={{height:5,background:S3,borderRadius:3}}><div style={{height:5,borderRadius:3,background:hc,width:Math.min(100,h.p)+"%",transition:"width .6s",boxShadow:"0 0 6px "+hc+"66"}}/></div><div style={{fontSize:10,color:TX3,marginTop:3}}>{h.p}%{h.p>80?" — PELIGRO ⚠":""}</div></div>;})}</div>{activeAcc.funding.profitTarget&&<div style={{marginTop:12,fontSize:13,color:TX2}}>Hacia el objetivo: <span style={{color:G,fontWeight:600}}>${Math.max(0,stats.totalPnl)} / ${activeAcc.funding.profitTarget} ({Math.round(Math.max(0,stats.totalPnl)/parseFloat(activeAcc.funding.profitTarget)*100)}%)</span></div>}</div>}
            <button style={styBtnP} onClick={async function(){if(userId){await apiCall({saveAccount:{trader_id:userId,name:activeAcc.name,balance:activeAcc.balance,type:activeAcc.type,risk_pct:activeAcc.riskPct,funding:activeAcc.funding}});}setPhase("dashboard");}}>Guardar</button>
          </div>
        )}

        {/* ── ACCOUNTS ── */}
        {phase==="accounts"&&(
          <div>
            <SecLabel c="Gestion de cuentas" />
            {accounts.map(function(a){return(<div key={a.id} style={Object.assign({},styCard,{borderLeft:"3px solid "+(activeAccId===a.id?G:BD)})}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{color:activeAccId===a.id?G:TX,fontSize:14,fontWeight:activeAccId===a.id?600:400}}>{a.name}</span><div style={{display:"flex",gap:8}}>{activeAccId!==a.id&&<button style={Object.assign({},styBtn,{padding:"4px 12px",fontSize:11})} onClick={function(){setActiveAccId(a.id);}}>Activar</button>}{accounts.length>1&&<button style={Object.assign({},styBtn,{padding:"4px 12px",fontSize:11,borderColor:RED,color:RED})} onClick={function(){setAccounts(function(ac){return ac.filter(function(x){return x.id!==a.id;});});}}>Eliminar</button>}</div></div><div style={{fontSize:12,color:TX2}}>Saldo: <span style={{color:G,fontWeight:600}}>${a.balance}</span> — Riesgo: {a.riskPct}% — {a.type}</div></div>);})}
            <div style={styCardG}>
              <div style={Object.assign({},styCardG,{marginBottom:16})}>
                <div style={{color:G,fontSize:11,textTransform:"uppercase",marginBottom:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Tu ID para el EA de MT5</div>
                <div style={{padding:"10px 14px",background:"rgba(0,0,0,0.4)",borderRadius:10,border:"1px solid "+BD2,fontSize:12,color:TX,letterSpacing:"0.05em",wordBreak:"break-all",marginBottom:10,fontFamily:"monospace"}}>{userId}</div>
                <div style={{fontSize:11,color:TX2,marginBottom:10}}>Copia este ID y pégalo en el EA de MT5 donde dice TraderID</div>
                <button style={Object.assign({},styBtn,{width:"100%"})} onClick={function(){navigator.clipboard.writeText(userId||"");alert("ID copiado!");}}>Copiar ID</button>
              </div>
              <div style={{color:G,fontSize:11,textTransform:"uppercase",marginBottom:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Agregar nueva cuenta</div>
              <Lbl c="Nombre de la cuenta" />
              <StableInput value={newAccName} onChange={function(v){setNewAccName(v);}} placeholder="Ej: FTMO 50K, Cuenta Real..." />
              <button style={Object.assign({},styBtnP,{marginTop:12})} onClick={function(){crearCuenta();}}>Crear cuenta</button>
            </div>
          </div>
        )}

        {/* ── CHAT / MENTOR IA ── */}
        {phase==="chat"&&(
          <div>
            <SecLabel c="Mentor IA" />
            <div style={{fontSize:13,color:TX2,marginBottom:16,lineHeight:1.7}}>Tu coach personal de trading y psicología del rendimiento — siempre disponible para <span style={{color:G,fontWeight:600}}>{traderName}</span></div>
            <div style={Object.assign({},styCard,{padding:0,overflow:"hidden"})}>
              <div style={{height:420,overflowY:"auto",padding:"1.25rem",display:"flex",flexDirection:"column",gap:12}}>
                {chatMsgs.map(function(m,i){return(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"82%",padding:"11px 16px",borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",background:m.role==="user"?"rgba(212,168,67,0.12)":S3,border:"1px solid "+(m.role==="user"?BD2:BD),fontSize:13,color:m.role==="user"?TX:TX2,lineHeight:1.85,whiteSpace:"pre-wrap",fontFamily:m.role==="assistant"?"Georgia,serif":"inherit"}}>{m.content}</div></div>);})}
                {chatLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{padding:"11px 16px",borderRadius:"14px 14px 14px 3px",background:S3,border:"1px solid "+BD,fontSize:13,color:TX3,fontStyle:"italic"}}>Escribiendo...</div></div>}
                <div ref={chatEndRef} />
              </div>
              <div style={{borderTop:"1px solid "+BD,padding:"12px 16px",display:"flex",gap:10,background:S2}}>
                <input ref={chatInputRef} value={chatInput} onChange={function(e){setChatInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder="Escríbele a tu mentor..." style={Object.assign({},styInp,{flex:1,margin:0})} disabled={chatLoading} />
                <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()} style={Object.assign({},styBtnP,{padding:"9px 22px",opacity:chatLoading||!chatInput.trim()?0.35:1})}>Enviar</button>
              </div>
            </div>
            <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6}}>
              {["Como mejorar mi disciplina?","Me siento frustrado hoy","Que errores debo corregir?","Necesito motivacion"].map(function(txt){return <button key={txt} onClick={function(){setChatInput(txt);}} style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+BD,background:"transparent",color:TX2,fontSize:11,cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={function(e){e.currentTarget.style.borderColor=G;e.currentTarget.style.color=G;}}
                onMouseLeave={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=TX2;}}>{txt}</button>;})}
            </div>
          </div>
        )}

      </div>

      {/* TICKER BOTTOM */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:28,background:"rgba(7,7,10,0.96)",borderTop:"1px solid "+BD,display:"flex",alignItems:"center",overflow:"hidden",zIndex:50}}>
        <div style={{display:"flex",gap:44,animation:"ticker 32s linear infinite",whiteSpace:"nowrap"}}>
          {[...TICKER_ITEMS,...TICKER_ITEMS].map(function(t,i){return(
            <span key={i} style={{fontSize:10,color:TX2}}>
              <span style={{color:TX3,marginRight:5}}>{t.label}</span>
              <span style={{color:t.up?GREEN:RED,fontFamily:"monospace"}}>{t.up?"▲":"▼"} {t.v}</span>
            </span>
          );}) }
        </div>
      </div>
    </div>
  );
}
