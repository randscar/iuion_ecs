### Grunt自动化构建工具的使用
使用目的
*	编译的all.js放到build/目录
*	需要生成build/all.js.map
*	需要生成build/all.d.ts
*	需要生成build/all.min.js
*	基于ES5，Commonjs编译
*	编译后的文件删除注释
*	编译后将build目录下的所有文件复制到test文件夹里做测试


一、插件准备
*	安装cli(需要安装全局的方便直接在cmd里处理命令)

```javascript
npm install grunt-cli -g
```

*	安装依赖项
```javascript
//更新npm到最新版本
npm install npm -g
//grunt插件
npm install grunt --save-dev
//grunt-ts编译器插件(ts2js)
npm install grunt-ts --save-dev
//javascript语法错误检查插件
npm install grunt-contrib-jshint --save-dev
//压缩javascript代码插件
npm install grunt-contrib-uglify --save-dev
//copy文件拷贝插件
npm install grunt-contrib-copy --save-dev
//（js合并）
npm install grunt-contrib-concat --save-dev
```