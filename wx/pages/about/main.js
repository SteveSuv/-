Page({
    data: {
        title: '关于',
    },
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })
    },
    onReady() {
        wx.hideLoading()
    },
    onPullDownRefresh() {
        wx.showLoading({
            title: '刷新中',
        })
        wx.stopPullDownRefresh()
        setTimeout(function () {
            wx.hideLoading()
        }, 1000)

    },
    onReachBottom() {
        wx.showToast({
            title: '页面已经到底啦',
            icon: 'none',

        })
    },
    onShareAppMessage() {
        return {
            title:'关于',
            path: '/pages/about/main'
        }
    },
    // joinClub() {
    //     // 微信使用图片，qq直接使用API
    //     wx.previewImage({
    //         urls: ['https://files.filesome.top/public/qqgroup.jpg']
    //     })
    // }

})