// https://cloud.tencent.com/document/product/436/8629

var COS = require('cos-nodejs-sdk-v5');
var fs = require('fs')
var cos = new COS({
    SecretId: 'AKIDWvCRaUUZLDAvWuiYdeN7qx0jMn7MwMBe',
    SecretKey: 'KgCgLq9JQQI1382kIm5C8Y0GKF7oJeTL'
});
var Bucket = 'filesome-1300389039'
var Region = 'ap-beijing'


// ----------------创建文件夹--------------------------------------------
function create_folder(folder_name) {
    cos.putObject({
        Bucket: Bucket,
        Region: Region,
        Key: folder_name + '/',
        Body: '',
    }, function (err, data) {
        console.log(err || 'done');
    })
}

// ----------------上传文件--------------------------------------------
function upload_file(file) {
    cos.sliceUploadFile({
        Bucket: Bucket,
        Region: Region,
        Key: file.file_key,
        FilePath: file.file_path,
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            fs.unlink(file.file_path, function (err2) {
                if (err2) {
                    console.log(err2);
                }
                else {
                    console.log('done');
                }
            })
        }
    });
}


function upload_files(files) {
    let uploadfiles = []
    files.forEach(e => {
        uploadfiles.push({
            Bucket: Bucket,
            Region: Region,
            Key: e.file_key,
            FilePath: e.file_path,
        })
    })
    cos.uploadFiles({
        files: uploadfiles,
    }, function (err, data) {
        console.log(err || 'done');
    });
}


// ---------------下载文件---------------------------------------------

function download_file(key) {
    cos.getObject({
        Bucket: Bucket,
        Region: Region,
        Key: key,              /* 必须 */
    }, function (err, data) {
        console.log(err || data.Body);
        // console.log(err || 'done');
    });
}


function download_path(key) {
    return `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`
}

// ----------------删除文件--------------------------------------------

function delete_file(key) {
    cos.deleteObject({
        Bucket: Bucket,
        Region: Region,
        Key: key,
    }, function (err, data) {
        console.log(err || 'done');
    });
}

function delete_files(keys) {
    let obj = []
    keys.forEach(e => {
        obj.push({ 'key': e })
    })
    cos.deleteMultipleObject({
        Bucket: Bucket,
        Region: Region,
        Objects: obj
    }, function (err, data) {
        console.log(err || 'done');
    });
}

module.exports = {
    'create_folder': create_folder,
    'upload_file': upload_file,
    'upload_files': upload_files,
    'download_file': download_file,
    'download_path': download_path,
    'delete_file': delete_file,
    'delete_files': delete_files
}