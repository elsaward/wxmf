define(function() {
    $(".back").on("click", function(e) {
        history.back();
        e.preventDefault();
    });

    $(".go-back").on("click", function(e) {
        history.back();
        e.preventDefault();
    });

    $(".modal-close").on("click", function(e) {
        history.back();
        e.preventDefault();
    });

    //清空DOM
    $.clearDomElement = function (obj) {
        $("*", obj).each(function () {
            $.event.remove(this);
            $.removeData(this);
        });
        $(obj).html("");
    };
});