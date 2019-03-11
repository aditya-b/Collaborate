var editor = null;
var file_list = ['py','java','js','css','html','r','c','json', 'xml', 'rtf', 'txt', 'cpp'];
var img_list = ['jpg', 'jpeg', 'gif'];
var music_list = ['mp3', 'ogg', 'wav'];
var video_list = ['mp4', 'avi'];
var gdocs_list = ['pdf', 'docx', 'doc', 'ppt', 'pptx', 'xls', 'xlsx']
var others_list = ['zip', 'exe', 'iso']
var icon_list = file_list + gdocs_list + img_list + others_list + video_list + music_list;
var exec_api_list = ['py', 'java', 'c', 'cpp', 'r'];
var host_url = window.location.protocol + '//' + window.location.hostname;
var port = window.location.port;
var theme_options = ['abcdef', 'default', '3024-day', '3024-night', 'ambiance', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'darcula', 'dracula', 'duotone-dark', 'duotone-light', 'eclipse', 'elegant', 'erlang-dark', 'gruvbox-dark', 'hopscotch', 'icecoder', 'idea', 'isotope', 'lesser-dark', 'liquibyte', 'lucario', 'material', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'oceanic-next', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'railscasts', 'rubyblue', 'seti', 'shadowfox', 'solarized dark', 'solarized light', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn'];
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
    xhttp.open("GET",load_home_url, true);
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
    xhttp.open("GET", load_upload_url.replace(1,group_id), true);
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
            loader.className = loader.className.replace('loads','load');
            $.ajax({
            url: host_url + load_files_url.replace(1,group_id),
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
                    var load_element = document.createElement("span");
                    var file_name = response[i].url.split('/').pop();
                    var file_ext = file_name.split('.').pop();
                    img_element.setAttribute("height","15px");
                    img_element.setAttribute("width","15px");
                    img_element.setAttribute("style","margin-right:10px;");
                    img_element.setAttribute("id","logo_"+response[i].id);
                    download_element.setAttribute("class","glyphicon glyphicon-save");
                    download_element.setAttribute("style","float:right;margin-right:10px;");
                    download_element.setAttribute("onclick","download_file("+response[i].id+")");
                    download_element.setAttribute("id","download_"+response[i].id);
                    load_element.setAttribute("class","glyphicon glyphicon-refresh load small");
                    load_element.setAttribute("style","float:right;margin-right:10px;display:none;");
                    load_element.setAttribute("id","load_"+response[i].id);
                    delete_element.setAttribute("id","deletefile_"+response[i].id);
                    delete_element.setAttribute("class","glyphicon glyphicon-trash");
                    delete_element.setAttribute("style","float:right;margin-right:10px;");
                    delete_element.setAttribute("onclick","delete_file("+response[i].id+"," + group_id +")");
                    list_text.setAttribute("id","file_"+response[i].id);
                    list_text.setAttribute("name", file_name);
                    list_text.setAttribute("onclick","load_file("+response[i].id + ",'" + btoa(response[i].url)+ "','" + file_ext +"')");
                    list_element.appendChild(img_element);
                    list_element.appendChild(download_element);
                    list_element.appendChild(delete_element);
                    list_element.appendChild(load_element);
                    file_name = file_name.replace('.' + file_ext, '');
                    var ext_text = '';
                    if( icon_list.includes(file_ext))
                    {
                        img_element.setAttribute("src", file_icon_url.replace(9,file_ext));
                        ext_text = '..';
                    }
                    else
                    {
                        img_element.setAttribute("src",file_icon_url.replace(9,'file'));
                        ext_text = file_ext;
                    }
                    if(file_name.length > 18)
                        file_name = file_name.slice(0,18) + '.' + ext_text;
                     if(!icon_list.includes(file_ext) && file_name.indexOf('.' + file_ext) == -1)
                        file_name = file_name + '.' + file_ext;
                    list_text.innerHTML = file_name;
                    list_element.appendChild(list_text);
                    list.children.length += 1;
                    list.appendChild(list_element);
                    nav.className = nav.className.replace("close","open");
                }
                if(no_of_files == 0) {
                    var list_element = document.createElement("li");
                    var list_text = document.createElement("span");
                    list_text.innerHTML = "No files added yet."
                    list_text.setAttribute("style", "color:grey");
                    list_element.appendChild(list_text);
                    list.children.length += 1;
                    list.appendChild(list_element);
                    nav.className = nav.className.replace("close","open");
                }
                loader.className = loader.className.replace('load','loads');
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
    document.getElementById("load_"+file_id).style.display = "inline-block";
    $.ajax({
            url: host_url + save_file_url.replace(1,file_id),
            type:'GET',
            data:{ 'content': editor.getValue().toString()},
            dataType: 'json',
            success:function(response){
                alert(response.message)
                document.getElementById("load_"+file_id).style.display = "none";
            },
            error:function(error){
                alert(error.responseJSON['message']);
                document.getElementById("load_"+file_id).style.display = "none";
            }
    })
}

function delete_file(file_id, group_id)
{
    document.getElementById("load_"+file_id).style.display = "inline-block";
    $.ajax({
            url: host_url + delete_file_url.replace(1,file_id),
            type:'GET',
            dataType: 'json',
            success:function(response){
                alert(response.message);
                load_home();
                var file = document.getElementById("file_"+file_id);
                file.parentElement.parentElement.removeChild(file.parentElement);
				var list = document.getElementById('files_'+group_id);
				if(list.children.length <= 0) {
                    var nav = document.getElementById('nav_'+group_id);
					var list_element = document.createElement("li");
                    var list_text = document.createElement("span");
                    list_text.innerHTML = "No files added yet."
                    list_text.setAttribute("style", "color:grey");
                    list_element.appendChild(list_text);
                    list.children.length += 1;
                    list.appendChild(list_element);
                    nav.className = nav.className.replace("close","open");
				}
            },
            error:function(error){
                alert(error.responseJSON['message']);
                document.getElementById("load_"+file_id).style.display = "none";
            }
    })
}

function download_file(file_id)
{
    document.getElementById("load_"+file_id).style.display = "inline-block";
    $.ajax({
         url: host_url + download_file_url.replace(1,file_id),
         type:'GET',
         dataType:'binary',
         processData:false,
         success: function (data) {
             var a = document.createElement('a');
             var url = window.URL.createObjectURL(data);
             a.href = url;
             a.download = document.getElementById("file_"+file_id).getAttribute("name");
             document.body.appendChild(a);
             a.click();
             window.URL.revokeObjectURL(url);
             document.getElementById("load_"+file_id).style.display = "none";
         },
            error:function(error){
                alert(error.responseJSON['message']);
                document.getElementById("load_"+file_id).style.display = "none";
            }
    })
}

function addEditor(file_id){
	var textarea = document.createElement("textarea");
    var header = document.createElement("h4");
    var save_button = document.createElement("button");
    var delete_button = document.createElement("button");
    var theme_changer = document.createElement("select");
    var theme_changer_label = document.createElement("label");
    theme_changer_label.setAttribute('class', 'form-control');
    theme_changer_label.setAttribute('style','float:right;margin-right:10px;max-width:250px;z-index:1000;, box-shadow:none; -webkit-box-shadow:none; width:fit-content;border:none;');
    theme_changer_label.innerHTML = "Editor Theme: ";
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
    content.appendChild(theme_changer_label);
    content.appendChild(header);
    content.appendChild(textarea);
}

function addHtmlControls(file_url_encoded) {

}

function changeVersion() {
	var lang_version_map = {
		'java': ['JDK 1.8.0_66', 'JDK 9.0.1', 'JDK 10.0.1'],
		'python2': [ '2.7.11', '2.7.15'],
		'python3': [ '3.5.1', '3.6.3', '3.6.5'],
		'c': ['GCC 5.3.0', 'Zapcc 5.0.0', 'GCC 7.2.0', 'GCC 8.1.0'],
		'cpp': ['GCC 5.3.0', 'Zapcc 5.0.0', 'GCC 7.2.0', 'GCC 8.1.0'],
		'r': ['3.3.1', '3.4.2', '3.5.0']
	};
	var language = document.getElementById('language');
	var lang = language.options[language.selectedIndex].textContent;
	var versions = document.getElementById('versions');
	$('#versions').empty();
	var versions_options = lang_version_map[lang];
	for(option in versions_options)
    {
        var option_div = document.createElement("option");
        option_div.value =versions_options[option];
        option_div.text = versions_options[option];
        versions.add(option_div);
    }
}

function executeCode() {
	var language_changer = document.getElementById('language');
	var language = language_changer.options[language_changer.selectedIndex].textContent;
	var version = document.getElementById('versions').selectedIndex;
	var script = editor.getValue().toString();
	var input = document.getElementById('inputarea').value;
	var output = document.getElementById('outputarea');
	var cpuTime = document.getElementById('cputime');
	var memory = document.getElementById('memory');
	var loader = document.getElementById('execution_loader');
	var loading_text = document.getElementById('execution_status');
	var requestData = {
		'language': language,
		'version': version,
		'script': script,
		'input': input,
		'csrfmiddlewaretoken': getCSRF()
	};
	loader.className = loader.className.replace('ok', 'refresh');
	loader.className = loader.className.replace('remove', 'refresh');
	loader.style.display = "inline-block";
	loading_text.style.color = "red";
	loader.style.color = "red";
	loading_text.innerHTML = "In progress  ";
	loader.className = loader.className.replace('loads', 'load');
	$.ajax({
        url: host_url + code_execution_url,
        type:'POST',
        data: requestData,
        dataType: 'json',
        success:function(response){
           output.value = response.output;
           cpuTime.innerHTML = response.cpuTime + ' s';
           memory.innerHTML = (parseInt(response.memory)/1000) + 'kB';
           loading_text.style.color = "green";
           loader.style.color = "green";
           loading_text.innerHTML = "Executed  ";
           loader.className = loader.className.replace('load', 'loads');
           loader.className = loader.className.replace('refresh', 'ok');
        },
        error:function(error){
            console.log(error);
            var errorMsg = error.responseJSON['error'] || error.responseJSON['message'] || error.responseJSON['detail'];
            alert(errorMsg);
            loading_text.innerHTML = "Error occurred!";
            loader.className = loader.className.replace('load', 'loads');
            loader.className = loader.className.replace('refresh', 'remove');
        }
    });
}

function getCSRF() {
	return document.cookie.split('=').pop();
}

function addControls(extension) {
	var lang_version_map = {
		'java': ['JDK 1.8.0_66', 'JDK 9.0.1', 'JDK 10.0.1'],
		'python2': [ '2.7.11', '2.7.15'],
		'python3': [ '3.5.1', '3.6.3', '3.6.5'],
		'c': ['GCC 5.3.0', 'Zapcc 5.0.0', 'GCC 7.2.0', 'GCC 8.1.0'],
		'cpp': ['GCC 5.3.0', 'Zapcc 5.0.0', 'GCC 7.2.0', 'GCC 8.1.0'],
		'r': ['3.3.1', '3.4.2', '3.5.0']
	};
	var ext_lang_map = {
		'java': 'java',
		'c': 'c',
		'py': 'python3',
		'cpp': 'cpp',
		'r': 'r'
	};
	var language = ext_lang_map[extension];
	var language_options = Object.keys(lang_version_map);
	var swap = '';
	var index = language_options.indexOf(language);
	swap = language_options[0];
	language_options[0] = language;
	language_options[index] = swap;
	var version_options = lang_version_map[language];
	var textarea = document.createElement("textarea");
	var textarea2 = document.createElement("textarea");
    var header = document.createElement("h4");
    var run_button = document.createElement("button");
    var language_changer = document.createElement("select");
    var language_changer_label = document.createElement("label");
    language_changer_label.setAttribute('class', 'form-control');
    language_changer_label.setAttribute('style','box-shadow:none; -webkit-box-shadow:none; width:fit-content; border:none; display:table-cell; vertical-align:middle;');
    language_changer_label.innerHTML = "Language: ";
    language_changer.setAttribute('class','form-control');
    language_changer.setAttribute('id','language');
    language_changer.setAttribute('style','width:150px;');
    language_changer.setAttribute('onchange','changeVersion()');
    var version_changer = document.createElement("select");
    var version_changer_label = document.createElement("label");
    version_changer_label.setAttribute('class', 'form-control');
    version_changer_label.setAttribute('style','box-shadow:none; -webkit-box-shadow:none; width:fit-content; border:none; display:table-cell; vertical-align:middle;');
    version_changer_label.innerHTML = "Version: ";
    version_changer.setAttribute('class','form-control');
    version_changer.setAttribute('style','width: 150px;');
    version_changer.setAttribute('id','versions');
    for(option in version_options)
    {
        var option_div = document.createElement("option");
        option_div.value = version_options[option];
        option_div.text = version_options[option];
        version_changer.add(option_div);
    }
    for(option in language_options)
    {
        var option_div = document.createElement("option");
        option_div.value = language_options[option];
        option_div.text = language_options[option];
        language_changer.add(option_div);
    }
    run_button.setAttribute('class','btn btn-success');
    run_button.setAttribute('onclick','executeCode()');
    run_button.setAttribute('style','margin:10px;');
    run_button.innerHTML = 'Run';
    header.innerHTML = "Execution options:";
    header.setAttribute('style', 'margin-top:25px;')
    textarea.setAttribute('id','inputarea');
    textarea.setAttribute('style','margin:20px;width:50%;float:left;resize:none; background:black; color:white; font-family:monospace;');
    textarea.setAttribute('class','form-control');
    textarea.setAttribute('rows','8');
    textarea.setAttribute('placeholder','Code input here...');
    textarea2.setAttribute('id','outputarea');
    textarea2.setAttribute('style','margin:20px; width:100%; resize:none;background:black; color:white; font-family:monospace;');
    textarea2.setAttribute('class','form-control');
    textarea2.setAttribute('readonly', 'true');
    textarea2.setAttribute('placeholder','Code output here...');
    var loading_div = document.createElement("h4");
    loading_div.innerHTML = 'Execution status:  ';
    loading_div.setAttribute('style', 'display:inline');
    var loading_text = document.createElement("h5");
    loading_text.setAttribute('style', 'display: inline; color:black');
    loading_text.setAttribute('id', 'execution_status');
    var loader = document.createElement('h5');
    loader.setAttribute('style', 'display:none; color:black;');
    loader.setAttribute('class', 'glyphicon glyphicon-refresh small loads');
    loader.setAttribute('id', 'execution_loader');
    loading_text.innerHTML = "N/A";
    var table = document.createElement('table');
    table.setAttribute('style', 'margin:50px;');
    var row1 = document.createElement('tr');
    var cell1 = document.createElement('td');
    cell1.appendChild(language_changer_label);
    cell1.setAttribute('style', 'padding:5px');
    var cell2 = document.createElement('td');
    cell2.appendChild(language_changer);
    cell2.setAttribute('style', 'padding:5px');
    row1.appendChild(cell1);
    row1.appendChild(cell2);
    var row2 = document.createElement('tr');
    var cell3 = document.createElement('td');
    cell3.appendChild(version_changer_label);
    cell3.setAttribute('style', 'padding:5px');
    var cell4 = document.createElement('td');
    cell4.appendChild(version_changer);
    cell4.setAttribute('style', 'padding:5px');
    row2.appendChild(cell3);
    row2.appendChild(cell4);
    var row3 = document.createElement('tr');
    var cell5 = document.createElement('td');
    cell5.setAttribute('colspan', '2');
    cell5.setAttribute('style', 'text-align:center;');
    cell5.appendChild(run_button);
    row3.appendChild(cell5);
    table.appendChild(row1);
    table.appendChild(row2);
    table.appendChild(row3);
    textarea2.setAttribute('rows', '8');
    content.appendChild(header);
    content.appendChild(textarea);
    content.appendChild(table);
    content.appendChild(loading_div);
    content.appendChild(loading_text);
    content.appendChild(loader);
    content.appendChild(textarea2);
    var meta = document.createElement('div');
    meta.setAttribute('style', 'margin-top:5px');
    var cpu_time_label = document.createElement("label");
    cpu_time_label.setAttribute('class', 'form-control');
    cpu_time_label.setAttribute('style','box-shadow:none; -webkit-box-shadow:none; width:fit-content; border:none; display:inline;');
    cpu_time_label.innerHTML = "CPU Time: ";
    var cpu_time = document.createElement("label");
    cpu_time.setAttribute('class', 'form-control');
    cpu_time.setAttribute('style','box-shadow:none; -webkit-box-shadow:none; width:fit-content; border:none; display:inline;');
    cpu_time.setAttribute('id', 'cputime');
    cpu_time.innerHTML = "N/A";
    var memory_label = document.createElement("label");
    memory_label.setAttribute('class', 'form-control');
    memory_label.setAttribute('style','box-shadow:none; -webkit-box-shadow:none; width:fit-content; border:none; display:inline;');
    memory_label.innerHTML = "Memory: ";
    var memory = document.createElement("label");
    memory.setAttribute('class', 'form-control');
    memory.setAttribute('style','box-shadow:none; -webkit-box-shadow:none; width:fit-content; border:none; display:inline;');
    memory.setAttribute('id', 'memory');
    memory.innerHTML = "N/A";
    meta.appendChild(cpu_time_label);
    meta.appendChild(cpu_time);
    meta.appendChild(memory_label);
    meta.appendChild(memory);
    content.appendChild(meta);
}

function load_file(file_id, file_url_encoded, extension)
{
    var file_field = document.getElementById("file_"+file_id);
    var content = document.getElementById("content");
    content.innerHTML = "";
    document.getElementById("load_"+file_id).style.display = "inline-block";
    if(file_list.includes(extension)){
    $.ajax({
            url: host_url + load_file_url.replace(/1/,file_id),
            type:'GET',
            dataType: 'json',
            success:function(response){
                addEditor(file_id);
                if(extension == 'html')
                    addHtmlControls(file_url_encoded);
                if(exec_api_list.includes(extension))
                    addControls(extension);
                var myTextarea=document.getElementById('codearea')
                editor = CodeMirror.fromTextArea(myTextarea, {
                    lineNumbers: true,
                });
                selectTheme();
                editor.setValue(response['data'].toString());
                document.getElementById("load_"+file_id).style.display = "none";
            },
            error:function(error)
            {
                alert(error.responseJSON['message']);
                console.log(error.responseJSON);
                document.getElementById("load_"+file_id).style.display = "none";
            }
            })
    }
    else if(gdocs_list.includes(extension))
    {
        var iframe = document.createElement("iframe");
        var url_file = "http://docs.google.com/viewer?url=" + atob(file_url_encoded) + "&embedded=true";
        iframe.setAttribute('src', url_file);
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '600px');
        iframe.setAttribute('allowfullscreen', 'true');
        content.appendChild(iframe);
        document.getElementById("load_"+file_id).style.display = "none";
    }
    else if(music_list.includes(extension)) {
        var audio = document.createElement("audio");
        var source = document.createElement("source");
        var center = document.createElement("center");
        source.setAttribute('src', atob(file_url_encoded));
        var type = extension === 'mp3'? 'mpeg': 'ogg';
        source.setAttribute('type', 'audio/' + type);
        audio.setAttribute('width', '100%');
        audio.setAttribute('controls', 'true');
		audio.innerHTML = 'Your browser doesn\'t support this media. Please download the file to view it.';
		audio.appendChild(source);
		center.appendChild(audio);
        content.appendChild(center);
        document.getElementById("load_"+file_id).style.display = "none";
    }
    else if(video_list.includes(extension)) {
        var video = document.createElement("video");
        var source = document.createElement("source");
        var center = document.createElement("center");
        source.setAttribute('src', atob(file_url_encoded));
        var type = extension !== 'ogg' && extension !== 'mp4'? 'webm': extension;
        source.setAttribute('type', 'video/' + extension);
        video.setAttribute('style', 'max-width:100%; height:auto');
        video.setAttribute('controls', 'true');
		video.innerHTML = 'Your browser doesn\'t support this media. Please download the file to view it.';
		video.appendChild(source);
		center.appendChild(video);
        content.appendChild(center);
        document.getElementById("load_"+file_id).style.display = "none";
    }
    else if(img_list.includes(extension)) {
        var img = document.createElement("img");
        var center = document.createElement("center");
        img.setAttribute('src', atob(file_url_encoded));
        img.setAttribute('style', 'max-width:100%; height:auto');
		center.appendChild(img);
        content.appendChild(center);
        document.getElementById("load_"+file_id).style.display = "none";
    }
    else {
        download_file(file_id);
    }
    if(extension === 'html') {
        var iframe = document.createElement("iframe");
        iframe.setAttribute('src', atob(file_url_encoded));
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '600px');
        iframe.setAttribute('allowfullscreen', 'true');
        content.appendChild(iframe);
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
    xhttp.open("GET",create_group_url, true);
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
            url: host_url + (load_group_url.replace(/1/,group_id)),
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
    xhttp.open("GET",view_group_details_url, true);
    xhttp.send();
}

function delete_group(group_id)
{
    $.ajax({
            url: host_url + delete_group_url.replace(/1/,group_id),
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
            url: host_url + add_user_to_group_url.replace(/1/,group_id),
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
            url: host_url + delete_from_group_url.replace(1,group_id).replace('h',username),
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
    xhttp.open("GET",get_change_password_url, true);
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
    xhttp.open("GET",get_edit_profile_url, true);
    xhttp.send();
}

function change_password()
{
    $.ajax({
            url: host_url + change_password_url,
            type:'GET',
            data: {
                'old_password': document.getElementById('old_password').value,
                'new_password': document.getElementById('new_password').value
            },
            dataType: 'json',
            success:function(response){
                alert(response['message']);
                window.location.replace(collaborate_home_url);
            },
            error:function(error){
                alert(error.responseJSON['message'])
            }
    })
}

function edit_profile()
{
    $.ajax({
            url: host_url + edit_profile_url,
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
            url: host_url + get_users_by_keyword_url,
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