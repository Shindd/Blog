function open_category(name){
    $(".page").hide();
    $('#' + name).show();
}

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

function getGrouplist(email){
    var params = {'email':email};
    request('getGrouplist', 1004, params);
}

function goGroup(groupname){
    // var email = getCookie('user');
    $.post("./page.html",
          {
            email : 'test01@test.com',
            groupname : groupname
        });
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
}

function failRPC(id){
    
}