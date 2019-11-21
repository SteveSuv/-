const ald = require('./utils/ald-stat.js')
App({
  onLaunch(options) {

    // 检查网络
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType == '2g' || networkType == 'unknown' || networkType == 'none') {
          wx.showModal({
            title: '提示',
            content: '请检查你的网络连接',
            showCancel: false,
          })
        }
      }
    })

    // 更新机制
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          wx.showToast({
            title: '更新失败',
            icon: 'none',
            duration: 2000
          })
        })
      }
    })





  },
  onShow(options) {

  },
  onHide() {

  },
  onError(err) {
    console.log(err);
  },
  domain: 'https://www.filesome.top/api',
  // domain:'http://127.0.0.1:4848/api',
  filedomain: 'https://files.filesome.top',
  showtime() {
    var a = new Date()
    return a.getFullYear().toString().substr(2) + '-' + (a.getMonth() + 1).toString() + '-' + a.getDate().toString()
  },
  sorttime() {
    var a = new Date()
    return a.getTime()
  }
})