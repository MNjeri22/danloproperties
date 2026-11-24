(() => {
  const root = document.querySelector('.properties-nav');
  if (!root) return;
  const trigger = root.querySelector('.properties-toggle');
  const panel = root.querySelector('.properties-mega');

  function setOpen(open) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  }

  trigger.addEventListener('click', () => setOpen(panel.hidden));
  root.addEventListener('focusout', event => {
    if (!root.contains(event.relatedTarget)) setOpen(false);
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.focus();
    }
    if (event.key === 'ArrowDown' && event.target === trigger) {
      event.preventDefault();
      setOpen(true);
      panel.querySelector('a').focus();
    }
  });
  document.addEventListener('click', event => {
    if (!root.contains(event.target) || event.target.closest('.properties-mega a')) setOpen(false);
  });
  matchMedia('(min-width: 901px)').addEventListener('change', () => setOpen(false));
})();
