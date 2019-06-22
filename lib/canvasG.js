const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

module.exports = {
    exec(list) {
        return new Promise((resolve, reject)=>{
            /*setTimeout(()=>{
                resolve();
            }, 5000)*/
            let allPromises = list.map((item)=>{
                return this.execItem(item);
            });
            
            Promise.all(allPromises).then((result)=>{
                console.log('result', result);
                resolve(result);
            }, ()=>{

            })
        })
        
    },
    execItem(item) {
        return new Promise((resolve, reject)=>{
            let imageMap = {

            };
            let imagesPromise = item.layers.filter((i)=>{
                return i.type == 'pic';
            }).map((i)=>{
                let pic_url = i.image;
                return new Promise((resolve, reject)=>{
                    console.log(pic_url);
                    loadImage(pic_url).then((image)=>{
                        imageMap[pic_url] = {
                            image:  image,
                            success: true,
                        }
                        resolve({
                            success: true,
                        });
                    }, (e)=>{
                        imageMap[pic_url] = {
                            image:  image,
                            success: false,
                            errorMsg: `${pic_url} load error`,
                        }
                        resolve({
                            success: false,
                            
                        });
                    }).catch(()=>{
                        imageMap[pic_url] = {
                            image:  '',
                            success: false,
                            errorMsg: `${pic_url} load error`,
                        }
                        resolve({
                            success: false,
                            errorMsg: `${pic_url} load error`,
                        });
                    })
                })
            })
            Promise.all(imagesPromise).then((result)=>{
                let errorMsgs = [];
                for(let i in imageMap) {
                    if(!imageMap[i].success) {
                        errorMsgs.push(imageMap[i].errorMsg)
                    }
                }
                if(errorMsgs.length > 0) {
                    resolve({
                        id: item.id,
                        success: false,
                        errorMsg: errorMsgs,
                        savePath: '',
                    });
                    return;
                }

                //开始绘制
                const canvas = createCanvas(item.canvasWidth, item.canvasHeight);
                const ctx = canvas.getContext('2d');
                const textLayer = createCanvas(item.canvasWidth, item.canvasHeight);;
                const textCtx = textLayer.getContext('2d');
                let distname = parseInt(Math.random() *10000);
                let buffers = [];
                if(item.values) {
                    // 对生成不同的数字列表进行循环
                    item.values.forEach((value, index)=>{
                        ctx.save();
                        ctx.clearRect(item.canvasWidth, item.canvasHeight);
                        console.log('item', item.layers);
                        item.layers.forEach((layer, index)=>{
                            if(layer.type == 'pic') {
                                let {
                                    left = 0,
                                    top = 0,
                                    width = 0,
                                    height = 0,
                                } = layer;
                                let pic_url = layer.image;
                                
                               
                                if(imageMap[pic_url] && imageMap[pic_url].success) {
                                    console.log('draw image');
                                    let img = imageMap[pic_url].image;
                                    if(width == 'auto' && height == 'auto'){
                                        width = img.width;
                                        height = img.height;
                                    } else {
                                        if(width == 'auto' && height) {
                                            width = img.width / img.height * height; 

                                        } else if(height == 'auto' && width) {
                                            height = img.height / img.width * width; 
                                        }
                                    }
                                    ctx.drawImage(img, left, top, width, height)
                                    /* ctx.rotate(Math.PI/180* 90);                            
                                    ctx.setTransform(1, 0, Math.tan(75), 1, 150, 150);
                                    ctx.drawImage(img, -150, -150, width, height);*/

                                    /*ctx.setTransform(Math.cos(45),Math.sin(45),-Math.sin(45),Math.cos(45), 150, 150);
                                    ctx.drawImage(img, -150, -150, width, height);*/
                                }
                            } else if (layer.type == 'text') {

                                let {

                                    x=0,
                                    y=0,
                                    words='',
                                    left=0,
                                    top=0,
                                    width=0,
                                    height=0,
                                    rotateZ=0, // 旋转
                                    opacity=1, // 不透明度
                                    color='#000000', // 颜色
                                    textAlign='left', // 左右对齐
                                    lineHeight=1,// 行高
                                    letterSpacing = 0,
                                    fontSize=30, // 字体大小
                                    fontFamily='黑体',// 字体
                                    fontStyle='normal',// 字体样式 italic
                                    fontWeight='normal',// 字体粗重 bold
                                    textDecorate='normal',// 下划线 underline
                                    shadowColor='#000000',// 投影颜色
                                    shadowBlur=0,// 投影半径
                                    strokeStyle='#000000',// 描边
                                    lineWidth=0// 描边粗细
                                } = layer;

                                let dig = fontWeight == 'bold' ? 15 : 20;
                                ctx.globalAlpha = opacity;
                                words = words.replace(/\$/, value);
                                // 绘制文本
                                console.log('draw text');
                                // 字体
                                ctx.fillStyle = color;
                                // Write "Awesome!"
                                ctx.font = `${'normal'} ${'normal'} ${layer.fontSize}px '${fontFamily}'`;
                                // ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
                                ctx.textBaseline="middle";

                                let distX = left;
                                /*if(textAlign == 'left'){
                                    distX = left;
                                    ctx.textAlign = 'left';
                                } else if (textAlign == 'right') {
                                    distX = left + width;
                                    ctx.textAlign = 'right';
                                } else if (textAlign == 'center') {
                                    distX = left + width / 2;
                                    ctx.textAlign = 'center';
                                }*/

                                let wordsMeasure = ctx.measureText(words);
                                console.log('wordsWidth', wordsMeasure);

                                // 计算因字间距而改变的每个字的位置
                                let wordsPositions = [];
                                words.split('').forEach((word, index)=>{
                                    let prevWords = words.slice(0, index);
                                    wordsPositions.push({
                                        word: word,
                                        left: ctx.measureText(prevWords).width + index * letterSpacing
                                    })
                                    // console.log(prevWords);
                                    // let prevWordsWidth =  ctx.measureText(words.splice)
                                })
                                let totalWordsWidth = wordsMeasure.width + (words.length > 1 ? ((words.length - 1) * letterSpacing) : 0);

                                
                                if(fontStyle == 'italic') {
                                    // ctx.setTransform(1, 0, Math.tan(75), 1, left + width / 2, top + height / 2);
                                    
                                    ctx.translate(left + width / 2, top + height / 2);
                                    ctx.rotate(rotateZ / 180 * Math.PI);
                                } else {
                                    ctx.translate(left + width / 2, top + height / 2);
                                    ctx.rotate(rotateZ / 180 * Math.PI);
                                }
                                // ctx.translate(0, 100);
                                if(textAlign == 'left'){
                                    console.log(left);
                                    console.log([-width / 2, -height / 2]);
                                    ctx.translate(-width / 2, -height / 2);
                                } else if (textAlign == 'right') {
                                    ctx.translate(-totalWordsWidth + width / 2, -height / 2);
                                } else if (textAlign == 'center') {
                                    console.log('center');
                                    console.log([(-totalWordsWidth) / 2, -height / 2]);
                                    ctx.translate((-totalWordsWidth) / 2, -height / 2);
                                }
                                //console.log(wordsPositions);

                                // 因行间距而改变的top偏移
                                let distTopOffset = lineHeight * fontSize / 2;

                                

                                // 如果描边大于0
                                if(lineWidth > 0) {
                                   
                                    ctx.strokeStyle = strokeStyle;
                                    ctx.lineWidth = lineWidth;
                                    if(shadowBlur > 0) {
                                        ctx.shadowBlur = shadowBlur;
                                        ctx.shadowColor = shadowColor;
                                    }
                                    wordsPositions.forEach((item)=>{
                                        ctx.strokeText(item.word, item.left , distTopOffset);
                                    })
                                    if(textDecorate == 'underline') {
                                        ctx.strokeRect(0, distTopOffset + fontSize / 2, totalWordsWidth, fontSize / dig);
                                    }

                                    ctx.shadowBlur = 0;
                                    ctx.shadowColor = 'rgba(0,0,0,0)';
                                } else if(shadowBlur > 0) {
                                    ctx.shadowBlur = shadowBlur;
                                    ctx.shadowColor = shadowColor;
                                } else {
                                    ctx.shadowBlur = 0;
                                    ctx.shadowColor = 'rgba(0,0,0,0)';
                                }

                                wordsPositions.forEach((item)=>{
                                    ctx.fillText(item.word, item.left , distTopOffset);
                                })
                                if(textDecorate == 'underline') {
                                    ctx.fillRect(0, distTopOffset + fontSize / 2, totalWordsWidth, fontSize / dig);
                                }
                                /*
                                ctx.fillText(words, left , top + distOffset);*/
                            }
                        })
                        buffers.push({
                            value: value,
                            buffer: canvas.toBuffer()
                        })
                        ctx.restore();
                    })
                }
                // console.log('distname', distname);

                let allPromises =buffers.map((bufferItem)=>{
                    let value = bufferItem.value;
                    return new Promise((resolve, reject)=>{
                        let savePath = path.resolve(__dirname, 'images',`${uuidv4()}-${value}.png`);
                        fs.writeFile(savePath, bufferItem.buffer, function(err) {
                            if(err) {
                                // console.error(err);
                                resolve({
                                    // id: item.id,
                                    success: false,
                                    errorMsg: error,
                                    savePath: '',
                                    value,
                                });
                            } else {
                                console.log('生成成功buffer');
                                resolve({
                                    // id: item.id,
                                    success: true,
                                    savePath: savePath,
                                    value,
                                });
                            }
                         });

                    })
                })

                Promise.all(allPromises).then((result)=>{
                    resolve({
                        id: item.id,
                        success: true,
                        result
                        // savePath: `${__dirname}/${distname}.png`,
                    });
                })


            });
            //resolve({id: Date.now(), path: 'dsfasdfsadfsadfds'});
        })
    }
}