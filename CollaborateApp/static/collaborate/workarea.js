var editor = null;
var file_list = ['py','java','js','css','html','r','c','json'];
var host_url = window.location.protocol + '//' + window.location.hostname;
var port = window.location.port;
var theme_options = ['default', '3024-day', '3024-night', 'abcdef', 'ambiance', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'darcula', 'dracula', 'duotone-dark', 'duotone-light', 'eclipse', 'elegant', 'erlang-dark', 'gruvbox-dark', 'hopscotch', 'icecoder', 'idea', 'isotope', 'lesser-dark', 'liquibyte', 'lucario', 'material', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'oceanic-next', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'railscasts', 'rubyblue', 'seti', 'shadowfox', 'solarized dark', 'solarized light', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn']
if(port)
    host_url += ':' + window.location.port;

function selectTheme() {
    var input = document.getElementById("theme_selector");
    var theme = input.options[input.selectedIndex].textContent;
    editor.setOption("theme", theme);
}

function load_home()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET","{% url 'collaborate:user_home' %}", true);
    xhttp.send();
}

function load_upload(group_id)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("upload_form").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET","{% url 'collaborate:file_form' groupid=1%}".replace(1,group_id), true);
    xhttp.send();
}

function load_files(group_id,flag)
{
    var list = document.getElementById('files_'+group_id);
    var nav = document.getElementById('nav_'+group_id);
        if(list.children.length == 0)
            nav.className = nav.className.replace("open","close");
        if( list.children.length != 0 && flag == 0)
        {
            if(list.style.display == "none")
            {
                list.style.display = "block";
                nav.className = nav.className.replace("close","open");
            }
            else
            {
                list.style.display = "none";
                nav.className = nav.className.replace("open","close");
            }
        }
        else
        {
            var loader = document.getElementById('group_loader_'+group_id);
            loader.className.replace('loads','load');
            $.ajax({
            url: host_url + "{% url 'collaborate:group_files' group=1 %}".replace(1,group_id),
            type:'GET',
            dataType: 'json',
            success:function(response){
                var no_of_files = response.length
                $('#files_'+group_id).empty();
                for(var i=0; i<no_of_files; i++)
                {
                    var list_element = document.createElement("li");
                    var list_text = document.createElement("span");
                    var img_element = document.createElement("img");
                    var download_element = document.createElement("span");
                    var delete_element = document.createElement("span");
                    img_element.setAttribute("height","15px");
                    img_element.setAttribute("width","15px");
                    img_element.setAttribute("style","margin-right:10px;");
                    img_element.setAttribute("id","logo_"+response[i].id);
                    download_element.setAttribute("class","glyphicon glyphicon-save");
                    download_element.setAttribute("style","float:right;margin-right:10px;");
                    download_element.setAttribute("onclick","download_file("+response[i].id+")");
                    download_element.setAttribute("id","download_"+response[i].id);
                    delete_element.setAttribute("id","deletefile_"+response[i].id);
                    delete_element.setAttribute("class","glyphicon glyphicon-trash");
                    delete_element.setAttribute("style","float:right;margin-right:10px;");
                    delete_element.setAttribute("onclick","delete_file("+response[i].id+")");
                    list_text.setAttribute("id","file_"+response[i].id);
                    list_text.setAttribute("onclick","load_file("+response[i].id+")");
                    list_element.appendChild(img_element);
                    list_element.appendChild(download_element);
                    list_element.appendChild(delete_element);
                    var file_name = response[i].url.split('/').pop();
                    var file_ext = file_name.split('.').pop();
                    if( file_list.includes(file_ext))
                        img_element.setAttribute("src","{% static 'exts/9.png' %}".replace(9,file_ext));
                    else
                        img_element.setAttribute("src","{% static 'exts/file.png' %}");
                    list_text.innerHTML = file_name;
                    list_element.appendChild(list_text);
                    list.children.length += 1;
                    list.appendChild(list_element);
                    nav.className = nav.className.replace("close","open");
                }
                loader.className.replace('load','loads');
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
            })
        }
}

function save_file(file_id)
{
    var myTextarea = document.getElementById('codearea')
    $.ajax({
            url: host_url + "{% url 'collaborate:edit_file' fileid=1 %}".replace(1,file_id),
            type:'GET',
            data:{ 'content': editor.getValue().toString()},
            dataType: 'json',
            success:function(response){
                alert(response.message)
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function delete_file(file_id)
{
    $.ajax({
            url: host_url + "{% url 'collaborate:delete_file' fileid=1 %}".replace(1,file_id),
            type:'GET',
            dataType: 'json',
            success:function(response){
                alert(response.message);
                load_home();
                var file = document.getElementById("file_"+file_id);
                var img = document.getElementById("logo_"+file_id);
                var download = document.getElementById("download_"+file_id);
                var del = document.getElementById("deletefile_"+file_id);
                file.parentElement.removeChild(file);
                img.parentElement.removeChild(img);
                download.parentElement.removeChild(download);
                del.parentElement.removeChild(del);

            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function download_file(file_id)
{
    $.ajax({
         url: host_url + "{% url 'collaborate:download_file' fileid=1 %}".replace(1,file_id),
         type:'GET',
         dataType:'binary',
         processData:false,
         success: function (data) {
            console.log(data);
             var a = document.createElement('a');
             var url = window.URL.createObjectURL(data);
             a.href = url;
             a.download = document.getElementById("file_"+file_id).innerHTML;
             document.body.appendChild(a);
             a.click();
             window.URL.revokeObjectURL(url);
         },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function load_file(file_id)
{
    var file_field = document.getElementById("file_"+file_id);
    var extension = file_field.innerHTML.split('.').pop();
    if(file_list.includes(extension)){
    $.ajax({
            url: host_url + "{% url 'collaborate:get_file_data' fileid=1 %}".replace(/1/,file_id),
            type:'GET',
            dataType: 'json',
            success:function(response){
                var content = document.getElementById("content");
                content.innerHTML = "";
                var textarea = document.createElement("textarea");
                var header = document.createElement("h4");
                var save_button = document.createElement("button");
                var delete_button = document.createElement("button");
                var theme_changer = document.createElement("select");
                theme_changer.setAttribute('class','form-control');
                theme_changer.setAttribute('id','theme_selector');
                theme_changer.setAttribute('onchange','selectTheme()');
                theme_changer.setAttribute('style','float:right;margin-right:10px;max-width:250px;z-index:1000;');
                for(option in theme_options)
                {
                    var option_div = document.createElement("option");
                    option_div.value = theme_options[option];
                    option_div.text = theme_options[option];
                    theme_changer.add(option_div);
                }
                save_button.setAttribute('class','btn btn-success');
                delete_button.setAttribute('class','btn btn-danger');
                save_button.setAttribute('style','float:right;margin-right:10px;');
                delete_button.setAttribute('style','float:right;margin-right:10px;');
                save_button.setAttribute('onclick','save_file(id)'.replace('id',file_id));
                delete_button.setAttribute('onclick','delete_file(id)'.replace('id',file_id));
                save_button.innerHTML = 'SAVE';
                delete_button.innerHTML = 'DELETE';
                header.innerHTML = "Code Editor:";
                textarea.setAttribute('id','codearea');
                textarea.setAttribute('style','margin:20px;');
                content.appendChild(delete_button);
                content.appendChild(save_button);
                content.appendChild(theme_changer);
                content.appendChild(header);
                content.appendChild(textarea);
                var myTextarea=document.getElementById('codearea')
                editor = CodeMirror.fromTextArea(myTextarea, {
                    lineNumbers: true,
                });
                editor.setValue(response['data'].toString());
                },
            error:function(error)
            {
                alert(error.responseJSON['message']);
                console.log(error.responseJSON)
                var content = document.getElementById("content");
                content.innerHTML = "";
            }
            })
    }
    else
    {
        download_file(file_id);
    }
}

function upload_file(group_id)
{
    load_upload(group_id);
    document.getElementById('upload_panel').style.display = 'block';
}

function close_upload()
{
    document.getElementById('upload_panel').style.display = 'none';
}

function create_group()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("create_group_body").innerHTML = this.responseText;
    }
    else
    {
        console.log(this.readyState,this.status)
    }
    };
    xhttp.open("GET","{% url 'collaborate:add_group' %}", true);
    xhttp.send();
    document.getElementById('create_group').style.display = 'block';
}

function close_group()
{
    document.getElementById('create_group').style.display = 'none';
}

function load_group(group_id)
{
    var table = document.getElementById('group_table_'+group_id);
    if(table.children.length == 0)
    {
    $.ajax({
            url: host_url + ("{% url 'collaborate:group_details' group=1 %}".replace(/1/,group_id)),
            type:'GET',
            dataType: 'json',
            success:function(response){
                var users = response['user_set'];
                for(user in users)
                {
                    var data = users[user];
                    var row = document.createElement("tr");
                    row.setAttribute('id','group_user_'+data['username']);
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(data['first_name']+' '+data['last_name']);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cell = document.createElement("td");
                    cellText = document.createTextNode(data['username']);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    table.appendChild(row);
                    cell = document.createElement("td");
                    cellText = document.createElement("a");
                    cellText.setAttribute('style','color:red;cursor:pointer;');
                    cellText.setAttribute('onclick',"delete_from_group("+group_id+",'"+data['username']+"')");
                    var span = document.createElement("span");
                    span.setAttribute('class','glyphicon glyphicon-trash small');
                    cellText.appendChild(span);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    table.appendChild(row);
                }
                document.getElementById('group_panel_body_'+group_id).style.display = 'block';
                var icon = document.getElementById('max_min_'+group_id);
                icon.className = icon.className.replace('plus','minus');
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
    }
    else
    {
        var display = document.getElementById('group_panel_body_'+group_id).style;
        var icon = document.getElementById('max_min_'+group_id);
        if(display.display == 'none')
        {
            display.display = 'block';
            icon.className = icon.className.replace('plus','minus');
        }
        else
        {
            display.display = 'none';
            icon.className = icon.className.replace('minus','plus');
        }
    }
}

function view_group_details()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET","{% url 'collaborate:load_user_details' %}", true);
    xhttp.send();
}

function delete_group(group_id)
{
    $.ajax({
            url: host_url + "{% url 'collaborate:delete_group' group=1 %}".replace(/1/,group_id),
            type:'GET',
            dataType: 'json',
            success:function(response){
                var group = document.getElementById("group_panel_"+group_id);
                var group_nav = document.getElementById("group_nav_"+group_id);
                group.parentElement.removeChild(group);
                group_nav.parentElement.removeChild(group_nav);
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function add_user_to_group(group_id)
{
    $.ajax({
            url: host_url + "{% url 'collaborate:add_to_group' group=1 %}".replace(/1/,group_id),
            type: 'GET',
            data: {'username': document.getElementById('username_'+group_id).value },
            dataType: 'json',
            success:function(response){
                var data = response['message'];
                if(data!='User exists!')
                {
                    var table = document.getElementById('group_table_'+group_id);
                    var row = document.createElement("tr");
                    row.setAttribute('id','group_user_'+data['username']);
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(data['first_name']+' '+data['last_name']);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cell = document.createElement("td");
                    cellText = document.createTextNode(data['username']);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    table.appendChild(row);
                    cell = document.createElement("td");
                    cellText = document.createElement("a");
                    cellText.setAttribute('style','color:red;cursor:pointer;');
                    cellText.setAttribute('onclick',"delete_from_group("+group_id+",'"+data['username']+"')");
                    var span = document.createElement("span");
                    span.setAttribute('class','glyphicon glyphicon-trash small');
                    cellText.appendChild(span);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    table.appendChild(row);
                }
                else
                    alert(data);
                document.getElementById('username_'+group_id).value='';
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function delete_from_group(group_id,username)
{
    $.ajax({
            url: host_url + "{% url 'collaborate:delete_from_group' group=1 user='h' %}".replace(1,group_id).replace('h',username),
            type:'GET',
            dataType: 'json',
            success:function(response){
                var message = response['message'];
                if(message == 'Success')
                {
                    var group_user = document.getElementById("group_user_"+username);
                    group_user.parentElement.removeChild(group_user);
                }
                else
                    alert(message);
                if(username == '{{ request.user }}')
                {
                    var group = document.getElementById("group_panel_"+group_id);
                    var group_nav = document.getElementById("group_nav_"+group_id);
                    group.parentElement.removeChild(group);
                    group_nav.parentElement.removeChild(group_nav);
                }
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function check_match()
{
    var password1 = document.getElementById('new_password').value;
    var password2 = document.getElementById('confirm_password').value;
    var ack = document.getElementById('password_match').style;
    var submit_button = document.getElementById('change_password_button');
    if(password1 == password2)
    {
        ack.display = 'none';
        submit_button.removeAttribute('disabled');
    }
    else
    {
        ack.display = 'table-cell';
        submit_button.setAttribute('disabled','true');
    }
}

function get_change_password()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET","{% url 'collaborate:fetch_change_password_page' %}", true);
    xhttp.send();
}

function get_edit_profile()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET","{% url 'collaborate:fetch_edit_profile_page' %}", true);
    xhttp.send();
}

function change_password()
{
    $.ajax({
            url: host_url + "{% url 'collaborate:change_password' %}",
            type:'GET',
            data: {
                'old_password': document.getElementById('old_password').value,
                'new_password': document.getElementById('new_password').value
            },
            dataType: 'json',
            success:function(response){
                alert(response['message']);
                window.location.replace("{% url 'collaborate:home' %}");
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function edit_profile()
{
    $.ajax({
            url: host_url + "{% url 'collaborate:edit_profile' %}",
            type:'GET',
            data: {
                'first_name': document.getElementById('first_name').value,
                'last_name': document.getElementById('last_name').value,
                'email': document.getElementById('email').value
            },
            dataType: 'json',
            success:function(response){
                alert(response['message']);
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function set_username(username,group_id)
{
    document.getElementById("username_"+group_id).value = username;
    document.getElementById('group_search_view_'+group_id).style.display = 'none';
}

function search_users(group_id)
{
    var username = document.getElementById("username_"+group_id).value;
    var search_view = document.getElementById('group_search_view_'+group_id);
    var search_keyword = document.getElementById('group_search_view_keyword_'+group_id);
    var search_view_details = document.getElementById('group_search_view_list_content_'+group_id);
    search_view_details.innerHTML = "";
    var search_view_details_count = document.getElementById('search_view_count_'+group_id);
    search_view_details_count.innerHTML = '';
    if(username.length == 0)
    {
        search_view.style.display = 'none';
    }
    else if(username.length < 3)
    {
        search_keyword.innerHTML = 'Minimum 3 characters required for suggesstions. ';
        search_view.style.display = 'block';
        document.getElementById('group_search_view_list_'+group_id).style.display = 'none';
    }
    else
    {
        $.ajax({
            url: host_url + "{% url 'collaborate:get_users_by_keyword' %}",
            type:'GET',
            data: {
                'keyword': username
            },
            dataType: 'json',
            success:function(response){
                var users = response['users'];
                if(users.length == 0)
                {
                    search_view_details_count.innerHTML = 'No users found.';
                    search_keyword.innerHTML = username;
                    document.getElementById('group_search_view_list_'+group_id).style.display = 'none';
                }
                else
                {
                    for(user in users)
                    {
                        var data = users[user];
                        var row = document.createElement("tr");
                        row.setAttribute('id','search_user_'+data['username']);
                        row.setAttribute('onclick','set_username("'+data['username']+'",'+group_id+')');
                        row.setAttribute('style','cursor:pointer;');
                        var cell = document.createElement("td");
                        var cellText = document.createTextNode('Name: '+data['first_name']+' '+data['last_name']);
                        //cell.setAttribute('style','padding:10px');
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        cell = document.createElement("td");
                        cellText = document.createTextNode('Username: '+data['username']);
                        //cell.setAttribute('style','padding:10px');
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        search_view_details.appendChild(row);
                    }
                    search_keyword.innerHTML = username;
                    search_view_details_count.innerHTML = users.length+' users found.';
                    document.getElementById('group_search_view_list_'+group_id).style.display = 'table';
                    search_view.style.display = 'block';
                }
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
    }
}