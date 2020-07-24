$(document).ready(function(){

    $("#department").change(function(){
        var deptid = $(this).val();

        $.ajax({
            url: '/case/department/'+deptid,
            type: 'get',
            dataType: 'json',
            success:function(response){

                var len = response.length;

                $("#user").empty();
                for( var i = 0; i<len; i++){
                    var id = response[i]['id'];
                    var name = response[i]['username'];
                    
                    $("#user").append("<option value='"+id+"'>"+name+"</option>");

                }
            }
        });
    });

});