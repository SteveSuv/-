// 模块
var express = require('express');
var bodyParser = require('body-parser');

// 初始化 
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// 路由
app.get('/',(req,res)=>{
    res.render('index.html')
})

var Router = require('./routes/api');
app.use('/api', Router);


// 端口
app.listen('4848', () => {
    console.log('http://127.0.0.1:4848');
});
