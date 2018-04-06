function isSomeone(){
    var useremail = getCookie('user');
    if( useremail != ''){
        getGrouplist(useremail);
    }
}

// below for JSON-RPC
function request(method, id, params){
    $.jsonRPC.request(method, {
        id:id,
        params : params,
        success: function(data){
            alert('Success!');
            successRPC(id, data);
        },
        error: function(data){
            alert('Receive error response...');
            failRPC(id);
        }
    });
}

function login(){
    var email = $('#email').val();
    var password = $('#password').val();
    
    var params = {
        'email':email,
        'password':password
    };
    
    request('login', 1001, params);
}

function signup(){
    var email = $('#email_su').val();
    var password = $('#password_su').val();
    var name = $('#name_su').val();
    
    var params = {
        'email':email,
        'password':password,
        'name':name
    };
    
    request('signup', 1002, params);
}

function makeGroup(name){
    var params = {'name': name, 'leader':'admin'};
    request('makegroup', 1003, params);
}

function makeCate(){
    var category = $('#cate_name').val();
    var shortname = $('#cate_Shortname').val();
    var parent_group = $('#cate_group').val();
    
    var params = {
        'category_name':category,
        'short_name':shortname,
        'parent_group':'ALGO'
    };

    request('makeCategory',1007, params);
}

function getGrouplist(email){
    var params = {'email':email};
    request('getGrouplist', 1004, params);
}

function getCategorylist(groupName){
    var params = {'groupname':groupName};
    request('getCategorylist', 1005, params);
}

function open_category(shortName, group){
    $(".page").hide();
    if(shortName != 'home'){
        var params = {'shortName' : shortName, 'group':group}
        request('getArticles', 1006, params);   
    }
    
    $('#' + shortName).show();
}

function goGroup(groupName){
    // var email = getCookie('user');
    $('#email_sf').val( $('#email').val() );
    $('#group_sf').val( groupName );
    // alert( $('#email_sf').val() + $('#group_sf').val() );
    $('#select_form').submit();
 }

function successRPC(id, data){
    if(id == 1001){ //login
        // document.cookie = "user=" + $('#email').val();
        getGrouplist($('#email').val());
        $('#login_box').hide();
    }
    else if( id == 1002){ // signup
        
    }
    else if( id== 1003){ // makegroup
        
    }
    else if( id==1004) { //getGrouplist
        if( data.result == null){
            var content = "<h4 class='center'>Sorry, You don`t have any group... Contact admin.</h4>"
            $('#select_form').append(content);
        }
        else {
            for(var i = 0; i < data.result.length; i++){
                var content = "<button type='button' class='btn btn-default btn-block btn-lg' onClick = \"goGroup('"+data.result[i]+ "')\">" + data.result[i] + "</button>"
                $('#select_form').append(content);
            }
        }
        $('#select_box').show();
    }
    else if( id == 1005){ // getCategorylist
        console.dir(data);
        if( data.result == null){
            var content = "<h4 class='center'>Sorry, There`s no category in this group... Contact admin.</h4>";
            $('#category').append(content);
        }
        else  {
            for( var i = 0; i < data.result.length; i++){
                var content = "<button type=\"button\" class=\"btn btn-default btn-block\" onclick=\"open_category('"+data.result[i].category+"', '" + data.result[i].group + "')\">" + data.result[i].category + "</button>";
                $('#category').append(content);
                
                content = "<option>" + data.result[i].category + "</option>";
                $('#cateInPosting').append(content);
            }
        }
    }
    else if( id==1006){
        console.dir(data);
        var posts = data.result;
        $('#article').empty();
        var content = "<div class='container page'><hr>";
        $('#article').append(content);
        for( var i = 0; i < posts.length; i++){
            var content = "<div><h2>" + posts[i].title + "</h2>";
            content += "<h3>Post by " + posts[i].writer + "<br><span class='glyphicon glyphicon-time'></span>" + posts[i].date + "</h3>";
            content += "<p><h4>" + posts[i].description + "</h4></p>";
            for( var j = 0; j < posts[i].filepath.length;j++){
                var filename = posts[i].filepath[j].split('/');
                
                content += "<a href=/uploads/" + posts[i].filepath[j] + " class= 'btn btn-primary' download>";
                
                if( filename.length == 1) content += filename[0] + "</a>";
                else content += filename[ filename.length -1 ] + "</a>";
            }
            $('#article').append(content + "<br><br><hr><br></div>");
        }
        $('#article').append("</div>");
    }
    else if( id == 1007){
        $('#close_mc').click();
    }
}

function failRPC(id){
    
}