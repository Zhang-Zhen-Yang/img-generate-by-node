const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const fontsMap = require('./fonstMap.js');
const Blob = require('node-blob');
const cacheImageFiles = require('./cacheImageFiles.js');
let imageMap = {};

module.exports = {
    exec(item, price) {
        return new Promise((resolve, reject)=>{
            let imageMap = {

            };
            // 对图层进行循环
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
                let canvasWidth = item.canvasWidth;
                let canvasHeight = item.canvasHeight;

                const canvas = createCanvas(canvasWidth, canvasHeight);
                const ctx = canvas.getContext('2d');
                const textLayer = createCanvas(canvasWidth, canvasHeight);;
                const textCtx = textLayer.getContext('2d');
                let distname = parseInt(Math.random() *10000);
                let buffers = [];
                // if(item.values) {
                    // 对生成不同的数字列表进行循环
                    ['one'].forEach((value, index)=>{
                        ctx.save();
                        ctx.clearRect(canvasWidth, canvasHeight);
                        console.log('item', item.layers);
                        item.layers.forEach((layer, index)=>{
                            // 图片图层
                            if(layer.type == 'pic') {
                                ctx.globalAlpha = 1;
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
                            } else if (layer.type == 'text') { // 文本图层
                                textCtx.save();
                                textCtx.lineCap = 'round';
                                textCtx.lineJoin = 'round';
                                textCtx.clearRect(0, 0, canvasWidth, canvasHeight);
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

                                if(price) {
                                    words = price;
                                }

                                let dig = fontWeight == 'bold' ? 15 : 20;
                                let boldStroke = fontSize * 0.03;

                                let fontFamilyDetails = fontsMap[fontFamily] || {};

                                // 绘制文本
                                console.log('draw text');
                                // 字体
                                textCtx.fillStyle = color;
                                // Write "Awesome!"
                                textCtx.font = `${'normal'} ${ fontFamilyDetails.weight || 'normal'} ${layer.fontSize}px '${fontFamilyDetails.name || fontFamily}'`;
                                // textCtx.font = `${'normal'} ${'normal'} ${layer.fontSize}px '郑庆科黄油体Regular'`;
                                // ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
                                textCtx.textBaseline="middle";

                                let distX = left;
                                let wordsMeasure = textCtx.measureText(words);
                                console.log('wordsWidth', wordsMeasure);

                                // 计算因字间距而改变的每个字的位置
                                let wordsPositions = [];
                                words.split('').forEach((word, index)=>{
                                    let prevWords = words.slice(0, index);
                                    wordsPositions.push({
                                        word: word,
                                        left: textCtx.measureText(prevWords).width + index * letterSpacing
                                    })
                                })
                                let totalWordsWidth = wordsMeasure.width + (words.length > 1 ? ((words.length - 1) * letterSpacing) : 0);

                                // 斜体
                                if(fontStyle == 'italic') {
                                    textCtx.setTransform(1, 0, Math.tan(75), 1, canvasWidth / 2, canvasHeight / 2)
                                } else {
                                    textCtx.translate(canvasWidth / 2, canvasHeight / 2);
                                }
                                

                                // 因行间距而改变的top偏移
                                let distTopOffset = lineHeight * fontSize / 2;

                                

                                // 如果描边大于0
                                if(lineWidth > 0) {
                                   
                                    if(shadowBlur > 0) {
                                        textCtx.shadowBlur = shadowBlur;
                                        textCtx.shadowColor = shadowColor;
                                    }
                                    // 如果是粗体，支持粗体
                                    if(fontWeight == 'bold' && fontFamilyDetails.boldEnable) {
                                        textCtx.lineWidth = lineWidth + boldStroke;
                                        wordsPositions.forEach((item)=>{
                                            textCtx.strokeText(item.word, item.left - totalWordsWidth/ 2, distTopOffset);
                                        })
                                        if(textDecorate == 'underline') {
                                            textCtx.strokeRect(-totalWordsWidth / 2, distTopOffset + fontSize / 2, totalWordsWidth, fontSize / dig);
                                        }
                                        textCtx.lineWidth = 0;
                                        textCtx.strokeStyle = 'rgba(0,0,0,0)'
                                    } else {
                                        textCtx.lineWidth = lineWidth;
                                        textCtx.strokeStyle = strokeStyle;
                                    }
                                    wordsPositions.forEach((item)=>{
                                        textCtx.strokeText(item.word, item.left - totalWordsWidth/ 2, distTopOffset);
                                    })

                                    if(textDecorate == 'underline') {
                                        textCtx.strokeRect(-totalWordsWidth / 2, distTopOffset + fontSize / 2, totalWordsWidth, fontSize / dig);
                                    }
                                    

                                    textCtx.shadowBlur = 0;
                                    textCtx.shadowColor = 'rgba(0,0,0,0)';
                                } else if(shadowBlur > 0) {
                                    textCtx.shadowBlur = shadowBlur;
                                    textCtx.shadowColor = shadowColor;

                                    if(fontWeight == 'bold' && fontFamilyDetails.boldEnable) {
                                        textCtx.lineWidth = boldStroke;
                                        textCtx.strokeStyle = color;

                                        wordsPositions.forEach((item)=>{
                                            console.log([item, item.left - totalWordsWidth / 2]);
                                            textCtx.strokeText(item.word, item.left - totalWordsWidth/ 2, distTopOffset);
                                        })
                                        if(textDecorate == 'underline') {
                                            textCtx.fillRect(-totalWordsWidth / 2, distTopOffset + fontSize / 2, totalWordsWidth, fontSize / dig);
                                        }
                                        textCtx.shadowBlur = 0;
                                        textCtx.shadowColor = 'rgba(0,0,0,0)';
                                    }
                                    
                                } else {
                                    /*console.log('boldStroke', boldStroke);
                                    console.log(fontWeight == 'bold')
                                    console.log(!!fontFamilyDetails.boldEnable)*/
                                    
                                    textCtx.shadowBlur = 0;
                                    textCtx.shadowColor = 'rgba(0,0,0,0)';
                                    
                                    if(fontWeight == 'bold' && !!fontFamilyDetails.boldEnable) {
                                        textCtx.lineWidth = boldStroke;
                                        textCtx.strokeStyle = color;
                                        wordsPositions.forEach((item)=>{
                                            console.log([item, item.left - totalWordsWidth / 2]);
                                            textCtx.strokeText(item.word, item.left - totalWordsWidth/ 2, distTopOffset);
                                        })
                                    }
                                }
                                
                                wordsPositions.forEach((item)=>{
                                    console.log([item, item.left - totalWordsWidth / 2]);
                                    textCtx.imageSmoothingEnabled = false;
                                    textCtx.fillText(item.word, item.left - totalWordsWidth/ 2, distTopOffset);
                                })

                                if(textDecorate == 'underline') {
                                    textCtx.fillRect(-totalWordsWidth / 2, distTopOffset + fontSize / 2, totalWordsWidth, fontSize / dig);
                                }
                                /*
                                ctx.fillText(words, left , top + distOffset);*/
                                // ctx.fillRect(0,10,300,10);


                                ctx.translate(left + width / 2, top + height / 2);
                                ctx.rotate(rotateZ / 180 * Math.PI);
                                // ctx.fillText('banana', 0, 0);


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
                                if(fontStyle == 'italic') {
                                    ctx.translate(Math.cos(30)*fontSize, 0);
                                }

                                // ctx.fillText('apple fgsdfgdfg', 0, 0);
                                ctx.globalAlpha = opacity;
                                ctx.imageSmoothingEnabled = false;
                                ctx.drawImage(textLayer, -((canvasWidth - totalWordsWidth) / 2), -(canvasHeight / 2), canvasWidth, canvasHeight);
                                ctx.restore();
                                textCtx.restore();
                            }
                        })
                        let buffer = canvas.toBuffer();
                        
                        buffers.push({
                            value: value,
                            size: `${canvasWidth}x${canvasHeight}`,
                            buffer: buffer,
                        })
                       
                        ctx.restore();
                    })
                // }
                // console.log('distname', distname);

                let bufferItem = buffers[0];
                let value = bufferItem.value;
                let size = bufferItem.size;
                let currentTime = new Date();
                let currentTimeString = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()}-${currentTime.getHours()}-${currentTime.getMinutes()}`;
                console.log(currentTimeString);
                
                let name = `t${currentTimeString}-uuid${uuidv4()}-v${value}-s${size}.png`;
                resolve({
                    // id: item.id,
                    success: true,
                    buffer: bufferItem.buffer,
                    name,
                });




                

                /* 
                let allPromises =buffers.map((bufferItem)=>{
                    let value = bufferItem.value;
                    let size = bufferItem.size;
                    let currentTime = new Date();
                    let currentTimeString = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()}-${currentTime.getHours()}-${currentTime.getMinutes()}`;
                    console.log(currentTimeString);
                    return new Promise((resolve, reject)=>{
                        let name = `t${currentTimeString}-uuid${uuidv4()}-v${value}-s${size}.png`;
                        resolve({
                            // id: item.id,
                            success: true,

                            name,
                        });
                        // 文件保存的路径
                        let savePath = path.resolve(__dirname, 'images', name);
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
                                // console.log('生成成功buffer');
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
                })*/


            });
            //resolve({id: Date.now(), path: 'dsfasdfsadfsadfds'});
        })
    }
}