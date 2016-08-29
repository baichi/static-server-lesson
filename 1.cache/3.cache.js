/**
 *
 */

var express = require('express');
var fs = require('fs');
var app = express();
//为res增加了一个方法，发送错误
app.use(function(req,res,next){
    res.sendError = function(){
        res.statusCode = 500;//写上状态码
        res.end('服务器端错误');//错误响应体
    }
    next();
});
app.get('/',function(req,res){
    res.sendFile('index.html',{root:__dirname});
});
/**
 * 希望浏览发现本地有缓存的话就干脆不要发请求了
 *
 *
 */
app.get('/index.js',function(req,res){
    console.log('重新请求服务器index.js');
    //设置缓存有效时间 有距离当前10秒后
   var expires = new Date(Date.now() + 10 * 1000);
   //res.setHeader('Expires',expires.toUTCString());
   //指定此缓存多少秒后过期，在过期之前不需要再请求服务器
   res.setHeader('Cache-Control',"max-age=10");
   fs.createReadStream('./index.js').pipe(res);
});

app.listen(9090);
