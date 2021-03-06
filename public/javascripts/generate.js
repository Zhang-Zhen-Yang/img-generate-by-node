$(function(){
    var area = $('#area');
    var submit = $('#submit');
    var presetJSON = [
        // 1
        {   
            canvasWidth: 400, // 生成的画布宽
            canvasHeight: 700, // 生成的画布高
            values: [100],
            id: 111,
            // 图层
            layers: [
                // 图片类型
                {
                    type: 'pic',
                    // image: 'http://imgs.aixifan.com/content/2019_04_08/1554691042560.JPG',
                    image: 'https://imgs.aixifan.com/content/2019_6_2/1.559475156410427E9.jpeg',
                    left: 0,
                    top: 0,
                    width: 400, // 可以是 数字或 'auto'
                    height: 'auto', // 可以是 数字或 'auto'
                },
                /*{
                    type: 'pic',
                    image: 'http://imgs.aixifan.com/content/2019_04_08/1554724160778.JPG',
                    x: 50,
                    y: 50,
                    w: 200,
                    h: 200,
                },
                {
                    type: 'text',
                    word: '$',
                    color: '#F36842',
                    fontSize: 50,
                    fontFamily: 'Impact',
                    x: 30,
                    y: 100,
                },*/
                {
                    type: 'text',
                    words: '令和 $',
                   
                   
                                
                    left: 0,
                    top: 150,
                    width: 300,
                    height: 100,
                    rotateZ: 0, // 旋转
                    opacity: 0.9, // 不透明度
                    color: '#3E54C3', // 颜色
                    textAlign: 'left', // 左右对齐
                    lineHeight: 1,// 行高
                    letterSpacing: 3,
                    fontSize: 50, // 字体大小
                    fontFamily: 'HappyZcool',// 字体
                    fontStyle: 'normal',// 字体样式 italic
                    fontWeight: 'bold',// 字体粗重 bold
                    textDecorate:'underline',// 下划线 underline
                    shadowColor: '#000000',// 投影颜色
                    shadowBlur:0,// 投影半径
                    strokeStyle: '#A0A94D',// 描边
                    lineWidth:0// 描边粗细
                },
            ]            
        },
        // 2
        /*{   
            canvasWidth: 300, // 生成的画布宽
            canvasHeight: 300, // 生成的画布高
            values: [2],
            id: 222,
            // 图层
            layers: [
                // 图片类型
                {
                    type: 'pic',
                    image: 'http://imgs.aixifan.com/content/2019_04_08/1554691053078.JPG',
                    x: 0,
                    y: 0,
                    w: 300,
                    h: 300,
                },
                {
                    type: 'text',
                    word: 'cintiq',
                    color: '#B380F3',
                    fontSize: 40,
                    fontFamily: 'Impact',
                    x: 150,
                    y: 150,
                },
            ]            
        }*/
    ]
    // alert('ddd');
    area.val(JSON.stringify(presetJSON));

    $('#preview').on('click', function(){
        var value = (new Function('', 'return '+area.val()))();
        $('.preview').remove();
        value.forEach((item)=>{
            let canvasWidth = item.canvasWidth;
            let canvasHeight = item.canvasHeight;
            
            item.values.forEach((val)=>{
                let c = $('<div class="preview"></div>').css({
                    width: canvasWidth +'px',
                    height: canvasHeight + 'px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'inline-block',
                })
                item.layers.forEach((l)=>{
                
                    if(l.type == 'pic') {
                        let pic = $('<img src="'+ l.image +'">').css({
                            left: l.left +'px',
                            top: l.top +'px',
                            width: l.width + 'px',
                            height: l.height + 'px',
                            position: 'absolute',
                        })
                        c.append(pic);
                    } else if (l.type == 'text') {
                        
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
                        } = l;
                        console.log(fontSize);
                        words = words.replace(/\$/, val);
                        let text = $('<div>'+ words +'</div>').css({
                            left: left +'px',
                            top: top +'px',
                            width: width + 'px',
                            height: height + 'px',
                            position: 'absolute',
                            fontSize: fontSize+'px',
                            fontFamily: fontFamily,
                            fontWeight: fontWeight,
                            lineHeight: lineHeight + 'em',
                            letterSpacing: letterSpacing + 'px',
                            textAlign: textAlign,
                            color: color,
                            opacity: opacity,
                            transform: 'rotateZ('+rotateZ+'deg)',
                            fontStyle: fontStyle,
                            textDecoration: textDecorate,
                            whiteSpace: 'nowrap',
                            textShadow: '0 0 '+shadowBlur+'px '+shadowColor,
                        })
                        c.append(text);
                    }
                })
                $('#preview-container').append(c);
            })

            
            



        })
    })
    submit.on('click', function(){
        var value = (new Function('', 'return '+area.val()))();
        console.log(value);

        $.ajax({
            type: 'POST',
            url: 'generateAction',
            data: {
                action: JSON.stringify(value),
            },
            success: function(res) {

            },
            error:function(res){

            }
            
        });
    

    })

})