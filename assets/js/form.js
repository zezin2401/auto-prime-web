$('.div-input').each(function () {
    const $input = $(this).find('input');
    const $label = $(this).find('label');

    $input.on('input', function () {
        if ($input.val().trim() !== "") {
            $label.addClass('active');
        } else {
            $label.removeClass('active');
        }
    });
});