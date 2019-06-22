$(function(){
    var area = $('#area');
    var submit = $('#submit');

    area.val('empty');

    submit.on('click', function(){
        var value = area.val();
        console.log(value);

        $.ajax({
            type: 'POST',
            url: 'deleteAction',
            data: {
                action: value,
            },
            success: function(res) {

            },
            error:function(res){

            }
            
        });
    

    })

})