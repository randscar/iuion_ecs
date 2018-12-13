//包装函数  https://www.npmjs.com/package/grunt-ts
module.exports = function (grunt) {

    // 获取package.json的信息
    var pkg=grunt.file.readJSON('package.json');
    var bar='/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.licenses %> */';
      console.log(bar);
    //任务配置，所有插件的配置信息
    grunt.initConfig({
        pkg:pkg,
        banner:bar,
        ts:  //用来编译typescript的任务
        {
            options: {
                target: "es5",
                module: "amd",
                banner: '<%= banner %>',
                comments: "all", // 显示注释
                declaration: true, // 生成.d.ts
                sourceMap: true,//生成.map
                fast:"never"
            },
            build:{
                src:['src/core/*.ts'],
                //reference: 'src/ref/_iuion.ts',  //第一次生成reference.ts,之后手动修改顺序,之后注释掉
                out: './dest/iuion.js',
            },
            idb:{
                src:['src/idb/*.ts'],
                //reference: 'src/ref/_idb.ts',  //第一次生成reference.ts,之后手动修改顺序,之后注释掉
                out: './dest/idb.js',
            }
            
            // test: {
            //     files: {
            //         'build/iuion_ecs.js':['src/core/*.ts'],
            //         'build/idb.js':['src/idb/*.ts']
            //     }
            // },
            // default:{
            //     tsconfig:true
            // }
        },
        
      uglify: {
          options: {
              //banner: '<%= banner %>',
              mangleProperties: false,
              comments: false, //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
              beautify:false
          },
          min: {
              options: {
                  compress: true,
                  comments: false
              },
              files: {
                  "dest/iuion.min.js": ["dest/iuion.js"],
                  "dest/idb.min.js":["dest/idb.js"]
              }
          }
      }
     
    //   //copy插件把build目录下的所有文件复制到test文件夹
    //   copy:
    //   {
    //       builds: { expand: true, cwd: 'build/', src: '*', dest: 'test/' }
    //   }
      
    });

     //加载之前命令行安装的3个插件
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    
    //grunt.loadNpmTasks("grunt-contrib-copy");

    //输入grunt时需要做些什么，注意先后顺序
    grunt.registerTask('default', ["ts:build","ts:idb"]);
    //grunt.registerTask('con', ["concat:foo"]);
    grunt.registerTask('ug', ["uglify:min"]);
    //grunt.registerTask('concat2', ["concat"]);
    grunt.registerTask('make', ["ts:build","ts:idb","uglify:min"]);
};


