Component({
    //属性（props）
    properties: {
        placeholder: {
            type: String,
            value: ''
        },
        value: {
            type: String,
            value: ''
        },
    },
    //初始数据
    data: {
       
        tempvalue: ''
    },
    //方法
    methods: {
        onCancel(e) {
            this.triggerEvent('cancel')
        },
        onConfirm(e) {
            this.triggerEvent('confirm')
        },
        onInput(e) {
            this.setData({
                tempvalue: e.detail.value
            })
            this.triggerEvent('input', this.data.tempvalue)
        },
    }

})