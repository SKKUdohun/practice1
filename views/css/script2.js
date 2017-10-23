
let obj;
open();
function open() {
    console.log("open호출");
    window.onload = function () {
        getContent();
    }
}

function writeDoc(url, data){
    var result = data;
    result = JSON.stringify(result);
    console.log(result);
    var xhttp = new XMLHttpRequest();

    xhttp.open('POST', url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(result);

    xhttp.addEventListener('load', function(){
        console.log(xhttp.responseText);
    })
}

function clearDoc() {

    console.log("clearDoc 호출됨");

    var cell= document.getElementById("root");
    while(cell.hasChildNodes()){
        cell.removeChild(cell.firstChild);
    }
    var cont = document.getElementById("content");
    while(cont.hasChildNodes()){
        cont.removeChild(cont.firstChild);
    }
}


function sendAjax(url){
    var result;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");

    xhr.send();

    xhr.addEventListener('load', function(){
        result= JSON.parse(xhr.responseText);
        var my_div = null;
        var newDiv =null;

        newDiv = document.createElement("div");
        newDiv.setAttribute('id','diiv');
        newDiv.innerHTML = "제목: "+result[0].title + "<br/>" + "내용: "+result[0].contents + "<br/>"
            + "작성자: " + result[0].author;
        my_div = document.getElementById("content");
        document.body.insertBefore(newDiv, my_div);
        var btn = document.createElement("BUTTON");
        var t = document.createTextNode("확인~");
        btn.appendChild(t);
        document.body.appendChild(btn);
        btn.onclick = function(){
            var delnode = document.getElementById('diiv');
            delnode.parentNode.removeChild(delnode);
            btn.parentNode.removeChild(btn);
            getContent();
        }
    })
};


let getContent = function(){
    console.log("getContent 호출");

    let httpRequest;
    if (window.XMLHttpRequest) { //Chrome, Safari..
        httpRequest = new XMLHttpRequest();
    }

    httpRequest.onreadystatechange = function () {
        var local = document.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
        local.setAttribute('id', 'root');

        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                obj = JSON.parse(httpRequest.responseText);

                var elements = document.getElementsByClassName('row');
                while (elements.length > 0) {
                    elements[0].parentNode.removeChild(elements[0]);
                }

                var th1 = document.createElement("th");
                th1.appendChild(document.createTextNode("번호"));

                var th2 = document.createElement("th");
                th2.appendChild(document.createTextNode("제목"));

                var th3 = document.createElement("th");
                th3.appendChild(document.createTextNode("작성자"));
                local.appendChild(th1);
                local.appendChild(th2);
                local.appendChild(th3);
                for (i = 0; i < obj.length; i++) {

                    var tr = document.createElement("tr");
                    tr.setAttribute('class', 'row');
                    tr.setAttribute('id', obj[i]._id);

                    var td1 = document.createElement("td");
                    td1.appendChild(document.createTextNode(i + 1));
                    var td2 = document.createElement("td");
                    td2.appendChild(document.createTextNode(obj[i].title));
                    var td3 = document.createElement("td");
                    td3.appendChild(document.createTextNode(obj[i].author));

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);

                    console.log(obj[i]);
                    local.appendChild(tr);

                    tr.onclick = function () {
                        console.log(this.id);
                        clearDoc();
                        sendAjax('/boards/ajax/read/' + this.id);
                    }

                }
                var write = document.createElement("button");
                write.appendChild(document.createTextNode("글쓰기"));
                local.appendChild(write);
                write.onclick = function(){
                    clearDoc();

                    //var form = document.createElement("form");
                    //form.setAttribute('style', 'line-height:2.3em');

                    var input_title = document.createElement("INPUT");
                    input_title.setAttribute('type', 'text');
                    input_title.setAttribute('placeholder', '제목');
                    input_title.setAttribute('id','title1');

                    var lb1 = document.createElement("br");
                    var lb2 = document.createElement("br");
                    var lb3 = document.createElement("br");
                    var lb4 = document.createElement("br");


                    var input_author = document.createElement("INPUT");
                    input_author.setAttribute('type', 'text');
                    input_author.setAttribute('placeholder', '작성자');
                    input_author.setAttribute('id','author');


                    var input_content = document.createElement("textarea");
                    input_content.setAttribute('type', 'text');
                    input_content.setAttribute('placeholder', '내용');
                    input_content.setAttribute('rows', '20');
                    input_content.setAttribute('cols', '80');
                    input_content.setAttribute('id','content2');

                    local.appendChild(input_title);
                    local.appendChild(lb1);
                    local.appendChild(input_author);
                    local.appendChild(lb2);
                    local.appendChild(input_content);
                    //local.appendChild(form);
                    local.appendChild(lb3);



                    var submit = document.createElement("button");
                    submit.appendChild(document.createTextNode("전송"));
                    local.appendChild(submit);




                    submit.onclick = function(){
                        var title =document.getElementById('title1').value;
                        var author = document.getElementById('author').value;
                        var content = document.getElementById('content2').value;

                        var data = {
                            'title' : title,
                            'author' : author,
                            'content' : content
                        };

                        writeDoc('/boards/ajax/write', data);
                        clearDoc();
                        getContent();
                    };

                    local.appendChild(lb4);
                    var cancel = document.createElement("button");
                    cancel.appendChild(document.createTextNode("취소"));
                    local.appendChild(cancel);
                    cancel.onclick = function(){
                        clearDoc();
                        getContent();
                    };
                }
            }
        }
    };
    httpRequest.open('GET', '/boards/ajax/contentGet', true);
    httpRequest.send();
}