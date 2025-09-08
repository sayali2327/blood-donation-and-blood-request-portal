// Simple interactivity
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    alert(`${button.innerText} button clicked!`);
  });
});
