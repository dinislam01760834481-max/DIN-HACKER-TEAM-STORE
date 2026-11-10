import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,signInAnonymously,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getDatabase,ref,onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getFunctions,httpsCallable} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";
import {firebaseConfig} from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getDatabase(app),functions=getFunctions(app);
const gate=document.querySelector('#gate'),store=document.querySelector('#store'),form=document.querySelector('#gateForm'),msg=document.querySelector('#gateMessage'),grid=document.querySelector('#fileGrid'),empty=document.querySelector('#empty'),logout=document.querySelector('#logout');
let unlocked=false,items=[],unsubscribeFiles=null;
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
onAuthStateChanged(auth,user=>{if(!user)signInAnonymously(auth).catch(e=>msg.textContent='Firebase Authentication চালু আছে কি না যাচাই করুন।');});
form.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='যাচাই হচ্ছে…';try{
 const check=httpsCallable(functions,'verifyStorePassword');await check({password:document.querySelector('#sharedPassword').value});
 await auth.currentUser.getIdToken(true);
 unlocked=true;gate.classList.add('hidden');store.classList.remove('hidden');logout.classList.remove('hidden');
 if(unsubscribeFiles)unsubscribeFiles();
 unsubscribeFiles=onValue(ref(db,'files'),snap=>{items=Object.entries(snap.val()||{}).map(([id,v])=>({id,...v})).filter(x=>x.published===true);render();},err=>{empty.textContent='ডাটা লোড করা যায়নি। Firebase Rules যাচাই করুন।';});render();
}catch(err){msg.textContent='পাসওয়ার্ড সঠিক নয় অথবা সার্ভার সমস্যা হয়েছে।';}});
logout.addEventListener('click',async()=>{unlocked=false;if(unsubscribeFiles){unsubscribeFiles();unsubscribeFiles=null;}store.classList.add('hidden');gate.classList.remove('hidden');logout.classList.add('hidden');document.querySelector('#sharedPassword').value='';});
document.querySelector('#search').addEventListener('input',render);
function render(){if(!unlocked)return;const q=document.querySelector('#search').value.toLowerCase();const list=items.filter(x=>(x.title+' '+x.category+' '+x.description).toLowerCase().includes(q));grid.innerHTML=list.map(x=>`<article class="file-card"><div class="meta">${escapeHtml(x.category||'FILE')} · ${escapeHtml(x.version||'LATEST')}</div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description||'ডাউনলোডের জন্য প্রস্তুত।')}</p><a class="primary" href="${escapeHtml(x.downloadURL)}" target="_blank" rel="noopener">ডাউনলোড করুন ↓</a></article>`).join('');empty.textContent=list.length?'':'এখনো কোনো ফাইল প্রকাশ করা হয়নি।';}
