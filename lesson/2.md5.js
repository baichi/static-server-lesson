/**
 * 摘要算法也叫哈希算法
 * 将任意长度的输入转变成固定长度的输出
 */
var crypto = require('crypto');
//console.log(crypto.getHashes());
var fs = require('fs');
//对这个文件的文件内容进行摘要输出
var rs = fs.createReadStream('./1.txt');
var md5 = crypto.createHash('md5');
/**
 * 1. 相同的输入一定会产生相同的输出
 * 2. 不同的输入会产生不同的输出
 * 3. 不能从输出反推算出输入
 */
rs.on('data',function(data){
    //通过update可以指定输入的内容，另外在最终输出之前可以调用多次update
    md5.update(data);
});
rs.on('end',function(data){
    console.log(md5.digest('hex'));//hex 表示是十六进制的方式输出
});
//827ccb0eea8a706c4c34a16891f84e7b
//e6481c46e064c35e8f6e371d72912507
