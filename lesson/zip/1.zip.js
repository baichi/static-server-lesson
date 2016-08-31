var fs = require('fs');
var zlib = require('zlib');
function zip(src){
    //创建一个可读流
   var rs = fs.createReadStream(src);
   //创建一个压缩流 可读可写
   var z = zlib.createGzip();
   //创建一个可写流
   var out = fs.createWriteStream(src+'.gz');
    //对可读流进行压缩然后写到可写流里面
   rs.pipe(z).pipe(out);
}
//zip('index.txt');
// index.txt.gz

function unzip(src){
  //创建一个解压前的可读流
   var rs = fs.createReadStream(src);
   var z = zlib.createUnzip();
   var out = fs.createWriteStream(src.slice(0,src.length-3));
   rs.pipe(z).pipe(out);
}
unzip('./index.txt.gz');