$(function () {
    $('#back-button').click(function () {
        window.history.back();
    });
})

$(function () {
    $('.focus :input').focus();
})

function showAnswer() {
    $("#showAnswer").addClass("removed");
    $("#answer").removeClass("removed");
}

