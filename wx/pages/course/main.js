var app = getApp();
Page({
    data: {
        title: '课程',
        schoolinput: false,
        courseinput: false,
        schoolvalue: '',
        coursevalue: '',
        courselist: [],
        nochangecourselist: []
    },
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })
        var schoolName = wx.getStorageSync('schoolName')
        if (!schoolName) {
            this.setData({
                schoolinput: true
            });
        }
        else {
            var schoollist = require('../../scripts/schoollist.js')
            if(schoollist.indexOf(schoolName)<0){
                wx.clearStorage()
                this.setData({
                    schoolinput: true
                });
            }
            else{
                wx.setNavigationBarTitle({
                    title: schoolName
                })
                this.getCourses()
            } 
        }
    },
    onReady() {
        wx.hideLoading()
    },
    onPullDownRefresh() {
        wx.showLoading({
            title: '刷新中',
        })
        this.getCourses()
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
    getCourses() {
        var that = this
        var schoolName = wx.getStorageSync('schoolName')
        wx.request({
            url: app.domain + '/courses?school=' + schoolName,
            success(e) {
                that.setData({
                    courselist: e.data,
                    nochangecourselist: e.data
                });
            },
            fail(e) {
                console.log(e);
            }
        })
    },

    //search
    onsearchinput(e) {
        var searchvalue = e.detail;
        var nochangecourselist = this.data.nochangecourselist
        var results = []
        nochangecourselist.forEach(e => {
            if ((e.course_name).indexOf(searchvalue) >= 0) {
                results.push(e)
            }
        })
        this.setData({
            courselist: results
        })
    },

    
    // school
    onschoolinput(e) {
        this.setData({
            schoolvalue: e.detail
        });
    },
    //取消按钮
    onschoolcancel() {
        var that = this
        that.setData({
            schoolinput: false,
            schoolvalue: ''
        });

        wx.showModal({
            title: '提示',
            content: '填写大学全称才能使用小程序',
            success: () => {
                that.setData({
                    schoolinput: true
                })
            }
        })
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
                        that.setData({
                            schoolinput: false
                        })
                        wx.setStorageSync(
                            "schoolName",
                            mayschools[tapIndex]
                        )
                        wx.showToast({
                            title:'选择成功'
                        })
                        wx.setNavigationBarTitle({
                            title: mayschools[tapIndex]
                        })
                        that.getCourses()
                    },
                })


            }
        }
    },


    // course
    addcourse(e) {
        var school = wx.getStorageSync('schoolName')
        var uname = wx.getStorageSync('uname')
        var signature = wx.getStorageSync('signature')
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo'] && uname && signature && school) {
                    that.setData({
                        courseinput: true
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
    oncourseinput(e) {

        this.setData({
            coursevalue: e.detail
        });
    },
    //取消按钮
    oncoursecancel() {
        this.setData({
            courseinput: false,
            coursevalue: ''
        });
    },
    //确认
    oncourseconfirm() {
        var that = this
        if (that.data.coursevalue == '') {
            wx.showToast({
                title: '课程名称不符要求',
                icon: 'none',

            })
        }
        else {
            wx.showLoading({
                title: '创建中'
            })
            var uname = wx.getStorageSync('uname')
            var signature = wx.getStorageSync('signature')
            var school = wx.getStorageSync('schoolName')
            var data = {
                course_school: school,
                course_name: that.data.coursevalue,
                showtime: app.showtime(),
                sorttime: app.sorttime(),
                course_author: uname,
                course_authorid: signature
            }


            wx.request({
                url: app.domain + "/addcourse",
                method: 'POST',
                data: data,
                success(e) {

                    wx.hideLoading()
                    if (e.data == '1') {
                        that.setData({
                            courseinput: false
                        })
                        wx.showToast({
                            title: '课程添加成功',


                        })
                        var school = wx.getStorageSync('schoolName')
                        wx.request({
                            url: app.domain + '/courses?school=' + school,
                            success(e) {
                                that.setData({
                                    courselist: e.data
                                });
                            },
                            fail(e) {
                                console.log(e);

                            }
                        })
                    }
                    if (e.data == '0') {
                        wx.showToast({
                            title: '此课程已存在',
                            icon: 'none',

                        })
                    }
                },
                fail(e) {
                    console.log(e);
                }
            })
        }
    },
})