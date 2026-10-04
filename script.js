'use strict';
// Keep older shared section URLs useful after the move to separate pages.
if (['/', '/index.html'].includes(location.pathname) && ['about','services','projects','products','contact'].includes(location.hash.slice(1))) {
  location.replace(`${location.hash.slice(1)}.html`);
}
// Public portfolio inbox. Visitors review and send their own email drafts.
const SITE_CONFIG = { email: window.AZ_CONFIG?.email || 'Rejxgodinez27@gmail.com', emailConfigured: true };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500); }
// Storage is optional; privacy settings must never break the page.
let storedTheme; try { storedTheme = localStorage.getItem('az-theme'); } catch {}
function setTheme(theme) { document.documentElement.dataset.theme = theme; $('#theme').textContent = theme === 'dark' ? '☼' : '☾'; $('#theme').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`); try { localStorage.setItem('az-theme', theme); } catch {} }
setTheme(storedTheme === 'light' ? 'light' : 'dark');
if (!SITE_CONFIG.emailConfigured && $('.form-note')) $('.form-note').textContent = 'Demo mode: prepare a downloadable draft. Nothing is sent.';
$('#theme')?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#year').textContent = new Date().getFullYear();
function closeMenu() { $('#navigation').classList.remove('open'); $('#menu').textContent = '☰'; $('#menu').setAttribute('aria-expanded', 'false'); $('#menu').setAttribute('aria-label', 'Open menu'); }
$('#menu')?.addEventListener('click', () => { const open = $('#navigation').classList.toggle('open'); $('#menu').textContent = open ? '×' : '☰'; $('#menu').setAttribute('aria-expanded', String(open)); $('#menu').setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
$$('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); closeChat(); if ($('#playground')) { $('#playground').hidden = true; $('#play-toggle').setAttribute('aria-expanded', 'false'); } } });
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: .08 }); $$('.reveal').forEach(section => { section.classList.add('ready'); observer.observe(section); }); }
// Pointer effects use one frame per event batch, with a static touch/reduced-motion fallback.
$$('.tilt').forEach(card => { card.addEventListener('pointermove', event => { if (!finePointer.matches || reducedMotion.matches) return; const rect = card.getBoundingClientRect(); const x = event.clientX - rect.left, y = event.clientY - rect.top; card.style.setProperty('--mx', `${x}px`); card.style.setProperty('--my', `${y}px`); card.style.transform = `perspective(1000px) rotateX(${(0.5 - y / rect.height) * 4}deg) rotateY(${(x / rect.width - .5) * 4}deg) translateY(-3px)`; }); card.addEventListener('pointerleave', () => { card.style.transform = ''; }); });
let sceneFrame = 0;
$('.hero')?.addEventListener('pointermove', event => { if (!finePointer.matches || reducedMotion.matches) return; const rect = $('.hero').getBoundingClientRect(); cancelAnimationFrame(sceneFrame); sceneFrame = requestAnimationFrame(() => { $('.hero').style.setProperty('--sx', `${(event.clientX - rect.left - rect.width / 2) / 42}px`); $('.hero').style.setProperty('--sy', `${(event.clientY - rect.top - rect.height / 2) / 42}px`); }); });
$('.hero')?.addEventListener('pointerleave', () => { cancelAnimationFrame(sceneFrame); $('.hero').style.setProperty('--sx', '0px'); $('.hero').style.setProperty('--sy', '0px'); });
$('#project-dialog .dialog-close')?.addEventListener('click', () => $('#project-dialog').close());
$('#project-dialog .button')?.addEventListener('click', () => $('#project-dialog').close());
$('#project-dialog')?.addEventListener('click', event => { if (event.target === $('#project-dialog')) { const r = event.target.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close(); } });
function closeChat() { const wasOpen = !$('#chat-panel').hidden; $('#chat-panel').hidden = true; $('#chat-toggle').setAttribute('aria-expanded', 'false'); if (wasOpen) $('#chat-toggle').focus(); }
$('#chat-toggle')?.addEventListener('click', () => { const open = $('#chat-panel').hidden; $('#chat-panel').hidden = !open; $('#chat-toggle').setAttribute('aria-expanded', String(open)); if (open) $('#chat-form input').focus(); });
$('#chat-close')?.addEventListener('click', () => { closeChat(); $('#chat-toggle').focus(); });
function chatReply(message) {
 const log=$('#chat-log');const q=message.toLowerCase();const user=document.createElement('p');user.className='user-message';user.textContent=message;log.append(user);
 let text,links=[];
 if(/privacy|data|store|personal/.test(q)){text='This FAQ runs in your browser. Your chat is not sent to an AI provider or saved by the site. Contact inquiries use the route described beside the form.';links=[['Privacy information','privacy.html']];}
 else if(/pric|cost|rate|budget|payment|quote/.test(q)){text='Portfolio pricing: Tier 1 is ₱299, Tier 2 is ₱499 and Tier 3 is ₱799 (PHP). For custom services, pricing depends on scope. Share your goals, preferred timeline and budget range. Akhi will confirm the deliverables, estimate and payment terms before work begins.';links=[['Request a quote','contact.html']];}
 else if(/time|turnaround|deadline|week|revision|process/.test(q)){text='The process is brief → scope and proposal → build and review → handoff. Turnaround, revision rounds and ongoing support are confirmed in the proposal after the brief is reviewed.';links=[['See the process','services.html#process'],['Share your timeline','contact.html']];}
 else if(/automation|n8n|make|workflow|whatsapp|calendar/.test(q)){text='Explore n8n lead capture and Make calendar / AI content-routing examples. Automation work can include a workflow map, configured integrations, testing and handoff notes. The public showcases do not execute live workflows.';links=[['Automation work','projects.html?collection=n8n'],['Discuss automation','contact.html?service=automation']];}
 else if(/canva|art|brand|graphic|creative|design sample/.test(q)){text='Zy’s Creative Samples includes 30 adapted artworks across invitations, cards, identity studies, books, covers and social campaigns. Personal content is replaced with fictional information.';links=[['Browse creative work','projects.html?collection=zy'],['Creative inquiry','contact.html?service=creative']];}
 else if(/portfolio|project|example|sample|demo/.test(q)){text='The collection includes four interactive portfolio styles, a fictional Zy Atelier, three automation case studies and six creative artwork collections. Each preview explains its scope and sample status.';links=[['Browse the collection','projects.html'],['Portfolio demos','projects.html?collection=portfolio']];}
 else if(/website|web|landing|mobile|responsive/.test(q)){text='Website work can include responsive page design, HTML/CSS/JavaScript development, inquiry setup, basic search metadata and launch handoff. The scope is tailored to your brief.';links=[['Website service','services.html'],['Start a website','contact.html?service=website']];}
 else if(/contact|start|hire|email|hello|hi|inquiry/.test(q)){text='Start with your goal, audience, service, preferred timeline and budget range. Use the Contact page or email '+SITE_CONFIG.email+'. The form tells you whether it sends directly or prepares an email draft.';links=[['Start an inquiry','contact.html']];}
 else if(/service|offer|help|do|make/.test(q)){text='AZ Makes offers website design and development, automation workflows, creative UI/UX and Canva layouts, and scoped custom experiments.';links=[['Explore services','services.html']];}
 else{text='I’m Zy, a browser-based FAQ guide. I can explain services, portfolio samples, the project process, quotes and privacy. For a specific estimate, send Akhi an inquiry.';links=[['Services','services.html'],['Contact Akhi','contact.html']];}
 const reply=document.createElement('p');reply.className='bot-message';reply.textContent=text;
 for(const [label,url]of links){const a=document.createElement('a');a.textContent=label+' →';a.href=url;reply.append(a);}log.append(reply);
 while(log.children.length>60)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;
}
$('#chat-form')?.addEventListener('submit', event => { event.preventDefault(); const input = $('#chat-form input'); const message = input.value.trim(); if (message) chatReply(message); input.value = ''; });
$$('[data-question]').forEach(button => button.addEventListener('click', () => chatReply(button.dataset.question)));
// User-initiated ambient audio, synthesized locally: no downloads and no autoplay.
let audioContext, masterGain, oscillators = [], soundOn = false;
$('#sound')?.addEventListener('click', async () => { try { if (!audioContext) { const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) throw new Error('unsupported'); audioContext = new AudioContextClass(); masterGain = audioContext.createGain(); masterGain.gain.value = 0; masterGain.connect(audioContext.destination); [130.81, 196, 261.63].forEach(frequency => { const oscillator = audioContext.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.value = frequency; oscillator.connect(masterGain); oscillator.start(); oscillators.push(oscillator); }); } await audioContext.resume(); soundOn = !soundOn; masterGain.gain.setTargetAtTime(soundOn ? .012 : 0, audioContext.currentTime, .5); $('#sound').textContent = soundOn ? '♫ Sound on' : '♫ Sound off'; $('#sound').setAttribute('aria-pressed', String(soundOn)); } catch { toast('Ambient sound is unavailable in this browser.'); } });
document.addEventListener('visibilitychange', () => { if (audioContext) { if (document.hidden) audioContext.suspend(); else if (soundOn) audioContext.resume().catch(() => {}); } });
let robotPosition = 0, collected = 0;
$('#play-toggle')?.addEventListener('click', () => { const open = $('#playground').hidden; $('#playground').hidden = !open; $('#play-toggle').setAttribute('aria-expanded', String(open)); if (open) $('[data-move]').focus(); });
function moveRobot(direction) { robotPosition = Math.max(0, Math.min(90, robotPosition + direction * 8)); $('#game-bot').style.left = `${robotPosition}%`; if (Math.abs(robotPosition - Number($('#spark').dataset.position || 80)) < 9) { collected++; $('#game-status').textContent = `${collected} creative spark${collected === 1 ? '' : 's'} collected`; const position = robotPosition > 45 ? 8 : 80; $('#spark').dataset.position = position; $('#spark').style.left = `${position}%`; if (collected === 3) toast('You found the secret ingredient: curiosity. ✦'); } }
$$('[data-move]').forEach(button => button.addEventListener('click', () => moveRobot(Number(button.dataset.move))));
document.addEventListener('keydown', event => { if (event.target.matches('input,textarea,select') || $('#project-dialog').open) return; if ($('#playground') && !$('#playground').hidden && ['ArrowLeft','ArrowRight','a','d','A','D'].includes(event.key)) { event.preventDefault(); moveRobot(['ArrowLeft','a','A'].includes(event.key) ? -1 : 1); } });
// A small, discoverable nod to classic games.
const secret = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let secretIndex = 0;
document.addEventListener('keydown', event => { if (event.target.matches('input,textarea,select')) return; secretIndex = event.key === secret[secretIndex] ? secretIndex + 1 : event.key === secret[0] ? 1 : 0; if (secretIndex === secret.length) { secretIndex = 0; toast('Creative mode unlocked. Keep making. ✦'); document.documentElement.classList.toggle('creative-mode'); } });

// Akhi and Zy's studio: foreground, room, particles, and lighting are separate layers.
let zyTimer;
const zyLines = ["Hey, I'm Zy. Akhi handles the ideas. I collect the sparks.", 'Good ideas build better futures. Want to make one?', 'Try the floating cube — I wired up the studio lights.', 'Psst… play my spark game. Three sparks unlock a little secret.'];
let zyLine = 0;
function zySpeak(message) { $('#zy-speech').textContent = message; $('#zy-speech').classList.add('visible'); clearTimeout(zyTimer); zyTimer = setTimeout(() => $('#zy-speech').classList.remove('visible'), 5000); }
$('#zy-hello')?.addEventListener('click', () => zySpeak(zyLines[zyLine++ % zyLines.length]));
$('#studio-cube')?.addEventListener('click', () => { const active = document.documentElement.classList.toggle('creative-mode'); $('#studio-cube').setAttribute('aria-pressed', String(active)); zySpeak(active ? 'Purple mode! A little late-night creative energy.' : 'Blue mode. All systems ready to make something great.'); });
$('#game-close')?.addEventListener('click', () => { $('#playground').hidden = true; $('#play-toggle').setAttribute('aria-expanded', 'false'); $('#play-toggle').focus(); });
function updateClock() { if (!$('#live-clock')) return; $('#live-clock').textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date()); }
updateClock(); setInterval(updateClock, 30000);

function openPromo() { $('#promo-dialog').showModal(); }
$('#watch-promo')?.addEventListener('click', openPromo);
$('#about-promo')?.addEventListener('click', openPromo);
$('#promo-close')?.addEventListener('click', () => $('#promo-dialog').close());
$('#promo-dialog')?.addEventListener('close', () => $('#promo-video').pause());

// Visibility-aware sparks: no perpetual work in hidden tabs or outside the hero.
if ($('#studio-particles') && $('.hero')) {
const particleCanvas = $('#studio-particles');
const particleContext = particleCanvas.getContext('2d');
let particleWidth = 0, particleHeight = 0, particleFrame = 0, heroVisible = true, lastParticleTime = 0;
const sparks = Array.from({ length: 32 }, (_, i) => ({ x: ((i * 37) % 100) / 100, y: ((i * 19) % 100) / 100, r: i % 3 === 0 ? 1.8 : .8, phase: i * 1.4 }));
function sizeParticles() { const rect = $('.hero').getBoundingClientRect(); particleWidth = rect.width; particleHeight = rect.height; const ratio = Math.min(devicePixelRatio || 1, 1.5); particleCanvas.width = Math.round(particleWidth * ratio); particleCanvas.height = Math.round(particleHeight * ratio); particleContext?.setTransform(ratio, 0, 0, ratio, 0, 0); }
function drawSparks(time) { particleFrame = 0; if (!particleContext || reducedMotion.matches || document.hidden || !heroVisible) return; if (time - lastParticleTime > 32) { particleContext.clearRect(0, 0, particleWidth, particleHeight); const t = time / 1000; for (const spark of sparks) { const x = (spark.x * particleWidth + Math.sin(t * .22 + spark.phase) * 20); const y = ((spark.y * particleHeight - t * 6) % particleHeight + particleHeight) % particleHeight; const alpha = .2 + (Math.sin(t + spark.phase) + 1) * .2; particleContext.fillStyle = `rgba(123,203,255,${alpha})`; particleContext.shadowColor = '#43bfff'; particleContext.shadowBlur = spark.r > 1 ? 12 : 3; particleContext.beginPath(); particleContext.arc(x, y, spark.r, 0, Math.PI * 2); particleContext.fill(); } lastParticleTime = time; } particleFrame = requestAnimationFrame(drawSparks); }
function syncParticles() { if (particleFrame) cancelAnimationFrame(particleFrame); particleFrame = 0; if (reducedMotion.matches || document.hidden || !heroVisible) { particleContext?.clearRect(0, 0, particleWidth, particleHeight); } else particleFrame = requestAnimationFrame(drawSparks); }
sizeParticles(); window.addEventListener('resize', sizeParticles, { passive: true }); document.addEventListener('visibilitychange', syncParticles); reducedMotion.addEventListener('change', syncParticles);
if ('IntersectionObserver' in window) new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; syncParticles(); }).observe($('.hero')); else syncParticles();

}

// Collection links open a real filtered page and retain a shareable URL.
function applyCollection(filter) {
 const button = $(`[data-filter="${filter}"]`); if (!button) return;
 $$('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
 let count=0; $$('.actual-work .project').forEach(card => { card.hidden=filter!=='all' && card.dataset.category!==filter; if (!card.hidden) count++; });
 if ($('#filter-status')) $('#filter-status').textContent=`${count} ${count===1?'creation':'creations'} shown`;
}
if ($('[data-filter]')) {
 const initial=new URLSearchParams(location.search).get('collection') || 'all'; applyCollection(initial);
 $$('[data-filter]').forEach(button => button.addEventListener('click',()=> { applyCollection(button.dataset.filter); const url=new URL(location); url.searchParams.set('collection',button.dataset.filter); history.replaceState(null,'',url); }));
}
// Project details preserve the original workflow screenshot and its source.
$('#workflow-preview')?.addEventListener('click',()=>$('#workflow-dialog').showModal());
$('#workflow-close')?.addEventListener('click',()=>$('#workflow-dialog').close());
const service = new URLSearchParams(location.search).get('service');
if (service && $('select[name="service"]')) { const option=$$('select[name="service"] option').find(o=>o.textContent.toLowerCase().includes(service)); if (option) $('select[name="service"]').value=option.value; }

// Asset-backed intro: percentage measures critical images, then holds for a short arrival.
(() => {
 const intro=$('#intro'); if(!intro) return;
 if(!document.body.classList.contains('page-home')){intro.remove();return;}
 const skip=$('#skip-intro'); const number=$('#load-number'); const label=$('#load-label');
 let done=false, frame=0, start=performance.now(), ready=0, target=0, displayed=0;
 const urls=['assets/character-atlas.webp','assets/studio-room.webp','assets/akhi-zy.webp'];
 function finish(){if(done)return;done=true;cancelAnimationFrame(frame);intro.classList.add('loader-exit');document.body.classList.remove('is-loading');setTimeout(()=>intro.remove(),reducedMotion.matches?0:450);}
 skip.addEventListener('click',finish);document.body.classList.add('is-loading');
 urls.forEach(url=>{const image=new Image();image.onload=image.onerror=()=>{ready++;target=Math.round(ready/urls.length*100)};image.src=url;});
 function tick(now){if(done)return;const elapsed=now-start;displayed=Math.min(target,displayed+2);number.firstChild.textContent=displayed;$('#load-accessible').textContent=`Studio loading ${displayed}%`;
 label.textContent=displayed<40?'Waking up the studio':displayed<100?'Gathering the creative sparks':'Ready to make something great';
 const phase=Math.min(1,elapsed/2600);intro.style.setProperty('--arrival',phase);
 if(!reducedMotion.matches){const i=Math.floor(elapsed/110)%8;$('.zy-sprite',intro).style.backgroundPosition=`${(i%4)/3*100}% ${i<4?50:100}%`;$('.akhi-sprite',intro).style.backgroundPosition=`${Math.floor(elapsed/450)%4/3*100}% 0%`;}
 if((ready===urls.length&&displayed===100&&elapsed>(reducedMotion.matches?250:3100))||elapsed>6500){finish();return;}frame=requestAnimationFrame(tick);}
 frame=requestAnimationFrame(tick);
})();
const sampleStudies={
 'cursor-sculptures':['Violet / Cursor Sculptures','A dimensional exploration of direction, glass, and electric blue/purple light.'],
 'zy-identity':['Zy / Creative Identity','A playful original studio identity study with rounded shapes and a familiar spark.'],
 'orbit-study':['Orbit / Light Study','An original sculptural exploration of light, atmosphere, and movement.']
};
$$('[data-sample]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.sample;const study=sampleStudies[key];$('#project-title').textContent=study[0];$('#project-description').textContent=study[1];$('#project-details').textContent='Original AZ Makes visual concept. Generated artwork directed for the studio; no client commission is claimed.';$('#sample-art').src=`assets/${key}.jpg`;$('#sample-art').alt=study[0];$('#sample-art').hidden=false;$('#project-dialog').showModal();}));
