/**
 * 在客户端请求服务器的时候，会发送一个
 * Accept-Encoding: gzip, deflate, sdch 请求头
 * 在服务器响应的时候
 * Content-Encoding:gzip
 */

var http = require('http');
var zlib = require('zlib');
var fs = require('fs');
//  /index.html
http.createServer(function(req,res){
    //先获取请求的文件名
   var filename = '.'+req.url;
    //根据文件名创建一个可读流
   var rs = fs.createReadStream(filename);
    //从请求头中获取客户端支持的压缩类型
   var acceptEncoding = req.headers['accept-encoding']||'';
    //如果客户端支持deflate
   if(acceptEncoding.match(/\bdeflate\b/)){
       //设置响应头中的内容编码
       res.setHeader('Content-Encoding','deflate');
       //原始文件进行压缩->导入到响应流里
       rs.pipe(zlib.createDeflate()).pipe(res);
   }else if(acceptEncoding.match(/\bgzip\b/)){
       //设置响应头中的内容编码
       res.setHeader('Content-Encoding','gzip');
       //原始文件进行压缩->导入到响应流里
       rs.pipe(zlib.createGzip()).pipe(res);
   }else{
       rs.pipe(res);
   }
}).listen(9090);