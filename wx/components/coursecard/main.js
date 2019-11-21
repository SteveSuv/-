Component({
    //属性（props）
    properties: {
        info: {
            type: Object
        }
    },
    //初始数据
    data: {
        courseimg: '/static/filetype/folder.png',
    },
    // observers: {
    //     'info': function () {
    //     }
    // },
    //方法
    methods: {
        go() {
            wx.navigateTo({
                url: '/pages/file/main?course=' + this.properties.info.course_name,
                fail: (e) => {
                    console.log(e);

                }
            })
        }
    }
})