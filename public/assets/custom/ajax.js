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

    $.ajax({
        url: '/case/getuserdetails',
        type: 'get',
        dataType: 'json',
        success:function(response){
            $("#userUsername").append(response.user.username);
            if (response.myCases != 0) $("#myCases").append(response.myCases);


            // var len = response.length;

            // $("#user").empty();
            // for( var i = 0; i<len; i++){
            //     var id = response[i]['id'];
            //     var name = response[i]['username'];
                
            //     $("#user").append("<option value='"+id+"'>"+name+"</option>");

            // }
        }
    });

});