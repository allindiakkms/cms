(function () {
  var slider = document.getElementById('heroSlider');
  if (!slider) return;

  var slides  = Array.from(slider.querySelectorAll('.hero-slide'));
  var dots    = Array.from(slider.querySelectorAll('.hero-dot'));
  var total   = slides.length;
  var current = 0;
  var timer;

  function goTo(idx) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (idx + total) % total;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  // Wire up manual controls regardless of motion preference
  var nextBtn = document.getElementById('heroNext');
  var prevBtn = document.getElementById('heroPrev');
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); if (timer) resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); if (timer) resetAuto(); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(this.dataset.index));
      if (timer) resetAuto();
    });
  });

  // Touch / swipe support
  var touchStartX = 0;
  slider.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); if (timer) resetAuto(); }
  }, { passive: true });

  // Respect prefers-reduced-motion — skip auto-advance entirely
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function startAuto() {
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  // Pause auto-advance on hover
  slider.addEventListener('mouseenter', function () { clearInterval(timer); });
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
})();
