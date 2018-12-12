var fs=require("fs");

var str_v='"version": ';
var str_d='"date":"';
var packageFile="package.json";
var data=fs.readFileSync(packageFile,"utf-8");
var sl=data.split("\n");
var rs="";
for(var i=0;i<sl.length;i++){
    var si=sl[i];
    var j=si.indexOf(str_v);
    if(j>=0){
        j=si.lastIndexOf(".")+1;
        var num=parseInt(si.substr(j))+1;
        si=si.substr(0,j)+num+'",';
    }else{
        j=si.indexOf(str_d);
        if(j>=0){
            var d=new Date();
            var dv=d.getFullYear()+"-"+g(d.getMonth(),1)+"-"+g(d.getDate(),0)+" "+g(d.getHours(),0)+":"+g(d.getMinutes(),0);
            si=si.substr(0,j)+str_d+dv+'",';
        }
    }
    rs=rs+si+"\n";
}
fs.writeFileSync(packageFile,rs);

function g(t,a){
    t=t+a;
    if(t<10)return "0"+t;
    return t;
}