const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const SESSION_KEY="watershifts_session_v1", USERS_KEY="watershifts_users_v1";
const state={signup:false};
function getUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY)||"[]")}catch{return[]}}
function setUsers(u){localStorage.setItem(USERS_KEY,JSON.stringify(u))}
async function hash(text){const data=new TextEncoder().encode(text);const buf=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function session(){try{const s=JSON.parse(localStorage.getItem(SESSION_KEY));if(s&&Date.now()<s.expires)return s;localStorage.removeItem(SESSION_KEY)}catch{}return null}
function updateAuthUI(){
 const s=session(), sn=$("#supportNav"), an=$("#authNav");
 sn.classList.toggle("hidden",!s); an.textContent=s?"Account":"Sign in";
}
function showPage(id){
 if(id==="support"&&!session()){location.hash="auth";return}
 $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 window.scrollTo({top:0,behavior:"smooth"}); updateAuthUI();
 if(id==="auth")renderAuth();
}
function route(){let id=(location.hash||"#home").slice(1).split("?")[0];if(!$("#"+id))id="home";showPage(id)}
window.addEventListener("hashchange",route);
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$$("nav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));

function renderAuth(){
 const s=session(), form=$("#authForm"), box=$("#accountBox");
 $("#authTitle").textContent=s?"Account":state.signup?"Create account":"Sign in";
 $("#authText").textContent=s?"Your Watershifts browser session is active.":state.signup?"Create a local Watershifts account.":"Sign in to unlock your member Support page.";
 form.classList.toggle("hidden",!!s);box.classList.toggle("hidden",!s);
 if(s)$("#accountName").textContent=s.name||s.email;
 $("#nameField").classList.toggle("hidden",!state.signup);$("#confirmField").classList.toggle("hidden",!state.signup);
 $("#authSubmit").textContent=state.signup?"Create account":"Sign in";
 $("#switchAuth").textContent=state.signup?"Already have an account? Sign in":"Need an account? Sign up";
 $("#authMessage").textContent="";
}
$("#switchAuth").addEventListener("click",()=>{state.signup=!state.signup;renderAuth()});
$("#authForm").addEventListener("submit",async e=>{
 e.preventDefault(); const email=$("#email").value.trim().toLowerCase(), pass=$("#password").value;
 const msg=$("#authMessage");
 if(state.signup){
   const name=$("#name").value.trim()||"Watershifts reader", confirm=$("#confirm").value;
   if(pass!==confirm){msg.textContent="Passwords do not match.";return}
   const users=getUsers();if(users.some(u=>u.email===email)){msg.textContent="An account with this email already exists.";return}
   users.push({email,name,hash:await hash(pass),created:Date.now()});setUsers(users);
   createSession({email,name});msg.style.color="#167b73";msg.textContent="Account created.";
 }else{
   const u=getUsers().find(x=>x.email===email);
   if(!u||u.hash!==await hash(pass)){msg.textContent="Incorrect email or password.";return}
   createSession({email:u.email,name:u.name});msg.style.color="#167b73";msg.textContent="Signed in.";
 }
 renderAuth();updateAuthUI();
});
function createSession(u){localStorage.setItem(SESSION_KEY,JSON.stringify({...u,expires:Date.now()+3*24*60*60*1000}))}
$("#logout").addEventListener("click",()=>{localStorage.removeItem(SESSION_KEY);updateAuthUI();state.signup=false;renderAuth();location.hash="home"});
$("#supportMail").addEventListener("click",()=>{location.href="mailto:support@watershifts.example?subject=Watershifts%20Support"});
$$("[data-action=details]").forEach(b=>b.addEventListener("click",()=>{
 $("#modalContent").innerHTML="<span class='eyebrow'>FEATURED READING</span><h2>Hydrogeology of Plains and Fractals in Geology</h2><p>This Watershifts entry highlights a research theme at the intersection of hydrogeology, geological structure and fractal concepts. For the authoritative publication details, consult the original Sayareyema materials.</p><a class='btn primary' href='https://sayareyema.com' target='_blank' rel='noopener'>Open source collection ↗</a>";
 $("#modal").classList.remove("hidden");
}));
$("#modalClose").addEventListener("click",()=>$("#modal").classList.add("hidden"));$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.add("hidden")});
const terms=[["Aquifer","A geological formation that stores and transmits groundwater."],["Recharge","Water entering an aquifer, often from rainfall or surface water."],["Porosity","The proportion of a material's volume occupied by pores."],["Permeability","How readily a material allows fluid to move through connected spaces."],["Water table","The upper surface of the saturated zone in an unconfined aquifer."],["Fracture","A break or discontinuity in rock that can influence groundwater flow."]];
function drawGlossary(q=""){const el=$("#glossary");el.innerHTML=terms.filter(x=>x[0].toLowerCase().includes(q.toLowerCase())||x[1].toLowerCase().includes(q.toLowerCase())).map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("")||"<p>No matching term.</p>"}
drawGlossary();$("#glossarySearch").addEventListener("input",e=>drawGlossary(e.target.value));
const qs=["How does rainfall become groundwater?","Why do some rocks make better aquifers than others?","How can fractures change groundwater flow?","What can groundwater chemistry reveal about its journey?","How do droughts affect aquifers over time?"];let qi=Math.floor(Math.random()*qs.length);function q(){qi=(qi+1)%qs.length;$("#dailyQuestion").textContent=qs[qi]}q();$("#newQuestion").addEventListener("click",q);
$$("[data-video]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.video;if(v){$("#modalContent").innerHTML=`<div style="aspect-ratio:16/9"><iframe src="${v}" style="width:100%;height:100%;border:0;border-radius:10px" allowfullscreen></iframe></div>`;$("#modal").classList.remove("hidden")}else{window.open("https://www.oxfordsparks.ox.ac.uk/videos/groundwater-beneath-our-feet/","_blank")}}));
updateAuthUI();route();
