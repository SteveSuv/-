Component({
    //属性（props）
    properties: {

    },
    //初始数据
    data: {
        keyword: ''
    },
    //方法
    methods: {
        solve1() {
            wx.navigateTo({
                url: "/pages/setting/main",
                fail: (e) => {
                    console.log(e);
                    
                }
            })
        },
        solve2() {
            wx.showModal({
                title: '提示',
                content: '点击下方按钮发布内容',
                showCancel: false
            })
        },
        solve3() {
            wx.showModal({
                title: '提示',
                content: '确认网络情况或加群联系管理员',
                confirmText: '加群',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/about/main",
                            fail: (e) => {
                                console.log(e);
                                
                            }
                        })
                    }
                }
            })
        }
    }

})