define(function() {

    var msg = {
        MSG_WAITING: "加载更多",
        MSG_LOADING: "正在加载...",
        MSG_NO_RESULT: "已显示全部",
        MSG_ERROR: "加载失败，点击重新加载"
    };

    var data = {
        start: undefined,   //数据浮标位置
        count: 10           //一次读取数据数量
    };

    var loadBar = $(".load-more");  //容器

    loadBar.on("click", function() {
        load.loadList();
    });

    var load = {
        init: function(option) {
            //初始化
            $.extend(msg, option["msg"]);
            this.url = option.url;  //查询url
            this.data = $.extend(data, option["data"]); //查询数据对象
        },
        changeMsg: function(tag) {
            //改变显示文字
            loadBar.html(msg[tag]);
        },
        buildLoad: function(callback) {
            this.callback = callback;
            this.loadList();
        },
        loadList: function() {
            var self = this;
            self.changeMsg("MSG_LOADING");
            $.ajax({
                url: self.url,
                type: "get",
                data: self.data,
                success: function(res) {
                    if(typeof res == "string") res = $.parseJSON(res);
                    if(res.length < self.data.count) {
                        //如果取得数据量小于设置数量，判断已读完全部
                        self.changeMsg("MSG_NO_RESULT");
                    } else {
                        //正常读取
                        self.changeMsg("MSG_WAITING");
                    }
                    //修正浮标位置
                    self.data.start = res["start"];
                    if(typeof self.callback == "function") {
                        self.callback(res["list"]);
                    }
                },
                error: function(req) {
                    //显示错误信息
                    self.changeMsg("MSG_ERROR");
                }
            });
        }
    };

    return load;
});