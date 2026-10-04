(() => {
  // The intro is created only when JavaScript runs, so it cannot block a static page.
  const loader = document.createElement('div');
  loader.className = 'workflow-loader';
  loader.innerHTML = `<div class="loader-content"><div class="loader-brand">AZ<span style="color:#8eaaff">.</span></div><p class="eyebrow">OPERATIONS, IN MOTION</p><h2>Connecting the dots.</h2><div class="loader-flow" aria-hidden="true"><div class="loader-step active"><b>↳</b><span>Trigger</span></div><i class="loader-wire"></i><div class="loader-step"><b>⌘</b><span>Connect</span></div><i class="loader-wire"></i><div class="loader-step"><b>✓</b><span>Ready</span></div></div><p role="status">Starting your visit…</p><button class="loader-skip" type="button">Skip intro ↗</button></div>`;
  document.body.append(loader);
  const steps = [...loader.querySelectorAll('.loader-step')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dismissed = false;
  function finishIntro() {
    if (dismissed) return;
    dismissed = true;
    const hadFocus = loader.contains(document.activeElement);
    loader.classList.add('is-done');
    loader.inert = true;
    if (hadFocus) document.querySelector('.brand')?.focus();
    setTimeout(() => loader.remove(), 400);
  }
  loader.querySelector('button').addEventListener('click', finishIntro);
  loader.addEventListener('keydown', event => { if (event.key === 'Escape') finishIntro(); });
  setTimeout(() => {
    steps[0].classList.add('complete');
    steps[1].classList.add('active');
    loader.querySelector('[role="status"]').textContent = 'Connecting people, process, and data…';
  }, 450);
  setTimeout(() => {
    steps[1].classList.add('complete');
    steps[2].classList.add('active', 'complete');
    loader.querySelector('[role="status"]').textContent = 'All connected. Welcome to my portfolio.';
  }, 1000);
  setTimeout(finishIntro, reduceMotion ? 0 : 1550);

  const widget = document.createElement('div');
  widget.innerHTML = `<section id="portfolio-chat" class="portfolio-chat" aria-labelledby="chat-title" hidden><header class="chat-header"><div class="chat-heading"><img class="chat-robot" src="robot-baby-robot.svg" alt="" width="38" height="42"><div><h2 id="chat-title">Jamie’s portfolio assistant</h2><p>A little curiosity. A lot of clarity.</p></div></div><button type="button" class="chat-close" aria-label="Close chat">×</button></header><div class="chat-messages" role="log" aria-live="polite" aria-label="Conversation" tabindex="0"></div><div class="chat-options"><button type="button" data-topic="Services">Services</button><button type="button" data-topic="Experience">Experience</button><button type="button" data-topic="Projects">Projects</button><button type="button" data-topic="Contact">Contact Jamie</button></div><form class="chat-form"><input aria-label="Your question" placeholder="Ask about my work…" maxlength="300" autocomplete="off" required><button type="submit">Send ↗</button></form><p class="chat-note">Automated portfolio guide. Messages stay in this page and aren’t sent to Jamie.</p></section><button type="button" class="chat-launcher" aria-controls="portfolio-chat" aria-expanded="false" aria-label="Open portfolio chat"><img class="chat-robot" src="robot-baby-robot.svg" alt="" width="43" height="47"></button>`;
  document.body.append(widget);
  const panel = widget.querySelector('.portfolio-chat');
  const launcher = widget.querySelector('.chat-launcher');
  const input = widget.querySelector('input');
  const log = widget.querySelector('.chat-messages');
  function addMessage(text, user = false, link) {
    const message = document.createElement('p');
    message.className = `chat-message${user ? ' user' : ''}`;
    message.textContent = text;
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label;
      message.append(document.createElement('br'), anchor);
      if (link.href.startsWith('#')) anchor.addEventListener('click', () => setOpen(false));
    }
    log.append(message);
    while (log.children.length > 60) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Close portfolio chat' : 'Open portfolio chat');
    (open ? input : launcher).focus();
  }
  launcher.addEventListener('click', () => setOpen(panel.hidden));
  widget.querySelector('.chat-close').addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  function answer(text){if(/contact|hire|price|rate|email/i.test(text))return ['Contact AZ Makes to discuss your own portfolio.',{href:'../contact.html',label:'Contact AZ Makes ↗'}];if(/experience|background|who|where/i.test(text))return ['Jamie Rivera is a fictional sample identity. This demo shows the layout and interactions without disclosing a real person’s background.',{href:'#experience',label:'Explore the sample ↗'}];return ['Try the interactive workflow, theme toggle, motion control and robot. This is a local FAQ, not a live AI chatbot.',{href:'#projects',label:'Explore projects ↗'}];}
  function send(question) {
    const text = question.trim();
    if (!text) return;
    addMessage(text, true);
    const [reply, link] = answer(text);
    addMessage(reply, false, link);
    input.value = '';
  }
  widget.querySelector('form').addEventListener('submit', event => { event.preventDefault(); send(input.value); });
  widget.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => send(button.dataset.topic)));
  addMessage('Hi! I’m Jamie’s automated portfolio guide. Ask me about services, experience, or the workflow projects, or choose a topic below.');
})();
