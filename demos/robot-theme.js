(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  let explicit = saved === 'light' || saved === 'dark';
  function apply(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector('#theme-toggle');
    if (button) {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
      button.title = `Switch to ${dark ? 'light' : 'dark'} mode`;
      button.querySelector('.theme-symbol').textContent = dark ? '☀' : '☾';
      button.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
    }
  }
  apply(explicit ? saved : system.matches ? 'dark' : 'light');
  system.addEventListener('change', event => { if (!explicit) apply(event.matches ? 'dark' : 'light'); });
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('#theme-toggle').addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      explicit = true;
      apply(theme);
      try { localStorage.setItem('portfolio-theme', theme); } catch {}
    });
  });
})();
