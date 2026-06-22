(function () {
  var btn  = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });

  // Set real header height as CSS variable so sticky offsets are exact
  function setHeaderHeight() {
    var h = document.getElementById('siteHeader').offsetHeight;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  // Shrink nav on scroll
  var header   = document.getElementById('siteHeader');
  var scrolled = false;
  window.addEventListener('scroll', function () {
    if (!scrolled && window.scrollY > 80) {
      header.classList.add('is-scrolled');
      scrolled = true;
    } else if (scrolled && window.scrollY < 40) {
      header.classList.remove('is-scrolled');
      scrolled = false;
    }
  }, { passive: true });
  header.addEventListener('transitionend', setHeaderHeight);
})();
