define(function() {
    //图标返回
    $(".back").on("click", function(e) {
        history.back();
        e.preventDefault();
    });

    //文字返回
    $(".go-back").on("click", function(e) {
        history.back();
        e.preventDefault();
    });

    //通用modal关闭
    $(".modal-close").on("click", function(e) {
        history.back();
        e.preventDefault();
    });

    //显示大图
    $("[data-large]").on("click", function(e) {
        location.href = "#picModal";
        $(".big-img").attr("src", this.dataset["large"]);
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