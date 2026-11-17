(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var link = target.closest('a[data-vc-confirm]');
    if (!link) return;
    var message = link.getAttribute('data-vc-confirm') || 'Are you sure?';
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  });
})();
