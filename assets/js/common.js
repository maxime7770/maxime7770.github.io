$(document).ready(function() {
    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
        $(this).parent().parent().find(".bibtex.hidden.open").toggleClass('open');
    });
    $('a.bibtex').click(function() {
        $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
        $(this).parent().parent().find(".abstract.hidden.open").toggleClass('open');
    });
    $('a').removeClass('waves-effect waves-light');
});

// Let the mobile navigation close naturally with Escape or a tap outside it.
$(function () {
    const panel = $('#navbarNav');
    const toggle = document.querySelector('.navbar-toggler');
    if (!panel.length || !toggle) return;
    panel.on('show.bs.collapse', function () {
        toggle.setAttribute('aria-label', 'Close navigation menu');
    }).on('hide.bs.collapse', function () {
        toggle.setAttribute('aria-label', 'Open navigation menu');
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && panel.hasClass('show')) {
            panel.collapse('hide');
            toggle.focus();
        }
    });
    document.addEventListener('click', function (event) {
        if (panel.hasClass('show') && !event.target.closest('#navbar')) panel.collapse('hide');
    });
});
