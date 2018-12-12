var fs=require("fs");

var versionstr='"version": "0.0.';
var packageFile="package.json";
var data=fs.readFileSync(packageFile,"utf-8");
var sl=data.split("\n");
var rs="";
for(var i=0;i<sl.length;i++){
    var j=sl[i].indexOf(versionstr);
    if(j>=0){
        var d=new Date();
        var dv=d.getFullYear()+g(d.getMonth(),1)+g(d.getDate(),0)+g(d.getHours(),0);
        rs=rs+'\t'+versionstr+dv+'",\n';
    }else{
        rs=rs+sl[i]+"\n";
    }
}
fs.writeFileSync(packageFile,rs);

function g(t,a){
    t=t+a;
    if(t<10)return "0"+t;
    return t;
}