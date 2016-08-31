var http = require('http');
var zlib = require('zlib');
var fs = require('fs');
var req = http.get({
    host: 'localhost',//请求主机
    port: 9090,//请求的端口号
    path: '/index.html',//请求的路径
    headers: {//请求头
        'accept-encoding': 'gzip, deflate, sdch'
    }
});
///当响应回来的时候调回调函数 response就是响应对象
req.on('response', function (response) {
    var out = fs.createWriteStream('./response.txt');
    //获取响应头中的内容压缩类型
    var contentEncoding = response.headers['content-encoding'];
    if (contentEncoding == 'gzip') {
        response.pipe(zlib.createGunzip()).pipe(out);
    }else if(contentEncoding == 'deflate'){
        response.pipe(zlib.createInflate()).pipe(out);
    }else{
        response.pipe(out);
    }
});
//当调用end的时候请求才会真正发出
req.end();