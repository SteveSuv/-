
//全力做search:课程页搜索课程，资料页搜索资料，跳转到result,呈现方式不同而已
Component({
    //属性（props）
    properties: {
        placeholder:{
            type:String
        },
        value:{
            type:String
        }
    },
    //初始数据
    data: {
        tempvalue: ''
    },
    //方法
    methods: {
        onInput(e){
            this.setData({
                tempvalue: e.detail.value
            })
            this.triggerEvent('input', this.data.tempvalue)
        },
    }
})