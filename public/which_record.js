var $submit = $('#submit');
var $results = $('#results');
var $results_body = $results.find('tbody');

function start_spinner() {
    $('#spinner_wrapper').toggle();
}

function stop_spinner() {
    $('#spinner_wrapper').toggle();
}

function reset_form() {
    $('#artist, #song').val('');
    $('input').blur();
}

$('form').submit(function (e) {
    e.preventDefault();

    var data = $(this).serialize();

    $.ajax({
        beforeSend: function () {
            $submit.hide();
            $results.hide();
            $results_body.empty();
            start_spinner();
        },
        url: '/search',
        data: data,
        error: function () {
            alert('Something went wrong, please refresh the page and try again.');
        },
        complete: function (_response) {
            var response = $.parseJSON(_response.responseText);

            start_spinner();
            $submit.show();

            if (response.message !== 'Success!') {
                alert(response.message);
            } else {
                reset_form();

                setTimeout(function () {
                    $(window).scrollTop($results.offset().top);
                }, 400)
                $.each(response.results, function (i, result) {
                    $results.append( $('<tr />').append($('<td />').text(result)));
                })
                $results.show();
            }
        }
    });
});

(function init() {
    var opts = {
        lines: 9, // The number of lines to draw
        length: 10, // The length of each line
        width: 4, // The line thickness
        radius: 14, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#fff', // #rgb or #rrggbb
        speed: 1.1, // Rounds per second
        trail: 42, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
    };
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);
    stop_spinner();
}())
