var app = getApp()
Page({
    data: {
        title: '上传文件',
        filelists: [],
        nameinput: false,
        type: '',
        tempindex: 0,
        newname: '',
        course: '',
    },
    onLoad(option) {
        wx.showLoading({
            title: '加载中',
        })
        wx.setNavigationBarTitle({
            title: '上传资料到' + option.course
        })
        this.setData({
            course: option.course
        })

    },
    onReady() {
        wx.hideLoading()
        wx.showModal({
            title:'提示',
            content:'小程序只支持从消息中选择文件上传哦',
            showCancel:false
        })
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
    addfile() {
        var that = this
        wx.chooseMessageFile({
            count: 100,
            type: 'all',
            success(res) {
                var files = that.data.filelists.concat(res.tempFiles)
                var arr = []
                var brr = []
                files.forEach(e => {
                    if (arr.indexOf(e.name) < 0) {
                        arr.push(e.name)
                        brr.push(e)
                    }
                })
                that.setData({
                    filelists: brr,
                })
                if (brr.length !== files.length) {
                    wx.showToast({
                        title: `已过滤${files.length - brr.length}个重复文件`,
                        icon: 'none'
                    })
                }
            },
            fail(e) {
                console.log(e);

            }
        })
    },

    changename(e) {
        var index = e.currentTarget.dataset.index
        var name = this.data.filelists[index].name
        var type = name.split('.').reverse()[0].toLowerCase()
        var filename = name.slice(0, name.indexOf(type) - 1)
        this.setData({
            tempindex: index,
            nameinput: true,
            newname: filename,
            type: type
        })
    },
    onnamecancel() {
        this.setData({
            nameinput: false
        });
    },
    onnameinput(e) {
        this.setData({
            newname: e.detail
        });
    },
    onnameconfirm(e) {
        if (this.data.newname == "") {
            wx.showToast({
                title: '文件名不符要求',
                icon: 'none',

            })
        }
        else {
            var index = this.data.tempindex
            var newname = this.data.newname
            var type = this.data.type
            this.data.filelists[index].name = newname + '.' + type

            this.setData({
                nameinput: false,
                filelists: this.data.filelists,
                tempindex: 0,
                newname: '',
                type: ''
            });
            wx.showToast({
                title: '修改文件名成功',


            })


        }
    },


    upload() {
        var school = wx.getStorageSync('schoolName')
        var uname = wx.getStorageSync('uname')
        var signature = wx.getStorageSync('signature')
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo'] && uname && signature && school) {
                    if (that.data.filelists.length == 0) {
                        wx.showToast({
                            title: '请先选择文件',
                            icon: 'none',

                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '点击文件即可更改文件名，上传之后无法再更改，请再仔细检查一遍',
                            confirmText: '开始上传',
                            cancelText: '返回修改',
                            success(res) {
                                if (res.confirm) {
                                    wx.showLoading({
                                        title: '正在上传中',
                                    })
                                    var len = that.data.filelists.length
                                    for (let i = 0; i < len; i++) {
                                        wx.uploadFile({
                                            url: app.domain + '/addfile', //仅为示例，非真实的接口地址
                                            filePath: that.data.filelists[i].path,
                                            name: 'file',
                                            formData: {
                                                file_name: that.data.filelists[i].name,
                                            },
                                            success(res) {
                                                var data = JSON.parse(res.data)
                                                var data2 = data
                                                data2.file_course = that.data.course

                                                data2.file_school = school
                                                data2.file_author = uname
                                                data2.file_authorid = signature
                                                data2.showtime = app.showtime()
                                                data2.sorttime = app.sorttime()
                                                wx.request({
                                                    url: app.domain + '/savefile',
                                                    method: 'POST',
                                                    data: data2,
                                                    success(res2) {
                                                        if (i === (len - 1) && res2.data == '1') {
                                                            wx.hideLoading()
                                                            wx.showToast({
                                                                title: '上传完成',
                                                            })
                                                            setTimeout(() => {
                                                                wx.redirectTo({
                                                                    url: '/pages/file/main?course=' + that.data.course
                                                                })
                                                            }, 500)
                                                        }
                                                    },
                                                    fail(e) {
                                                        console.log(e);

                                                    }
                                                })
                                            },
                                            fail(e) {
                                                console.log(e);

                                            }
                                        })
                                    }
                                }
                            },
                            fail(e) {
                                console.log(e);
                            }
                        })
                    }
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
})