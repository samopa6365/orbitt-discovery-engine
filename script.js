const root = document.documentElement;

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  root.style.setProperty('--x', `${x}%`);
  root.style.setProperty('--y', `${y}%`);
});
