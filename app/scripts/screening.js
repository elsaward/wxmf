// screening.js - 查询条件筛选模块

define([
    "./render",
    "./load"
],function(render, load){
    //依赖render.js - 模板渲染模块
    //依赖load.js - 数据加载模块

    //容器
    var screeningBar = $(".screening");
    var screeningList = $(".screening-list");
    var screeningData = $(".screening-data");
    var body = $("body");
    var listPage = $("#list-page");
    var emptyPage = $("#empty-page");

    //进行筛选操作的选项
    var menuTarget;

    //选定筛选条件，改变文字并进行查询
    screeningList.on("click", "li", function(e) {
        var target = $(e.target);
        var condition = $(e.target).html();
        var field = target.data("field");

        if(condition == "不限") {
            //恢复未限定条件状态
            load.data[field] = "";
            menuTarget.children().html(menuTarget.data("title"));
            menuTarget.removeClass("on-condition");
        } else {
            load.data[field] = condition;
            menuTarget.children().html(condition);
            menuTarget.addClass("on-condition");
        }

        //查询
        screening.exec();

        //关闭选项
        closeMenu();
    });

    function elementTpl(condition) {
        //筛选条件渲染模板
        return '<a href="#" data-title="'+condition["title"]+'" data-field="'+condition["field"]+'">' +
            '<div>'+condition["title"]+'</div>' +
            '</a>';
    }

    function listTpl(field, item) {
        //筛选条件具体项渲染模板
        return '<li data-field="'+field+'">'+item+'</li>';
    }

    var screening = {
        init: function(option) {
            //初始化
            load.init(option);
            load.callback = renderData;
            this.elements = []; //查询筛选项元素数组
            this.tpl = option.tpl;  //查询结果列表渲染模板
            this.createElements(option.conditions); //根据筛选条件构成筛选项元素
        },
        exec: function() {
            //执行查询
            screeningData.html("");
            load.buildLoad(renderData);
        },
        createElements: function(conditions) {
            //构成筛选项元素
            var i, j, len1, len2, element;
            for(i = 0, len1 = conditions.length; i < len1; i++) {
                element = new ScreeningElement(conditions[i], elementTpl);
                this.elements.push(element);    //加入元素数组
                load.data[element.field] = "";  //初始化查询条件对象
                screeningBar.append(element.element);   //渲染查询条件栏
                for(j = 0, len2 = element.list.length; j < len2; j++) {
                    //渲染所有筛选选项
                    screeningList.append(listTpl(element.field, element.list[j]));
                }
            }
        }
    };

    function ScreeningElement(condition, tpl) {
        //筛选项元素类
        this.title = condition["title"];    //条件文字
        this.field = condition["field"];    //条件字段名
        this.list = condition["list"];      //条件筛选项列表
        this.element = $(tpl(condition));   //页面元素
        this.element.on("click", function(e) {
            //筛选列表的打开与关闭
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
        //打开筛选列表
        var field = menuTarget.data("field");
        screeningList.children().hide();
        screeningList.children("[data-field="+field+"]").show();
        menuTarget.siblings().removeClass("active");
        screeningList.addClass("on");
        body.addClass("lock");
        menuTarget.addClass("active");
    }

    function closeMenu() {
        //关闭筛选列表
        screeningList.removeClass("on");
        body.removeClass("lock");
        menuTarget.removeClass("active");
    }

    function renderData(res) {
        if(res.length == 0 && load.start === undefined) {
            //空数据，显示空界面
            listPage.addClass("page-disabled");
            emptyPage.removeClass("page-disabled");
        } else {
            screeningData.append(render(screening.tpl, res));
            listPage.removeClass("page-disabled");
            emptyPage.addClass("page-disabled");
        }
    }

    return screening;
});