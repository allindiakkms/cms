(function () {
  var groups  = Array.from(document.querySelectorAll('.month-group'));
  var select  = document.getElementById('monthSelect');
  var btnPrev = document.getElementById('monthPrev');
  var btnNext = document.getElementById('monthNext');
  if (!groups.length || !select) return;

  var keys    = groups.map(function (g) { return g.dataset.month; });
  var current = 0;

  function showMonth(idx) {
    current = Math.max(0, Math.min(idx, keys.length - 1));
    groups.forEach(function (g, i) {
      g.classList.toggle('month-group--hidden', i !== current);
    });
    select.value        = keys[current];
    btnPrev.disabled    = current >= keys.length - 1;
    btnNext.disabled    = current <= 0;
  }

  showMonth(0);

  select.addEventListener('change', function () {
    var idx = keys.indexOf(this.value);
    if (idx !== -1) showMonth(idx);
  });

  // Prev = older (higher index — newest is index 0)
  btnPrev.addEventListener('click', function () { showMonth(current + 1); });
  // Next = newer (lower index)
  btnNext.addEventListener('click', function () { showMonth(current - 1); });
})();
