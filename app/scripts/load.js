define(function() {

    var msg = {
        MSG_WAITING: "加载更多",
        MSG_LOADING: "正在加载...",
        MSG_NO_RESULT: "已显示全部",
        MSG_ERROR: "加载失败，点击重新加载"
    };

    var data = {
        start: undefined,
        count: 10
    };

    var loadBar = $(".load-more");

    loadBar.on("click", function() {
        load.loadList();
    });

    var load = {
        init: function(option) {
            $.extend(msg, option["msg"]);
            this.url = option.url;  //查询url
            this.data = $.extend(data, option["data"]); //查询数据对象
        },
        changeMsg: function(tag) {
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
                        self.changeMsg("MSG_NO_RESULT");
                    } else {
                        self.changeMsg("MSG_WAITING");
                    }
                    self.data.start = res["start"];
                    if(typeof self.callback == "function") {
                        self.callback(res["list"]);
                    }
                },
                error: function(req) {
                    self.changeMsg("MSG_ERROR");
                }
            });
        }
    };

    function refresh(){}

    function loadMore(){}

    return load;
});