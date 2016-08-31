var http = require('http');
var fs = require('fs');
var url = require('url');
//此模块可以实现从文件类型到MIME的转换
var mime = require('mime');
var zlib = require('zlib');
var server = http.createServer(function(req,res){
    //实现路由 根据客户端请求的资源不同返回不同的响应
    var urlObj = url.parse(req.url,true);//true query是对象，false query是字符串
    //请求路径 端口号和问号中间的那部分字符串
    var pathname = urlObj.pathname;
    // /a   /a/index.html    / /index.html
    pathname = pathname + (pathname.endsWith('/')?'index.html':'');

    // /index.css
    var filename = './public'+pathname;
    console.log(filename);
    fs.exists(filename,function(exists){
        if(exists){
            res.setHeader('Content-Type',mime.lookup(filename));
            //当客户端有etag的时候，会把etag放在if-none-match请求头里发到服务器
            var ifNoneMatch = req.headers['if-none-match'];

            if(ifNoneMatch){
                var md5 = getEtag(filename);
                if(md5 == ifNoneMatch){
                    send304();
                }else{
                    sendFile(filename,md5);
                }
            }else{
                //取得请求头中的最后修改时间
                var ifModifiedSince = req.headers['if-modified-since'];
                if(ifModifiedSince){
                    //判断客户端传过来的最后修改时间和服务器此文件的最后修改时间是否一致
                    var lastModified = getLastModified(filename);
                    if(ifModifiedSince == lastModified){
                        send304();
                    }else{
                        //发送实际文件
                        sendFile(filename,undefined,lastModified);
                    }
                }else{
                    //发送实际文件
                    sendFile(filename);
                }
            }
        }else{
            res.statusCode = 404;
            res.end('Not Found');
        }
    })

    function getEtag(filename){
        var content = fs.readFileSync(filename);
        return require('crypto').createHash('md5').update(content).digest('hex');
    }

    //取得此文件的最后修改时间
    function getLastModified(filename){
        return fs.statSync(filename).ctime.toGMTString();
    }

    function send304(){
        res.statusCode = 304;
        res.end('Not Modified');
    }
    //把文件发送到客户端
    function sendFile(filename,md5,lastModified){
        res.setHeader('Etag',md5||getEtag(filename));//返回最新的etag
        res.setHeader('Last-Modified',lastModified||getLastModified(filename));
        //设置缓存的绝对过期时间为一小时后
        res.setHeader('Expires',new Date(Date.now()+3600*1000).toGMTString());
        //设置缓存的相对过期时间为一小时后
        res.setHeader('Cache-Control',"max-age=3600");

        var acceptEncoding = req.headers['accept-encoding']||'';
        var rs = fs.createReadStream(filename);

        if(acceptEncoding.match(/\bdeflate\b/)){
            res.setHeader('Content-Encoding','deflate');
            rs.pipe(zlib.createDeflate()).pipe(res);
        }else if(acceptEncoding.match(/\bgzip\b/)){
            res.setHeader('Content-Encoding','gzip');
            rs.pipe(zlib.createGzip()).pipe(res);
        }else{
            rs.pipe(res);
        }
    }
});
server.listen(80,function(){
    console.log('server started at port 80!');
});