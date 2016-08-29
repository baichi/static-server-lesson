/**
 * 1.浏览器第一次访问服务器的时候，服务器返回需要的文件并返回响应头(Last-Modified)表示此文件的上次修改时间
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
 * 1. 第一次当客户端访问服务器的时候 服务器返回最新内容，并且返回Etag
 */
app.get('/index.js',function(req,res){
    console.log('来访问服务器了');
    var ifNoneMatch = req.headers['if-none-match'];
    getEtag('./index.js',function(md5,content){
        if(ifNoneMatch == md5){
            res.statusCode = 304;
            res.end();
        }else{
            //把对文件内容加密后得到的md5值作为Etag发回去
            res.setHeader('Etag',md5);
            //再把整个文件内容发给客户端
            res.end(content);
        }
    });

});
//获取etag的值
function getEtag(filename,callback){
    //读取文件内容
    fs.readFile(filename,function(err,content){
        var md5 = require('crypto').createHash('md5').update(content).digest('hex');
        callback(md5,content);
    })
}
app.listen(9090);
