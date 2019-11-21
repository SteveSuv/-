Page({
    data: {
        title: '设置',
        schoolName: '',
        uname: '',
        avatar: '/static/imgs/logo.png',
        schoolinput: false,
        schoolvalue: '',
        islogin: false
    },
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })
        this.login()
        var schoolname = wx.getStorageSync('schoolName')
        this.setData({
            schoolName: schoolname
        });

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
            title:'设置',
            path: '/pages/setting/main'
        }
    },
    changeSchool() {
        this.setData({
            schoolinput: true
        })
    },

    onschoolinput(e) {
        this.setData({
            schoolvalue: e.detail
        });
    },
    //取消按钮
    onschoolcancel() {

        this.setData({
            schoolinput: false,
            schoolvalue: ''
        });
    },
    //确认
    onschoolconfirm() {
        var that = this
        if (this.data.schoolvalue == '') {
            wx.showToast({
                title: '学校名不符要求',
                icon: 'none',

            })
        }
        else {
            var schoollist = require('../../scripts/schoollist.js')
            var mayschools = []
            schoollist.forEach(e => {
                if (e.indexOf(that.data.schoolvalue) >= 0) {
                    mayschools.push(e)
                }
            })
            if (mayschools.length === 0) {
                wx.showToast({
                    title: '你填写的学校不存在',
                    icon: 'none',

                })
            }
            else if (mayschools.length > 5) {
                wx.showToast({
                    title: '请缩小搜索范围',
                    icon: 'none',

                })
            }
            else {
                wx.showActionSheet({
                    itemList: mayschools,
                    success: (e) => {
                        var tapIndex = e.tapIndex
                        wx.setStorageSync(
                            "schoolName", mayschools[tapIndex]
                        )
                        this.setData({
                            schoolinput: false
                        })
                        wx.reLaunch({
                            url: '/pages/course/main'
                        })
                    },
                })


            }

        }

    },
    clearall() {
        wx.showModal({
            title: '提示',
            content: '这将使应用回到初次打开时的状态，确认清空缓存吗？',
            success(res) {
                if (res.confirm) {
                    wx.clearStorage()
                    wx.reLaunch({
                        url: '/pages/course/main'
                    })
                }
            }
        })
    },
    login() {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res2) {
                            that.setData({
                                islogin: true,
                                uname: res2.userInfo.nickName,
                                avatar: res2.userInfo.avatarUrl
                            })
                            wx.setStorageSync('uname', res2.userInfo.nickName)
                            wx.setStorageSync('signature', res2.signature)
                            wx.showToast({
                                title:'授权成功'
                            })
                        },
                        fail(e) {
                            console.log(e);
                        }
                    })
                }
                else {
                    that.setData({
                        islogin: false,
                    })
                }
            }
        })
    }

})