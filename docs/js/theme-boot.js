(function () {
  try {
    var raw = localStorage.getItem('bluegrassbuddy.v1');
    if (!raw) return;
    var theme = JSON.parse(raw).preferences.theme;
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch (e) { /* keep the dark default */ }
})();
