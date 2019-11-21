var app = getApp()
Page({
    data: {
        title: '资料',
        course: '',
        school: '',
        filelist: [],
        nochangefilelist: []
    },
    onLoad(option) {
        var school = wx.getStorageSync('schoolName')
        wx.showLoading({
            title: '加载中',
        })
        this.setData({
            course: option.course,
            school: school
        })
        wx.setNavigationBarTitle({
            title: option.course + '的资料'
        })
        this.getFiles()
    },
    onReady() {
        wx.hideLoading()
       
    },
    onPullDownRefresh() {


        wx.showLoading({
            title: '刷新中',
        })
        this.getFiles()
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
            title:'首页',
            path: '/pages/course/main'
        }
    },

    getFiles() {
        var that = this
        wx.request({
            url: app.domain + '/files?course=' + that.data.course + '&school=' + that.data.school,
            success(e) {
                that.setData({
                    filelist: e.data,
                    nochangefilelist: e.data
                })
            }
        })
    },

    addfile() {
        var school = wx.getStorageSync('schoolName')
        var uname = wx.getStorageSync('uname')
        var signature = wx.getStorageSync('signature')
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo'] && uname && signature && school) {
                    wx.navigateTo({
                        url: "/pages/addfile/main?course=" + that.data.course,
                        fail: (e) => {
                            console.log(e);
                        }
                    })
                }
                else {
                    wx.showModal({
                        title: '提示',
                        content: '请先授权登录',
                        success(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/setting/main'
                                })
                            }
                        }
                    })
                }
            }
        })
    },


    //search
    onsearchinput(e) {
        var searchvalue = e.detail;
        var nochangefilelist = this.data.nochangefilelist
        var results = []
        nochangefilelist.forEach(e => {
            if ((e.file_name).indexOf(searchvalue) >= 0) {
                results.push(e)
            }
        })
        this.setData({
            filelist: results
        })
    },

})