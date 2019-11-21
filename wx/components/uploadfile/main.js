Component({
  //属性（props）
  properties: {
    fileinfo: {
      type: Object
    }
  },
  //初始数据
  data: {
    fileimg: '/static/filetype/white.png',
    filesize: ''
  },
  observers: {
    'fileinfo': function () {
      var that = this
      var size = this.properties.fileinfo.size


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

      var name = this.properties.fileinfo.name
      var type = name.split('.').reverse()[0].toLowerCase()
      if (type === 'doc' || type === 'docx') {
        that.setData({
          fileimg: '/static/filetype/word.png'
        })
      }
      else if (type === 'pdf') {
        that.setData({
          fileimg: '/static/filetype/pdf.png'
        })
      }
      else if (type === 'xls' || type === 'xlsx') {
        that.setData({
          fileimg: '/static/filetype/excel.png'
        })
      }
      else if (type === 'jpg' || type === 'png' || type === 'gif' || type === 'jpeg') {
        that.setData({
          fileimg: '/static/filetype/jpg.png'
        })
      }
      else if (type === 'mp3') {
        that.setData({
          fileimg: '/static/filetype/mp3.png'
        })
      }
      else if (type === 'txt') {
        that.setData({
          fileimg: '/static/filetype/txt.png'
        })
      }
      else if (type === 'ppt' || type === 'pptx') {
        that.setData({
          fileimg: '/static/filetype/ppt.png'
        })
      }
      else if (type === 'mp4' || type === 'avi' || type === 'mov' || type === 'flv') {
        that.setData({
          fileimg: '/static/filetype/video.png'
        })
      }
      else if (type === 'rar' || type === 'zip' || type === '7z' || type === 'tar' || type === 'iso' || type === 'jar') {
        that.setData({
          fileimg: '/static/filetype/zip.png'
        })

      }
      else {
        that.setData({
          fileimg: '/static/filetype/white.png'
        })
      }
    }
  },
  //方法
  methods: {
    rename() {
      this.triggerEvent('rename')
    }
  }
})