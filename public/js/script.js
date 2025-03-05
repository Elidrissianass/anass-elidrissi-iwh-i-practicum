window.addEventListener('load', () => {
  const url = new URL(window.location);
  if (url.searchParams.has('error')) {
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url.toString());
  }
});
