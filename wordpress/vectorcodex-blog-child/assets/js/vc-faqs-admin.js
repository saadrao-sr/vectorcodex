(function () {
  'use strict';

  var list = document.getElementById('vc-faqs-list');
  var addBtn = document.getElementById('vc-faqs-add');
  if (!list || !addBtn) return;

  function reindex() {
    var rows = list.querySelectorAll('.vc-faq-row');
    rows.forEach(function (row, index) {
      var q = row.querySelector('.vc-faq-question');
      var a = row.querySelector('.vc-faq-answer');
      if (q) q.name = 'vc_faqs[' + index + '][question]';
      if (a) a.name = 'vc_faqs[' + index + '][answer]';
      row.querySelector('.vc-faq-index').textContent = String(index + 1).padStart(2, '0');
    });
  }

  function createRow(index) {
    var row = document.createElement('div');
    row.className = 'vc-faq-row';
    row.innerHTML =
      '<div class="vc-faq-row__head">' +
      '<span class="vc-faq-index">' +
      String(index + 1).padStart(2, '0') +
      '</span>' +
      '<button type="button" class="button-link-delete vc-faq-remove">Remove</button>' +
      '</div>' +
      '<p><label>Question<br><input type="text" class="widefat vc-faq-question" name="vc_faqs[' +
      index +
      '][question]" value="" /></label></p>' +
      '<p><label>Answer<br><textarea class="widefat vc-faq-answer" name="vc_faqs[' +
      index +
      '][answer]" rows="3"></textarea></label></p>';
    return row;
  }

  addBtn.addEventListener('click', function () {
    list.appendChild(createRow(list.querySelectorAll('.vc-faq-row').length));
    reindex();
  });

  list.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.classList || !target.classList.contains('vc-faq-remove')) return;
    var row = target.closest('.vc-faq-row');
    if (row) row.remove();
    reindex();
  });
})();
