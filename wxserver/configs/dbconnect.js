// 模块
var mongoose = require('mongoose');

// 设置
var DB_URL = 'mongodb://localhost:27017/filesome';

// 连接
mongoose.connect(DB_URL, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('数据库连接失败:' + err)
    } else {
        console.log('数据库连接成功!')
    }
});

// -------------------------------------------------------
// 数据构造
var course = new mongoose.Schema({
    course_school: {
        type: String,
    },
    course_filenum: {
        type: Number,
        default:0
    },
    course_name: {
        type: String,
    },
    course_author: {
        type: String
    },
    course_authorid:{
        type:String
    },
    showtime: {
        type: String
    },
    sorttime: {
        type: Number
    }
}, {
    collection: "course"
})

var file = new mongoose.Schema({
    file_school: {
        type: String,
    },
    file_seenum: {
        type: Number,
        default:0
    },
    file_course: {
        type: String,
    },
    file_name: {
        type: String,
    },
    file_author: {
        type: String
    },
    file_authorid:{
        type:String
    },
    file_strogename: {
        type: String
    },
    file_coskey: {
        type: String,
        default:''
    },
    file_size: {
        type: String
    },
    file_type: {
        type: String
    },
    showtime: {
        type: String
    },
    sorttime: {
        type: Number
    },
}, {
    collection: "file"
})


// --------------------接口---------------------------------------------


// 数据模型
var coursemodel = mongoose.model('course', course);
var filemodel = mongoose.model('file', file);




// 输出接口
module.exports.coursemodel = coursemodel
module.exports.filemodel = filemodel



