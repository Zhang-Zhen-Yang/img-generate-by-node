var path = require('path');
var fs = require('fs');
module.exports = function(action) {
    // 清容当前文件夹下的文件
    if(action == 'empty') {
        return new Promise((resolve, reject)=>{
            // 读取图片目录下的文件信息
            fs.readdir(path.join(__dirname,'./images'), function(error, list) {
                if(error) {
                    console.error(error);
                    return;
                }
                /* fs.stat(path.join(__dirname, 'images' ,list[0]), function(error, data){
                    console.log('one data', data.isFile());
                })*/
                let statsPromises = list.map((item)=>{
                    return new Promise((resolve, reject) => {
                        fs.stat(path.join(__dirname, 'images', item), function(error, data){
                            if(error) {
                                console.error(error);
                                resolve({
                                    name: item,
                                    success: true,
                                    error: error,
                                    data: {}
                                });
                                return;
                            }
                            resolve({
                                name: item,
                                data:data,
                            });
                        });
                    })
                })
                Promise.all(statsPromises).then((res)=>{
                    let deletePromises = res.map((f) =>{
                        return new Promise((resolve, reject)=>{
                            // 如果是文件类型
                            if(f.data.isFile && f.data.isFile()) {
                                fs.unlink(path.join(__dirname, 'images', f.name), function(error) {
                                    if(error) {
                                        resolve({
                                            name: f.name,
                                            success: false,
                                            res: error,
                                        })
                                        return;
                                    }
                                    resolve({
                                        name: f.name,
                                        success: true,
                                    })
                                });
                            } else {
                                resolve({
                                    name: f.name,
                                    success: false,
                                    res: 'not file',
                                })
                            }
                        });
                    })
                    Promise.all(deletePromises).then((res)=>{
                        resolve(res);
                    })
                    console.log(res);
                }, (res)=>{
                    console.log(res);
                })
                // console.log(list);
            });

            /* resolve({
                success: true
            });*/
        })
    } else {
        
        return new Promise((resolve)=>{
            let names = action.split(',');
            console.log(names);
            let statsPromises = names.map((i,index)=>{
                let pathMsg = path.parse(i.trim());
                let baseName = pathMsg.base;
                return new Promise((resolve, reject)=>{
                    fs.unlink(path.join(__dirname, 'images', baseName),function(error) {
                        if(error) {
                            resolve({
                                name: baseName,
                                success: false,
                                res: error,
                            })
                            return;
                        }
                        resolve({
                            name: baseName,
                            success: true,
                        })
                    });
                    
                });
                console.log(pathMsg);
            })
            Promise.all(statsPromises).then((res)=>{
                resolve(res);
            })
        })

    }
}