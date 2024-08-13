var searchedjobs;
var access;

window.addEventListener("load", function(){
    
    access=-1;
    sysresponse = document.getElementById("response");
    sysresponse.innerHTML="欢迎。近期更新频繁，建议每天第一次使用前按键盘Shift+F5刷新页面。";
    
    //page fist load
    // var searchcreteria = new FormData();
    // searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
    // showjobsearchbox();
    // searchjobs(searchcreteria);

    var loginform= document.getElementById("loginform");
    loginform.addEventListener("submit", function (event) {
        event.preventDefault();
        login();
    });
    
    var newinjobbutton = document.getElementById("newinjobbutton");
    newinjobbutton.addEventListener("click", function() {
        if(access>0){
            loaddetail("",'入库');
        }
    });
    var newoutjobbutton = document.getElementById("newoutjobbutton");
    newoutjobbutton.addEventListener("click", function() {
        if(access>0){
            loaddetail("",'出库');
        }
    });

    

    //select page
    var currentjobs = document.getElementById("currentjobs");
    currentjobs.addEventListener("click", function() {
        if(access!=-1){
            var searchcreteria = new FormData();
            searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
            showjobsearchbox();
            searchjobs(searchcreteria);
        }
    });
    var currentinventory = document.getElementById("currentinventory");
    currentinventory.addEventListener("click", function() {
        if(access!=-1){
            var searchcreteria = new FormData();
            showinventorysearchbox();
            showinventory(searchcreteria);
        }
    });

    var activitylog = document.getElementById("activitylog");
    activitylog.addEventListener("click", function() {
        if(access!=-1){
            document.getElementById("activejobs").innerHTML="";
            showitemsearchbox();
        }
    });

});

function login(){
    
    var loginform = new FormData(document.getElementById("loginform"));
    showloading(document.getElementById("activejobs"));
    const xhr  = new XMLHttpRequest();
    xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/finduser", true);
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                sysresponse.innerHTML=xhr.response["msg"];
                access=xhr.response["data"]["access"];
                document.getElementById("newinjobbutton").removeAttribute('disabled');
                document.getElementById("newoutjobbutton").removeAttribute('disabled');
                var searchcreteria = new FormData();
                searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
                showjobsearchbox();
                searchjobs(searchcreteria);
            }else{
                document.getElementById("activejobs").innerHTML=xhr.response["msg"]+' 请刷新本页重新登陆';
                
            }
        }
    }
    xhr.responseType="json";
    xhr.send(loginform);
}

function searchjobs(searchcreteria){
    showloading(document.getElementById("activejobs"));
    
    const xhr  = new XMLHttpRequest();  
    xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/searchjobs", true);
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                document.getElementById("activejobs").innerHTML="";
                
                searchedjobs=xhr.response["data"];
                for (var i = 0; i < xhr.response["data"].length; i++) {
                    createjob(xhr.response["data"][i],document.getElementById("activejobs"));
                }
                sysresponse.innerHTML=xhr.response["msg"];
            }else{
                sysresponse.innerHTML=xhr.response["msg"];
                document.getElementById("activejobs").innerHTML="加载失败/没有数据";
            }
        }
    }
    xhr.responseType="json";
    xhr.send(searchcreteria);

}
function searchitems(searchcreteria){
    const xhr  = new XMLHttpRequest();  
    xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/searchitems", true);
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                return xhr.response["data"];
                sysresponse.innerHTML=xhr.response["msg"];
            }
        }
    }
    xhr.responseType="json";
    xhr.send(searchcreteria);
}

function showjobsearchbox(){
    // Clear previous elements in searchbox
    const searchbox = document.getElementById('searchbox');
    searchbox.innerHTML = '';
    // Create form element
    const form = document.createElement('form');
    form.id = 'searchform';
    form.className = 'searchform';

    // Create div container
    const divContainer = document.createElement('div');
    divContainer.className = 'linecontrol';
    divContainer.style.display = 'flex';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    searchInput.placeholder = '搜索客户、箱号、提货码、状态';
    divContainer.appendChild(searchInput);

    // Create status radio input container
    const statusRadioInput = document.createElement('div');
    statusRadioInput.className = 'status-radio-input';
    statusRadioInput.style.marginLeft = '15px';
    statusRadioInput.style.setProperty('--container_width', '160px');

    // Function to create radio input with label
    const createRadioInput = (id, value, text, checked = false) => {
    const label = document.createElement('label');
    label.id = id;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'value-radio';
    input.id = value;
    input.value = value;
    if (checked) input.checked = true;

    const span = document.createElement('span');
    span.textContent = text;

    label.appendChild(input);
    label.appendChild(span);

    return label;
    };

    // Append radio inputs
    statusRadioInput.appendChild(createRadioInput('searchyesterday', 'value-1', '昨天'));
    statusRadioInput.appendChild(createRadioInput('searchtoday', 'value-2', '今天', true));
    statusRadioInput.appendChild(createRadioInput('searchtomorrow', 'value-3', '明天'));
    statusRadioInput.appendChild(createRadioInput('searchall', 'value-4', '全部'));

    // Append status selection span
    const statusSelection = document.createElement('span');
    statusSelection.className = 'status-selection';
    statusRadioInput.appendChild(statusSelection);

    divContainer.appendChild(statusRadioInput);

    // Create date input
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'search-input';
    dateInput.name = 'date';
    dateInput.style.width = '140px';
    dateInput.style.marginLeft = '20px';
    divContainer.appendChild(dateInput);

    // Create search button
    const searchButton = document.createElement('button');
    searchButton.className = 'button';
    searchButton.id = 'searchbutton';
    searchButton.style.display = 'inline-block';
    searchButton.style.position = 'absolute';
    searchButton.style.right = '0px';
    searchButton.style.width = '70px';
    searchButton.textContent = '搜索';
    divContainer.appendChild(searchButton);

    // Append div container to form
    form.appendChild(divContainer);

    //second line
    const divContainer1 = document.createElement('div');
    divContainer1.className = 'linecontrol';
    divContainer1.style.display = 'flex';
    divContainer1.style.marginTop = '10px';

    const noshowcompletedlabel = document.createElement('label');
    noshowcompletedlabel.className = 'noshowcompletedlabel';
    noshowcompletedlabel.style.marginLeft = '10px';
    noshowcompletedlabel.innerHTML = '只显示未完成';

    const noshowcompletedswitch = document.createElement('label');
    noshowcompletedswitch.className = 'switch';
    const noshowcompletedinput = document.createElement('input');
    noshowcompletedinput.type = 'checkbox';
    noshowcompletedinput.className = 'toggle';
    noshowcompletedinput.id = 'noshowcompleted';
    const noshowcompletedspan1 = document.createElement('span');
    noshowcompletedspan1.className = 'slider';
    const noshowcompletedspan2 = document.createElement('span');
    noshowcompletedspan2.className = 'card-side';

    noshowcompletedswitch.appendChild(noshowcompletedinput);
    noshowcompletedswitch.appendChild(noshowcompletedspan1);
    noshowcompletedswitch.appendChild(noshowcompletedspan2);

    
    divContainer1.appendChild(noshowcompletedswitch);
    divContainer1.appendChild(noshowcompletedlabel);

    form.appendChild(divContainer1);
    // Append form to body or any other container
    searchbox.appendChild(form);

    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(form);
        if(searchcreteria.get("date")!=""){
            searchcreteria.set("date", searchcreteria.get('date') + " 23:59:59");
        }
        searchjobs(searchcreteria);
        noshowcompletedinput.checked = false;
    });

    //search selected date
    var searchyesterday = document.getElementById("searchyesterday");
    searchyesterday.addEventListener("click", function() {
        var searchcreteria = new FormData();
        searchcreteria.append("date", getformatteddate(-1)+" 23:59:59");
        searchjobs(searchcreteria);
        noshowcompletedinput.checked = false;
    });
    var searchtoday = document.getElementById("searchtoday");
    searchtoday.addEventListener("click", function() {
        var searchcreteria = new FormData();
        searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
        searchjobs(searchcreteria);
        noshowcompletedinput.checked = false;
    });
    var searchtomorrow = document.getElementById("searchtomorrow");
    searchtomorrow.addEventListener("click", function() {
        var searchcreteria = new FormData();
        searchcreteria.append("date", getformatteddate(1)+" 23:59:59");
        searchjobs(searchcreteria);
        noshowcompletedinput.checked = false;
    });
    var searchall = document.getElementById("searchall");
    searchall.addEventListener("click", function() {
        var searchcreteria = new FormData();
        searchjobs(searchcreteria);
        noshowcompletedinput.checked = false;
    });

    noshowcompletedinput.addEventListener("change", function() {
        if (this.checked) {
            document.getElementById("activejobs").innerHTML = "";
            var filteredJobs = searchedjobs.filter(job => job.status != '完成');
            for (var i = 0; i < filteredJobs.length; i++) {
                createjob(filteredJobs[i],document.getElementById("activejobs"));
            }
        }else{
            document.getElementById("activejobs").innerHTML = "";
            for (var i = 0; i < searchedjobs.length; i++) {
                createjob(searchedjobs[i],document.getElementById("activejobs"));
            }
        }
    });
}

function showinventorysearchbox(){
    // Clear previous elements in searchbox
    const searchbox = document.getElementById('searchbox');
    searchbox.innerHTML = '';

    // Create form element
    const form = document.createElement('form');
    form.id = 'searchform';
    form.className = 'searchform';
    // Center align elements
    form.style.display = 'flex';

    // Create div container
    const divContainer = document.createElement('div');
    divContainer.className = 'linecontrol';
    divContainer.style.display = 'flex';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    
    searchInput.style.margin = '10px 0px 0px 0px';
    searchInput.placeholder = '搜索库存编号、箱号、标签、箱唛';
    divContainer.appendChild(searchInput);

    const wareinputDiv=document.createElement("div");
    wareinputDiv.className="input-container";
    wareinputDiv.style.margin = '10px 0px 0px 20px';
    wareinputDiv.style.width = '60px';
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="locationa";
    input0.id="input";
    input0.style.fontSize = '20px';
    var input0label=document.createElement("label");
    input0label.innerHTML="仓库";
    input0label.htmlFor="input";
    input0label.className="label";
    wareinputDiv.appendChild(input0);
    wareinputDiv.appendChild(input0label);
    wareinputDiv.appendChild(inputbottomline);
    divContainer.appendChild(wareinputDiv);

    const areainputDiv=document.createElement("div");
    areainputDiv.className="input-container";
    areainputDiv.style.margin = '10px 0px 0px 20px';
    areainputDiv.style.width = '60px';
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="locationb";
    input0.id="input";
    input0.style.fontSize = '20px';
    var input0label=document.createElement("label");
    input0label.innerHTML="区域";
    input0label.htmlFor="input";
    input0label.className="label";
    areainputDiv.appendChild(input0);
    areainputDiv.appendChild(input0label);
    areainputDiv.appendChild(inputbottomline);
    divContainer.appendChild(areainputDiv);
    
    // Create search button
    const searchButton = document.createElement('button');
    searchButton.className = 'button';
    searchButton.id = 'searchbutton';
    searchButton.style.display = 'inline-block';
    searchButton.style.position = 'absolute';
    searchButton.style.right = '0px';
    searchButton.style.width = '70px';
    searchButton.textContent = '搜索';
    divContainer.appendChild(searchButton);

    // Append div container to form
    form.appendChild(divContainer);

    // Append form to body or any other container
    searchbox.appendChild(form);

    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(form);
        if(searchcreteria.get("searchref")!=""){
            searchcreteria.set("searchref", searchcreteria.get('searchref').trim());
        }
        showinventory(searchcreteria);
    });

}

function showitemsearchbox(){
    // Clear previous elements in searchbox
    const searchbox = document.getElementById('searchbox');
    searchbox.innerHTML = '';

    // Create form element
    const form = document.createElement('form');
    form.id = 'searchform';
    form.className = 'searchform';
    // Center align elements
    form.style.display = 'flex';

    // Create div container
    const divContainer = document.createElement('div');
    divContainer.className = 'linecontrol';
    divContainer.style.display = 'flex';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    
    searchInput.style.margin = '10px 0px 0px 0px';
    searchInput.placeholder = '搜索客户、箱号、标签';
    divContainer.appendChild(searchInput);

    const wareinputDiv=document.createElement("div");
    wareinputDiv.className="input-container";
    wareinputDiv.style.margin = '10px 0px 0px 20px';
    wareinputDiv.style.width = '125px';
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="jobid";
    input0.id="input";
    input0.style.fontSize = '20px';
    var input0label=document.createElement("label");
    input0label.innerHTML="任务编号";
    input0label.htmlFor="input";
    input0label.className="label";
    wareinputDiv.appendChild(input0);
    wareinputDiv.appendChild(input0label);
    wareinputDiv.appendChild(inputbottomline);
    divContainer.appendChild(wareinputDiv);

    const areainputDiv=document.createElement("div");
    areainputDiv.className="input-container";
    areainputDiv.style.margin = '10px 0px 0px 20px';
    areainputDiv.style.width = '125px';
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="inventoryid";
    input0.id="input";
    input0.style.fontSize = '20px';
    var input0label=document.createElement("label");
    input0label.innerHTML="库存编号";
    input0label.htmlFor="input";
    input0label.className="label";
    areainputDiv.appendChild(input0);
    areainputDiv.appendChild(input0label);
    areainputDiv.appendChild(inputbottomline);
    divContainer.appendChild(areainputDiv);
    
    // Create search button
    const searchButton = document.createElement('button');
    searchButton.className = 'button';
    searchButton.id = 'searchbutton';
    searchButton.style.display = 'inline-block';
    searchButton.style.position = 'absolute';
    searchButton.style.right = '0px';
    searchButton.style.width = '70px';
    searchButton.textContent = '搜索';
    divContainer.appendChild(searchButton);

    // Append div container to form
    form.appendChild(divContainer);

    // Append form to body or any other container
    searchbox.appendChild(form);

    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(form);
        showitems(searchcreteria);
    });
}
function addnewjob(clickeditem,detaillinenumber){

    var addjob = new FormData(document.getElementById("detailform"));
    if(clickeditem==""){
        jobid = new Date().getTime();
    }else{
        if (!clickeditem['jobid']) {
            jobid = new Date().getTime();
        }else{
        jobid = clickeditem['jobid'];
        }
    }
    addjob.append("jobid",jobid);

    console.log(addjob.get("date"));
    if (!addjob.get('date')) {
        alert('Please set a date');
        return;
    }
    // for (let [key, value] of addjob.entries()) {
    //         console.log(`${key}: ${value}`);
    // }
    if (addjob.get('status') == '完成') {
        if (confirm("确认任务已完成?")) {
            // Code to execute if user confirms update
        } else {
            // Code to execute if user cancels update
            return;
        }
    }
    
    const xhr  = new XMLHttpRequest();  
    xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/addjob", true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                sysresponse.innerHTML=xhr.response["msg"];
            }
            
        }
    }
    xhr.responseType="json";
    xhr.send(addjob);

    const detaillineForms = document.getElementsByClassName('detaillineform');
    for (let i = 0; i < detaillineForms.length; i++) {
        const addjobline = new FormData(detaillineForms[i]);
        if (addjob.get('activity') == '入库') {
            addjobline.append('container', addjob.get('joblabel'));
            addjobline.set('customer', addjob.get('customer'));
        } else {

            addjobline.append('label', addjob.get('joblabel'));
        }
        addjobline.append('jobid', jobid);
        
        addjobline.append('activity', addjob.get('activity'));
        addjobline.append('date', addjob.get('date'));

        console.log(addjobline.get('inventoryid'));
        console.log(addjobline);

        console.log(addjobline.get('createtime'));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://garfat.xyz/index.php/home/Wms/additem', true);
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log(xhr.response['msg']);
            }
        };
        xhr.responseType = 'json';
        xhr.send(addjobline);

        if (addjob.get('status') == '完成') {
            const xhr1 = new XMLHttpRequest();
            xhr1.open('POST', 'https://garfat.xyz/index.php/home/Wms/updateinventory', true);
            xhr1.onreadystatechange = () => {
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
                    sysresponse.innerHTML = xhr1.response['msg'];
                }
            };
            xhr1.responseType = 'json';
            xhr1.send(addjobline);
        }
    }
    

    
    
    document.getElementById("itemdetail").innerHTML = "";

}
function printSpecificContent(clickeditem) {
    if (clickeditem) {
        var printWindow = window.open('', '', 'height=1123,width=794');
        printWindow.document.write('<html><head><title>打印操作单</title>');
        printWindow.document.write('<style>body{font-family: Arial, sans-serif; font-size:45px;margin:50px 0px 0px 30px}h1{font-size:65px; font-weight:600;margin:0 0 0 0;}</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h1>'+clickeditem['customer']+'</h1>');
        printWindow.document.write('<h1>'+clickeditem['joblabel']+'</h1>');
        printWindow.document.write('<hr>');
        printWindow.document.write(clickeditem['date']+'<br>');
        printWindow.document.write(clickeditem['overview']+ '<br>');    
        printWindow.document.write(clickeditem['ordernote']); 
        printWindow.document.write('</body></html>');
        // printWindow.document.close();
        printWindow.print();
    } else {
        console.error('Element with ID ' + elementId + ' not found.');
    }
}

async function showinventory(searchcreteria){
    showloading(document.getElementById("activejobs"));
    const response = await fetch('https://garfat.xyz/index.php/home/Wms/searchinventory', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    
    
    var activejobs = document.getElementById("activejobs");
    activejobs.innerHTML="";
    
    // Create table element
    var table = document.createElement("table");
    table.className = "inventory-table";

    // Create table header
    var thead = document.createElement("thead");
    thead.className = "inventory-table-header";
    var headerRow = document.createElement("tr");
    var headers = ["客户", "箱号/单号", "箱唛","仓点", "件数", "托数", "仓库", "区域"];
    headers.forEach(function(headerText, index) {
        var th = document.createElement("th");
        th.textContent = headerText;
        th.addEventListener("click", function() {
            sortTable(index);
        });

        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    var tbody = document.createElement("tbody");
    tbody.id = "inventory-table-body";
    tbody.className = "inventory-table-body";
    data['data'].forEach(function(item) {
        var row = document.createElement("tr");
        row.className = "inventory-table-row";
        var columns = [item.customer,item.container,item.marks,item.label, item.pcs, item.plt, item.locationa, item.locationb];
        columns.forEach(function(columnText) {
            var td = document.createElement("td");
            td.textContent = columnText;
            row.appendChild(td);
        });
        tbody.appendChild(row);

        row.addEventListener("click", function() {
            if(document.getElementById("detailform")!=null && document.getElementById("statuslog").innerHTML!="完成"){
                detaillinenumber++;
                item['id'] = '';
                createdetailline(detaillinenumber,item,document.getElementById("jobactivity").value,true);
            }else{
                showinventorydetail(item);
                // alert("您可以打开一个出库任务后，点击一个库存项目将其添加到任务中。");
            }
            
        });
    });
    table.appendChild(tbody);

    // Append table to activejobs element
    activejobs.appendChild(table);
}
async function showitems(searchcreteria){
    showloading(document.getElementById("activejobs"));
    const response = await fetch('https://garfat.xyz/index.php/home/Wms/searchitems', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    
    
    var activejobs = document.getElementById("activejobs");
    activejobs.innerHTML="";
    
    // Create table element
    var table = document.createElement("table");
    table.className = "inventory-table";

    // Create table header
    var thead = document.createElement("thead");
    thead.className = "inventory-table-header";
    var headerRow = document.createElement("tr");
    var headers = ["出入库", "客户", "箱号/单号", "货物标签", "件数", "托数", "日期"];
    headers.forEach(function(headerText) {
        var th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    var tbody = document.createElement("tbody");
    tbody.className = "inventory-table-body";
    data['data'].forEach(function(item) {
        var row = document.createElement("tr");
        row.className = "inventory-table-row";
        var columns = [item.activity, item.customer, item.container,item.label, item.pcs, item.plt, item.date];
        columns.forEach(function(columnText) {
            var td = document.createElement("td");
            td.textContent = columnText;
            row.appendChild(td);

            row.addEventListener("click", function() {
                if(document.getElementById("detailform")!=null){
                    alert("关闭当前任务后，点击出入库记录将显示详细信息。");
                }else{
                    showactivitydetail(item);
                    // alert("您可以打开一个出库任务后，点击一个库存项目将其添加到任务中。");
                }
                
            });
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append table to activejobs element
    activejobs.appendChild(table);
}
async function loaddetail(clickeditem,activity){
    detaillinenumber=0;

    var itemdetail = document.getElementById("itemdetail");
    itemdetail.innerHTML="";
    var detailform=document.createElement("form");
    detailform.id="detailform";
    detailform.className="detailform";
    itemdetail.appendChild(detailform);

    detailform.addEventListener("submit", function (event) {
        event.preventDefault();
        
    });

    var datalist=document.createElement("datalist");
    datalist.id="channels";
    const channels = ['海外仓', '客户自提', '亚马逊-卡派-散货', '亚马逊-卡派-托盘', '快递-DHL Express', '快递-DHL-Paket', '快递-DPD', '卡派-DHL Freight', '拦截暂扣', '不卸货', '暂放-不确定出货方式'];
    channels.forEach(channel => {
        const option = document.createElement('option');
        option.value = channel;
        datalist.appendChild(option);
    });
    document.body.appendChild(datalist);
    
    //control   bar
    var controlbar=document.createElement("div");
    controlbar.className="controlbar";
    detailform.appendChild(controlbar);
    var submitbutton=document.createElement("button");
    submitbutton.innerHTML="保存";
    submitbutton.className="button";
    
    
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "封存任务";
    cancelButton.className = "button";
    cancelButton.id = "archivebutton";
    cancelButton.addEventListener("click", function() {
        // Displaying an alert message
        if (confirm("确认封存任务?")) {
            // Code to execute if user confirms cancellation
            var archiveid = new FormData();
            archiveid.append("jobid",clickeditem['jobid']);
            const response = fetch('https://garfat.xyz/index.php/home/Wms/archivejob', {
            method: 'POST',
            body: archiveid,
          });
        } else {
            // Code to execute if user cancels cancellation
            // ...
        }
    });
    
    var printbutton=document.createElement("button");
    printbutton.innerHTML="打印操作单 &#x1F5B6";
    printbutton.className="button";
    printbutton.style.marginLeft = '10px';

    
    var printcmrbutton=document.createElement("button");
    printcmrbutton.innerHTML="打印CMR &#x1F5B6";
    printcmrbutton.className="button";
    
    var closebutton=document.createElement("button");
    closebutton.innerHTML="✕";
    closebutton.className="button";
    closebutton.style.marginLeft = '30px';
    closebutton.style.padding = '5px 5px 5px 8px';
    closebutton.addEventListener("click", function() {
        itemdetail.innerHTML="";
    });

    controlbar.appendChild(submitbutton);
    controlbar.appendChild(cancelButton);
    controlbar.appendChild(printbutton);
    controlbar.appendChild(printcmrbutton);
    controlbar.appendChild(closebutton);

    var titleLine = document.createElement("div");
    titleLine.className = "detailtitle";
    titleLine.innerHTML = activity+"任务";
    detailform.appendChild(titleLine);

    //customer line
    var linecontrol0=document.createElement("div");
    linecontrol0.className="input-container";
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="customer";
    input0.id="customerinput";
    input0.required=true;
    input0.value=((clickeditem!='')?clickeditem['customer']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="客户";
    input0label.htmlFor="customerinput";
    input0label.className="label";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(inputbottomline);
    
    var linecontrol0=document.createElement("div");
    linecontrol0.className="input-container";
    linecontrol0.style.width="180px";
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="joblabel";
    input0.id="joblabelinput";
    input0.required=true;
    input0.value=((clickeditem!='')?clickeditem['joblabel']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML=activity=="入库"?"箱号/单号":"目的地简称";
    input0label.htmlFor="joblabelinput";
    input0label.className="label";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(inputbottomline);

    if(activity=="出库"){
        var linecontrol0=document.createElement("div");
        linecontrol0.className="input-container";
        linecontrol0.style.position="absolute";
        linecontrol0.style.right="120px";
        linecontrol0.style.top="57px";
        var inputbottomline=document.createElement("div");
        inputbottomline.className="underline";
        var input0=document.createElement("input");
        input0.type="text";
        input0.name="reference";
        input0.id="referenceinput";
        input0.required=true;
        input0.value=((clickeditem!='')?clickeditem['reference']:"");
        var input0label=document.createElement("label");
        input0label.innerHTML="提货码";
        input0label.htmlFor="referenceinput";
        input0label.className="label";
        detailform.appendChild(linecontrol0);
        linecontrol0.appendChild(input0);
        linecontrol0.appendChild(input0label);
        linecontrol0.appendChild(inputbottomline);

        var linecontrol0=document.createElement("div");
        linecontrol0.className="input-container";
        linecontrol0.style.position="absolute";
        linecontrol0.style.right="120px";
        linecontrol0.style.top="95px";
        var inputbottomline=document.createElement("div");
        inputbottomline.className="underline";
        var input0=document.createElement("input");
        input0.type="text";
        input0.name="orderid";
        input0.id="referenceinput";
        input0.required=true;
        input0.value=((clickeditem!='')?clickeditem['orderid']:"");
        var input0label=document.createElement("label");
        input0label.innerHTML="订单号";
        input0label.htmlFor="referenceinput";
        input0label.className="label";
        detailform.appendChild(linecontrol0);
        linecontrol0.appendChild(input0);
        linecontrol0.appendChild(input0label);
        linecontrol0.appendChild(inputbottomline);

    }
    

    createstatusbar(((clickeditem!='')?clickeditem['status']:"预报"));


    var linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    var input0=document.createElement("input");
    input0.type="datetime-local";
    input0.name="date";
    input0.id="inputdate";
    input0.className="lineinput";
    input0.required=true;
    input0.value=((clickeditem!='')?clickeditem['date']:"");;
    var input0label=document.createElement("label");
    input0label.innerHTML="日期";
    input0label.htmlFor="inputdate";
    input0label.className="lineinputlabel";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(input0);

    if (activity == '出库') {
        var linecontrol0=document.createElement("div");
        linecontrol0.className="linecontrol";
        var input0=document.createElement("textarea");
        input0.name="deladdress";
        input0.className="lineinput";
        input0.value=((clickeditem!='')?clickeditem['deladdress']:"");
        var input0label=document.createElement("label");
        input0label.innerHTML="送货地址";
        input0label.className="lineinputlabel";
        linecontrol0.appendChild(input0label);
        linecontrol0.appendChild(input0);
        detailform.appendChild(linecontrol0);
    }
    
    var input0=document.createElement("textarea");
    input0.name="ordernote";
    input0.className="lineinput";
    input0.value=((clickeditem!='')?clickeditem['ordernote']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="备注";
    input0label.className="lineinputlabel";
    input0label.style.margin="0px 0px 0px 20px";
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(input0);

    detailform.appendChild(linecontrol0);

    var activityInput = document.createElement("input");
    activityInput.type = "hidden";
    activityInput.id = "jobactivity";
    activityInput.name = "activity";
    activityInput.value = clickeditem != '' ? clickeditem['activity'] : activity;
    detailform.appendChild(activityInput);

    var statuslog = document.createElement("div");
    statuslog.style.display = "none";
    statuslog.id = "statuslog";
    statuslog.innerHTML = clickeditem != '' ? clickeditem['status'] : "";
    detailform.appendChild(statuslog);
    
    detailform.appendChild(document.createElement("hr"));

    //upload image block
    var uploaddiv=document.createElement("div");
    uploaddiv.className="uploaddiv";
    for (var i = 1; i <= 5; i++) {
        var uploadbuttonblock = document.createElement("div");
        uploadbuttonblock.className="uploadbuttonblock";
        uploadbuttonblock.id="uploadbuttonblock"+i;

        var uploadbutton = document.createElement("button");
        uploadbutton.className="container-btn-file";
        
        uploadbutton.innerHTML="上传图片"+i;

        var input = document.createElement("input");
        input.type = "file";
        input.id = "imgFile"+i;
        input.name = "imgFile"+i;
        input.className="file";
        input.accept = "image/*";
        input.multiple = false;
        
        uploadbutton.appendChild(input);
        uploadbuttonblock.appendChild(uploadbutton);

        const inumber = i;
        if (clickeditem != '' && clickeditem['img'+i] != '' && clickeditem['img'+i] != null) {
            var img = document.createElement("img");
            img.src = clickeditem['img'+i];
            img.width = 100;
            img.height = 100;
            img.className = "img-preview";
            uploadbuttonblock.appendChild(img);
            img.addEventListener("click", function() {
                window.open(this.src);
            });
        }
        
        //!!!!!!!!!!!!!!
        input.addEventListener("change", function() {
            if (clickeditem == '') {
                alert("请保存任务后再上传图片");
            } else {
                var file = this.files[0];
                if (file) {
                    if (file.size > 1048576) { // 1MB in bytes
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(event) {
                            var img = new Image();
                            img.src = event.target.result;
                            img.onload = function() {
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext("2d");
                                var width = img.width;
                                var height = img.height;
        
                                // Set canvas dimensions proportional to the image
                                if (width > height) {
                                    if (width > 2000) {
                                        height *= 2000 / width;
                                        width = 2000;
                                    }
                                } else {
                                    if (height > 2000) {
                                        width *= 2000 / height;
                                        height = 2000;
                                    }
                                }
                                canvas.width = width;
                                canvas.height = height;
        
                                // Draw the image on the canvas
                                ctx.drawImage(img, 0, 0, width, height);
        
                                // Get the compressed image data
                                var compressedDataUrl = canvas.toDataURL("image/jpeg", 0.95); // Adjust quality as needed
        
                                // Create an image element with the compressed data
                                var compressedImg = document.createElement("img");
                                compressedImg.src = compressedDataUrl;
                                compressedImg.width = 100;
                                compressedImg.height = 100;
                                compressedImg.className = "img-preview";
                                var existingImage = document.getElementById('uploadbuttonblock' + inumber).querySelector('.img-preview');
                                if (existingImage) {
                                    existingImage.remove();
                                }
                                document.getElementById('uploadbuttonblock' + inumber).appendChild(compressedImg);
        
                                // Convert data URL to Blob for upload
                                var byteString = atob(compressedDataUrl.split(',')[1]);
                                var mimeString = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
                                var ab = new ArrayBuffer(byteString.length);
                                var ia = new Uint8Array(ab);
                                for (var i = 0; i < byteString.length; i++) {
                                    ia[i] = byteString.charCodeAt(i);
                                }
                                var compressedFile = new Blob([ab], { type: mimeString });
        
                                uploadimage(clickeditem['jobid'], compressedFile, 'img' + inumber);
                            };
                        };
                    } else {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function() {
                            var img = document.createElement("img");
                            img.src = reader.result;
                            img.width = 100;
                            img.height = 100;
                            img.className = "img-preview";
                            var existingImage = document.getElementById('uploadbuttonblock' + inumber).querySelector('.img-preview');
                            if (existingImage) {
                                existingImage.remove();
                            }
                            document.getElementById('uploadbuttonblock' + inumber).appendChild(img);
                        };
                        uploadimage(clickeditem['jobid'], file, 'img' + inumber);
                    }
                }
            }
        });
        // input.addEventListener("change", function() {
        //     if (clickeditem == '') {
        //         alert("请保存任务后再上传图片");
        //     }else{
        //         var file = this.files[0];
        //         if (file) {
        //             var reader = new FileReader();
        //             reader.readAsDataURL(file);
        //             reader.onload = function() {
        //                 var img = document.createElement("img");
        //                 img.src = reader.result;
        //                 img.width = 100;
        //                 img.height = 100;
        //                 img.className = "img-preview";
        //                 var existingImage = document.getElementById('uploadbuttonblock'+inumber).querySelector('.img-preview');
        //                 if (existingImage) {
        //                     existingImage.remove();
        //                 }
        //                 document.getElementById('uploadbuttonblock'+inumber).appendChild(img);
        //             };
        //             uploadimage(clickeditem['jobid'], file, 'img'+inumber);
        //         }
        //     }
        // });
        
        uploaddiv.appendChild(uploadbuttonblock);
    }
    itemdetail.appendChild(uploaddiv);
    itemdetail.appendChild(document.createElement("hr"));
    
    //add new detail button
    var addnew = document.createElement("button");
    addnew.type="button";
    addnew.id="addnewitemlinebutton";
    addnew.innerHTML="新增货物信息";
    addnew.className="button";
    itemdetail.appendChild(addnew);

    if (clickeditem == '' && activity== '入库') {
        var importfromxls = document.createElement("button");
        importfromxls.className="container-btn-file";
        importfromxls.style.fontSize = '14px';
        importfromxls.style.padding = '5px 10px';
        importfromxls.style.display = 'inline-flex';
        // importfromxls.className="container-btn-file";
        importfromxls.innerHTML="从Excel导入";

        var importfromxlsinput = document.createElement("input");
        importfromxlsinput.type = "file";
        importfromxlsinput.id = "importfromxls";
        importfromxlsinput.name = "importfromxls";
        importfromxlsinput.className="file";
        importfromxlsinput.multiple = false;
        importfromxls.appendChild(importfromxlsinput);
        itemdetail.appendChild(importfromxls);
        importfromxlsinput.accept = '.xls,.xlsx';
        importfromxlsinput.onchange = function() {
            var file = this.files[0];
            if (file) {
                const joblable=file.name.replace(/\.[^/.]+$/, "");
                console.log(joblable);
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function(e) {
                    var data = new Uint8Array(reader.result);
                    var workbook = XLSX.read(data, {type: 'array'});
                    var sheet = workbook.Sheets[workbook.SheetNames[0]];
                    var json = XLSX.utils.sheet_to_json(sheet,{header: ["channel","marks","hold","label","deladdress","fba","pcs","cbm","ctnperpcs","kgs","po","note"]});
                    // creat job info
                    var xlsclickeditem = {  "joblabel":joblable,
                                            "customer":document.getElementsByName("customer")[0].value,
                                            "date":document.getElementById("inputdate").value,
                                            "activity":"入库",
                                            "status":"预报",
                                            "ordernote":document.getElementsByName("ordernote")[0].value,
                                            
                                        };
                    loaddetail(xlsclickeditem,"入库");
                                        console.log(json);
                    //create detail lines
                    var xlsfba="";
                    var xlspcs=0;
                    var xlscbm=0;
                    var xlskgs=0;
                    var xlsnote="";
                    var j=0;
                    for (var i = 1; i < json.length; i++) {
                        if(!json[i]['label']){
                            break;
                        }
                        xlsfba = (!json[i]['fba'])?xlsfba:xlsfba+json[i]['fba']+";";
                        xlspcs = (!json[i]['pcs'])?xlspcs:xlspcs+Number(json[i]['pcs']);
                        xlscbm = (!json[i]['cbm'])?xlscbm:xlscbm+Number(json[i]['cbm']);
                        xlskgs = (!json[i]['kgs'])?xlskgs:xlskgs+Number(json[i]['kgs']);
                        xlsnote = (!json[i]['note'])?xlsnote:xlsnote+json[i]['note'] + ";";    
                        //if(!json[i+1]['label'] || json[i]['label']!=json[i+1]['label'] || (!json[i]['marks'] && json[i]['marks']!=json[i+1]['marks'] )){
                        if(i==json.length-1 || !json[i+1]['label'] || json[i]['label']!=json[i+1]['label'] || (json[i]['hold']=="是" || json[i+1]['hold']=='是')){
                            var xlsmarks = (!json[i]['marks'])?"":json[i]['marks'];

                            j=j+1;
                            var inventoryid=constructinventoryid(j);
                            var xlsitem={   "label":json[i]['label'],
                                            "marks":xlsmarks,
                                            "deladdress":json[i]['deladdress'],
                                            "requirement":json[i]['hold']=="是"?"拦截暂扣":"",
                                            "fba":xlsfba,
                                            "pcs":xlspcs,
                                            "cbm":xlscbm,
                                            "kgs":xlskgs,
                                            "note":xlsnote,
                                            "plt":0,
                                            "locationa":"",
                                            "locationb":"",
                                            "channel":json[i]['channel'],
                                            "inventoryid":inventoryid,
                                            "id":"",
                                            "createtime": Date.now(),
                                        };
                            detaillinenumber++;
                            createdetailline(detaillinenumber,xlsitem,"入库",true);
                            xlsfba="";
                            xlspcs=0;
                            xlscbm=0;
                            xlskgs=0;
                            xlsnote="";
                        }
                    }
                };
            }
        };

    }
    
    
    createTooltip(itemdetail, "新建出库任务时，请务必在左侧库存列表中点击一个库存项目，将其添加到任务中。对于库存表中没有的货物，请在此处手动添加。创建任务之后的显示顺序为输入顺序。");

    const sumcountdiv = document.createElement("div");
    sumcountdiv.className = "sumcount";
    sumcountdiv.id = "sumcount";
    itemdetail.appendChild(sumcountdiv);

    // Count all the pcs in the detaillineform
    var pcsCount = 0;
    var detaillineform = document.getElementById("detailform");
    var pcsInputs = detaillineform.querySelectorAll("input[name='pcs']");
    pcsInputs.forEach(function(input) {
        pcsCount += parseInt(input.value);
    });


    const detaillinelistDiv = document.createElement("div");
    detaillinelistDiv.id = "detaillinelist";
    detaillinelistDiv.className = "detaillinelist";
    itemdetail.appendChild(detaillinelistDiv);
    //load items
    if(clickeditem!=""){
        var searchcreteria = new FormData();
        searchcreteria.append("jobid",clickeditem['jobid']);
        const response = await fetch('https://garfat.xyz/index.php/home/Wms/searchitems', {
            method: 'POST',
            body: searchcreteria,
          });

        const data = await response.json();
        sysresponse.innerHTML=data["msg"];
        
        var items = data["data"];
        if(items!=null){
            for (var i = detaillinenumber; i < detaillinenumber+items.length; i++) {
                createdetailline(i+1,items[i],activity,false);
            }
            detaillinenumber=detaillinenumber+items.length;
        }
    }
    

    
    //submit button    
    

    if ((clickeditem && clickeditem['status'] === '完成') || access!=1) {
        var inputs = itemdetail.getElementsByTagName('input');
        var textareas = itemdetail.getElementsByTagName('textarea');
        var buttons = itemdetail.getElementsByTagName('button');

        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        for (var i = 0; i < textareas.length; i++) {
            textareas[i].disabled = true;
        }

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }
    if(access==1){
        cancelButton.removeAttribute("disabled");
        printbutton.removeAttribute("disabled");
        printcmrbutton.removeAttribute("disabled");
    }
    closebutton.removeAttribute("disabled");
    addnew.addEventListener("click", function(){
        detaillinenumber++;
        createdetailline(detaillinenumber,"",activity,true);
        //detailform.appendChild(addnew);
        
    });
    submitbutton.addEventListener("click", function() {
        var inputform=document.getElementById("detailform");
        var formdata=new FormData(inputform);
        // for (let [key, value] of formdata.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        addnewjob(clickeditem,detaillinenumber);

    });
    printbutton.addEventListener("click", function() {
        // Displaying an alert message
        printSpecificContent(clickeditem);
    });
    printcmrbutton.addEventListener("click", function() {
        // Displaying an alert message
        printcmr(clickeditem,items);
    });
    
}

function createdetailline(nid, item, activity, cancelable) {
    
    var detailLines = document.getElementsByClassName("detaillineform");
    var id = detailLines.length + 1;
    while (document.getElementById("detaillineform" + id)) {
        id++;
    }
    // var detailform=document.getElementById("itemdetail");
    var detailform = document.getElementById("detaillinelist");

    var detaillineform=document.createElement("form");
    detaillineform.id="detaillineform"+id;
    detaillineform.className="detaillineform";
    detaillineform.style.opacity="0";
    detaillineform.style.height="0";

    detailform.insertBefore(detaillineform, detailform.firstChild);
    // detailform.appendChild(detaillineform);

    
    var input1=document.createElement("input");
    input1.type="text";
    input1.name=activity=="入库"?"label":"container";
    input1.className="lineinput";
    input1.style.width="120px";
    input1.value=item==''?'':activity=="入库"?item['label']:item['container'];
    
    var input1label=document.createElement("label");
    input1label.innerHTML=activity=="入库"?"仓点":"箱号/单号";
    input1label.className="lineinputlabel";
    detaillineform.appendChild(input1label);
    detaillineform.appendChild(input1);

    
    var input2=document.createElement("input");
    input2.type="text";
    input2.name="pcs";
    input2.className="lineinput";
    input2.style.width="35px";
    input2.value=item!=''?item['pcs']:'';
    var input2label=document.createElement("label");
    input2label.innerHTML="件数";
    input2label.className="lineinputlabel";
    input2.onblur=function(){
        sumpcsplt();
    };
    detaillineform.appendChild(input2label);
    detaillineform.appendChild(input2);

    var input2=document.createElement("input");
    input2.type="text";
    input2.name="plt";
    input2.className="lineinput";
    input2.style.width="35px";
    input2.value=item!=''?item['plt']:'';
    input2.onblur=function(){
        sumpcsplt();
    };
    var input2label=document.createElement("label");
    input2label.innerHTML="托数";
    input2label.className="lineinputlabel";
    detaillineform.appendChild(input2label);
    detaillineform.appendChild(input2);
    
    // var selectchannel=document.createElement("select");
    // selectchannel.name="channel";
    // selectchannel.id="selectchannel";
    // selectchannel.style.width="100px";
    // selectchannel.className="lineinput";
    // selectchannel.value=item['channel']?item['channel']:'';
    // const channels = ['','海外仓', '客户自提', '亚马逊-卡派-散货', '亚马逊-卡派-托盘', '快递-DHL Express', '快递-DHL-Paket', '快递-DPD', '卡派-DHL Freight', '拦截暂扣', '不卸货', '暂放-不确定出货方式'];
    //     channels.forEach(channel => {
    //         const option = document.createElement('option');
    //         option.value = channel;
    //         option.text = channel;
    //         selectchannel.appendChild(option);
    //     });
    // var input0label=document.createElement("label");
    // input0label.innerHTML="渠道";
    // input0label.style.marginLeft="10px";
    // input0label.htmlFor="selectchannel";
    // detaillineform.appendChild(input0label);
    // detaillineform.appendChild(selectchannel);

    var selectchannel=document.createElement("input");
    selectchannel.type="text";
    selectchannel.name="channel";
    selectchannel.setAttribute('list', 'channels');
    selectchannel.className="lineinput";
    selectchannel.style.width="100px";
    selectchannel.value=item['channel']?item['channel']:'';
    
    var input0label=document.createElement("label");
    input0label.innerHTML="渠道";
    input0label.style.marginLeft="10px";
    input0label.htmlFor="selectchannel";
    detaillineform.appendChild(input0label);
    detaillineform.appendChild(selectchannel);

    detaillineform.appendChild(document.createElement("br"));
    var input8=document.createElement("input");
    input8.type="text";
    input8.name="marks";
    input8.className="lineinput";
    input8.style.width="120px";
    input8.value=item!=''?item['marks']:'';
    var input8label=document.createElement("label");
    input8label.innerHTML="箱唛";
    input8label.className="lineinputlabel";
    detaillineform.appendChild(input8label);
    detaillineform.appendChild(input8);

    var input9=document.createElement("input");
    input9.type="text";
    input9.name="requirement";
    input9.className="lineinput";
    input9.style.width="160px";
    input9.value=item!=''?(item['requirement']?item['requirement']:''):'';
    var input9label=document.createElement("label");
    input9label.innerHTML="要求";
    input9label.className="lineinputlabel";
    detaillineform.appendChild(input9label);
    detaillineform.appendChild(input9);

    detaillineform.appendChild(document.createElement("br"));

    var input3=document.createElement("textarea");
    input3.name="fba";
    input3.className="lineinput";
    input3.value=item!=''?item['fba']:'';
    var input3label=document.createElement("label");
    input3label.innerHTML="FBA";
    input3label.className="lineinputlabel";
    detaillineform.appendChild(input3label);
    detaillineform.appendChild(input3);

    var input3=document.createElement("textarea");
    input3.name="note";
    input3.className="lineinput";
    input3.value=item!=''?item['note']:'';
    var input3label=document.createElement("label");
    input3label.innerHTML="备注";
    input3label.className="lineinputlabel";
    detaillineform.appendChild(input3label);
    detaillineform.appendChild(input3);

    var input4 = document.createElement("input");
    input4.type = "hidden";
    input4.name = "id";
    input4.value = item != '' ? item['id'] : '';
    detaillineform.appendChild(input4);

    var input10 = document.createElement("input");
    input10.type = "hidden";
    input10.name = "createtime";
    var timeorder=(Math.floor(Date.now()/1000)%100000000)*10;
    input10.value =timeorder + id;
    detaillineform.appendChild(input10);

    
    var linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    var input5 = document.createElement("input");
    input5.name = "inventoryid";
    input5.readOnly = true;
    input5.className="lineinput";
    input5.style.width="110px";
    
    var inventoryid = constructinventoryid(id);
    input5.value = item != '' ? item['inventoryid'] : inventoryid;
    var input5label=document.createElement("label");
    input5label.innerHTML="库存编号：";
    input5label.className="lineinputlabel";
    linecontrol0.appendChild(input5label);
    linecontrol0.appendChild(input5);

    var input6 = document.createElement("input");
    input6.type = "text";
    input6.id = "locationa"+id;
    input6.name = "locationa";
    input6.className = "lineinput";
    input6.style.width="40px";
    input6.value = item != '' ? item['locationa'] : '';
    var input6label = document.createElement("label");
    input6label.innerHTML = "仓库";
    input6label.className = "lineinputlabel";
    linecontrol0.appendChild(input6label);
    linecontrol0.appendChild(input6);

    var input7 = document.createElement("input");
    input7.type = "text";
    input7.id = "locationb"+id;
    input7.name = "locationb";
    input7.className = "lineinput";
    input7.style.width="40px";
    input7.value = item != '' ? item['locationb'] : '';
    var input7label = document.createElement("label");
    input7label.innerHTML = "区域";
    input7label.className = "lineinputlabel";
    linecontrol0.appendChild(input7label);
    linecontrol0.appendChild(input7);

    
    
    var input11 = document.createElement("input");
    input11.type = activity=="出库"? (item['customer']?"hidden":"text"):"hidden";
    input11.name = "customer";
    input11.className = "lineinput";
    input11.style.width="50px";
    input11.value = item['customer'] ? item['customer'] : '';
    var  input11label= document.createElement("label");
    input11label.innerHTML = "客户";
    input11label.className = "lineinputlabel";
    input11label.style.display=activity=="出库"? (item['customer']?"none":"inline-block"):"none";
    linecontrol0.appendChild(input11label);
    linecontrol0.appendChild(input11);

    detaillineform.appendChild(linecontrol0);


    input1.onblur=function(){
        var location=getlocation(input1.value);
        if(location!=null){
            
            input6.value=location[0];
            input7.value=location[1];
        }
    };

    


    //!!!!!!!!!
    if(cancelable){
        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "button";
        deleteButton.innerHTML = "删除";
        deleteButton.style.fontSize = "14px";
        deleteButton.style.padding = "5px 5px";
        deleteButton.style.position = "absolute";
        deleteButton.style.right = "10px";
        deleteButton.style.bottom = "10px";
        deleteButton.addEventListener("click", function() {
            detaillineform.remove();
        });
        detaillineform.appendChild(deleteButton);
    }

    sumpcsplt();

    setTimeout(() => {
        detaillineform.style.opacity="1";
        detaillineform.style.height="145px";
    },1);
    


}

function createjob(jobcontent,parentdiv){
    const clickeditem=jobcontent;
    var joblist = document.getElementById("activejobs");

    var activejob = document.createElement("div");
    activejob.className="activejob";
    if(jobcontent['status']=="完成"){
        activejob.style.backgroundColor="rgba(86, 218, 74, 0.3)";
        
    }
    if(jobcontent['status']=="排队中" || jobcontent['status']=="作业中"){
        activejob.style.backgroundColor="rgba(202, 255, 58, 0.3)";
    }

    
    // Create the container div for the first item line
    const itemLine1 = document.createElement('div');
    itemLine1.className = 'itemline';

    // Create and append the item title to the first item line
    const itemTitle1 = document.createElement('p');
    itemTitle1.className = 'itemtitle';
    itemTitle1.textContent = jobcontent['customer'];
    itemLine1.appendChild(itemTitle1);
    activejob.appendChild(itemLine1);

    //create the container div for the status
    const jobstatus = document.createElement('div');
    jobstatus.className = 'jobstatus';
    jobstatus.textContent = jobcontent['status'];
    activejob.appendChild(jobstatus);

    // Create and append the standalone item title
    const itemTitle2 = document.createElement('p');
    itemTitle2.className = 'itemtitle';
    itemTitle2.textContent = jobcontent['joblabel'];
    activejob.appendChild(itemTitle2);

    // Create and append the first horizontal rule
    const hr1 = document.createElement('hr');
    activejob.appendChild(hr1);
    // reference line
    const itemLine4 = document.createElement('div');
    itemLine4.className = 'itemline';

    // Create and append the list item (time label) to the second item line
    const listItem5 = document.createElement('p');
    listItem5.className = 'listitem';
    listItem5.textContent = "提货码: ";
    itemLine4.appendChild(listItem5);
    
    // Create and append the list item (time value) to the second item line
    const listItem6 = document.createElement('p');
    listItem6.className = 'listitem';
    listItem6.textContent = jobcontent['reference'];
    itemLine4.appendChild(listItem6);

    // Append the second item line to the document body or a specific container
    activejob.appendChild(itemLine4);

    // Create the container div for the second item line
    const itemLine2 = document.createElement('div');
    itemLine2.className = 'itemline';

    // Create and append the list item (time label) to the second item line
    const listItem2 = document.createElement('p');
    listItem2.className = 'listitem';
    listItem2.textContent = "日期:";
    itemLine2.appendChild(listItem2);
    // Append the second item line to the document body or a specific container
    activejob.appendChild(itemLine2);
    
    // Create and append the list item (time value) to the second item line
    const listItem3 = document.createElement('p');
    listItem3.className = 'listitem';
    listItem3.textContent = jobcontent['date'];
    itemLine2.appendChild(listItem3);

   

    // Create and append the second horizontal rule
    const hr2 = document.createElement('hr');
    activejob.appendChild(hr2);

    // Create the container div for the third item line
    const itemLine3 = document.createElement('div');
    itemLine3.className = 'itemline';
    const listItem4 = document.createElement('div');
    listItem4.className = 'listitem';
    listItem4.innerHTML = jobcontent['overview'];
    itemLine3.appendChild(listItem4);
    activejob.appendChild(itemLine3);

    parentdiv.appendChild(activejob);

    activejob.addEventListener("click", function() {
        loaddetail(clickeditem,clickeditem['activity']);
    });
}

function uploadimage(jobid, file, field) {
    var formData = new FormData();
    formData.append('jobid', jobid);
    formData.append('field', field);
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://garfat.xyz/index.php/home/Wms/saveimg', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            sysresponse.innerHTML = xhr.response['msg'];
        }
    };
    xhr.responseType = 'json';
    xhr.send(formData);
    
}

function showloading(parent){
    const banterLoader = document.createElement('div');
    banterLoader.className = 'banter-loader';

    // Loop to create and append each banter-loader__box to the banter-loader
    for (let i = 0; i < 9; i++) {
        const box = document.createElement('div');
        box.className = 'banter-loader__box';
        banterLoader.appendChild(box);
    }

    // Append the banter-loader to the document body or a specific container
    parent.innerHTML="";
    parent.appendChild(banterLoader);
}

function createstatusbar(status){
    var detailform=document.getElementById("detailform");
    // Create the container div for the status-radio-input
    const statusRadioInput = document.createElement('div');
    statusRadioInput.id = 'status-radio-input';
    statusRadioInput.className = 'status-radio-input';
    statusRadioInput.style.position="absolute";
    statusRadioInput.style.right="100px";
    statusRadioInput.style.top="35px";

    // Define the radio button options
    const options = [
        { value: '预报', id: 'value-1', checked: ((status=="预报")?true:false) },
        { value: '排队中', id: 'value-2', checked: ((status=="排队中")?true:false) },
        { value: '作业中', id: 'value-3', checked: ((status=="作业中")?true:false) },
        { value: '完成', id: 'value-4', checked: ((status=="完成")?true:false) } // Note: Corrected the duplicate id 'value-3' to 'value-4'
    ];

    // Loop through each option to create and append the labels, inputs, and spans
    options.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'status');
        input.setAttribute('value', option.value);
        input.setAttribute('id', option.id);
        if (option.checked) input.setAttribute('checked', '');

        const span = document.createElement('span');
        span.textContent = option.value;

        label.appendChild(input);
        label.appendChild(span);

        statusRadioInput.appendChild(label);
    });

    // Create and append the status-selection span
    const statusSelectionSpan = document.createElement('span');
    statusSelectionSpan.className = 'status-selection';
    statusRadioInput.appendChild(statusSelectionSpan);

    // Append the status-radio-input to the document body or a specific container
    detailform.appendChild(statusRadioInput);
}

function getlocation(ref){
    if (ref === 'STR1') {
        return ['1', 'A'];
    } else if (ref === 'HAJ1') {
        return ['2', 'B'];
    } else if (ref === 'WRO5') {
        return ['3', 'C'];
    } else{
        return null;
    }
}
//get formatted date, targetdate is the number of days from today
function getformatteddate(targetdate){
    var today = new Date();
    var date = new Date(today);
    date.setDate(date.getDate() + targetdate);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function sortTable(columnIndex) {
    var tbody = document.getElementById('inventory-table-body');
    var rows = Array.from(tbody.querySelectorAll("tr"));
    var sortedRows = rows.sort(function(a, b) {
        var aText = a.children[columnIndex].textContent;
        var bText = b.children[columnIndex].textContent;
        return aText.localeCompare(bText, 'zh', { numeric: true });
    });
    tbody.innerHTML = "";
    sortedRows.forEach(function(row) {
        tbody.appendChild(row);
    });
}
function createTooltip(parent, message){
    // Create container div
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';

    // Create tooltip text span
    const tooltipText = document.createElement('span');
    tooltipText.className = 'tooltip-text';
    tooltipText.innerHTML = '&#128712';

    // Create tooltip span
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;

    // Append spans to container
    tooltipContainer.appendChild(tooltipText);
    tooltipContainer.appendChild(tooltip);

    // Append container to body or any other desired parent element
    parent.appendChild(tooltipContainer);
}
function sumpcsplt(){
    var pcsInputs = document.getElementById("itemdetail").querySelectorAll("input[name='pcs']");
    var pcsCount = 0;
    pcsInputs.forEach(function(input) {
        if (input.value) {
            pcsCount += parseInt(input.value);
        }
    });
    
    var pltInputs = document.getElementById("itemdetail").querySelectorAll("input[name='plt']");
    var pltCount = 0;
    pltInputs.forEach(function(input) {
        if (input.value) {
            pltCount += parseInt(input.value);
        }
    });
    
    const sumcountdiv = document.getElementById("sumcount");
    if (sumcountdiv) {
        sumcountdiv.innerHTML = "总计: " + pcsCount + "件, " + pltCount + "托";
    }
    
}

function printcmr(clickeditem,items){
    var printWindow = window.open('', '', 'height=1123px,width=794px');
        printWindow.document.write('<html><head>');
        printWindow.document.write('<style>body{font-family: Arial, sans-serif; font-size:14px;margin:0px 0px 0px 0px}h1{font-size:65px; font-weight:600;margin:0 0 0 0;}</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('</body></html>');

    const img = document.createElement('img');
    img.src = 'http://ljb2-utility.stor.sinaapp.com/CMR%20template.jpg';
    img.width = 794;
    img.height = 1050;
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.zIndex = '-1';
    printWindow.document.body.appendChild(img);

    //items
    const itemsdiv = document.createElement('div');
    itemsdiv.style.position = 'absolute';
    itemsdiv.style.top = '437px';
    itemsdiv.style.left = '40px';
    itemsdiv.style.width = '635px';
    itemsdiv.style.height = '250px';
    itemsdiv.style.overflow = 'hide';
    itemsdiv.style.zIndex = '1';
    itemsdiv.style.fontSize = '10px';
    itemsdiv.contentEditable = true;
    items.forEach(function(item) {
        const itemdiv = document.createElement('div');
        itemdiv.style.display = 'flex';
        itemdiv.style.width = '100%';
        if(item['pcs']>0){
            const itemheader = document.createElement('div');
            // itemheader.contentEditable = true;
            if(item['plt']>0){  
                itemheader.innerHTML = item['container'] + ' ' + item['pcs']+ 'CTNS ' + item['plt'] + 'PLTS';
            }else{
                itemheader.innerHTML = item['container'] + ' ' + item['pcs']+ 'CTNS ';
            }
            itemheader.style.marginRight = '5px';
            itemheader.style.fontWeight = 'bold';
            itemdiv.appendChild(itemheader);
            const itemfba = document.createElement('div');
            // itemfba.contentEditable = true;
            itemfba.style.fontSize = '7px';
            itemfba.innerHTML = item['fba'].replace(/[\n;,]/g, ' ');
            itemdiv.appendChild(itemfba);
            itemsdiv.appendChild(itemdiv);
        }
    });

    printWindow.document.body.appendChild(itemsdiv);

    //order number
    const ordernumber = document.createElement('div');
    ordernumber.style.position = 'absolute';
    ordernumber.style.top = '340px';
    ordernumber.style.left = '420px';
    ordernumber.style.width = '300px';
    ordernumber.style.height = '50px';
    ordernumber.style.zIndex = '1';
    ordernumber.contentEditable = true;
    if(clickeditem['orderid']){
        ordernumber.innerHTML = clickeditem['orderid'] + ' <br>' ;
    }
    if(clickeditem['reference']){
        ordernumber.innerHTML = ordernumber.innerHTML + clickeditem['reference'];
    }
    
    printWindow.document.body.appendChild(ordernumber);

    //del address
    var deladdressfull=getaddress(clickeditem['joblabel']);
    const deladdress = document.createElement('div');
    deladdress.style.position = 'absolute';
    deladdress.style.top = '196px';
    deladdress.style.left = '40px';
    deladdress.style.width = '360px';
    deladdress.style.height = '50px';
    deladdress.style.zIndex = '1';
    deladdress.style.fontSize = '11px';
    deladdress.contentEditable = true;
    deladdress.innerHTML = deladdressfull?deladdressfull[0]:clickeditem['deladdress']?clickeditem['deladdress'].replace(/\n/g, '<br>'):'';

    printWindow.document.body.appendChild(deladdress);

    //del address city
    const deladdresscity = document.createElement('div');
    deladdresscity.style.position = 'absolute';
    deladdresscity.style.top = '275px';
    deladdresscity.style.left = '40px';
    deladdresscity.style.width = '360px';
    deladdresscity.style.height = '22px';
    deladdresscity.style.zIndex = '1';
    deladdresscity.contentEditable = true;
    deladdresscity.textContent = deladdressfull?deladdressfull[1]:clickeditem['delcity']?clickeditem['delcity']:'';

    printWindow.document.body.appendChild(deladdresscity);

    //total pcs
    const totalpcs = document.createElement('div');
    totalpcs.style.position = 'absolute';
    totalpcs.style.top = '470px';
    totalpcs.style.left = '690px';
    totalpcs.style.width = '70px';
    totalpcs.style.height = '80px';
    totalpcs.style.zIndex = '1';
    totalpcs.contentEditable = true;
    var totalpcscount = items.reduce((sum, item) => sum + Number(item.pcs), 0);
    var totalpltcount = items.reduce((sum, item) => sum + Number(item.plt), 0);
    if(totalpltcount>0){
        totalpcs.innerHTML = 'Total: <br>'+totalpcscount + 'CTNS<br>'+totalpltcount + 'PLTS';
    }else{
        totalpcs.innerHTML = 'Total: <br>'+totalpcscount + 'CTNS';
    }
    printWindow.document.body.appendChild(totalpcs);

    //seal number
    const sealnumber = document.createElement('div');
    sealnumber.style.position = 'absolute';
    sealnumber.style.top = '700px';
    sealnumber.style.left = '40px';
    sealnumber.style.width = '200px';
    sealnumber.style.height = '50px';
    sealnumber.style.zIndex = '1';
    sealnumber.contentEditable = true;
    sealnumber.innerHTML = 'Seal Number: ';
    
    printWindow.document.body.appendChild(sealnumber);
     
    //issue city
    const issuecity = document.createElement('div');
    issuecity.style.position = 'absolute';
    issuecity.style.top = '900px';
    issuecity.style.left = '110px';
    issuecity.style.width = '120px';
    issuecity.style.height = '20px';
    issuecity.style.zIndex = '1';
    issuecity.textContent = 'Gronsveld';

    printWindow.document.body.appendChild(issuecity);

    //issue date
    const issuedate = document.createElement('div');
    issuedate.style.position = 'absolute';
    issuedate.style.top = '900px';
    issuedate.style.left = '300px';
    issuedate.style.width = '100px';
    issuedate.style.height = '20px';
    issuedate.style.zIndex = '1';
    issuedate.textContent = getformatteddate(0);

    printWindow.document.body.appendChild(issuedate);

}
function readxls(file,headers){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(e) {
        var data = new Uint8Array(reader.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var json = XLSX.utils.sheet_to_json(sheet, {header: headers});
        return json;
    };
    
    
}

function constructinventoryid(i){
    var jobdate=document.getElementById("inputdate").value==''?new Date():document.getElementById("inputdate").value;
    var datepart=new Date(jobdate);
    var datestring=""+(1 + datepart.getMonth()).toString().padStart(2, '0')+datepart.getDate().toString().padStart(2, '0');
    var containerpart=document.getElementById("joblabelinput").value.trim();
    var time4dig = Math.floor((Date.now() % 100000000) / 10000);
    var last4=containerpart.length>3?containerpart.substr(containerpart.length - 3):containerpart;
    var inventoryid=""+last4+datestring+time4dig+i;
    return inventoryid;
}

async function showinventorydetail(inventory){
    // var searchcreteria = new FormData();
    // searchcreteria.append("id",id);
    // const response = await fetch('https://garfat.xyz/index.php/home/Wms/searchinventory', {
    //     method: 'POST',
    //     body: searchcreteria,
    //   });

    // const data = await response.json();

    // var inventory = data["data"][0];

    const itemdetail = document.getElementById("itemdetail");
    itemdetail.innerHTML = "";
    
    var inventorydetail = document.createElement("div");
    inventorydetail.className="inventorydetail";
    itemdetail.appendChild(inventorydetail);

    function createInventoryDetailItem(label, value) {
        const detailpargraph = document.createElement('p');
        detailpargraph.className = 'detailpargraph';
        detailpargraph.textContent = label + ': ' + value;
        inventorydetail.appendChild(detailpargraph);
    }

    createInventoryDetailItem('库存编号', inventory['inventoryid']);
    createInventoryDetailItem('客户', inventory['customer']);
    createInventoryDetailItem('箱号/单号', inventory['container']);
    createInventoryDetailItem('仓点', inventory['label']);
    createInventoryDetailItem('箱唛', inventory['marks']);
    createInventoryDetailItem('渠道', inventory['channel']);
    createInventoryDetailItem('件数', inventory['pcs']);
    createInventoryDetailItem('托数', inventory['plt']);
    createInventoryDetailItem('要求', inventory['requirement']);
    createInventoryDetailItem('FBA', inventory['fba']);
    createInventoryDetailItem('备注', inventory['note']);
    createInventoryDetailItem('创建时间', inventory['date']);
    createInventoryDetailItem('仓库', inventory['locationa']);
    createInventoryDetailItem('区域', inventory['locationb']);




}
async function showactivitydetail(activity){
    var itemdetail = document.getElementById("itemdetail");
    itemdetail.innerHTML = "";
    var activitydetail = document.createElement("div");
    activitydetail.className="activitydetail";
    itemdetail.appendChild(activitydetail);

    function createActivityDetailItem(label, value) {
        const detailpargraph = document.createElement('p');
        detailpargraph.className = 'detailpargraph';
        detailpargraph.textContent = label  + value;
        activitydetail.appendChild(detailpargraph);
    }
    createActivityDetailItem('可以使用任务编号在“当前任务”标签中搜索任务详细信息。', '');
    createActivityDetailItem('任务编号: ', activity['jobid']);
    createActivityDetailItem('库存编号: ', activity['inventoryid']);
    createActivityDetailItem('客户: ', activity['customer']);
    createActivityDetailItem('日期: ', activity['date']);
    createActivityDetailItem('活动: ', activity['activity']);
    createActivityDetailItem('箱号: ', activity['container']);
    createActivityDetailItem('件数: ', activity['pcs']);
    createActivityDetailItem('托数: ', activity['plt']);
    createActivityDetailItem('渠道: ', activity['channel']);
    createActivityDetailItem('箱唛: ', activity['marks']);
    createActivityDetailItem('仓点: ', activity['label']);
    createActivityDetailItem('要求: ', activity['requirement']);
    createActivityDetailItem('FBA: ', activity['fba']);
    createActivityDetailItem('备注: ', activity['note']);
    
    var searchcreteria = new FormData();
    searchcreteria.append("jobid",activity['jobid']);
    const response = await fetch('https://garfat.xyz/index.php/home/Wms/searchjobs', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    var job = data["data"][0];
    createActivityDetailItem('任务状态', job['status'] +"  任务状态不是“完成”时，出入动作信息将不会被记录到库存。");
    createjob(job,activitydetail);
    
}

function getaddress(reforigin){
   const ref = reforigin.trim().toUpperCase();
    if (ref === 'STR1') {
        return ['STR1 <br>Im Buchbusch 1, DE-75177', 'Pforzheim, Baden-Württemberg, Germany'];
    } else if (ref === 'HAJ1') {
        return ['HAJ1 <br>Zur Alten Molkerei 1, DE-38350', 'Helmstedt, Lower Saxony, Germany'];
    } else if (ref === 'WRO5') {
        return ['Finsterwalder Transport und Logistik GmbH <br>Schieferstraße 16,  DE-06126', 'Halle (saale), Germany'];
    } else if (ref === 'DTM2') {
        return ['DTM2<br>Kaltbandstrasse 4, DE-44145', 'Dortmund, North Rhine-Westphalia, Germany'];
    } else if (ref === 'DTM1') {
        return ['DTM1 <br>Raiffeisenstraße 1, DE-59368', 'Werne, Nordrhein-Westfalen, Germany'];
    }else if (ref === 'LEJ3') {
        return ['LEJ3 <br>Bielefelder Straße 9, DE-39171', 'Suelzetal, Saxony-Anhalt, Germany']; 
    }else if (ref === 'DPD') {
        return ["DPD Belgium Depot<br>Rue de l'Arbe Saint-Michel 99, 4400 Flémalle", 'Flémalle, Belgium']; 
    }else if (ref === 'XSC1') {
        return ['XSC1<br>Hans-Geiger-Strasse 7, DE-67661', 'Kaiserslautern, Rhineland-Palatinate, Germany']; 
    }else if (ref === 'CDG7') {
        return ['CDG7<br>1 Av. Alain Boucher, FR-60300', 'Senlis, Oise, France'];
    }else if (ref === 'XOR1') {
        return ['XOR1<br>2449 Rue Denis Papin, FR-77550', 'Réau, France'];
    }else if (ref === 'STR2') {
        return ['STR2<br>Oggenhauser Hauptstrasse 151, DE-89522', 'Heidenheim an der Brenz, Bayern, Germany'];
    }else if (ref === 'XPO1') {
        return ['Slam Sp.z.o.o<br>Am Zeugamt 4, DE-04758', 'Oschatz, Germany']; 
    }else if (ref === 'DHL PAKET') {
        return ['DHL Freight Hagen<br>Dolomitstraße 20, DE-58099', 'Hagen, Germany']; 
    }else{
        return null;
    }
    
    
}