// 模块
var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require("path")
// 数据库
var dbconnect = require('../configs/dbconnect');
var uploader = require('../configs/uploader');
var cos = require('../configs/cos');

var coursedata = dbconnect.coursemodel
var filedata = dbconnect.filemodel

//api
router.get('/', async (req, res) => {
    res.send('hello,api!')
})

router.get('/courses', async (req, res) => {
    try {
        var school = req.query.school
        var arr = await coursedata.find({ 'course_school': school });
        for (let i = 0; i < arr.length; i++) {
            var filenum = await filedata.find({ 'file_course': arr[i]['course_name'], 'file_school': arr[i]['course_school'] }).countDocuments()
            arr[i]['course_filenum'] = filenum
        }
        arr.sort((a, b) => {
            return b.course_filenum - a.course_filenum
        })
        res.send(arr)
    } catch (err) {
        console.log(err);
    }
})

router.post('/addcourse', async (req, res) => {
    try {
        var courses = await coursedata.find({ 'course_school': req.body.course_school }).select('-_id course_name')
        var arr = []
        courses.forEach(e => {
            arr.push(e.course_name)
        })
        if (arr.indexOf(req.body.course_name) < 0) {
            var onedata = new coursedata(req.body)
            await onedata.save()
            res.send('1')//success
        }
        else {
            res.send('0')//课程重复
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/files', async (req, res) => {
    try {
        var course = req.query.course
        var school = req.query.school
        var arr = await filedata.find({ 'file_course': course, 'file_school': school }).sort('-sorttime');
        res.send(arr)
    } catch (err) {
        console.log(err);
    }
})



router.post('/addfile', uploader.single('file'), async (req, res) => {
    try {

        var file_name = req.body.file_name
        var fileinfo = req.file
        var resp = {
            file_name: file_name,
            file_strogename: fileinfo.filename,
            file_size: fileinfo.size, //k
            file_type: fileinfo.originalname.split('.').reverse()[0].toLowerCase()
        }
        res.send(resp)
    } catch (err) {
        console.log(err);
    }
})

router.post('/savefile', async (req, res) => {
    try {
        var filearr = await filedata.find({ 'file_school': req.body.file_school, 'file_course': req.body.file_course }).select('-_id file_name')

        var arr = []
        filearr.forEach(e => {
            arr.push(e.file_name)
        })

        function isSameName(name) {
            if (arr.indexOf(name) >= 0) {
                return true
            }
            else {
                return false
            }
        }

        var name = req.body.file_name
        var puretype = name.split('.').reverse()[0].toLowerCase()
        var purename = name.slice(0, name.indexOf(puretype) - 1)

        if (isSameName(req.body.file_name)) {
            for (let i = 1; true; i++) {
                req.body.file_name = purename + '(' + i + ')' + '.' + puretype
                if (!isSameName(req.body.file_name)) {
                    break
                }
            }
        }

        var file_path = path.resolve(__dirname, '../public/upload/' + req.body.file_strogename)
        var file_key = req.body.file_school + '/' + req.body.file_course + '/' + req.body.file_name

        cos.upload_file({
            file_key: file_key,
            file_path: file_path
        })
        var onedata = new filedata(req.body)
        onedata.file_coskey = file_key
        await onedata.save()
        res.send('1')
    } catch (err) {
        console.log(err);
    }
})

router.post('/deletefile', async (req, res) => {
    try {
        var file = await filedata.findOne({ '_id': req.body.id })
        var key = file.file_coskey
        await cos.delete_file(key)
        await filedata.deleteOne({ '_id': req.body.id })
        res.send('1')
    } catch (err) {
        console.log(err);
    }
})

router.get('/search', async (req, res) => {
    try {
        var keyword = req.query.keyword
        var arr = [1, 2, 3, 4, 5]
        res.send(arr)
    } catch (err) {
        console.log(err);
    }
})

router.get('/filedetail', async (req, res) => {
    try {
        var id = req.query.id
        var resp = await filedata.findOne({ '_id': id })
        resp.file_seenum++
        await resp.save()
        res.send(resp)
    } catch (err) {
        console.log(err);
    }
})

// 导出
module.exports = router

