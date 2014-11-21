define([
    "./render"
],function(render){

    var screeningBar = $(".screening");
    var screeningList = $(".screening-list");
    var screeningData = $(".screening-data");
    var body = $("body");
    var menuTarget;
    var listPage = $("#list-page");
    var emptyPage = $("#empty-page");

    screeningList.on("click", "li", function(e) {
        var target = $(e.target);
        var condition = $(e.target).html();
        var field = target.data("field");

        if(condition == "不限") {
            screening.data[field] = "";
            menuTarget.children().html(menuTarget.data("title"));
            menuTarget.removeClass("on-condition");
        } else {
            screening.data[field] = condition;
            menuTarget.children().html(condition);
            menuTarget.addClass("on-condition");
        }
        screening.exec();
        closeMenu();
    });

    function elementTpl(condition) {
        return '<a href="#" data-title="'+condition["title"]+'" data-field="'+condition["field"]+'">' +
            '<div>'+condition["title"]+'</div>' +
            '</a>';
    }

    function listTpl(field, item) {
        return '<li data-field="'+field+'">'+item+'</li>';
    }

    var screening = {
        init: function(option) {
            this.url = option.url;
            this.data = {};
            this.elements = [];
            this.tpl = option.tpl;
            this.createElements(option.conditions);
        },
        exec: function() {
            var self = this;
            $.ajax({
                url: self.url,
                type: "get",
                data: self.data,
                success: function(res) {
                    if(typeof res == "string") res = $.parseJSON(res);
                    if(res.length == 0) {
                        listPage.addClass("page-disabled");
                        emptyPage.removeClass("page-disabled");
                    } else {
                        screeningData.html("");
                        screeningData.html(render(self.tpl, res));
                        listPage.removeClass("page-disabled");
                        emptyPage.addClass("page-disabled");
                    }
                }
            });
        },
        createElements: function(conditions) {
            var i, j, len1, len2, element;
            for(i = 0, len1 = conditions.length; i < len1; i++) {
                element = new ScreeningElement(conditions[i], elementTpl);
                this.elements.push(element);
                this.data[element.field] = "";
                screeningBar.append(element.element);
                for(j = 0, len2 = element.list.length; j < len2; j++) {
                    screeningList.append(listTpl(element.field, element.list[j]));
                }
            }
        }
    };

    function ScreeningElement(condition, tpl) {
        this.title = condition["title"];
        this.field = condition["field"];
        this.list = condition["list"];
        this.element = $(tpl(condition));
        this.element.on("click", function(e) {
            var target = $(this);
            menuTarget = target;
            if(target.hasClass("active")) {
                closeMenu();
            } else {
                openMenu();
            }
            e.preventDefault();
        });
    }

    function openMenu() {
        var field = menuTarget.data("field");
        screeningList.children().hide();
        screeningList.children("[data-field="+field+"]").show();
        menuTarget.siblings().removeClass("active");
        screeningBar.addClass("menu-on");
        screeningList.addClass("on");
        body.addClass("lock");
        menuTarget.addClass("active");
    }

    function closeMenu() {
        screeningBar.removeClass("menu-on");
        screeningList.removeClass("on");
        body.removeClass("lock");
        menuTarget.removeClass("active");
    }

    return screening;
});