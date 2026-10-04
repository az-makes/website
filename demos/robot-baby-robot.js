(() => {
  const visual = document.querySelector('.visual');
  const face = document.querySelector('#faceInteractiveGroup');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  visual.addEventListener('pointermove', event => {
    if (document.body.classList.contains('motion-off') || reduced.matches) return;
    const box = visual.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    face.style.transform = `translate(${x * 4.5}px, ${y * 4.5}px)`;
  });
  const reset = () => { face.style.transform = ''; };
  visual.addEventListener('pointerleave', reset);
  visual.addEventListener('pointercancel', reset);
  visual.addEventListener('pointerup', event => { if (event.pointerType === 'touch') reset(); });
  document.querySelector('#motion').addEventListener('click', reset);
  reduced.addEventListener('change', reset);
})();
