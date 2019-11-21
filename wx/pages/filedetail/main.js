var app = getApp()
Page({
    data: {
        title: '资料详情',
        id: '',
        file_detail: {},
        filesize: '',
        fileimg: '/static/filetype/white.png'
    },
    onLoad(option) {
        this.setData({
            id: option.id,
            fileimg: option.fileimg
        })
        wx.showLoading({
            title: '加载中',
        })
        this.getFileDetail()
    },
    onReady() {

        wx.hideLoading()
    },
    onPullDownRefresh() {
        wx.showLoading({
            title: '刷新中',
        })
        this.getFileDetail()
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
    onShareAppMessage(e) {
        return {
            title:'资料详情',
            path: '/pages/filedetail/main?id=' + e.target.dataset.id + '&fileimg=' + e.target.dataset.fileimg
        }
    },

    getFileDetail() {
        var that = this
        wx.request({
            url: app.domain + '/filedetail?id=' + that.data.id,
            success(e) {
                that.setData({
                    file_detail: e.data
                })
                var size = e.data.file_size
                if (size < 1024 * 1024) {
                    that.setData({
                        filesize: (size / 1024).toFixed(1) + 'K'
                    })
                }
                else {
                    that.setData({
                        filesize: (size / 1024 / 1024).toFixed(1) + 'M'
                    })
                }

            }
        })
    },
    readfile() {
        var that = this
        var url = app.filedomain + '/' + encodeURI(that.data.file_detail.file_coskey)
        var type = that.data.file_detail.file_type.toLowerCase()
        if (type == 'doc' || type == 'docx' || type == 'xls' || type == 'xlsx' || type == 'ppt' || type == 'pptx' || type == 'pdf') {
            wx.showLoading({
                title: '正在打开中',
            })
            wx.downloadFile({
                url: url,
                success: (res) => {
                    wx.hideLoading()
                    const filePath = res.tempFilePath
                    wx.openDocument({
                        filePath: filePath,
                        fail: (e) => {
                            console.log(e);
                        }
                    })
                },
                fail: (e) => {
                    console.log(e);
                }
            })
        }
        else if (type == 'jpg' || type == 'png' || type == 'jpeg' || type == 'gif') {
            wx.previewImage({
                urls: [url]
            })
        }
        else {
            wx.showModal({
                title: '提示',
                content: '小程序不支持打开这种文件类型，请复制链接后在浏览器中粘贴下载',
                showCancel: false,
                confirmText: '复制链接',
                success(res) {
                    if (res.confirm) {
                        wx.setClipboardData({
                            data: url,
                            fail(e) {
                                console.log(e);
                            }
                        })
                    }
                },
                fail(e) {
                    console.log(e);
                }
            })

        }


    },
    more() {
        var that = this
        var signature = wx.getStorageSync('signature')
        if (that.data.file_detail.file_authorid === signature) {
            wx.showActionSheet({
                itemList: ['打开资料', '删除资料', '设置中心', '关于应用'],
                success: (e) => {
                    var tapIndex = e.tapIndex
                    if (tapIndex == 0) {
                        this.readfile()
                    }
                    if (tapIndex == 1) {
                        wx.showModal({
                            title: '提示',
                            content: '是否确认删除此文件',
                            success(res) {
                                var course = that.data.file_detail.file_course
                                if (res.confirm) {
                                    wx.showLoading({
                                        title: '请求中',
                                    })
                                    wx.request({
                                        url: app.domain + '/deletefile',
                                        method: 'POST',
                                        data: {
                                            id: that.data.file_detail._id
                                        },
                                        success(res) {
                                            if (res.data == '1') {
                                                wx.hideLoading()
                                                wx.showToast({
                                                    title: '删除成功',
                                                })
                                                setTimeout(function () {
                                                    wx.redirectTo({
                                                        url: '/pages/file/main?course=' + course
                                                    })
                                                }, 500)
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                    if (tapIndex == 2) {
                        wx.navigateTo({
                            url: '/pages/setting/main',
                            fail: (e) => {
                                console.log(e);

                            }
                        })
                    }
                    if (tapIndex == 3) {
                        wx.navigateTo({
                            url: '/pages/about/main',
                            fail: (e) => {
                                console.log(e);

                            }
                        })
                    }
                },
            })
        }
        else {
            wx.showActionSheet({
                itemList: ['打开资料', '设置中心', '关于应用'],
                success: (e) => {
                    var tapIndex = e.tapIndex
                    if (tapIndex == 0) {
                        this.readfile()
                    }
                    if (tapIndex == 1) {
                        wx.navigateTo({
                            url: '/pages/setting/main',
                            fail: (e) => {
                                console.log(e);

                            }
                        })
                    }
                    if (tapIndex == 2) {
                        wx.navigateTo({
                            url: '/pages/about/main',
                            fail: (e) => {
                                console.log(e);
                            }
                        })
                    }
                },
            })
        }
    }

})