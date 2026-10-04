// Motion preference: defaults to your visitor's accessibility setting.
const motionButton = document.querySelector('#motion');
const media = matchMedia('(prefers-reduced-motion: reduce)');
let motionOn = !media.matches;
try { const saved = localStorage.getItem('portfolio-motion'); if (saved !== null) motionOn = saved === 'on'; } catch {}
function updateMotion() {
  document.body.classList.toggle('motion-off', !motionOn);
  motionButton.setAttribute('aria-pressed', String(motionOn));
  motionButton.innerHTML = `Motion: ${motionOn ? 'on' : 'off'} <span>${motionOn ? '◉' : '○'}</span>`;
}
motionButton.addEventListener('click', () => {
  motionOn = !motionOn;
  updateMotion();
  try { localStorage.setItem('portfolio-motion', motionOn ? 'on' : 'off'); } catch {}
});
updateMotion();
// Convert pointer position into a small 3D rotation.
const visual = document.querySelector('.visual');
const scene = document.querySelector('.scene');
visual.addEventListener('pointermove', event => {
  if (!motionOn || event.pointerType === 'touch') return;
  const box = visual.getBoundingClientRect();
  scene.style.setProperty('--rx', `${-(event.clientY - box.top - box.height / 2) / 16}deg`);
  scene.style.setProperty('--ry', `${(event.clientX - box.left - box.width / 2) / 16}deg`);
});
visual.addEventListener('pointerleave', () => { scene.style.setProperty('--rx', '0deg'); scene.style.setProperty('--ry', '0deg'); });
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!motionOn || event.pointerType === 'touch') return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--tx', `${-(event.clientY - box.top - box.height / 2) / 45}deg`);
    card.style.setProperty('--ty', `${(event.clientX - box.left - box.width / 2) / 30}deg`);
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg'); });
});
// Reveal content as it enters the viewport; without JS, content stays visible.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('ready'); observer.observe(element); });
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Project screenshot: add your image beside baby-robot.html using this filename.
const projectImage = 'robot-workflow.svg';
const thumbnail = document.querySelector('#project-thumbnail');
thumbnail.addEventListener('load', () => {
  document.querySelector('#open-project').hidden = false;
  document.querySelector('#screenshot-placeholder').hidden = true;
  document.querySelector('#screenshot-description').textContent = 'Take a closer look at the workflow. Open the screenshot to explore the connections.';
  document.querySelector('#project-full').src = projectImage;
});
// A missing screenshot keeps the honest coming-soon state; no invented project image.
fetch(projectImage, {method:'HEAD'}).then(response => { if(response.ok) thumbnail.src = projectImage; }).catch(() => { thumbnail.src = projectImage; });
const projectDialog = document.querySelector('#project-dialog');
document.querySelector('#open-project').addEventListener('click', () => projectDialog.showModal());
document.querySelector('#close-project').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => { if(event.target === projectDialog) { const r = projectDialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) projectDialog.close(); } });
const nodes = [...document.querySelectorAll('.node')];
const descriptions = [
  'Start with an incoming request. A trigger tells an automation when it should begin.',
  'Give the details a consistent structure so the next step receives the information it needs.',
  'Send the organized details to the right people so they can take the next action.'
];
let demoTimer;
function selectStep(index) {
  nodes.forEach((node,i) => { node.classList.toggle('selected',i === index); node.setAttribute('aria-pressed',String(i === index)); });
  document.querySelector('#step-description').textContent = descriptions[index];
}
nodes.forEach((node,i) => node.addEventListener('click', () => {clearTimeout(demoTimer); selectStep(i); document.querySelector('#demo-status').textContent = `Step ${i+1} of 3`; }));
document.querySelector('#run-demo').addEventListener('click', () => {
  clearTimeout(demoTimer);
  let step = 0;
  const next = () => { selectStep(step); document.querySelector('#demo-status').textContent = step === 2 ? 'Demo complete. Three connected steps.' : `Exploring step ${step+1} of 3…`; if(step++ < 2) demoTimer = setTimeout(next,1400); };
  next();
});
// A depth-like particle field; never captures pointer input or blocks navigation.
const canvas = document.querySelector('#particles');
const ctx = canvas.getContext('2d');
let width, height, points = [], pointer = {x:-1000,y:-1000};
function sizeParticles() {
  width = innerWidth; height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width*ratio; canvas.height = height*ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
  points = Array.from({length:width < 600 ? 28 : 65}, () => ({x:Math.random()*width,y:Math.random()*height,v:0.12+Math.random()*.3,r:.6+Math.random()*1.4}));
}
let lastFrame = 0;
function drawParticles(time) {
  requestAnimationFrame(drawParticles);
  if(time-lastFrame < 32 || document.hidden) return;
  const elapsed = Math.min((time-lastFrame)/32,2); lastFrame=time;
  if(!motionOn || media.matches) {ctx.clearRect(0,0,width,height);return;}
  ctx.clearRect(0,0,width,height);
  for(const p of points) {
    p.y -= p.v*elapsed; if(p.y < 0) p.y=height;
    ctx.fillStyle='#99b7ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    const distance = Math.hypot(p.x-pointer.x,p.y-pointer.y);
    if(distance < 150) {ctx.strokeStyle=`rgba(142,170,255,${(1-distance/150)*.4})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();}
  }
}
if(ctx){sizeParticles();addEventListener('resize',sizeParticles);addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY};},{passive:true});requestAnimationFrame(drawParticles);}
function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('#reading-progress').style.width=`${total>0 ? scrollY/total*100 : 0}%`;}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
