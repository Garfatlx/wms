var access;
var customername;
var latestActionToken;
var currentjobpagecontent;
var currentwarehouse;

var searchedjobs;
var searchedinventory;
var filteredinventory;
var searchedreports;

var readytoloadjobdetail=true;

var serverdomain = "https://garfat.xyz/index.php/home/Wms/";

// window.addEventListener("load", function(){
    
//     access=-1;
//     sysresponse = document.getElementById("response");
//     sysresponse.innerHTML="欢迎。近期更新频繁，建议每天第一次使用前按键盘Shift+F5刷新页面。v1.1.15";
    
//     //page fist load
//     // var searchcreteria = new FormData();
//     // searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
//     // showjobsearchbox();
//     // searchjobs(searchcreteria);

//     var loginform= document.getElementById("loginform");
//     loginform.addEventListener("submit", function (event) {
//         event.preventDefault();
//         login();
//     });
    
//     var newinjobbutton = document.getElementById("newinjobbutton");
//     newinjobbutton.addEventListener("click", function() {
//         if(access>0){
//             loaddetail("",'入库',null,true);
//         }
//     });
//     var newoutjobbutton = document.getElementById("newoutjobbutton");
//     newoutjobbutton.addEventListener("click", function() {
//         if(access>0){
//             loaddetail("",'出库',null,true);
//         }
//     });
    

    

//     //select page
//     var currentjobs = document.getElementById("currentjobs");
//     currentjobs.addEventListener("click", function() {
//         console.log("currentjobs clicked");
//         if(access!=-1){
//             var searchcreteria = new FormData();
//             if(access==2){
//                 searchcreteria.append("status", '全部');
//             }
//             searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
//             searchcreteria.append("includeunfinished", "true");
//             showjobsearchbox();
//             searchjobs(searchcreteria);
//             currentjobpagecontent='jobs';
//         }
//     });
//     var currentinventory = document.getElementById("currentinventory");
//     currentinventory.addEventListener("click", function() {
//         if(access!=-1){
//             var searchcreteria = new FormData();
//             showinventorysearchbox();
//             showinventory(searchcreteria);
//         }
//     });

//     var activitylog = document.getElementById("activitylog");
//     activitylog.addEventListener("click", function() {
//         if(access!=-1){
//             document.getElementById("activejobs").innerHTML="";
//             showitemsearchbox();
//             if(access==2){
//                 var searchcreteria = new FormData();
//                 searchcreteria.append("enddate", getformatteddate(0)+" 23:59:59");
//                 searchcreteria.append("customer", customername);
//                 showitemsOrganised(searchcreteria);
//                 //showitems(searchcreteria);


                
//             }
//         }
//     });
//     var activitylog = document.getElementById("invoicelog");
//     activitylog.addEventListener("click", function() {
//         if(access==1 || access==3){
//             document.getElementById("activejobs").innerHTML="";
//             showinvoicesearchbox();
//         }else{
//             sysresponse.innerHTML="功能未开放";
//         }
//     });

    
    

//     var datalist=document.createElement("datalist");
//     datalist.id="channels";
//     const channels = ['海外仓', '客户自提', '亚马逊-卡派-散货', '亚马逊-卡派-托盘', '快递-DHL Express', '快递-DHL-Paket', '快递-DPD', '卡派-DHL Freight', '拦截暂扣', '不卸货', '暂放-不确定出货方式'];
//     channels.forEach(channel => {
//         const option = document.createElement('option');
//         option.value = channel;
//         datalist.appendChild(option);
//     });
//     document.body.appendChild(datalist);

//     var datalist2=document.createElement("datalist");
//     datalist2.id="services";
//     const services = ['贴标', '打托'];
//     services.forEach(service => {
//         const option = document.createElement('option');
//         option.value = service;
//         datalist2.appendChild(option);
//     });
//     document.body.appendChild(datalist2);

//     // testing code
//     // var searchcreteria = new FormData();
//     // searchcreteria.append("jobid", "1732890217735");   
//     // const testdt=searchjobwithitems(searchcreteria);

//     refreshAt(0,0,0);

// });

function refreshAt(hours, minutes, seconds) {
    var now = new Date();
    var then = new Date();

    if(now.getHours() > hours ||
       (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(function() { window.location.reload(true); }, timeout);
    console.log("refreshed at "+then+" in "+timeout+" milliseconds");
}

function login(){
    
    var loginform = new FormData(document.getElementById("loginform"));
    if(loginform.get('directconnect')=='directconnect'){
        serverdomain="https://ljb2.saelinzi.com/index.php/home/Wms/";
    }
    showloading(document.getElementById("activejobs"));
    const xhr  = new XMLHttpRequest();
    xhr.open("POST", serverdomain+"finduser", true);
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                sysresponse.innerHTML=xhr.response["msg"];
                access=xhr.response["data"]["access"];
                customername=xhr.response["data"]["customer"];
                currentwarehouse=xhr.response["data"]["warehouse"];

                if(access>0){
                    document.getElementById("newinjobbutton").removeAttribute('disabled');
                    document.getElementById("newoutjobbutton").removeAttribute('disabled');

                    //select from no appointment jobs
                    const noappbutton = document.createElement('button');
                    noappbutton.className = 'button';
                    noappbutton.style.position = 'absolute';
                    noappbutton.style.right = '0px';
                    noappbutton.style.top = '6px';
                    noappbutton.innerHTML = '未预约任务';
                    document.getElementById("controlframe").appendChild(noappbutton);
                    noappbutton.addEventListener("click", function() {
                            var searchcreteria = new FormData();
                            searchcreteria.append("status", "未预约");
                            showjobsearchbox();
                            searchjobs(searchcreteria);
                            currentjobpagecontent='unappoint';
                    });
                }
                
                if(access==2){
                    // document.querySelector("#activitylog input").checked = true;
                    document.getElementById("newinjobbutton").removeAttribute('disabled');
                    document.getElementById("activitylog").click();
                    
                }else{
                    document.getElementById("currentjobs").click();
                    // var searchcreteria = new FormData();
                    // searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
                    // showjobsearchbox();
                    // searchjobs(searchcreteria);
                }
                
            }else{
                document.getElementById("activejobs").innerHTML=xhr.response["msg"]+' 请刷新本页重新登陆';
            }
        }
    }
    xhr.responseType="json";
    xhr.send(loginform);
}
async function addnewjob(clickeditem,detaillinenumber){

    var addjob = new FormData(document.getElementById("detailform"));
    
    if (!addjob.get('date')) {
        alert('Please set a date');
        return;
    }

    if (addjob.get('status') == '完成') {
        if (confirm("确认任务已完成?")) {
            // Code to execute if user confirms update
        } else {
            // Code to execute if user cancels update
            return;
        }
    }

    
    //check whether this job is already finished
    var checkingjob = new FormData();
    checkingjob.append("jobid", addjob.get('jobid'));
    const response = await fetch(serverdomain+'searchjobs', {
        method: 'POST',
        body: checkingjob,
    });
    const data = await response.json();
    if (data['data'] && data['data'][0].status == '完成') {
        alert('任务已完成，无法修改');
        return;
    }
    
    // new code start here
    return new Promise((resolve, reject) => {
        // Array to hold all HTTP request promises
        let httpRequests = [];

        // Example HTTP request using fetch (replace with actual HTTP requests)
        httpRequests.push(fetch(serverdomain+"addjob", {
            method: 'POST',
            body: addjob,
        })
        );
        
        const detaillineForms = document.getElementsByClassName('detaillineform');
        for (let i = 0; i < detaillineForms.length; i++) {
            const addjobline = new FormData(detaillineForms[i]);
            if (addjob.get('activity') == '入库') {
                addjobline.append('container', addjob.get('joblabel'));
                addjobline.set('customer', addjob.get('customer'));
            } else {
                addjobline.append('orderid', addjob.get('orderid'));
                addjobline.append('label', addjob.get('joblabel'));
            }
            // addjobline.append('jobid', jobid);
            addjobline.append('jobid', addjob.get('jobid'));
            addjobline.append('activity', addjob.get('activity'));
            addjobline.append('date', addjob.get('date'));
            addjobline.append('status', addjob.get('status'));
            addjobline.append('warehouse', addjob.get('warehouse'));
            var checkedstatus = addjobline.get('checked')?addjobline.get('checked'):0;
            addjobline.set('checked', checkedstatus);

            httpRequests.push(fetch(serverdomain+"additem", {
                method: 'POST',
                body: addjobline,
            }));
            
            if(addjob.get('activity')=="入库"){
                httpRequests.push(fetch(serverdomain+"updateinventory", {
                    method: 'POST',
                    body: addjobline,
                }));
                //check plt numbers
                if(addjob.get('status') == '完成'){
                    httpRequests.push(checkandGeneratevasPlt(addjobline));
                }
            }else{
                if (addjob.get('status') == '完成') {
                    httpRequests.push(fetch(serverdomain+"updateinventory", {
                        method: 'POST',
                        body: addjobline,
                    }));
                }
            }

            
            
        }
        // document.getElementById("itemdetail").innerHTML = "";
        // Wait for all HTTP requests to complete
        Promise.all(httpRequests)
            .then(responses => {
                // All HTTP requests are completed
                resolve();
            })
            .catch(error => {
                // Handle any errors
                console.log(error);
                console.log(addjobline.get('label'));
                reject(error);
            });
    });

    

}

// search boxes
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
    divContainer.style.flexWrap = 'wrap';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    searchInput.placeholder = '搜索箱号、提货码、状态';
    divContainer.appendChild(searchInput);

    // Create status radio input container
    const statusRadioInput = document.createElement('div');
    statusRadioInput.className = 'status-radio-input';
    statusRadioInput.style.marginLeft = '15px';
    statusRadioInput.style.setProperty('--container_width', '200px');

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
    statusRadioInput.appendChild(createRadioInput('searcvas', 'value-4', '附加任务'));

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
    // searchButton.style.position = 'absolute';
    // searchButton.style.right = '0px';
    // searchButton.style.width = '70px';
    searchButton.style.marginLeft = '20px';
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

    if(access!=3){
        const warehouseSelectdiv=createwarehouseselectiondiv();
        warehouseSelectdiv.style.marginLeft = '15px';
        divContainer1.appendChild(warehouseSelectdiv);

        const warehouseselect = warehouseSelectdiv.querySelector('select');
        warehouseselect.addEventListener("change", function() {
            document.getElementById("activejobs").innerHTML = "";
            if (this.value === '') {
                for (var i = 0; i < searchedjobs.length; i++) {
                    createjob(searchedjobs[i],document.getElementById("activejobs"));
                }
                return;
            }
            var filteredJobs = searchedjobs.filter(job => job.warehouse == this.value);
            for (var i = 0; i < filteredJobs.length; i++) {
                createjob(filteredJobs[i],document.getElementById("activejobs"));
            }
            currentwarehouse=this.value;
        });
    }

    form.appendChild(divContainer1);

    // Append form to body or any other container
    searchbox.appendChild(form);

    // add show dock appointments button
    if(access==1 || access==3){
        const showdockappointmentsbutton = document.createElement('button');
        showdockappointmentsbutton.className = 'button';
        showdockappointmentsbutton.id = 'showdockappointmentsbutton';
        showdockappointmentsbutton.style.display = 'inline-block';
        showdockappointmentsbutton.style.marginLeft = '20px';
        showdockappointmentsbutton.style.marginTop = '4px';
        showdockappointmentsbutton.style.height = '29.2px';
        showdockappointmentsbutton.textContent = '垛口信息';

        showdockappointmentsbutton.addEventListener("click", function() {
            showdockappointments(undefined,'showdockappointments');
        });

        searchbox.appendChild(showdockappointmentsbutton);
    }

    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log(currentjobpagecontent);
        var searchcreteria = new FormData(form);
        searchcreteria.delete('warehouse');

        if(access==2){
            searchcreteria.append("status", '全部');
        }
        if(currentjobpagecontent=='unappoint' && !searchcreteria.get("status")){
            searchcreteria.append("status", "未预约");
        }
        if(searchcreteria.get("date")!=""){
            if(currentjobpagecontent=='jobs' || currentjobpagecontent=='unappoint'){
                searchcreteria.set("date", searchcreteria.get('date') + " 23:59:59");
            }
            if(currentjobpagecontent=='vas'){
                searchcreteria.append("createdate", searchcreteria.get('date') + " 23:59:59");
            }
        }
        if(searchcreteria.get("searchref")=="" && searchcreteria.get("date")==""){
            alert("请输入搜索条件。");
        }else{
            if(currentjobpagecontent=='jobs' || currentjobpagecontent=='unappoint'){
                searchjobs(searchcreteria,function(){
                    const warehouseSelectinput=divContainer1.querySelector('select');
                    if(warehouseSelectinput){
                        console.log(warehouseSelectinput.value);
                        warehouseSelectinput.dispatchEvent(new Event('change'));
                    }
                });
                noshowcompletedinput.checked = false;
                
            }
            if(currentjobpagecontent=='vas'){
                searchvas(searchcreteria);
                noshowcompletedinput.checked = false;
                // if(access!=3){
                //     const warehouseselectinput=divContainer1.querySelector('select');
                //     if(warehouseselectinput){
                //         warehouseselectinput.value = '';
                //         //warehouseselectinput.dispatchEvent(new Event('change'));
                //     }
                // }
            }
            
        }
        
    });

    //search selected date  所有注释的代码被新的searchTodayHandler函数替代， 注释日期2024-12-31. 可以删除
    const searchyesterday = document.getElementById("searchyesterday").querySelector('input');
    searchyesterday.addEventListener("click", searchTodayHandler.bind(null, -1));
    // searchyesterday.addEventListener("click", function() {
    //     var searchcreteria = new FormData();
    //     if(access==2){
    //         searchcreteria.append("status", '全部');
    //     }
    //     searchcreteria.append("date", getformatteddate(-1)+" 23:59:59");
    //     searchjobs(searchcreteria,function(){
    //         const warehouseSelectinput=divContainer1.querySelector('select');
    //         if(warehouseSelectinput){
    //             console.log(warehouseSelectinput.value);
    //             warehouseSelectinput.dispatchEvent(new Event('change'));
    //         }
    //     });
    //     currentjobpagecontent='jobs';
    //     noshowcompletedinput.checked = false;
    // });

    const searchtoday = document.getElementById("searchtoday").querySelector('input');
    searchtoday.addEventListener("click", searchTodayHandler.bind(null, 0));
    // searchtoday.addEventListener("click", function() {
    //     console.log("searchtoday clicked");
    //     var searchcreteria = new FormData();
    //     if(access==2){
    //         searchcreteria.append("status", '全部');
    //     }
    //     currentjobpagecontent='jobs';
    //     searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
    //     searchcreteria.append("includeunfinished", "true");
    //     searchjobs(searchcreteria,function(){
    //         const warehouseSelectinput=divContainer1.querySelector('select');
    //         if(warehouseSelectinput){
    //             console.log(warehouseSelectinput.value);
    //             warehouseSelectinput.dispatchEvent(new Event('change'));
    //         }
    //     });
        
    //     noshowcompletedinput.checked = false;
    // });
    

    const searchtomorrow = document.getElementById("searchtomorrow").querySelector('input');
    searchtomorrow.addEventListener("click", searchTodayHandler.bind(null, 1));
    // searchtomorrow.addEventListener("click", function() {
    //     var searchcreteria = new FormData();
    //     if(access==2){
    //         searchcreteria.append("status", '全部');
    //     }
    //     searchcreteria.append("date", getformatteddate(1)+" 23:59:59");
    //     searchjobs(searchcreteria,function(){
    //         const warehouseSelectinput=divContainer1.querySelector('select');
    //         if(warehouseSelectinput){
    //             warehouseSelectinput.dispatchEvent(new Event('change'));
    //         }
    //     });
    //     currentjobpagecontent='jobs';
    //     noshowcompletedinput.checked = false;
    // });
    const searcvas = document.getElementById("searcvas").querySelector('input');
    searcvas.addEventListener("click", function() {
        sysresponse.innerHTML="附加任务";
        var searchcreteria = new FormData();
        if(access==2){
            searchcreteria.append("customer", customername);
        }
        searchcreteria.append("status", "未完成");
        searchvas(searchcreteria);
        currentjobpagecontent='vas';
        noshowcompletedinput.checked = true;
    });

    noshowcompletedinput.addEventListener("change", function() {
        if(currentjobpagecontent=='jobs'){
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
        }
        if(currentjobpagecontent=='vas'){
            if (this.checked) {
                var searchcreteria = new FormData();
                searchcreteria.append("status", "未完成");
                searchvas(searchcreteria);
            }else{
                var searchcreteria = new FormData();
                searchcreteria.append("date", getformatteddate(0)+" 23:59:59");
                searchvas(searchcreteria);
            }
        }
    });

    function searchTodayHandler(daytotoday) {
        console.log("searchtoday clicked");
        var searchcreteria = new FormData();
        if (access == 2) {
            searchcreteria.append("status", '全部');
        }
        currentjobpagecontent = 'jobs';
        searchcreteria.append("date", getformatteddate(daytotoday) + " 23:59:59");
        searchcreteria.append("includeunfinished", "true");
        searchjobs(searchcreteria, function () {
            const warehouseSelectinput = divContainer1.querySelector('select');
            if (warehouseSelectinput) {
                console.log(warehouseSelectinput.value);
                warehouseSelectinput.dispatchEvent(new Event('change'));
            }
        });
        noshowcompletedinput.checked = false;
    }
}

function showinventorysearchbox(){
    // Clear previous elements in searchbox
    const searchbox = document.getElementById('searchbox');
    searchbox.style.flexDirection = 'row';
    searchbox.innerHTML = '';

    // Create form element
    const form = document.createElement('form');
    form.id = 'searchform';
    form.className = 'searchform';
    // Center align elements
    form.style.display = 'flex';
    form.style.margin="0px 0px 0px 0px";

    // Create div container
    const divContainer = document.createElement('div');
    divContainer.className = 'linecontrol';
    divContainer.style.display = 'flex';
    divContainer.style.flexWrap = 'wrap';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    searchInput.style.margin = '0px 0px 0px 0px';
    searchInput.placeholder = '搜索箱号、仓点、箱唛、FBA';
    divContainer.appendChild(searchInput);

    // Create date input
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'search-input';
    dateInput.name = 'dateref';
    dateInput.style.width = '140px';
    dateInput.style.marginLeft = '20px';
    divContainer.appendChild(dateInput);

    // Create switch button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';

    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch btn-color-mode-switch';

    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.value = 'checked';
    inputCheckbox.id = 'datetype';
    inputCheckbox.name = 'datetype';

    const innerLabel = document.createElement('label');
    innerLabel.className = 'btn-color-mode-switch-inner';
    innerLabel.setAttribute('data-off', '创建日期');
    innerLabel.setAttribute('data-on', '盘点日期');
    innerLabel.htmlFor = 'datetype';


    switchLabel.appendChild(inputCheckbox);
    switchLabel.appendChild(innerLabel);

    btnContainer.appendChild(switchLabel);

    divContainer.appendChild(btnContainer);

    //select warehouse
    if(access!=3){
        const warehouseSelect=createwarehouseselectiondiv();
        warehouseSelect.style.marginLeft = '15px';
        divContainer.appendChild(warehouseSelect)
        warehouseSelect.querySelector('select').addEventListener("change", function() {
            const opreationdiv=document.getElementById('warehouseoperationdiv');
            if(opreationdiv){
                createinventoryoperationdiv();
                return;
            }
            const activeJobs = document.getElementById('activejobs');
            var searchcreteria = new FormData(form);
            activeJobs.innerHTML = '';
            filteredinventory = filterinventory(searchcreteria);
            activeJobs.appendChild(createinventorytable(filteredinventory));
            currentwarehouse=this.value;
        });
    }

    // const wareinputDiv=document.createElement("div");
    // wareinputDiv.className="input-container";
    // wareinputDiv.style.margin = '10px 0px 0px 20px';
    // wareinputDiv.style.width = '60px';
    // var inputbottomline=document.createElement("div");
    // inputbottomline.className="underline";
    // var input0=document.createElement("input");
    // input0.type="text";
    // input0.name="locationa";
    // input0.id="input";
    // input0.style.fontSize = '20px';
    // var input0label=document.createElement("label");
    // input0label.innerHTML="仓库";
    // input0label.htmlFor="input";
    // input0label.className="label";
    // wareinputDiv.appendChild(input0);
    // wareinputDiv.appendChild(input0label);
    // wareinputDiv.appendChild(inputbottomline);
    // divContainer.appendChild(wareinputDiv);

    // const areainputDiv=document.createElement("div");
    // areainputDiv.className="input-container";
    // areainputDiv.style.margin = '10px 0px 0px 20px';
    // areainputDiv.style.width = '60px';
    // var inputbottomline=document.createElement("div");
    // inputbottomline.className="underline";
    // var input0=document.createElement("input");
    // input0.type="text";
    // input0.name="locationb";
    // input0.id="input";
    // input0.style.fontSize = '20px';
    // var input0label=document.createElement("label");
    // input0label.innerHTML="区域";
    // input0label.htmlFor="input";
    // input0label.className="label";
    // areainputDiv.appendChild(input0);
    // areainputDiv.appendChild(input0label);
    // areainputDiv.appendChild(inputbottomline);
    // divContainer.appendChild(areainputDiv);
    
    // Create search button
    const searchButton = document.createElement('button');
    searchButton.className = 'button';
    searchButton.id = 'searchbutton';
    searchButton.style.display = 'inline-block';
    searchButton.style.marginLeft = '20px';
    searchButton.style.alignSelf = 'center';
    searchButton.textContent = '搜索';
    divContainer.appendChild(searchButton);

    const inventorymapbutton = document.createElement('button');
    inventorymapbutton.className = 'button';
    inventorymapbutton.id = 'inventorymapbutton';
    inventorymapbutton.style.display = 'inline-block';
    // inventorymapbutton.style.justifySelf = 'flex-end';
    inventorymapbutton.style.alignSelf = 'center';
    inventorymapbutton.textContent = '库存地图';
    inventorymapbutton.disabled = true;

    
    

    // Append div container to form
    form.appendChild(divContainer);

    // Append form to body or any other container
    searchbox.appendChild(form);
    searchbox.appendChild(inventorymapbutton);

    //Invnetory operation button
    if(access==1 || access==3){
        const inventoryoperationbut = document.createElement('button');
        inventoryoperationbut.className = 'button';
        inventoryoperationbut.id = 'inventoryoperationbut';
        inventoryoperationbut.style.display = 'inline-block';
        inventoryoperationbut.style.alignSelf = 'center';
        inventoryoperationbut.textContent = '库存操作';
        inventoryoperationbut.addEventListener("click", function() {
            createinventoryoperationdiv();
            
        });
        searchbox.appendChild(inventoryoperationbut);

        const exportbutton = document.createElement('button');
        exportbutton.className = 'button';
        exportbutton.id = 'exportbutton';
        exportbutton.style.display = 'inline-block';
        exportbutton.style.alignSelf = 'center';
        exportbutton.textContent = '导出CSV';
        exportbutton.addEventListener("click", function() {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            var ouputdata=filteredinventory.filter(inventory => inventory.status == "完成");
            ouputdata=ouputdata.sort((a, b) => {
                const dateA = new Date(a.date); // Parses 'yyyy-mm-dd hh:mm:ss'
                const dateB = new Date(b.date); // Parses 'yyyy-mm-dd hh:mm:ss'
        
                // Check if dates are older than 3 months
                const isOldA = dateA < threeMonthsAgo;
                const isOldB = dateB < threeMonthsAgo;
        
                // Step 1: Prioritize records by 'old' status
                if (isOldA && !isOldB) return 1;   // 'a' is older, push it down
                if (!isOldA && isOldB) return -1; // 'b' is older, push it down
                
                // If 'hold' is true, place it at the bottom
                if (a.channel === '拦截暂扣' && b.channel !== '拦截暂扣') return 1;  // 'a' goes after 'b'
                if (a.channel !== '拦截暂扣' && b.channel === '拦截暂扣') return -1; // 'a' goes before 'b'
        
                // If 'hold' status is the same, sort by 'label'
                return a.label.localeCompare(b.label); // Ascending by 'label'
            });

            // Filter the data to only keep the columns we want in warehouse checking process
            const columnsToKeep = ['label', 'customer','container', 'marks','pcs','plt', 'date', 'channel'];
            const filteredOutputData = ouputdata.map(inventory => {
                const filteredInventory = {};
                columnsToKeep.forEach(column => {
                    if(inventory.hasOwnProperty(column)){
                        filteredInventory[column] = inventory[column];
                    }
                });
                return filteredInventory;
            });


            // Convert JSON data to CSV
            const csvData = jsonToCsv(filteredOutputData,itemexporttilemapping);

            // Create a Blob from the CSV data
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-16;' });

            // Create a link element to download the Blob as a CSV file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'data.csv';

            // Append the link to the document body and trigger the download
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
        searchbox.appendChild(exportbutton);


    }

    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(form);
        
        if(searchcreteria.get("searchref")!=""){
            searchcreteria.set("searchref", searchcreteria.get('searchref').trim());
        }
        // showinventory(searchcreteria);

        const activeJobs = document.getElementById('activejobs');
        activeJobs.innerHTML = '';
        filteredinventory = filterinventory(searchcreteria);
        activeJobs.appendChild(createinventorytable(filteredinventory));
        
    });

    function filterinventory(searchcreteria) {
        if (!searchcreteria || Array.from(searchcreteria.keys()).length === 0 || Array.from(searchcreteria.values()).every(value => value === "")) {
            return searchedinventory;
        }
        return searchedinventory.filter(inventory => {
            let matches = true;
    
            if (searchcreteria.get('searchref')) {
                const searchref = searchcreteria.get('searchref').toLowerCase();
                matches = matches && (
                    (inventory.label && inventory.label.toLowerCase().includes(searchref)) ||
                    (inventory.container && inventory.container.toLowerCase().includes(searchref)) ||
                    (inventory.fba && inventory.fba.toLowerCase().includes(searchref)) ||
                    (inventory.marks && inventory.marks.toLowerCase().includes(searchref))
                );
            }
    
            if (searchcreteria.get('dateref')) {
                const dateref = new Date(searchcreteria.get('dateref'));
                if (searchcreteria.get('datetype') == 'checked') {
                    matches = matches && (inventory.checkdate && new Date(inventory.checkdate) >= dateref);
                } else {
                    matches = matches && (inventory.date && new Date(inventory.date) >= dateref);
                }
            }
    
            if (searchcreteria.get('locationa')) {
                matches = matches && inventory.locationa.toLowerCase().includes(searchcreteria.get('locationa').toLowerCase());
            }
    
            if (searchcreteria.get('locationb')) {
                matches = matches && inventory.locationb.toLowerCase().includes(searchcreteria.get('locationb').toLowerCase());
            }
            if (searchcreteria.get('warehouse')) {
                matches = matches && inventory.warehouse.toLowerCase().includes(searchcreteria.get('warehouse').toLowerCase());
            }
    
            return matches;
        });
    }

    inventorymapbutton.addEventListener("click", function() {
        showinventorymap(searchedinventory,"",filteredinventory);
    });

}

function showitemsearchbox(){
    // Clear previous elements in searchbox
    const searchbox = document.getElementById('searchbox');
    searchbox.innerHTML = '';
    searchbox.style.flexDirection = 'column';

    const line1=document.createElement("div");
    line1.className="flexlinecontrol";

    // Create form element
    const form = document.createElement('form');
    form.id = 'searchform';
    form.className = 'searchform';
    // Center align elements
    form.style.display = 'flex';
    form.style.margin="0px 0px 0px 0px";

    // Create div container
    const divContainer = document.createElement('div');
    divContainer.className = 'flexlinecontrol';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    
    searchInput.style.margin = '0px 8px 0px 5px';
    searchInput.placeholder = '搜索箱号、仓点';
    divContainer.appendChild(searchInput);
    
    // Create date input
    divContainer.appendChild(document.createTextNode('日期:'));
    const startdateInput = document.createElement('input');
    startdateInput.type = 'date';
    startdateInput.className = 'search-input';
    startdateInput.name = 'startdate';
    startdateInput.style.width = '140px';
    startdateInput.style.marginRight = '5px';
    divContainer.appendChild(startdateInput);
    divContainer.appendChild(document.createTextNode(' 至 '));
    const enddateInput = document.createElement('input');
    enddateInput.type = 'date';
    enddateInput.className = 'search-input';
    enddateInput.name = 'enddate';
    enddateInput.style.width = '140px';
    enddateInput.style.marginLeft = '5px';
    divContainer.appendChild(enddateInput);

    // Create search button
    const searchButton = document.createElement('button');
    searchButton.className = 'button';
    searchButton.id = 'searchbutton';
    searchButton.style.display = 'inline-block';
    searchButton.style.marginLeft = '20px';
    searchButton.textContent = '搜索';
    divContainer.appendChild(searchButton);

    
    
    // Append div container to form
    form.appendChild(divContainer);
    

    const exportbutton = document.createElement('button');
    exportbutton.className = 'button';
    exportbutton.id = 'exportbutton';
    exportbutton.textContent = '导出CSV';
    exportbutton.style.height = '29.2px';
    exportbutton.disabled = true;
    

    // Append form to body or any other container
    line1.appendChild(form);
    // searchbox.appendChild(reportform);
    line1.appendChild(exportbutton);
    // Append line1 to searchbox
    searchbox.appendChild(line1);

    const line2=document.createElement("div");
    line2.className="flexlinecontrol";
    // Create search input
    const orderidsearchform = document.createElement('form');
    orderidsearchform.id = 'orderidsearchform';
    orderidsearchform.className = 'searchform';
    orderidsearchform.style.display = 'flex';
    orderidsearchform.style.margin="0px 0px 0px 0px";

    const orderidsearchInput = document.createElement('input');
    orderidsearchInput.type = 'text';
    orderidsearchInput.className = 'search-input';
    orderidsearchInput.name = 'orderid';
    orderidsearchInput.style.margin = '0px 8px 0px 5px';
    orderidsearchInput.placeholder = '搜索订单号';
    orderidsearchform.appendChild(orderidsearchInput);

    const orderidsearchButton = document.createElement('button');
    orderidsearchButton.className = 'button';
    orderidsearchButton.id = 'orderidsearchbutton';
    orderidsearchButton.style.display = 'inline-block';
    orderidsearchButton.style.marginLeft = '20px';
    orderidsearchButton.textContent = '搜索';
    orderidsearchform.appendChild(orderidsearchButton);

    line2.appendChild(orderidsearchform);
    searchbox.appendChild(line2);


    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(form);
        if(searchcreteria.get("searchref")=="" && searchcreteria.get("startdate")=="" && searchcreteria.get("enddate")==""){
            alert("请输入搜索条件。");
        }else{
            showitemsOrganised(searchcreteria);
        }
    });
    //orderid search form action
    orderidsearchform.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(orderidsearchform);
        if(searchcreteria.get("orderid")==""){
            alert("请输入搜索条件。");
        }else{

            showitemsOrganised(searchcreteria);
        }
    });
    // reportform.addEventListener("submit", function (event) {
    //     event.preventDefault();
    // });
    // reportButton.addEventListener("click", function() {
    //     var searchcreteria = new FormData(reportform);
    //     searchcreteria.append("status", "完成");
    //     if(searchcreteria.get("startdate")!="" && searchcreteria.get("enddate")!=""){
    //         showitems(searchcreteria);
    //     }else{
    //         alert("请输入开始、结束日期。");
    //     }
    // });
    exportbutton.addEventListener("click", function() {
        // Convert JSON data to CSV
        const csvData = jsonToCsv(searchedreports,itemexporttilemapping);

        // Create a Blob from the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-16;' });

        // Create a link element to download the Blob as a CSV file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'data.csv';

        // Append the link to the document body and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}
function showinvoicesearchbox(){
    // Clear previous elements in searchbox
    const searchbox = document.getElementById('searchbox');
    searchbox.innerHTML = '';
    searchbox.style.flexDirection = 'column';

    const line1=document.createElement("div");
    line1.className="flexlinecontrol";

    // Create form element
    const form = document.createElement('form');
    form.id = 'searchform';
    form.className = 'searchform';
    // Center align elements
    form.style.display = 'flex';
    form.style.margin="0px 0px 0px 0px";

    // Create div container
    const divContainer = document.createElement('div');
    divContainer.className = 'flexlinecontrol';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.name = 'searchref';
    searchInput.style.margin = '0px 8px 0px 5px';
    searchInput.placeholder = '搜索客户、箱号、仓库';
    divContainer.appendChild(searchInput);
    
    // Create date input
    divContainer.appendChild(document.createTextNode('日期:'));
    const startdateInput = document.createElement('input');
    startdateInput.type = 'date';
    startdateInput.className = 'search-input';
    startdateInput.name = 'startdate';
    startdateInput.style.width = '140px';
    startdateInput.style.marginRight = '5px';
    divContainer.appendChild(startdateInput);
    divContainer.appendChild(document.createTextNode(' 至 '));
    const enddateInput = document.createElement('input');
    enddateInput.type = 'date';
    enddateInput.className = 'search-input';
    enddateInput.name = 'enddate';
    enddateInput.style.width = '140px';
    enddateInput.style.marginLeft = '5px';
    divContainer.appendChild(enddateInput);

    // Create search button
    const searchButton = document.createElement('button');
    searchButton.className = 'button';
    searchButton.id = 'searchbutton';
    searchButton.style.display = 'inline-block';
    searchButton.style.marginLeft = '20px';
    searchButton.textContent = '搜索';
    divContainer.appendChild(searchButton);

    
    
    // Append div container to form
    form.appendChild(divContainer);
    

    const exportbutton = document.createElement('button');
    exportbutton.className = 'button';
    exportbutton.id = 'exportbutton';
    exportbutton.textContent = '导出CSV';
    exportbutton.style.height = '29.2px';
    exportbutton.disabled = true;

    // Append form to body or any other container
    line1.appendChild(form);
    // searchbox.appendChild(reportform);
    line1.appendChild(exportbutton);
    // Append line1 to searchbox
    searchbox.appendChild(line1);

    //search form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var searchcreteria = new FormData(form);
        if(searchcreteria.get("searchref")=="" && searchcreteria.get("startdate")=="" && searchcreteria.get("enddate")==""){
            alert("请输入搜索条件。");
        }else{
            showinovicedata(searchcreteria);
        }
    });
    //orderid search form action
    
    exportbutton.addEventListener("click", function() {
        return;
        // Convert JSON data to CSV
        const csvData = jsonToCsv(searchedreports,itemexporttilemapping);

        // Create a Blob from the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-16;' });

        // Create a link element to download the Blob as a CSV file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'data.csv';

        // Append the link to the document body and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

// loading papers
function searchjobs(searchcreteria,callback){
    showloading(document.getElementById("activejobs"));
    if(access==2){
        searchcreteria.append("customer", customername);
    }
    if(access==3){
        searchcreteria.append("warehouse", currentwarehouse);
    }
    const actionToken = Symbol();
    latestActionToken = actionToken;

    searchjobwithitems(searchcreteria).then(data => {
        console.log("aha");
        if (actionToken !== latestActionToken) {
            return;
        }
        document.getElementById("activejobs").innerHTML="";
        searchedjobs = data['jobs'];
        
        if(searchedjobs.length==0){
            sysresponse.innerHTML="没有找到任务。";
        }else{
            for (var i = 0; i < data['jobs'].length; i++) {
                createjob(data['jobs'][i],document.getElementById("activejobs"));
            }
        }
        if(callback){
            callback();
        }
    });

    // // 老代码，一定时间后删除, 2024/12/30注
    // const xhr  = new XMLHttpRequest();  
    // xhr.open("POST", serverdomain+"searchjobs", true);
    // xhr.onreadystatechange= () => {
    //     if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
    //         if(xhr.response["error_code"]==0){
    //             if (actionToken !== latestActionToken) {
    //                 return;
    //             }
    //             document.getElementById("activejobs").innerHTML="";
                
    //             searchedjobs=xhr.response["data"];
    //             for (var i = 0; i < xhr.response["data"].length; i++) {
    //                 createjob(xhr.response["data"][i],document.getElementById("activejobs"));
    //             }
    //             sysresponse.innerHTML=xhr.response["msg"];

    //             if(callback){
    //                 callback();
    //             }
    //         }else{
    //             sysresponse.innerHTML=xhr.response["msg"];
    //             document.getElementById("activejobs").innerHTML="";
    //             sysresponse.innerHTML="没有找到任务。";
    //         }
    //     }
    // }
    // xhr.responseType="json";
    // xhr.send(searchcreteria);

    // pre load inventory data
    searchinventory(new FormData()).then(data => {
        searchedinventory = data;
    });
}
async function showinventory(searchcreteria){
    showloading(document.getElementById("activejobs"));
    const actionToken = Symbol();
    latestActionToken = actionToken;

    if(access==2){
        searchcreteria.append("customer", customername);
    }
    if(access==3){
        searchcreteria.append("warehouse", currentwarehouse);
    }
    const showinventorymap = document.getElementById('inventorymapbutton');
    showinventorymap.disabled = true;
    
    const response = await fetch(serverdomain+'searchinventory', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    if (actionToken !== latestActionToken) {
        return;
    }
    const cleaninventorydata=filterunvalidinventory(data['data']);
    searchedinventory = cleaninventorydata;
    filteredinventory = cleaninventorydata;
    showinventorymap.disabled = false;
    var activejobs = document.getElementById("activejobs");
    activejobs.innerHTML="";
    
    // Append table to activejobs element
    const table = createinventorytable(cleaninventorydata);
    activejobs.appendChild(table);
}
async function searchinventory(searchcreteria){
    const response = await fetch(serverdomain+'searchinventory', {
        method: 'POST',
        body: searchcreteria,
      });
    const data = await response.json();
    return data['data'];
}
function searchitems(searchcreteria){
    if(access==2){
        searchcreteria.append("customer", customername);
    }
    if(access==3){
        searchcreteria.append("warehouse", currentwarehouse);
    }
    const xhr  = new XMLHttpRequest();  
    xhr.open("POST", serverdomain+"searchitems", true);
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
async function showitems(searchcreteria,callback){
    showloading(document.getElementById("activejobs"));
    const actionToken = Symbol();
    latestActionToken = actionToken;

    if(access==2){
        searchcreteria.append("customer", customername);
    }
    if(access==3){
        searchcreteria.append("warehouse", currentwarehouse);
    }
    const response = await fetch(serverdomain+'searchitems', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    if (actionToken !== latestActionToken) {
        return;
    }

    if(!data['data']){
        alert("没有找到相关数据。");
        document.getElementById("activejobs").innerHTML="";
        return;
    }
    //save data for export use
    searchedreports = data['data'];
    document.getElementById("exportbutton").disabled = false;

    var activejobs = document.getElementById("activejobs");
    activejobs.innerHTML="";
    
    // Create table element
    var table = document.createElement("table");
    table.className = "inventory-table";

    // Create table header
    var thead = document.createElement("thead");
    thead.className = "inventory-table-header";
    var headerRow = document.createElement("tr");
    var headers = ["出入库" ,"状态","客户", "箱号/单号", "货物标签", "件数", "托数", "日期","仓库"];
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

    var previousRow = null;
    var previousRowOriginalColor = "";
    // Create table body
    var tbody = document.createElement("tbody");
    tbody.className = "inventory-table-body";
    tbody.id = "inventory-table-body";
    data['data'].forEach(function(item) {
        var row = document.createElement("tr");
        row.className = "inventory-table-row";
        //style each row based on status
        if(item.status!="完成"){
            row.style.color = "grey";
        }
        if(item.activity=="出库"){
            row.style.fontStyle = "italic";
        }
        var columns = [item.activity, item.status,item.customer, item.container,item.label, item.pcs, item.plt, item.date,item.warehouse];
        // var previousRow = nulll;
        columns.forEach(function(columnText,index) {
            var td = document.createElement("td");
            td.textContent = columnText;
            row.appendChild(td);

            if(index===5){
                if(item.activity=="入库"){
                    if(item.oripcs){
                        if(item.pcs!=item.oripcs){
                            td.style.color = "red";
                            td.classList.add('tableele');
                            const tooltip = document.createElement('span');
                            tooltip.className = 'tooltip';
                            tooltip.innerHTML = '预报件数: ' + item.oripcs;
                            td.appendChild(tooltip);
                        }
                    }
                }
            }

            row.addEventListener("click", function() {
                if(previousRow){
                    previousRow.style.backgroundColor = previousRowOriginalColor;
                }
                previousRowOriginalColor=row.style.backgroundColor;
                row.style.backgroundColor = 'rgb(73 162 233)';
                previousRow = row;
                showactivitydetail(item);
                
            });
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append table to activejobs element
    activejobs.appendChild(table);

    sortTable(7,3);

    if(callback){
        callback();
    }
}
async function showitemsOrganised(searchcreteria,callback){
    showloading(document.getElementById("activejobs"));
    const actionToken = Symbol();
    latestActionToken = actionToken;

    if(searchcreteria.get('orderid')){
        const response1= await fetch(serverdomain+'searchitems', {
            method: 'POST',
            body: searchcreteria,
        });
        const data1 = await response1.json();
        if (actionToken !== latestActionToken) {
            return;
        }
        if(!data['data']){
            document.getElementById("activejobs").innerHTML = '无数据';
            return;
        }
        const inventoryids = data1['data'].map(item => item.inventoryid);
        searchcreteria.delete('orderid');
        searchcreteria.append('inventoryids', inventoryids.join(','));
        
    }

    if(access==2){
        searchcreteria.append("customer", customername);
    }
    if(access==3){
        searchcreteria.append("warehouse", currentwarehouse);
    }
    searchcreteria.append("activity", "入库");
    const response = await fetch(serverdomain+'searchitems', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    if (actionToken !== latestActionToken) {
        return;
    }

    if(!data['data']){
        document.getElementById("activejobs").innerHTML = '无数据';
        return;
    }
    //filter out the unvalid activity
    const outactivitydata = filterunvalidactivity(data['data']);
    document.getElementById("activejobs").innerHTML = '';
    //save data for export use
    searchedreports = data['data'];
    document.getElementById("exportbutton").disabled = false;
 
    // Create table element
    var table = document.createElement("table");
    table.className = "inventory-table";

    // Create table header
    var thead = document.createElement("thead");
    thead.className = "inventory-table-header";
    var headerRow = document.createElement("tr");
    var headers = ["仓库" ,"箱号","箱唛","仓点", "入库日期", "件数", "托数", "出库记录"];
    headers.forEach(function(headerText, index) {
        var th = document.createElement("th");
        th.textContent = headerText;
        th.addEventListener("click", function() {
            sortcomlextable(index);
        });
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var previousRow = null;
    var previousRowOriginalColor = "";
    // Create table body
    var tbody = document.createElement("tbody");
    tbody.className = "inventory-table-body";
    tbody.id = "inventory-table-body";
    outactivitydata.forEach(async function(item) {
        //search the according out item
        var outitemsearchcreteria = new FormData();
        outitemsearchcreteria.append("inventoryid", item['inventoryid']);
        outitemsearchcreteria.append("activity", "出库");
        fetch(serverdomain+'searchitems', {
            method: 'POST',
            body: outitemsearchcreteria,
        }).then(response => response.json())
        .then(data => {
            let n=0;
            if(data['data']){
                searchedreports = searchedreports.concat(data['data']);
                //filter out the unvalid activity
                const outdata = filterunvalidactivity(data['data']);
                outdata.forEach(function(outitem) {
                    n++;
                    const outitemtable = createoutitemtableunit(outitem);
                    outitemtable.addEventListener("click", function(event) {
                        event.stopPropagation();
                        if(previousRow){
                            previousRow.style.backgroundColor = previousRowOriginalColor;
                        }
                        previousRowOriginalColor=this.style.backgroundColor;
                        this.style.backgroundColor = 'rgb(73 162 233)';
                        previousRow = this;
                        showactivitydetail(outitem);
                    });
                    item['outitemtable'+n] = outitemtable;
                });
            }
            const row = document.createElement("tr");
            row.className = "inventory-table-complex-row";
            //style each row based on status
            if(item.status!="完成"){
                row.classList.add('tablerownoncompleted');
            }

            var columns = [item.warehouse, item.container,item.marks,item.label, item.date, item.pcs, item.plt];
            columns.forEach(function(columnText,index) {
                var td = document.createElement("td");
                td.textContent = columnText;
                row.appendChild(td);
                if(index===5){
                    if(item.oripcs){
                        if(item.pcs!=item.oripcs){
                            td.style.color = "red";
                            td.classList.add('tableele');
                            const tooltip = document.createElement('span');
                            tooltip.className = 'tooltip';
                            tooltip.innerHTML = '预报件数: ' + item.oripcs;
                            td.appendChild(tooltip);
                        }
                    }
                }
            });
            for (let i = 1; i <= n; i++) {
                row.appendChild(item['outitemtable'+i]);
            }
            row.addEventListener("click", function() {
                if(previousRow){
                    previousRow.style.backgroundColor = previousRowOriginalColor;
                }
                previousRowOriginalColor=row.style.backgroundColor;
                row.style.backgroundColor = 'rgb(73 162 233)';
                previousRow = row;
                showactivitydetail(item);
                
            });

            tbody.appendChild(row);
            sortcomlextable(4,1);
        });
        
    });
    table.appendChild(tbody);

    // Append table to activejobs element
    activejobs.appendChild(table);

    //sortcomlextable(3,1);

    if(callback){
        callback();
    }

    function createoutitemtableunit(item){
        const unittable = document.createElement('table');
        unittable.className = "unittable-table";
        const unitbody = document.createElement('tbody');
        const unitrow = document.createElement("tr");

        if(item.status!="完成"){
            unitrow.classList.add('tablerownoncompleted');
        }
        var columns = [item.date, item.pcs,item.plt];
        columns.forEach(function(columnText) {
            var td = document.createElement("td");
            td.textContent = columnText;
            unitrow.appendChild(td);
        });
        unitbody.appendChild(unitrow);
        unittable.appendChild(unitbody);
        return unittable;
    }

    function sortcomlextable(columnIndex,secondindex) {
        var tbody = document.getElementById('inventory-table-body');

        var rows = Array.from(tbody.querySelectorAll(".inventory-table-complex-row"));
        var sortedRows = rows.sort(function(a, b) {
            var aText = a.children[columnIndex].textContent;
            var bText = b.children[columnIndex].textContent;
            var comparison = -aText.localeCompare(bText, 'zh', { numeric: true });

            if(secondindex){
                if (comparison === 0) {
                    var aText2 = a.children[secondindex].textContent;
                    var bText2 = b.children[secondindex].textContent;
                    comparison = -aText2.localeCompare(bText2, 'zh', { numeric: true });
                }
            }
            return comparison;
        });
        tbody.innerHTML = "";
        sortedRows.forEach(function(row) {
            tbody.appendChild(row);
        });
    }

}
function searchvas(searchcreteria){
    showloading(document.getElementById("activejobs"));
    currentjobpagecontent='vas';
    const actionToken = Symbol();
    latestActionToken = actionToken;

    const xhr  = new XMLHttpRequest();
    xhr.open("POST", serverdomain+"searchvas", true);
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                if (actionToken !== latestActionToken) {
                    return;
                }
                // return xhr.response["data"];
                sysresponse.innerHTML=xhr.response["msg"];
                document.getElementById("activejobs").innerHTML="";
                for (var i = 0; i < xhr.response["data"].length; i++) {
                    createvasjob(xhr.response["data"][i],document.getElementById("activejobs"));
                }
            }else{
                sysresponse.innerHTML=xhr.response["msg"];
                document.getElementById("activejobs").innerHTML="";
                sysresponse.innerHTML="没有找到任务。";
            }
        }
    }
    xhr.responseType="json";
    xhr.send(searchcreteria);

    
}
async function showinovicedata(searchcreteria){
    showloading(document.getElementById("activejobs"));
    const actionToken = Symbol();
    latestActionToken = actionToken;

    if(access==2){
        searchcreteria.append("customer", customername);
    }
    if(access==3){
        searchcreteria.append("warehouse", currentwarehouse);
    }
    const response = await fetch(serverdomain+'searchinvoices', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    if (actionToken !== latestActionToken) {
        return;
    }

    if(!data['data']){
        document.getElementById("activejobs").innerHTML = '无数据';
        return;
    }
    //save data for export use
    searchedreports = data['data'];
    document.getElementById("exportbutton").disabled = false;
 
    var activejobs = document.getElementById("activejobs");
    activejobs.innerHTML="";

    const invoicediv=document.createElement("div");
    invoicediv.style.display = 'flex';
    invoicediv.style.flexDirection = 'column';
    invoicediv.style.alignItems = 'center';
    invoicediv.style.justifyContent = 'center';
    invoicediv.style.width = '100%';

    activejobs.appendChild(invoicediv);
    
    // Create table element
    var table = document.createElement("table");
    table.className = "inventory-table";
    table.style.maxWidth = '1000px';

    // Create table header
    var thead = document.createElement("thead");
    thead.className = "inventory-table-header";
    var headerRow = document.createElement("tr");
    var headers = ["客户", "箱号/单号", "仓库", "日期", "总仓点数", "总件数","EUR托盘数","BLOCK托盘数","应收","应付"];
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

    var previousRow = null;
    var previousRowOriginalColor = "";
    // Create table body
    var tbody = document.createElement("tbody");
    tbody.className = "inventory-table-body";
    tbody.id = "inventory-table-body";
    var totalar=0;
    var totalap=0;
    data['data'].forEach(function(item) {
        var row = document.createElement("tr");
        row.className = "inventory-table-row";
        
        var columns = [item.customer, item.joblabel,item.warehouse, item.date, item.labelcount, item.pcs,item.eurplt, item.blockplt, item.ar, item.ap];
        columns.forEach(function(columnText,index) {
            var td = document.createElement("td");
            td.textContent = columnText;
            row.appendChild(td);
            // if(index===3){
            //     if(item.oripcs){
            //         if(item.pcs!=item.oripcs){
            //             td.style.color = "red";
            //             td.classList.add('tableele');
            //             const tooltip = document.createElement('span');
            //             tooltip.className = 'tooltip';
            //             tooltip.innerHTML = '预报件数: ' + item.oripcs;
            //             td.appendChild(tooltip);
            //         }
            //     }
            // }
            
            row.addEventListener("click", function() {
                if(previousRow){
                    previousRow.style.backgroundColor = previousRowOriginalColor;
                }
                previousRowOriginalColor=row.style.backgroundColor;
                row.style.backgroundColor = 'rgb(73 162 233)';
                previousRow = row;
                
            });
        });
        totalap+=parseFloat(item.ap);
        totalar+=parseFloat(item.ar);
        tbody.appendChild(row);

    });
    table.appendChild(tbody);

    // Append table to activejobs element
    invoicediv.appendChild(table);

    // create summary
    const summary = document.createElement('div');
    summary.style.marginTop = '10px';
    summary.style.fontSize = '1.2em';
    summary.style.dwidth = '100%';
    summary.style.textAlign = 'center';
    summary.display = 'block';
    invoicediv.appendChild(summary);
    summary.innerHTML = `总应收: ${totalar.toFixed(2)}; 总应付: ${totalap.toFixed(2)}`;

}

// functions
function createinventorytable(data){

    var table = document.createElement("table");
    table.className = "inventory-table";

    // Create table header
    var thead = document.createElement("thead");
    thead.className = "inventory-table-header";
    var headerRow = document.createElement("tr");
    var headers = ["客户", "需求","箱号/单号", "箱唛","仓点", "件数", "托数","创建日期","仓库"];
    if(access==3){
        headers = ["客户", "需求", "箱号/单号", "箱唛","仓点", "件数", "托数","创建日期"];
    }
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

    var previousRow = null;
    var previousRowOriginalColor = "";

    // Create table body
    var tbody = document.createElement("tbody");
    tbody.id = "inventory-table-body";
    tbody.className = "inventory-table-body";
    data.forEach(function(item) {
        var row = document.createElement("tr");
        row.className = "inventory-table-row";
        if(item.status!="完成"){
            row.style.color = "grey";
        }
        var columns = [item.customer,item.requirement,item.container,item.marks,item.label, item.pcs, item.plt, item.date,item.warehouse];
        if(access==3){
            columns = [item.customer,item.requirement,item.container,item.marks,item.label, item.pcs, item.plt, item.date];
        }
        columns.forEach(function(columnText) {
            var td = document.createElement("td");
            td.textContent = columnText;
            row.appendChild(td);
        });
        tbody.appendChild(row);

        row.addEventListener("click", function() {
            if(previousRow){
                previousRow.style.backgroundColor = previousRowOriginalColor;
            }
            previousRowOriginalColor=this.style.backgroundColor;
            this.style.backgroundColor = 'rgb(73 162 233)';
            previousRow = this;
            
            if(document.getElementById("detailform")!=null && document.getElementById("statuslog").innerHTML!="完成"){
                detaillinenumber++;
                item['id'] = '';
                createdetailline(detaillinenumber,item,document.getElementById("jobactivity").value,true);
            }else{
                showinventorydetail(item,this);
                // alert("您可以打开一个出库任务后，点击一个库存项目将其添加到任务中。");
            }
            
        });
    });
    table.appendChild(tbody);
    return table;
}
function showcontrolpanel(){
    //check if the controlpanel is already shown then return
    if(document.getElementById("controlpanel").classList.contains("controlpanel_show")){
        return;
    }
    document.getElementById("controlpanel").classList.add("controlpanel_show");
    const closebutton=document.createElement("button");
    closebutton.innerHTML=">>";
    closebutton.className="button";
    closebutton.style.position="absolute";
    closebutton.style.right="10px";
    closebutton.style.top="10px";
    closebutton.style.padding = '5px 5px 5px 8px';
    closebutton.addEventListener("click", function() {
        document.getElementById("itemdetail").innerHTML="";
        document.getElementById("controlpanel").removeChild(closebutton);
        document.getElementById("controlpanel").classList.remove("controlpanel_show");
    });
    document.getElementById("controlpanel").appendChild(closebutton);
}
async function loaddetail(clickeditem,activity,thisjobdiv,newadded){
    if(!readytoloadjobdetail){
        return;
    }
    showcontrolpanel();

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

    
    
    //control   bar
    var controlbar=document.createElement("div");
    controlbar.className="controlbar";
    detailform.appendChild(controlbar);
    var submitbutton=document.createElement("button");
    submitbutton.innerHTML="保存";
    submitbutton.className="button";
    
    
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "删除任务";
    cancelButton.className = "button";
    cancelButton.id = "archivebutton";
    
    
    var printbutton=document.createElement("button");
    printbutton.innerHTML="&#x1F5B6 操作单";
    printbutton.className="button";
    printbutton.style.marginLeft = '10px';

    
    var printcmrbutton=document.createElement("button");
    printcmrbutton.innerHTML="&#x1F5B6 CMR";
    printcmrbutton.className="button";

    var printlabelbutton=document.createElement("button");
    printlabelbutton.innerHTML="&#x1F5B6 标签";
    printlabelbutton.className="button";

    const invoicebutton = document.createElement('button');
    invoicebutton.innerHTML = '账单';
    invoicebutton.style.marginLeft = '10px';
    invoicebutton.className = 'button';
    
    // var closebutton=document.createElement("button");
    // closebutton.innerHTML="✕";
    // closebutton.className="button";
    // closebutton.style.marginLeft = '30px';
    // closebutton.style.padding = '5px 5px 5px 8px';
    // closebutton.addEventListener("click", function() {
    //     itemdetail.innerHTML="";
    //     document.getElementById("controlpanel").classList.remove("controlpanel_show");
    // });

    controlbar.appendChild(submitbutton);
    controlbar.appendChild(cancelButton);
    controlbar.appendChild(printbutton);
    controlbar.appendChild(printcmrbutton);
    controlbar.appendChild(printlabelbutton);
    // if(access==1 || access==3){
    //     controlbar.appendChild(invoicebutton);
    // }
    // controlbar.appendChild(closebutton);

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
    var input0label=document.createElement("label");
    input0label.innerHTML="客户";
    input0label.htmlFor="customerinput";
    input0label.className="label";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(inputbottomline);
    if(access==2){
        input0.value=customername;
        input0.readOnly = true;
    }else{
        input0.value=((clickeditem!='')?clickeditem['customer']:"");
        linecontrol0.appendChild(input0label);
    }
    
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
        // input0.required=true;
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
        input0.id="orderidinput";
        // input0.required=true;
        input0.value=((clickeditem!='')?clickeditem['orderid']:"");
        var input0label=document.createElement("label");
        input0label.innerHTML="订单号";
        input0label.htmlFor="orderidinput";
        input0label.className="label";
        detailform.appendChild(linecontrol0);
        linecontrol0.appendChild(input0);
        linecontrol0.appendChild(input0label);
        linecontrol0.appendChild(inputbottomline);

    }
    
    if((newadded && access==2) || (access==2 && clickeditem!='' && clickeditem['status']=="未预约")){
        const statusinput=document.createElement("input");
        statusinput.type="hidden";
        statusinput.name="status";
        statusinput.value="未预约";
        detailform.appendChild(statusinput);
    }else{
        if(clickeditem['status'] && clickeditem['status']=="未预约"){
            clickeditem['status'] = "预报";
        }
        const taskstatusbar = createstatusbar(((clickeditem!='')?clickeditem['status']:"预报"),'预报','排队中','作业中','完成');
        taskstatusbar.style.position="absolute";
        taskstatusbar.style.right="100px";
        taskstatusbar.style.top="35px";
        detailform.appendChild(taskstatusbar);
    }

    var linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    const dateinput=document.createElement("input");
    dateinput.type="datetime-local";
    dateinput.name="date";
    dateinput.id="inputdate";
    dateinput.className="lineinput";
    dateinput.required=true;
    dateinput.value=((clickeditem!='')?clickeditem['date']:new Date().toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16));
    
    const dateinputlabel=document.createElement("label");
    dateinputlabel.innerHTML="日期";
    dateinputlabel.htmlFor="inputdate";
    dateinputlabel.className="lineinputlabel";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(dateinputlabel);
    linecontrol0.appendChild(dateinput);

    // dock appointment button
    if (access == 1 || access == 3) {
        const dockappointmentbutton = document.createElement('button');
        dockappointmentbutton.innerHTML = '预约';
        dockappointmentbutton.className = 'button';
        dockappointmentbutton.style.marginLeft = '10px';
        linecontrol0.appendChild(dockappointmentbutton);

        const dockinfo = document.createElement('div');
        dockinfo.id = 'showdockinfo';
        dockinfo.style.display = 'inline-block';
        linecontrol0.appendChild(dockinfo);

        if(clickeditem['dock']){
            dockinfo.innerHTML = '已预约垛口: ' + clickeditem['dock'];
        }   
        const docknumber=createhiddeninput('dock',clickeditem['dock']?clickeditem['dock']:"");
        detailform.appendChild(docknumber);

        dockappointmentbutton.addEventListener('click', function() {
            showdockappointments(clickeditem);
        });
            
    }
    



    //add warehouse selection and bulk status line
    const warehouseandbulkstatusline = document.createElement('div');
    warehouseandbulkstatusline.className = 'flexlinecontrol';
    warehouseandbulkstatusline.style.marginBottom = '5px';
    detailform.appendChild(warehouseandbulkstatusline);

    const selectedwarehouse=clickeditem['warehouse']?clickeditem['warehouse']:"";
    const warehouseselec=createwarehouseselectiondiv(selectedwarehouse);
    warehouseandbulkstatusline.appendChild(warehouseselec);

    const bulkstatus=clickeditem['bulkstatus']?clickeditem['bulkstatus']:"";
    const bulkstatusdiv = createbulkstatusselectiondiv(bulkstatus);
    bulkstatusdiv.style.marginLeft = '20px';
    warehouseandbulkstatusline.appendChild(bulkstatusdiv);


    if(access==3){
        warehouseselec.querySelector('select').value = currentwarehouse;
        warehouseselec.querySelector('select').disabled = true;
        const hidewarehouse = document.createElement('input');
        hidewarehouse.type = 'hidden';
        hidewarehouse.name = 'warehouse';
        hidewarehouse.value = currentwarehouse;
        linecontrol0.appendChild(hidewarehouse);
    }

    const line7control = document.createElement('div');
    line7control.className = 'flexlinecontrol';
    line7control.style.marginBottom = '5px';
    detailform.appendChild(line7control);

    if (activity == '出库') {
        
        var input0=document.createElement("textarea");
        input0.name="deladdress";
        input0.className="lineinput";
        input0.style.marginRight = '20px';
        input0.value=((clickeditem!='')?clickeditem['deladdress']:"");
        var input0label=document.createElement("label");
        input0label.innerHTML="送货地址";
        input0label.className="lineinputlabel";
        line7control.appendChild(input0label);
        line7control.appendChild(input0);
    }
    
    var input0=document.createElement("textarea");
    input0.name="ordernote";
    input0.className="lineinput";
    input0.value=((clickeditem!='')?clickeditem['ordernote']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="备注";
    input0label.className="lineinputlabel";
    input0label.style.margin="0px 0px 0px 0px";
    line7control.appendChild(input0label);
    line7control.appendChild(input0);

    if(activity == '入库') {
        const line8control = document.createElement('div');
        line8control.className = 'flexlinecontrol';
        line8control.style.marginBottom = '5px';
        detailform.appendChild(line8control);

        const quotetemplate=clickeditem['quotetemplate']?clickeditem['quotetemplate']:"";
        const inputcustomer=document.getElementById("customerinput").value;
        const quotetemplateselect=createquotetemplateselectiondiv(Object.keys(getcustomerinvoicetempletelist(inputcustomer)),quotetemplate);
        
        document.getElementById("customerinput").addEventListener("input", function() {
            const inputcustomer = this.value;
            const quotetemplate = clickeditem['quotetemplate'] ? clickeditem['quotetemplate'] : "";
            const quotetemplateselect = createquotetemplateselectiondiv(Object.keys(getcustomerinvoicetempletelist(inputcustomer)), quotetemplate);
        
            // Clear the previous options
            while (line8control.firstChild) {
                line8control.removeChild(line8control.firstChild);
            }
        
            // Append the new options
            line8control.appendChild(quotetemplateselect);
        });

        line8control.appendChild(quotetemplateselect);


    }


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

    var jobid = document.createElement("input");
    jobid.type = "hidden";
    jobid.name = "jobid";
    jobid.value = clickeditem['jobid'] ? clickeditem['jobid'] : new Date().getTime();
    detailform.appendChild(jobid);
    
    

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
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function(e) {
                    var data = new Uint8Array(reader.result);
                    var workbook = XLSX.read(data, {type: 'array'});
                    var sheet = workbook.Sheets[workbook.SheetNames[0]];
                    
                    //copystart here use header name as indicator
                    var orijson = XLSX.utils.sheet_to_json(sheet,{header: 1});
                    var headers = orijson[0].map(header => header.trim());
                    var json = orijson.slice(1).map(row => {
                        var newRow = {};
                        headers.forEach((header, index) => {
                            newRow[header] = row[index];
                        });
                        return newRow;
                    });
                    // creat job info
                    var xlsclickeditem = {  "joblabel":joblable,
                                            "customer":document.getElementsByName("customer")[0].value,
                                            "date":document.getElementById("inputdate").value,
                                            "activity":"入库",
                                            "status":"预报",
                                            "ordernote":document.getElementsByName("ordernote")[0].value,
                                            
                                        };
                    loaddetail(xlsclickeditem,"入库",undefined,true);
                    //read detail infor
                    var concludeitem=[];
                    var j=0;
                    for (var i = 0; i < json.length; i++) {
                        if(!json[i]['仓点']){
                            break; 
                        }
                        var holdmark = json[i]['拦截暂扣']=="是"?"拦截暂扣":"";
                        var channelmark = json[i]['Vendor Name（供应商名称）']?json[i]['Vendor Name（供应商名称）']:"";
                        var marks = json[i]['单号/箱唛']?json[i]['单号/箱唛']:"";
                        // var itemref = json[i]['仓点']+holdmark+channelmark;
                        var itemref = json[i]['拦截暂扣']=="是"?json[i]['仓点']+marks+holdmark:json[i]['仓点']+channelmark;
                        //var itemref = json[i]['拦截暂扣']=="是"?json[i]['仓点']+json[i]['marks']:json[i]['仓点']+channelmark;
                        var index = concludeitem.findIndex(item => item['itemref'] == itemref);
                        if (index == -1) {
                            concludeitem.push({
                                "itemref": itemref,
                                "label": json[i]['仓点'],
                                "marks": json[i]['单号/箱唛'] ? json[i]['单号/箱唛'] : "",
                                "deladdress": json[i]['Delivery Address （派送地址）'] ? json[i]['Delivery Address （派送地址）'] : "",
                                "requirement":json[i]['拦截暂扣']=="是"?"拦截暂扣":channelmark=="不卸货"?"不卸货":"",
                                "fba": json[i]['BOL List （货物FBA号码）'] ? json[i]['BOL List （货物FBA号码）'] + ";" : "",
                                "pcs": json[i]['Carton Count（箱数）'] ? Number(json[i]['Carton Count（箱数）']) : 0,
                                "cbm": (json[i]['CMB（立方数）'] && !isNaN(Number(json[i]['CMB（立方数）'])))? Number(json[i]['CMB（立方数）']) : 0,
                                "kgs": (json[i]['Weight KG（重量）'] && !isNaN(Number(json[i]['Weight KG（重量）']))) ? Number(json[i]['Weight KG（重量）']) : 0,
                                "note": json[i]['备注（打托要求/拼车/换标/其他）'] ? json[i]['备注（打托要求/拼车/换标/其他）'] + ";" : "",
                                "channel": json[i]['拦截暂扣']=="是"?"拦截暂扣":json[i]['Vendor Name（供应商名称）'],
                                "plt": 0,
                                "locationa": "",
                                "locationb": "",
                                "inventoryid": constructinventoryid(j),
                                "id": "",
                                "priority":json[i]['拦截暂扣']=="是"?-6:0,
                                "plttype":json[i]['散货/托盘类型']?json[i]['散货/托盘类型']:"散货",
                                "oogplt":json[i]['托盘操作要求']?json[i]['托盘操作要求']:"",
                                "createtime": Date.now(),
                            });
                            j++;
                        } else {
                            concludeitem[index].fba += json[i]['BOL List （货物FBA号码）'] ? json[i]['BOL List （货物FBA号码）'] + ";" : "";
                            concludeitem[index].pcs += json[i]['Carton Count（箱数）'] ? Number(json[i]['Carton Count（箱数）']) : 0;
                            concludeitem[index].cbm += (json[i]['CMB（立方数）'] && !isNaN(Number(json[i]['CMB（立方数）'])))? Number(json[i]['CMB（立方数）']) : 0;
                            concludeitem[index].kgs += (json[i]['Weight KG（重量）'] && !isNaN(Number(json[i]['Weight KG（重量）']))) ? Number(json[i]['Weight KG（重量）']) : 0;
                            concludeitem[index].note += json[i]['备注（打托要求/拼车/换标/其他）'] ? json[i]['备注（打托要求/拼车/换标/其他）'] + ";" : "";
                        }
                    }
                    for (var i = 0; i < concludeitem.length; i++) {
                        detaillinenumber++;
                        concludeitem[i]['cbm'] = Math.round(concludeitem[i]['cbm'] * 100/concludeitem[i]['pcs']) / 100;
                        concludeitem[i]['kgs'] = Math.round(concludeitem[i]['kgs'] * 100/concludeitem[i]['pcs']) / 100;
                        createdetailline(i,concludeitem[i],"入库",true);
                    }
                    
                };
            }
        };

    }

    if(newadded && activity=='出库'){
        const autoarrangebutton = document.createElement("button");
        autoarrangebutton.innerHTML = "自动排车";
        autoarrangebutton.className = "button";
        autoarrangebutton.style.marginLeft = '10px';
        autoarrangebutton.addEventListener("click", function() {
            autoarrangeout();
        });
        itemdetail.appendChild(autoarrangebutton);
    }
    
    itemdetail.appendChild(createTooltip( "新建出库任务时，请务必在左侧库存列表中点击一个库存项目，将其添加到任务中。对于库存表中没有的货物，请在此处手动添加。创建任务之后的显示顺序为输入顺序。"));
    

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
        const actionToken = Symbol();
        latestActionToken = actionToken;
        var searchcreteria = new FormData();
        searchcreteria.append("jobid",clickeditem['jobid']);
        const response = await fetch(serverdomain+'searchitems', {
            method: 'POST',
            body: searchcreteria,
          });

        if (latestActionToken !== actionToken) {
            return;
        }
        const data = await response.json();
        
        sysresponse.innerHTML=data["msg"];
        var items = data["data"];
        if(items!=null){
            for(var i=items.length-1;i>=0;i--){

                createdetailline(i+1,items[i],activity,false);
            }
            // for (var i = 0; i <items.length ; i++) {
            //     createdetailline(i+1,items[i],activity,false);
            // }
            detaillinenumber=detaillinenumber+items.length;
        }

        //make line form draggable
        // const draggables = document.querySelectorAll('.detailineform');
        // const container = document.querySelector('.detaillinelist');

        // draggables.forEach(draggable => {
        // draggable.addEventListener('dragstart', () => {
        //     draggable.classList.add('dragging');
        // });

        // draggable.addEventListener('dragend', () => {
        //     draggable.classList.remove('dragging');
        // });
        // });

        // container.addEventListener('dragover', e => {
        // e.preventDefault();
        // const afterElement = getDragAfterElement(container, e.clientY);
        // const dragging = document.querySelector('.dragging');
        // if (afterElement == null) {
        //     container.appendChild(dragging);
        // } else {
        //     container.insertBefore(dragging, afterElement);
        // }
        // });

        // function getDragAfterElement(container, y) {
        // const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

        // return draggableElements.reduce((closest, child) => {
        //     const box = child.getBoundingClientRect();
        //     const offset = y - box.top - box.height / 2;
        //     if (offset < 0 && offset > closest.offset) {
        //     return { offset: offset, element: child };
        //     } else {
        //     return closest;
        //     }
        // }, { offset: Number.NEGATIVE_INFINITY }).element;
        // }

        //stop here
    }
    

    
    //submit button    
    

    if ((clickeditem && clickeditem['status'] === '完成') || access<1) {
        var inputs = itemdetail.getElementsByTagName('input');
        var textareas = itemdetail.getElementsByTagName('textarea');
        var buttons = itemdetail.getElementsByTagName('button');
        var selections = itemdetail.getElementsByTagName('select');

        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        for (var i = 0; i < textareas.length; i++) {
            textareas[i].disabled = true;
        }

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        for (var i = 0; i < selections.length; i++) {
            selections[i].disabled = true;
        }
    }
    if(access==2){
        printbutton.disabled = true;
        printcmrbutton.disabled = true;
        printlabelbutton.disabled = true;
        printcmrbutton.disabled = true;
        // if (clickeditem['status'] == '未预约') {
        //     // submitbutton.disabled = true;
        //     // cancelButton.disabled = true;
        //     submitbutton.removeAttribute("disabled");
        //     cancelButton.removeAttribute("disabled");
        // }
        
        if (clickeditem['status'] && clickeditem['status'] != '未预约' && !newadded) {
            submitbutton.disabled = true;
            const tooltip = createTooltip("任务已确认预约，如需修改请联系管理员");
            submitbutton.insertAdjacentElement('afterend', tooltip);
            cancelButton.disabled = true;
        }
    }
    if(access==1 || access==3){
        cancelButton.removeAttribute("disabled");
        printbutton.removeAttribute("disabled");
        printcmrbutton.removeAttribute("disabled");
        printlabelbutton.removeAttribute("disabled");
        // invoicebutton.removeAttribute("disabled");
        var fileInputs = itemdetail.getElementsByClassName("file");
        for (var i = 0; i < fileInputs.length; i++) {
            fileInputs[i].removeAttribute("disabled");
        }
        var addvasbutton=itemdetail.getElementsByClassName("addvasbutton");
        if(addvasbutton){
            for (var i = 0; i < addvasbutton.length; i++) {
                addvasbutton[i].removeAttribute("disabled");
            }
        }
    }
    
    // closebutton.removeAttribute("disabled");
    addnew.addEventListener("click", function(){
        detaillinenumber++;
        createdetailline(detaillinenumber,"",activity,true);
        //detailform.appendChild(addnew);
        
    });
    submitbutton.addEventListener("click", function() {
        // var inputform=document.getElementById("detailform");
        if(document.getElementById("inputdate").value==""){
            alert("请输入日期");
            return;
        }
        if(document.getElementById("itemdetail").querySelector("[name='warehouse']").value==""){
            alert("请选择仓库");
            return;
        }
        if(document.getElementById("statusvalue-4")){
            if(document.getElementById("statusvalue-4").checked==true){
                if(document.getElementById("cannotcomplete")){
                    alert("有未完成附加服务，请先完成附加服务！");
                    return;
                }
            }
        }
        if(activity=="入库"){
            if(access==2 && Object.keys(getcustomerinvoicetempletelist(document.getElementById('customerinput').value)).length>1 && document.getElementById('quotetemplate').value==''){
                alert("请选择发票模板");
                return;
            }
        }
        


        //check plt information intactly
        if(newadded){
            if(checkreadytosubmit()==false){
                return;
            }
        }
        const activeJobs = document.getElementById("activejobs");
        readytoloadjobdetail=false;
        addnewjob(clickeditem,detaillinenumber).then(async function(){
            readytoloadjobdetail=true;
            sysresponse.innerHTML="任务保存成功";
            if(access==2){
                itemdetail.innerHTML="";
                return;
            }
            var searchnewadded = new FormData();
            searchnewadded.append("jobid",jobid.value);

            const jobwithitems=await searchjobwithitems(searchnewadded);

            const newaddedjob = jobwithitems["jobs"][0];
            // const newaddeditems = jobwithitems["items"];
            const newaddeditems = newaddedjob["items"];
            if(thisjobdiv){
                createjob(newaddedjob,activeJobs,thisjobdiv);   
            }else{
                
                createjob(newaddedjob,activeJobs);
            }
            const now=new Date().toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16);
            //send email to customer
            if(newaddedjob['status']=="完成" && newaddedjob['activity']=="入库"){
                const sendto=getemailaddress(newaddedjob['customer']);
                if(sendto){
                    const mailsubject = "系统通知: "+newaddedjob['warehouse']+'仓库 '+newaddedjob['joblabel']+'入库完成';
                    const mailcontent = "主题任务入库完成，系统完成时间"+now+"。入库数据如下 \n"+newaddedjob['overview'].replace(/<br \/>/g, '\n')+ "\n 请登录系统查看详情";
                    sendemail(sendto,mailsubject,mailcontent);
                }else{
                    //alert("无法发送邮件，请检查客户邮箱地址");
                }
            }
            if(newaddedjob['status']=="完成" && newaddedjob['activity']=="出库"){
                var outemails=[];
                const showedorderid=newaddedjob['orderid']?'订单号（ISA）：'+newaddedjob['orderid']:"";
                newaddeditems.forEach(function(item){
                    var index = outemails.findIndex(x => x['customer'] == item['customer']);
                    const pltinfo=item['plt']==0?"":item['plt']+"托";
                    if(index==-1){
                        outemails.push({"customer":item['customer'],
                                        "email":getemailaddress(item['customer']),
                                        "subject":"系统通知: "+newaddedjob['warehouse']+'仓库 '+item['label']+" "+showedorderid+' 出库完成',
                                        "bodycontent":item['container']+" "+item['label']+" "+item['pcs']+"件 "+pltinfo+"  "+item['note']+"\n"});
                    }else{
                        outemails[index]['bodycontent']+=item['container']+" "+item['label']+" "+item['pcs']+"件 "+pltinfo+"  "+item['note']+"\n";
                    }
                });
                outemails.forEach(function(email){
                    if(email['email']){
                        const emailbody = "主题任务入库完成，"+showedorderid+"。系统完成时间"+now+"。出库数据如下 \n"+email['bodycontent']+ "\n 请登录系统查看详情";
                        sendemail(email['email'],email['subject'],emailbody);
                    }
                }
                );
            }
            

            itemdetail.innerHTML="";
        })
        .catch(function(){
            sysresponse.innerHTML="任务保存失败";
            itemdetail.innerHTML="";
        });
        this.disabled = true;
        sysresponse.innerHTML="上传中...";
    });
    printbutton.addEventListener("click", function() {
        // Displaying an alert message
        printSpecificContent(clickeditem);
    });
    printcmrbutton.addEventListener("click", function() {
        // Displaying an alert message
        printcmr(clickeditem,items);
    });
    printlabelbutton.addEventListener("click", function() {
        // Displaying an alert message
        printinventorylabel(items);
    });
    cancelButton.addEventListener("click", function() {
        if(clickeditem['status']=="完成"){
            alert("任务已完成，无法删除");
            return;
        }
        // Displaying an alert message
        if (confirm("确认删除任务?")) {
            // Code to execute if user confirms cancellation
            var archiveid = new FormData();
            archiveid.append("jobid",clickeditem['jobid']);
            archiveid.append("activity",activity);
            fetch(serverdomain+'archivejob', {
                method: 'POST',
                body: archiveid,
            }).then(response => response.json()).then(data => {
                sysresponse.innerHTML=data["msg"];
                if(data["error_code"]==0){
                    if(thisjobdiv){
                        thisjobdiv.remove();
                    }
                    itemdetail.innerHTML="";
                }
            });

        } else {
            // Code to execute if user cancels cancellation
            // ...
        }
    });
    // invoicebutton.addEventListener("click", function() {
    //     showinvoicewindow(clickeditem,items);
    // });
    
    function checkreadytosubmit(){
        var readytosubmit=true;
        var detaillines = document.getElementsByClassName("detaillineform");
        for (var i = 0; i < detaillines.length; i++) {
            var detailline = detaillines[i];
            if (detailline.querySelector('select[name="plttype"]').value == "") {
                alert("请填写完出货类型，散货或整托");
                readytosubmit = false;
                break;
            }
            if (detailline.querySelector('select[name="plttype"]').value != "") {
                if (detailline.querySelector('select[name="plttype"]').value == "散货") {
                    continue;
                }
                // if (detailline.querySelector('input[name="plt"]').value == "") {
                //     detailline.querySelector('input[name="plt"]').style.backgroundColor = "pink";
                //     detailline.querySelector('input[name="plt"]').focus();
                //     alert("请填写完预计打托数");
                //     readytosubmit = false;
                //     break;
                // }
                if (detailline.querySelector('select[name="oogplt"]').value == "") {
                    detailline.querySelector('select[name="oogplt"]').style.backgroundColor = "pink";
                    detailline.querySelector('select[name="oogplt"]').focus();
                    alert("请填写完是否可超尺寸");
                    readytosubmit = false;
                    break;
                }
            }
        }
        return readytosubmit;
    }
}

function createdetailline(nid, item, activity, cancelable) {
    
    var detailLines = document.getElementsByClassName("detaillineform");
    var id = detailLines.length + 1;
    while (document.getElementById("detaillineform" + id)) {
        id++;
    }
    // var detailform=document.getElementById("itemdetail");
    var detailform = document.getElementById("detaillinelist");

    const detaillineform=document.createElement("form");
    detaillineform.id="detaillineform"+id;
    detaillineform.className="detaillineform";
    detaillineform.style.opacity="0";
    detaillineform.style.height="0";

    detailform.insertBefore(detaillineform, detailform.firstChild);
    // detailform.appendChild(detaillineform);

    var createorder=document.createElement("input");
    createorder.name="createorder";
    createorder.className="createorder";
    createorder.style.border="none";
    createorder.style.width="20px";
    createorder.readOnly=true;
    createorder.value=detailLines.length;
    detaillineform.appendChild(createorder);
    
    
    
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

    input1.onblur=function(){
        // var location=getlocation(input1.value);
        // if(location!=null){
            
        //     input6.value=location[0];
        //     input7.value=location[1];
        // }
    };
    
    const pcsinput=document.createElement("input");
    pcsinput.type="text";
    pcsinput.name="pcs";
    pcsinput.className="lineinput";
    pcsinput.style.width="35px";
    pcsinput.value=item!=''?item['pcs']:'';
    const pcsinputlabel=document.createElement("label");
    pcsinputlabel.innerHTML="件数";
    pcsinputlabel.className="lineinputlabel";
    pcsinput.onblur=function(){
        sumpcsplt();
    };
    detaillineform.appendChild(pcsinputlabel);
    detaillineform.appendChild(pcsinput);


    const pltinput=document.createElement("input");
    pltinput.type="text";
    pltinput.name="plt";
    pltinput.className="lineinput";
    pltinput.style.width="35px";
    pltinput.value=item!=''?item['plt']:'';
    pltinput.onblur=function(){
        sumpcsplt();
    };
    const pltinputlabel=document.createElement("label");
    pltinputlabel.innerHTML="托数";
    pltinputlabel.className="lineinputlabel";
    detaillineform.appendChild(pltinputlabel);
    detaillineform.appendChild(pltinput);

    
    detaillineform.appendChild(document.createElement("br"));

    const pltreqlinecontrol = document.createElement("div");
    pltreqlinecontrol.style.display = "inline-flex";
    pltreqlinecontrol.className = "linecontrol";
    detaillineform.appendChild(pltreqlinecontrol);
    const pltrequirementtitle = document.createElement("div");
    pltrequirementtitle.innerHTML = "打托要求：";
    pltreqlinecontrol.appendChild(pltrequirementtitle);

    const plttypecon=item['plttype']?item['plttype']:"";
    const plttypeinput=createplttypeselectiondiv(plttypecon);
    plttypeinput.style.marginBottom = '5px';
    plttypeinput.style.display = 'inline-flex';
    pltreqlinecontrol.appendChild(plttypeinput);

    const pltmark = document.createElement("input");
    pltmark.type = "text";
    pltmark.id = "pltmark" + id;
    pltmark.name = "pltmark";
    pltmark.style.border = "none";
    pltmark.readOnly = true;
    if(item['pltmark']){
        pltmark.value=item['pltmark'];
    }
    pltreqlinecontrol.appendChild(pltmark);
    // const oogplt = document.createElement("select");
    // oogplt.name = "oogplt";
    // oogplt.style.marginLeft = "10px";
    // oogplt.placeholder = "是否可超尺寸";
    // oogplt.className = "lineinput";
    // oogplt.style.width = "100px";
    // const oogpltoptions = ["", "不可超托盘尺寸", "可超托盘尺寸"];
    // for (var i = 0; i < oogpltoptions.length; i++) {
    //     var option = document.createElement("option");
    //     option.value = oogpltoptions[i];
    //     option.text = oogpltoptions[i];
    //     if (item && item['oogplt'] == oogpltoptions[i]) {
    //         option.selected = true; // Set the default value based on item['oogplt']
    //     } else if (!item && oogpltoptions[i] == "散货") {
    //         option.selected = true; // Set the default value to "普通" if item is not defined
    //     }
    //     oogplt.appendChild(option);
    // }
    // pltreqlinecontrol.appendChild(oogplt);

    plttypeinput.querySelector('select').addEventListener("change", function() {
        if (this.value != "") {
            if(this.value=="散货"){
                pltinput.value = 0;
                oogplt.value = "";
                return;
            }
            if(oogplt.value==""){
                oogplt.value="不可超托盘尺寸";
            }
            if(!pltinput.value){
                pltinput.focus();
            }
        }
    });

    var selectchannel=document.createElement("input");
    selectchannel.type="text";
    selectchannel.name="channel";
    selectchannel.setAttribute('list', 'channels');
    selectchannel.className="lineinput";
    selectchannel.style.width="90px";
    selectchannel.value=item['channel']?item['channel']:'';

    
    
    
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

    var input0label=document.createElement("label");
    input0label.innerHTML="渠道";
    input0label.style.marginLeft="10px";
    input0label.htmlFor="selectchannel";
    detaillineform.appendChild(input0label);
    detaillineform.appendChild(selectchannel);

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
    input3label.innerHTML="仓库备注";
    input3label.className="lineinputlabel";
    detaillineform.appendChild(input3label);
    detaillineform.appendChild(input3);

    var linecontrol=document.createElement("div");
    linecontrol.className="linecontrol";
    linecontrol.style.margin="0px";
    var input12=document.createElement("input");
    input12.name="kgs";
    input12.type="text";
    input12.id="kgs"+id;
    input12.className="lineinput";
    input12.style.width="80px";
    input12.value=item['kgs']?item['kgs']:'';
    var input12label=document.createElement("label");
    input12label.innerHTML="重量(KG)/件:";
    input12label.htmlFor=input12.id;
    input12label.className="lineinputlabel";
    input12label.htmlFor=input12;
    linecontrol.appendChild(input12label);
    linecontrol.appendChild(input12);

    var input13=document.createElement("input");
    input13.name="cbm";
    input13.type="text";
    input13.id="cbm"+id;
    input13.className="lineinput";
    input13.style.width="80px";
    input13.value=item['cbm']?item['cbm']:'';
    var input13label=document.createElement("label");
    input13label.innerHTML="体积(CBM)/件:";
    input13label.htmlFor=input13.id;
    input13label.className="lineinputlabel";
    input13label.htmlFor=input13;
    linecontrol.appendChild(input13label);
    linecontrol.appendChild(input13);

    if(activity=="入库"){
        var priorityinput=document.createElement("select");
        priorityinput.name="priority";
        priorityinput.className="lineinput";
        priorityinput.style.width="45px";
        var priorityinputlabel=document.createElement("label");
        priorityinputlabel.innerHTML="优先级";
        priorityinputlabel.className="lineinputlabel";
        linecontrol.appendChild(priorityinputlabel);
        linecontrol.appendChild(priorityinput);
        const priorityoptions = [5, 4, 3, 2, 1, 0,-1,-2,-3,-4,-5,-6];
        for (var i = 0; i < priorityoptions.length; i++) {
            var option = document.createElement("option");
            option.value = priorityoptions[i];
            option.text = priorityoptions[i]==-6?"拦截":priorityoptions[i];
            if (item && item['priority'] == priorityoptions[i]) {
                option.selected = true; // Set the default value based on item['priority']
            } else if (!item && priorityoptions[i] == 0) {
                option.selected = true; // Set the default value to 5 if item is not defined
            }
            priorityinput.appendChild(option);
        }
    }

    detaillineform.appendChild(linecontrol);

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

    var locationinput = document.createElement("input");
    locationinput.type = "hidden";
    locationinput.name = "inventoryloc";
    locationinput.value = item['inventoryloc'] ? item['inventoryloc'] : '';
    detaillineform.appendChild(locationinput);
    
    const linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    linecontrol0.style.margin="0px";
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

    //Disable this function temporarily!!!!!!!!
    const selectlocationbutton = document.createElement("button");
    selectlocationbutton.type = "button";
    selectlocationbutton.className = "button";
    selectlocationbutton.innerHTML = "选择库位";
    selectlocationbutton.style.fontSize = "14px";
    selectlocationbutton.style.padding = "5px 10px";
    selectlocationbutton.style.margin = "0px 10px";

    linecontrol0.appendChild(selectlocationbutton);
    selectlocationbutton.addEventListener("click", function() {
        // showinventorymap(searchedinventory,activity,[item],locationinput);
        showinventorymap(searchedinventory,activity,[item],function(selectedlocations){
            locationinput.value = selectedlocations;
        });
    });

    if (activity == '入库') {
        const addvasbutton = document.createElement("button");
        addvasbutton.type = "button";
        addvasbutton.className = "button";
        addvasbutton.classList.add("addvasbutton");
        addvasbutton.innerHTML = "添加额外任务";
        addvasbutton.style.fontSize = "14px";
        addvasbutton.style.padding = "5px 10px";
        addvasbutton.style.margin = "0px 10px";
        linecontrol0.appendChild(addvasbutton);
        addvasbutton.addEventListener("click", function() {
            var inputs = detaillineform.querySelectorAll('input');
            var vaspassdata = {};
            inputs.forEach(function(input) {
                vaspassdata[input.name] = input.value;
            });
            vaspassdata['customer'] = document.getElementsByName("customer")[0].value;
            vaspassdata['container'] = document.getElementsByName("joblabel")[0].value;
            vaspassdata['jobid'] = document.getElementsByName("jobid")[0].value;
            addnewvaswindow(vaspassdata, function(vasitem) {
                
            });
        });
    }

    if (activity == '出库') {
        var searchcreteria = new FormData();
        searchcreteria.append("inventoryid", item['inventoryid']);
        searchcreteria.append("status", '未完成');

        fetch(serverdomain+'searchvas', {
            method: 'POST',
            body: searchcreteria,
        }).then(response => response.json()).then(data => {
            if (data['data'] && pcsinput.value != 0) {
                const cannotcomplete = document.createElement("div");
                cannotcomplete.innerHTML = "该库存项目有未完成的附加任务!";
                cannotcomplete.id = "cannotcomplete";
                detaillineform.appendChild(cannotcomplete);
                detaillineform.style.height = "175px";
                detaillineform.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
            }
        });
        
    }

    
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

    const checkeddiv=createcheckbox("checked"+id,"checked",item['checked'],detaillineform);
    checkeddiv.style.position="absolute";
    checkeddiv.style.right="10px";
    checkeddiv.style.top="7px";
    detaillineform.appendChild(checkeddiv);

    

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
            const detailLines = document.getElementsByClassName("detaillineform");
            var index = 0;
            for(const detailLine of detailLines){
                detailLine.getElementsByClassName("createorder")[0].value = detailLines.length - index;
                index++;
            }
        });
        detaillineform.appendChild(deleteButton);
    }

    sumpcsplt();

    setTimeout(() => {
        detaillineform.style.opacity="1";
        detaillineform.style.height="190px";
    },1);
    


}

function createjob(jobcontent,parentdiv,replacement){
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

    // add open in new tab icon
    const openinnewtab = document.createElement('img');
    openinnewtab.src = "images/open-in-new-window-icon.jpg";
    openinnewtab.className = 'openinnewwindowicon';
    openinnewtab.addEventListener("click", function() {
        opennewjobwindow(clickeditem,jobcontent['activity']);
    });

    activejob.appendChild(openinnewtab);

    // Create and append the standalone item title
    const itemTitle2 = document.createElement('p');
    itemTitle2.className = 'itemtitle';
    itemTitle2.textContent = jobcontent['joblabel'];
    activejob.appendChild(itemTitle2);

    // Create and append the first horizontal rule
    const hr1 = document.createElement('hr');
    activejob.appendChild(hr1);
    if(jobcontent['activity']=="出库"){
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
    }
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

    //check if the job has warning
    if(jobcontent['warning']){
        activejob.style.border="2px solid #ef9696";
        itemLine2.style.backgroundColor="#ef9696";
    }

    if(access!=3){
        const itemLine5 = document.createElement('div');
        itemLine5.className = 'itemline';

        const listItem7 = document.createElement('p');
        listItem7.className = 'listitem';
        listItem7.textContent = "仓库:"+jobcontent['warehouse'];
        itemLine5.appendChild(listItem7);
        activejob.appendChild(itemLine5);
    }
   

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

    activejob.addEventListener("click", function() {
        loaddetail(clickeditem,clickeditem['activity'],activejob);
    });
    openinnewtab.addEventListener("click", function(event) {
        event.stopPropagation();
        console.log("open in new tab");
    });

    if(replacement){
        replacement.replaceWith(activejob);
        activejob.classList.add("fade-in");
    }else{
        parentdiv.appendChild(activejob);
        activejob.classList.add("fade-in");
    }
    
}

function createvasjob(jobcontent,parentdiv,replacement){
    const clickeditem=jobcontent;

    var activejob = document.createElement("div");
    activejob.className="activejob";
    if(jobcontent['status']=="完成"){
        activejob.style.backgroundColor="rgba(86, 218, 74, 0.3)";
        
    }
    if(jobcontent['status']=="处理中"){
        activejob.style.backgroundColor="rgba(202, 255, 58, 0.3)";
    }
    if(jobcontent['status']=="暂停"){
        activejob.style.backgroundColor="#ef9696";
    }

    
    // Create the container div for the first item line
    const itemLine1 = document.createElement('div');
    itemLine1.className = 'itemline';

    // Create and append the item title to the first item line
    const itemTitle1 = document.createElement('p');
    itemTitle1.className = 'itemtitle';
    itemTitle1.textContent = jobcontent['service'];
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
    itemTitle2.textContent = jobcontent['container'];
    activejob.appendChild(itemTitle2);
    const itemTitle3 = document.createElement('p');
    itemTitle3.className = 'itemtitle';
    itemTitle3.textContent = jobcontent['label'];
    activejob.appendChild(itemTitle3);

    // Create and append the first horizontal rule
    const hr1 = document.createElement('hr');
    activejob.appendChild(hr1);
    
    // reference line
        const itemLine4 = document.createElement('div');
        itemLine4.className = 'itemline';

        // Create and append the list item (time label) to the second item line
        
        const listItem5 = document.createElement('p');
        listItem5.className = 'listitem';
        listItem5.textContent = "截止日期: ";
        itemLine4.appendChild(listItem5);
        
        // Create and append the list item (time value) to the second item line
        const listItem6 = document.createElement('p');
        listItem6.className = 'listitem';
        listItem6.textContent = jobcontent['deadline'];
        itemLine4.appendChild(listItem6);

        // Append the second item line to the document body or a specific container
        activejob.appendChild(itemLine4);
    
    // Create the container div for the second item line
    const itemLine2 = document.createElement('div');
    itemLine2.className = 'itemline';

    // Create and append the list item (time label) to the second item line
    const listItem2 = document.createElement('p');
    listItem2.className = 'listitem';
    listItem2.textContent = "创建日期:";
    itemLine2.appendChild(listItem2);
    // Append the second item line to the document body or a specific container
    activejob.appendChild(itemLine2);
    
    // Create and append the list item (time value) to the second item line
    const listItem3 = document.createElement('p');
    listItem3.className = 'listitem';
    listItem3.textContent = jobcontent['createdate'];
    itemLine2.appendChild(listItem3);

   

    // Create and append the second horizontal rule
    const hr2 = document.createElement('hr');
    activejob.appendChild(hr2);

    // Create the container div for the third item line
    const itemLine3 = document.createElement('div');
    itemLine3.className = 'itemline';
    const listItem4 = document.createElement('div');
    listItem4.className = 'listitem';
    listItem4.innerHTML = jobcontent['instruction'];
    itemLine3.appendChild(listItem4);
    activejob.appendChild(itemLine3);

    activejob.addEventListener("click", function() {
        showcontrolpanel();
        document.getElementById("itemdetail").innerHTML="";
        document.getElementById("itemdetail").appendChild(vasdetailform(clickeditem,function(vas){
            alert(vas.responsemsg);
            document.getElementById("itemdetail").innerHTML="";
        },this));
    });

    if(replacement){
        replacement.replaceWith(activejob);
        activejob.classList.add("fade-in");
    }else{
        parentdiv.appendChild(activejob);
        activejob.classList.add("fade-in");
    }
    
}

function uploadimage(jobid, file, field) {
    var formData = new FormData();
    formData.append('jobid', jobid);
    formData.append('field', field);
    formData.append('file', file);
    console.log(formData.get('file'));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', serverdomain+'saveimg', true);
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

function createstatusbar(currentstatus,status1,status2,status3,status4){
    // var detailform=document.getElementById("detailform");
    // Create the container div for the status-radio-input
    const statusRadioInput = document.createElement('div');
    statusRadioInput.id = 'status-radio-input';
    statusRadioInput.className = 'status-radio-input';
    // statusRadioInput.style.position="absolute";
    // statusRadioInput.style.right="100px";
    // statusRadioInput.style.top="35px";

    // Define the radio button options
    const options = [
        { value: status1, id: 'statusvalue-1', checked: ((currentstatus==status1)?true:false) },
        { value: status2, id: 'statusvalue-2', checked: ((currentstatus==status2)?true:false) },
        { value: status3, id: 'statusvalue-3', checked: ((currentstatus==status3)?true:false) },
        { value: status4, id: 'statusvalue-4', checked: ((currentstatus==status4)?true:false) } // Note: Corrected the duplicate id 'value-3' to 'value-4'
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

    return statusRadioInput;
    // Append the status-radio-input to the document body or a specific container
    // detailform.appendChild(statusRadioInput);
}

function sortTable(columnIndex,secondindex) {
    var tbody = document.getElementById('inventory-table-body');
    var rows = Array.from(tbody.querySelectorAll("tr"));
    var sortedRows = rows.sort(function(a, b) {
        var aText = a.children[columnIndex].textContent;
        var bText = b.children[columnIndex].textContent;
        var comparison = -aText.localeCompare(bText, 'zh', { numeric: true });

        if(secondindex){
            if (comparison === 0) {
                var aText2 = a.children[secondindex].textContent;
                var bText2 = b.children[secondindex].textContent;
                comparison = -aText2.localeCompare(bText2, 'zh', { numeric: true });
            }
        }
        return comparison;
    });
    tbody.innerHTML = "";
    sortedRows.forEach(function(row) {
        tbody.appendChild(row);
    });
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
    var time4dig = Date.now() % 100000000;
    var last4=containerpart.length>3?containerpart.substr(containerpart.length - 3):containerpart;
    var inventoryid=""+datestring+time4dig+i;
    return inventoryid;
}

async function showinventorydetail(inventory,thisrow){
    showcontrolpanel();

    const itemdetail = document.getElementById("itemdetail");
    itemdetail.innerHTML = "";
    
    var inventorydetail = document.createElement("div");
    inventorydetail.className="inventorydetail";
    itemdetail.appendChild(inventorydetail);

    const updateinventoryform = document.createElement('form');
    updateinventoryform.id = 'updateinventoryform';
    updateinventoryform.className = 'inventorydetail';
    inventorydetail.appendChild(updateinventoryform);

    function createInventoryDetailItem(label, value) {
        const detailpargraph = document.createElement('p');
        detailpargraph.className = 'detailpargraph';
        detailpargraph.textContent = label + ': ' + value;
        updateinventoryform.appendChild(detailpargraph);
    }
    function createInventoryDetailInput(label, value, name) {
        const linecontrol = document.createElement('div');
        linecontrol.className = 'linecontrol';

        if(label=="优先级"){
            const priorityinput = document.createElement('select');
            priorityinput.name = name;
            priorityinput.className = 'lineinput';
            priorityinput.style.width = '45px';
            const priorityinputlabel = document.createElement('label');
            priorityinputlabel.innerHTML = label;
            priorityinputlabel.className = 'lineinputlabel';
            linecontrol.appendChild(priorityinputlabel);
            linecontrol.appendChild(priorityinput);
            updateinventoryform.appendChild(linecontrol);
            const priorityoptions = [5, 4, 3, 2, 1, 0,-1,-2,-3,-4,-5,-6];
            for (var i = 0; i < priorityoptions.length; i++) {
                var option = document.createElement('option');
                option.value = priorityoptions[i];
                option.text = priorityoptions[i]==-6?"拦截":priorityoptions[i];
                if (value == priorityoptions[i]) {
                    option.selected = true; // Set the default value based on item['priority']
                }
                priorityinput.appendChild(option);
            }

            return;
        }
        if(label=="托盘类型"){
            const plttypeinput = createplttypeselectiondiv(value);
            plttypeinput.style.display = 'inline-flex';
            linecontrol.appendChild(plttypeinput);
            updateinventoryform.appendChild(linecontrol);
            return;
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.className = 'lineinput';
        input.style.width = '120px';
        input.value = value;
        const inputlabel = document.createElement('label');
        inputlabel.innerHTML = label;
        inputlabel.className = 'lineinputlabel';
        linecontrol.appendChild(inputlabel);
        linecontrol.appendChild(input);
        updateinventoryform.appendChild(linecontrol);
    }

    const submitbutton = document.createElement('button');
    submitbutton.type = 'button';
    submitbutton.className = 'button';
    submitbutton.innerHTML = '更新';
    submitbutton.style.fontSize = '14px';
    submitbutton.style.padding = '5px 5px';
    submitbutton.style.margin = '10px 0px';
    updateinventoryform.appendChild(submitbutton);

    const hidenid = document.createElement('input');
    hidenid.type = 'hidden';
    hidenid.name = 'id';
    hidenid.value = inventory['id'];
    updateinventoryform.appendChild(hidenid);

    createInventoryDetailItem('库存编号', inventory['inventoryid']);
    createInventoryDetailItem('状态', inventory['status']);
    createInventoryDetailItem('客户', inventory['customer']);
    createInventoryDetailItem('箱号/单号', inventory['container']);
    createInventoryDetailItem('仓点', inventory['label']);
    createInventoryDetailItem('箱唛', inventory['marks']);
    createInventoryDetailItem('渠道', inventory['channel']);
    createInventoryDetailInput('件数', inventory['pcs'], 'pcs');
    createInventoryDetailInput('托数', inventory['plt'], 'plt');
    createInventoryDetailInput('托盘类型', inventory['plttype'], 'plttype');
    createInventoryDetailInput('优先级', inventory['priority'], 'priority');
    createInventoryDetailItem('要求', inventory['requirement']);
    createInventoryDetailItem('FBA', inventory['fba']);
    createInventoryDetailItem('重量（KGS）/件', inventory['kgs']);
    createInventoryDetailItem('体积（CBM）/件', inventory['cbm']);
    createInventoryDetailItem('备注', inventory['note']);
    createInventoryDetailItem('创建时间', inventory['date']);
    createInventoryDetailItem('最后盘库时间', inventory['checkdate']);
    createInventoryDetailItem('库位', inventory['inventoryloc']);

    inventorydetail.appendChild(document.createElement('br'));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button';
    deleteButton.innerHTML = '删除';
    deleteButton.style.fontSize = '14px';
    deleteButton.style.padding = '5px 5px';

    inventorydetail.appendChild(deleteButton);

    const labelbutton = document.createElement('button');
    labelbutton.type = 'button';
    labelbutton.className = 'button';
    labelbutton.innerHTML = '打印标签';
    labelbutton.style.fontSize = '14px';
    labelbutton.style.padding = '5px 5px';
    inventorydetail.appendChild(labelbutton);

    const selectlocationbutton = document.createElement('button');
    selectlocationbutton.type = 'button';
    selectlocationbutton.className = 'button';
    selectlocationbutton.innerHTML = '选择库位';
    selectlocationbutton.style.fontSize = '14px';
    selectlocationbutton.style.padding = '5px 5px';
    inventorydetail.appendChild(selectlocationbutton);

    const checkinventorybutton = document.createElement('button');
    checkinventorybutton.type = 'button';
    checkinventorybutton.className = 'button';
    checkinventorybutton.innerHTML = '确认库存';
    checkinventorybutton.style.fontSize = '14px';
    checkinventorybutton.style.padding = '5px 5px';
    inventorydetail.appendChild(checkinventorybutton);


    updateinventoryform.addEventListener('submit', async function(event) {
        console.log('submit');
        event.preventDefault();
    });

    submitbutton.addEventListener('click', async function() {
        var formData = new FormData(updateinventoryform);
        console.log(formData.get('id'));
        const response = await fetch(serverdomain+'updateinventorynumber', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data['error_code'] == 0) {
            alert(data['msg']);
        } else {
            alert(data['msg']);
        }
    });

    selectlocationbutton.addEventListener('click', function() {
        showinventorymap(searchedinventory,"入库",[inventory],function(selectedlocations){
            var updateinventory = new FormData();
            updateinventory.append('id', inventory['id']);
            updateinventory.append('inventoryloc', selectedlocations);
            fetch(serverdomain+'updateinventorylocation', {
                method: 'POST',
                body: updateinventory,
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if (data['error_code'] == 0) {
                    alert(data['msg']);
                    inventory['inventoryloc'] = selectedlocations;
                }else{
                    alert(data['msg']);
                }
            });
        });
    });

    deleteButton.addEventListener('click', async function() {
        const confirmDelete = confirm('确定删除库存编号 ' + inventory['inventoryid'] + ' ?');
        if (confirmDelete) {
            const deletecreteria = new FormData();
            deletecreteria.append('id', inventory['id']);
            const response = await fetch(serverdomain+'deleteinventory', {
                method: 'POST',
                body: deletecreteria,
            });
            const data = await response.json();

            if (data['error_code'] == 0) {
                alert('库存编号 ' + inventory['inventoryid'] + ' 已删除');
                thisrow.remove();
                itemdetail.innerHTML = '';
            }
        }
    });

    labelbutton.addEventListener('click', function() {
        printinventorylabel(inventory);
    });

    checkinventorybutton.addEventListener('click', async function() {
        const confirmCheck = confirm('确定盘库库存编号 ' + inventory['inventoryid'] + ' ?');
        if (confirmCheck) {
            const today = new Date();

            const checkcreteria = new FormData();
            checkcreteria.append('id', inventory['id']);
            checkcreteria.append('checkdate', today.toISOString());
            const response = await fetch(serverdomain+'checkinventory', {
                method: 'POST',
                body: checkcreteria,
            });
            const data = await response.json();

            if (data['error_code'] == 0) {
                alert('库存编号 ' + inventory['inventoryid'] + ' 已确认');
                inventory['checkdate'] = data['checkdate'];
                createInventoryDetailItem('最后盘库时间', inventory['checkdate']);
            }
        }
    });
    

    if(access!=1 && access!=3){
        submitbutton.disabled = true;
        deleteButton.disabled = true;
        labelbutton.disabled = true;
        selectlocationbutton.disabled = true;
        checkinventorybutton.disabled = true;
    }

}
async function showactivitydetail(activity){
    showcontrolpanel();

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
    createActivityDetailItem('任务详情', '');
    createActivityDetailItem('仓库: ', activity['warehouse']);
    createActivityDetailItem('任务编号: ', activity['jobid']);
    createActivityDetailItem('库存编号: ', activity['inventoryid']);
    createActivityDetailItem('订单号: ', activity['orderid']);
    createActivityDetailItem('状态: ', activity['status']);
    createActivityDetailItem('客户: ', activity['customer']);
    createActivityDetailItem('日期: ', activity['date']);
    createActivityDetailItem('活动: ', activity['activity']);
    createActivityDetailItem('箱号: ', activity['container']);
    createActivityDetailItem('预报件数: ', activity['oripcs']);
    createActivityDetailItem('实际件数: ', activity['pcs']);
    createActivityDetailItem('托数: ', activity['plt']);
    createActivityDetailItem('渠道: ', activity['channel']);
    createActivityDetailItem('箱唛: ', activity['marks']);
    createActivityDetailItem('仓点: ', activity['label']);
    createActivityDetailItem('要求: ', activity['requirement']);
    createActivityDetailItem('FBA: ', activity['fba']);
    createActivityDetailItem('备注: ', activity['note']);
    
    var searchcreteria = new FormData();
    searchcreteria.append("jobid",activity['jobid']);
    const response = await fetch(serverdomain+'searchjobs', {
        method: 'POST',
        body: searchcreteria,
      });

    const data = await response.json();
    var job = data["data"][0];
    createActivityDetailItem('相关任务：', "");
    createjob(job,activitydetail);
    
}
function checkitem(array,key){
    if(!array[key]){
        return false;
    }
    if(typeof(array[key])=="undefined"){
        return false;
    }
    if(array[key]==null){
        return false;
    }
    return true;
}
function jsonToCsv(jsonData,columntitle) {
    const csvRows = [];
    const headers = Object.keys(jsonData[0]).map(key => columntitle[key] || key);
    csvRows.push(headers.join(','));

    for (const row of jsonData) {
        const values = headers.map(header => {
            const originalKey = Object.keys(columntitle).find(key => columntitle[key] === header) || header;
            let value = row[originalKey];
            if (typeof value === 'string') {
                value = value.replace(/\n/g, ';'); // Replace newline characters with a space
                value = value.replace(/"/g, '""'); // Escape double quotes
                value = `"${value}"`; // Enclose in double quotes
            }
            return value;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}
function replacer(key, value) {
    return value === null ? '' : value;
}
function filterunvalidactivity(data){
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight
    return data.filter(item => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0); // Parse item date at midnight
        return !(item.status == '预报' && itemDate < today) && item.pcs > 0;
    });
}
function filterunvalidinventory(data){
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight
    return data.filter(item => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0); // Parse item date at midnight
        return !(item.status == '预报' && itemDate < today) && item.pcs > 0;
    });
}
function adminauthorization(){
    const adminpassword = prompt('请输入管理员密码');
    if (adminpassword === 'Garfat') {
        return true;
    } else {
        alert('密码错误');
        return false;
    }
}
function sendemail(sendto,subject,content){
    const formData = new FormData();
    formData.append('sendto', sendto);
    formData.append('subject', subject);
    formData.append('content', content);
    fetch(serverdomain+'sendemail', {
        method: 'POST',
        body: formData,
    }).then(response => response.json()).then(data => {
        console.log(data);
    });
}
async function searchjobwithitems(searchcreteria){
    const response = await fetch(serverdomain+'searchjobs', {
        method: 'POST',
        body: searchcreteria,
    });

    const data = await response.json();

    if (!data['data']) {
        return{'jobs':[],'items':[]};
    }

    // const jobs = data['data']['job'];
    // const items = data['data']['items'];
    const jobs = data['data'];
    

    jobs.forEach(job => {
        job["overview"] = '';
        if (!job['items']) {
            job['items'] = [];
            return;
        }
        job['items'].forEach((item, key2) => {
            item["overview"] = '';
            if (item.pcs <= 0) {
                return;
            }
            let plttype = '';
            if (item.plttype && item.plttype !== '散货') {
                // plttype = item.plttype + '托盘打托 ' + item.oogplt;
                plttype = item.plttype + '托盘打托 ' ;
            }
            if (job.activity === '入库') {
                if (item.plt == 0) {
                    if (item.channel === '拦截暂扣') {
                        item["overview"] = item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + plttype + item.requirement + ':' + item.fba + '<br />';
                        // job["overview"] += item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + plttype + item.requirement + ':' + item.fba + '<br />';
                    } else {
                        item["overview"] = item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + plttype + item.requirement + '<br />';
                        // job.overview += item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + plttype + item.requirement + '<br />';
                    }
                } else {
                    if (item.channel === '拦截暂扣') {
                        item["overview"] = item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + item.plt + '托  ' + plttype + item.requirement + ':' + item.fba + '<br />';
                        // job["overview"] += item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + item.plt + '托  ' + plttype + item.requirement + ':' + item.fba + '<br />';
                    } else {
                        item["overview"] = item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + item.plt + '托  ' + plttype + item.requirement + '<br />';
                        // job["overview"] += item.createorder + '.' + item.label + ':    ' + item.pcs + '件 ' + item.plt + '托  ' + plttype + item.requirement + '<br />';
                    }
                }
            } else {
                if (item.plt == 0) {
                    item["overview"] = item.createorder + '.' + item.container + ':    ' + item.pcs + '件 ' + plttype + item.requirement + '<br />';
                    // job["overview"] += item.createorder + '.' + item.container + ':    ' + item.pcs + '件 ' + plttype + item.requirement + '<br />';
                } else {
                    item["overview"] = item.createorder + '.' + item.container + ':    ' + item.pcs + '件 ' + item.plt + '托  ' + plttype + item.requirement + '<br />';
                    // job["overview"] += item.createorder + '.' + item.container + ':    ' + item.pcs + '件 ' + item.plt + '托  ' + plttype + item.requirement + '<br />';
                }
            }
            job["overview"] += item["overview"];
        });

    });

    console.log({'jobs':jobs,'items':jobs.map(job => job.items).flat()});

    return {'jobs':jobs,'items':jobs.map(job => job.items).flat()};
}
async function checkandGeneratevasPlt(itemFormdata){
    const pcs=parseInt(itemFormdata.get('pcs'));
    const cbm=parseFloat(itemFormdata.get('cbm'));
    if(pcs==0 || cbm==0){
        return;
    }
    const plttype = itemFormdata.get('plttype');
    if(plttype=="散货" || plttype==""){
        return;
    }

    //Check Threshold
    const estimateplt = Math.ceil(cbm*pcs / 1.5);
    const plt = parseInt(itemFormdata.get('plt'));

    if(plt>=estimateplt*1.2){
        var uploaddata = new FormData();
        itemFormdata.forEach((value, key) => {
            uploaddata.append(key, value);
        });
        uploaddata.append('service', '异常打托');
        uploaddata.set('status', '处理中');
        uploaddata.append('instruction', '系统预估托数: '+estimateplt+' 实际托数: '+plt+' 请上传2+1货物打托照片');
        uploaddata.append('deadline', itemFormdata.get('date'));
        const response = await fetch(serverdomain+'updatevas', {
            method: 'POST',
            body: uploaddata,
        });
        const data = await response.json();
        alert(itemFormdata.get('label')+"系统预估托数: "+estimateplt+" 实际托数: "+plt+" 请在额外任务中上传2+1货物打托照片");
    }
    return;

}

// prints
function printcmr(clickeditem,items){
    var printWindow = window.open('', '', 'height=1123px,width=794px');
        printWindow.document.write('<html><head>');
        printWindow.document.write('<style>@page {size: A4 portrait;margin:0;}body{font-family: Arial, sans-serif; font-size:14px;margin:0px 0px 0px 0px}h1{font-size:65px; font-weight:600;margin:0 0 0 0;}</style>');
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
    var baseFontSize = 14;
    var baseheight = 260;
    const itemsdiv = document.createElement('div');
    itemsdiv.style.position = 'absolute';
    itemsdiv.style.top = '385px';
    itemsdiv.style.left = '40px';
    itemsdiv.style.width = '635px';
    itemsdiv.style.height = '250px';
    itemsdiv.style.overflow = 'hide';
    itemsdiv.style.zIndex = '1';
    itemsdiv.style.fontSize = '10px';
    itemsdiv.contentEditable = true;
    printWindow.document.body.appendChild(itemsdiv);
    while(baseheight>255 && baseFontSize>7){
        itemsdiv.innerHTML = '';
        items.forEach(function(item) {
            const itemdiv = document.createElement('div');
            itemdiv.style.display = 'flex';
            itemdiv.style.marginBottom = '3px';
            itemdiv.style.width = '100%';
            if(item['pcs']>0){
                const itemheader = document.createElement('div');
                if(item['plt']>0){  
                    itemheader.innerHTML = item['container'] + ' ' + item['pcs']+ 'CTNS ' + item['plt'] + 'PLTS';
                }else{
                    itemheader.innerHTML = item['container'] + ' ' + item['pcs']+ 'CTNS ';
                }
                itemheader.style.marginRight = '5px';
                itemheader.style.fontWeight = 'bold';
                itemheader.style.fontSize = baseFontSize + 'px';
                itemdiv.appendChild(itemheader);
                const itemfba = document.createElement('div');
                var fbafontsize = baseFontSize - 3;
                itemfba.style.fontSize = fbafontsize + 'px';
                itemfba.innerHTML = item['fba'].replace(/[\n;,]/g, ' ');
                itemdiv.appendChild(itemfba);
                itemsdiv.appendChild(itemdiv);
            }
        });
        const itemdiv = document.createElement('div');
        itemdiv.style.display = 'flex';
        itemdiv.style.marginBottom = '3px';
        itemdiv.style.width = '100%';
        itemdiv.style.fontSize = baseFontSize + 'px';
        itemdiv.innerHTML = '.';
        itemsdiv.appendChild(itemdiv);

        baseheight = itemsdiv.clientHeight;
        baseFontSize = baseFontSize - 2;

    }

    // const extraspace = document.createElement('div');
    // extraspace.style.position = 'absolute';
    // extraspace.style.top = '385px';
    // extraspace.style.left = '40px';
    // extraspace.style.width = '635px';
    // extraspace.style.height = '250px';
    // extraspace.style.overflow = 'hide';
    // extraspace.style.zIndex = '2';
    // extraspace.style.fontSize = '10px';
    // extraspace.contentEditable = true;
    // printWindow.document.body.appendChild(extraspace);
    

    

    //order number
    const ordernumber = document.createElement('div');
    ordernumber.style.position = 'absolute';
    ordernumber.style.top = '290px';
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

    //loading address
    var warehouseaddress=getwarehouseaddress();
    const  loadingaddress= document.createElement('div');
    loadingaddress.style.position = 'absolute';
    loadingaddress.style.top = '70px';
    loadingaddress.style.left = '40px';
    loadingaddress.style.width = '360px';
    loadingaddress.style.height = '50px';
    loadingaddress.style.zIndex = '1';
    loadingaddress.style.fontSize = '11px';
    loadingaddress.contentEditable = true;
    loadingaddress.innerHTML=warehouseaddress[0];

    printWindow.document.body.appendChild(loadingaddress);

    //loading city
    const  loadingcity= document.createElement('div');
    loadingcity.style.position = 'absolute';
    loadingcity.style.top = '285px';
    loadingcity.style.left = '40px';
    loadingcity.style.width = '360px';
    loadingcity.style.height = '25px';
    loadingcity.style.zIndex = '1';
    loadingcity.style.fontSize = '11px';
    loadingcity.contentEditable = true;
    loadingcity.innerHTML=warehouseaddress[1];

    printWindow.document.body.appendChild(loadingcity);

    //del address
    var deladdressfull=getaddress(clickeditem['joblabel']);
    const deladdress = document.createElement('div');
    deladdress.style.position = 'absolute';
    deladdress.style.top = '145px';
    deladdress.style.left = '40px';
    deladdress.style.width = '360px';
    deladdress.style.height = '50px';
    deladdress.style.zIndex = '1';
    deladdress.style.fontSize = '11px';
    deladdress.contentEditable = true;
    deladdress.innerHTML=clickeditem['deladdress']?clickeditem['deladdress'].replace(/\n/g, '<br>'):deladdressfull?deladdressfull[0]:'';

    printWindow.document.body.appendChild(deladdress);

    //del address city
    const deladdresscity = document.createElement('div');
    deladdresscity.style.position = 'absolute';
    deladdresscity.style.top = '227px';
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
    issuecity.style.width = '200px';
    issuecity.style.height = '20px';
    issuecity.style.zIndex = '1';
    issuecity.textContent = warehouseaddress[1];

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

    function getwarehouseaddress(){
        if(currentwarehouse=="NL001"){
            return ['CEEC SUPPLY CHAIN <br>Building 3, Schutteboendersweg 1, 6247EM Gronsveld','Gronsveld, The Netherlands'];
        }
        if(currentwarehouse=="DE001"){
            return ['Blue Shark Trading &Logistics GmbH <br>Baumstr. 61 47198 Duisburg','Duisburg, Germany'];
        }
        
        return ['',''];
    }

}
function printSpecificContent(clickeditem) {
    
    if (clickeditem) {
        var printWindow = window.open('', '', 'height=1123,width=794');
        
        
        printWindow.document.write('<html><head><title>打印操作单</title>');
        printWindow.document.write('<style>@page {size: A4 portrait;margin:0;}body{font-family: Arial, sans-serif;margin:50px 0px 0px 30px}h1{font-weight:600;margin:0 0 0 0;}p{word-break:break-all;}</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('</body></html>');
        // printWindow.document.close();
        
    } else {
        console.error('Element with ID ' + elementId + ' not found.');
        return;
    }

    var totalHeight = 2000;
    var baseFontSize = 45;
    while (totalHeight>1050 && baseFontSize>20) {
        printWindow.document.body.innerHTML = '';
        // Create a temporary element to measure text height
        var headerfontsize = baseFontSize + 20;
        var tempElement = document.createElement('div');
        tempElement.style.position = 'absolute';
        tempElement.style.fontFamily = 'Arial, sans-serif';
        tempElement.style.width = '794px';
        tempElement.style.fontSize = baseFontSize + 'px';
        var temph1 = document.createElement('h1');
        temph1.style.fontSize = headerfontsize + 'px';
        temph1.innerHTML = clickeditem['customer'];
        tempElement.appendChild(temph1);
        var temph1 = document.createElement('h1');
        temph1.style.fontSize = headerfontsize + 'px';
        temph1.innerHTML = clickeditem['reference']?clickeditem['joblabel']+ ' ' + clickeditem['reference']:clickeditem['joblabel'];
        tempElement.appendChild(temph1);
        var hr = document.createElement('hr');
        tempElement.appendChild(hr);
        var p = document.createElement('p');
        p.style.fontSize = baseFontSize + 'px';
        p.innerHTML = clickeditem['date'];
        tempElement.appendChild(p);
        var p = document.createElement('p');
        p.style.fontSize = baseFontSize + 'px';
        p.innerHTML = clickeditem['overview'];
        tempElement.appendChild(p);
        var p = document.createElement('p');
        p.style.fontSize = baseFontSize + 'px';
        p.innerHTML = clickeditem['ordernote'];
        tempElement.appendChild(p);
        printWindow.document.body.appendChild(tempElement);
        
        // Measure the height of the temporary element
        totalHeight = tempElement.offsetHeight;
        
        // Adjust the font size based on the number of lines
        if (totalHeight > 1050) {
            baseFontSize = baseFontSize-5;
        } 
    }
    // printWindow.print();
    // if (clickeditem) {
    //     var printWindow = window.open('', '', 'height=1123,width=794');
    //     printWindow.document.write('<html><head><title>打印操作单</title>');
    //     printWindow.document.write('<style>body{font-family: Arial, sans-serif; font-size:45px;margin:50px 0px 0px 30px}h1{font-size:65px; font-weight:600;margin:0 0 0 0;}</style>');
    //     printWindow.document.write('</head><body >');
    //     printWindow.document.write('<h1>'+clickeditem['customer']+'</h1>');
    //     printWindow.document.write('<h1>'+clickeditem['joblabel']+'</h1>');
    //     printWindow.document.write('<hr>');
    //     printWindow.document.write(clickeditem['date']+'<br>');
    //     printWindow.document.write(clickeditem['overview']+ '<br>');    
    //     printWindow.document.write(clickeditem['ordernote']); 
    //     printWindow.document.write('</body></html>');
    //     // printWindow.document.close();
    //     printWindow.print();
    // } else {
    //     console.error('Element with ID ' + elementId + ' not found.');
    // }
}
function printinventorylabel(content){
    var timestamp = new Date().getTime();
    var printWindow = window.open('', '', 'height=750px,width=1000px');
    printWindow.document.write('<html><head>');
    printWindow.document.write('<link href="labelprintpage.css?v=' + timestamp + '" rel="stylesheet" type="text/css">');
    printWindow.document.write('</head><body >');
    printWindow.document.write('</body></html>');

    if (!Array.isArray(content)) {
        content = [content];
    }

    content.forEach(function(item) {
        // var pagenumbers=item['plt']&&item['plt']>0?item['plt']:1;
        var pagenumbers=1;

        if(item['pcs']<=0){
            return;
        }
        for(var i=0;i<pagenumbers;i++){
            const pagediv = document.createElement('div');
            pagediv.className = 'pagediv';
            pagediv.contentEditable = true;
            printWindow.document.body.appendChild(pagediv);

            const line = document.createElement('div');
            line.style.fontSize = '85px';
            line.style.fontWeight = '800';
            line.style.height = '128px';
            line.className = 'line';
            line.innerHTML = item['container'];
            pagediv.appendChild(line);
            const secondline = document.createElement('div');
            secondline.style.display = 'flex';
            secondline.style.width = '100%';
            secondline.style.justifyContent = 'space-between';
            secondline.style.alignItems = 'center';
            pagediv.appendChild(secondline);
            const secleft = document.createElement('div');
            secleft.style.display = 'flex';
            secleft.style.width = '80%';
            secleft.style.flexDirection = 'column';
            secleft.style.justifyContent = 'center';
            secleft.style.alignItems = 'center';
            secondline.appendChild(secleft);
            const secright = document.createElement('div');
            secright.style.display = 'flex';
            secright.style.width = '20%';
            secright.style.flexDirection = 'column';
            secright.style.justifyContent = 'center';
            secright.style.alignItems = 'center';
            secondline.appendChild(secright);

            const line2 = document.createElement('div');
            line2.className = 'line';
            const date = new Date(item['date']);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            line2.innerHTML = item['label']+"  "+ formattedDate;
            secleft.appendChild(line2);

            const line3 = document.createElement('div');
            line3.className = 'line';
            const pltc= item['plt']&&item['plt']>0?item['plt']:'_____';
            line3.innerHTML = item['pcs'] + '件 ' + pltc + '托';
            secleft.appendChild(line3);

            const qrcodecontainer = document.createElement('div');
            qrcodecontainer.className = 'qrcodecontainer';
            // new QRCode(qrcodecontainer, serverdomain+"inventorydetail?inventoryid=" + item['inventoryid']);
            const qrCodeOptions = {
                text: "https://oath-stone.com/outboundlabelhandler?inventoryid=" + item['inventoryid'],
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
            };
            new QRCode(qrcodecontainer, qrCodeOptions);
            secright.appendChild(qrcodecontainer);
        }
    });
    
    
    printWindow.print();
}

// create popup windows
async function createinventoryoperationdiv(){
    
    const activeJobs = document.getElementById('activejobs');
    activeJobs.innerHTML = '';

    //frame for the operation
    const operationdiv = document.createElement('div');
    operationdiv.className = 'operationdiv';
    operationdiv.id = 'warehouseoperationdiv';
    operationdiv.style.display = 'flex';
    operationdiv.style.flexDirection = 'column';
    operationdiv.style.justifyContent = 'center';
    operationdiv.style.alignItems = 'center';
    operationdiv.style.margin = '0px 0px 0px 0px';
    operationdiv.style.width = '100%';
    activeJobs.appendChild(operationdiv);

    

    

    //get all inventory data
    var searchallinventory = new FormData();
    searchallinventory.append('status', '完成');
    if(access==3){
        searchallinventory.append("warehouse", currentwarehouse);
    }else{
        const selectedwarehouse=document.getElementById('searchbox').querySelector('select').value;
        if(selectedwarehouse){
            searchallinventory.append("warehouse", selectedwarehouse);
        }
    }
    const response = await fetch(serverdomain+'searchinventory', {
        method: 'POST',
        body: searchallinventory,
    });
    const data = await response.json();
    searchedinventory = data['data'];

    //all inventory

    const allinventorytitle = document.createElement('div');
    allinventorytitle.style.fontWeight = 'bold';
    allinventorytitle.style.fontSize = '20px';
    allinventorytitle.innerHTML = '系统所有库存';
    operationdiv.appendChild(allinventorytitle);

    const statisticcomparediv = document.createElement('div');
    statisticcomparediv.style.display = 'flex';
    statisticcomparediv.style.flexDirection = 'row';
    statisticcomparediv.style.justifyContent = 'center';
    statisticcomparediv.style.margin = '0px 0px 0px 0px';
    statisticcomparediv.style.width = '100%';
    operationdiv.appendChild(statisticcomparediv);

    const customerdiv = document.createElement('div');
    customerdiv.className = 'inventoryreporttablediv';
    statisticcomparediv.appendChild(customerdiv);

    const alldiv = document.createElement('div');
    alldiv.className = 'inventoryreporttablediv';
    statisticcomparediv.appendChild(alldiv);

    //group the inventory by customer
    const totalpcs = searchedinventory.reduce((sum, item) => sum + Number(item.pcs), 0);

    const customerdivtitle = document.createElement('div');
    customerdivtitle.style.fontSize = '18px';
    customerdivtitle.innerHTML = '按照客户统计';
    customerdiv.appendChild(customerdivtitle);

    customerdiv.appendChild(createinfoline('总件数:', totalpcs));
    const inventorybycustomer = searchedinventory.reduce((acc, item) => {
        if (!acc[item.customer]) {
            acc[item.customer] = 0;
        }
        acc[item.customer] += Number(item.pcs);
        return acc;
    }, {});

    const customerinventorytable = createsubtable(["客户", "件数"],inventorybycustomer);
    customerinventorytable.style.width = '100%';
    customerdiv.appendChild(customerinventorytable);
    

    
    //group the inventory by label
    const alldivtitle = document.createElement('div');
    alldivtitle.style.fontSize = '18px';
    alldivtitle.innerHTML = '按照仓点统计';
    alldiv.appendChild(alldivtitle);

    const inventorygroup = searchedinventory.reduce((acc, item) => {
        if (!acc[item.label]) {
            acc[item.label] = 0;
        }
        acc[item.label] += Number(item.pcs);
        return acc;
    }, {});
    
    alldiv.appendChild(createinfoline('总件数:', totalpcs));

    //create a table for the inventorygroup
    const allinventorytable = createsubtable(["仓点", "件数"],inventorygroup);
    allinventorytable.style.width = '100%';
    alldiv.appendChild(allinventorytable);


    operationdiv.appendChild(document.createElement('hr'));


    //from the check point
    const lastcheckdivtitle = document.createElement('div');
    lastcheckdivtitle.style.fontWeight = 'bold';
    lastcheckdivtitle.style.fontSize = '20px';
    lastcheckdivtitle.innerHTML = '盘点库存';
    operationdiv.appendChild(lastcheckdivtitle);

    const lastcheckdate = searchedinventory.reduce((max, item) => Math.max(max, new Date(item.checkdate).getTime()), 0);
    //sum the total pcs of the inventory with the lastest checkdate
    const lastcheckinventory = searchedinventory.filter(item => new Date(item.checkdate).getTime() >= lastcheckdate);
    //create a form to choose the checkdate
    const choosecheckdatediv = document.createElement('form');
    choosecheckdatediv.style.display = 'flex';
    choosecheckdatediv.style.flexDirection = 'row';
    choosecheckdatediv.style.justifyContent = 'center';
    choosecheckdatediv.style.margin = '0px 0px 0px 0px';
    choosecheckdatediv.style.width = '100%';
    operationdiv.appendChild(choosecheckdatediv);
    const checkdateinput = document.createElement('input');
    checkdateinput.type = 'date';
    checkdateinput.name = 'checkdate';
    checkdateinput.value = formatDate(new Date(lastcheckdate));
    checkdateinput.style.width = '150px';
    checkdateinput.style.fontSize = '16px';
    checkdateinput.style.margin = '0px 0px 0px 0px';
    const checkdateinputlabel = document.createElement('div');
    checkdateinputlabel.innerHTML = '选择盘点时间';
    checkdateinputlabel.style.fontSize = '16px';
    checkdateinputlabel.style.margin = '0px 10px 0px 0px';
    choosecheckdatediv.appendChild(checkdateinputlabel);
    choosecheckdatediv.appendChild(checkdateinput);
    const checkdatebutton = document.createElement('button');
    checkdatebutton.type = 'submit';
    checkdatebutton.className = 'button';
    checkdatebutton.innerHTML = '查询';
    checkdatebutton.style.fontSize = '14px';
    checkdatebutton.style.padding = '5px 5px';
    choosecheckdatediv.appendChild(checkdatebutton);
    choosecheckdatediv.addEventListener('submit', function(event) {
        event.preventDefault();
        const checkdate = new Date(checkdateinput.value).getTime();
        const lastcheckinventory = searchedinventory.filter(item => new Date(item.checkdate).getTime() >= checkdate);
        createlastcheckcontent(lastcheckinventory);
    });

    const statisticcomparediv2 = document.createElement('div');
    statisticcomparediv2.style.display = 'flex';
    statisticcomparediv2.style.flexDirection = 'row';
    statisticcomparediv2.style.justifyContent = 'center';
    statisticcomparediv2.style.margin = '0px 0px 0px 0px';
    statisticcomparediv2.style.width = '100%';
    operationdiv.appendChild(statisticcomparediv2);

    const lastcheckdivcustomer = document.createElement('div');
    lastcheckdivcustomer.className = 'inventoryreporttablediv';
    statisticcomparediv2.appendChild(lastcheckdivcustomer);

    const lastcheckdiv = document.createElement('div');
    lastcheckdiv.className = 'inventoryreporttablediv';
    statisticcomparediv2.appendChild(lastcheckdiv);
    
    createlastcheckcontent(lastcheckinventory);

    //create a button to delete all unchecked inventory
    const deletebutton = document.createElement('button');
    deletebutton.type = 'button';
    deletebutton.className = 'button';
    deletebutton.innerHTML = '删除未盘点库存';
    deletebutton.style.margin = '20px 0px 0px 0px';
    deletebutton.style.fontSize = '16px';
    deletebutton.style.width = '200px';
    deletebutton.style.padding = '5px 5px';
    operationdiv.appendChild(deletebutton);

    const deletenoncompletedbutton = document.createElement('button');
    deletenoncompletedbutton.type = 'button';
    deletenoncompletedbutton.className = 'button';
    deletenoncompletedbutton.innerHTML = '删除盘点日期前未入库的库存';
    deletenoncompletedbutton.style.margin = '20px 0px 0px 0px';
    deletenoncompletedbutton.style.fontSize = '16px';
    deletenoncompletedbutton.style.width = '200px';
    deletenoncompletedbutton.style.padding = '5px 5px';
    operationdiv.appendChild(deletenoncompletedbutton);

    const deleteextrabutton = document.createElement('button');
    deleteextrabutton.type = 'button';
    deleteextrabutton.className = 'button';
    deleteextrabutton.innerHTML = '删除多余库存';
    deleteextrabutton.style.margin = '20px 0px 0px 0px';
    deleteextrabutton.style.fontSize = '16px';
    deleteextrabutton.style.width = '200px';
    deleteextrabutton.style.padding = '5px 5px';
    operationdiv.appendChild(deleteextrabutton);


    deletebutton.addEventListener('click', function() {
        if(!adminauthorization()){
            return;
        }
        if(access!=3){
            const selectedwarehouse=document.getElementById('searchbox').querySelector('select').value;
            if(!selectedwarehouse){
                alert('此操作只能操作于选择的仓库，请选择仓库！');
                return;
            }
        }
        const checkdate = new Date(checkdateinput.value).getTime();
        var uncheckedinventory = searchedinventory.filter(item => new Date(item.checkdate).getTime() < checkdate);
        uncheckedinventory=uncheckedinventory.filter(item => new Date(item.date).getTime() < checkdate);
        uncheckedinventory=uncheckedinventory.filter(item => item.status=='完成');
        const uncheckedinventorytotalpcs = uncheckedinventory.reduce((sum, item) => sum + Number(item.pcs), 0);
        //add confirmation dialog to delete the unchecked inventory
        if (confirm('确定删除'+uncheckedinventorytotalpcs+'件未盘点库存吗？')) {
            const uncheckedinventoryids = uncheckedinventory.map(item => item.id);
            
            // const uncheckedinventoryids=['718','719'];
            console.log(uncheckedinventory);
            // const deleteinventory = new FormData();
            // deleteinventory.append('ids', uncheckedinventoryids.join(','));

            // fetch(serverdomain+'deleteinventorybatch', {
            //     method: 'POST',
            //     body: deleteinventory,
            // }).then(response => response.json())
            // .then(data => {
            //     if (data.msg === '删除成功') {
            //         createinventoryoperationdiv();
            //     }
            // });
            
        }
    });

    deletenoncompletedbutton.addEventListener('click', async function() {
        if(!adminauthorization()){
            return;
        }
        
        //add confirmation dialog to delete the unchecked inventory
        if (confirm('确定删除件盘点日期前未入库的库存吗？')) {


            var searchallinventory = new FormData();
            if(access==3){
                searchallinventory.append("warehouse", currentwarehouse);
            }else{
                const selectedwarehouse=document.getElementById('searchbox').querySelector('select').value;
                if(!selectedwarehouse){
                    alert('此操作只能操作于选择的仓库，请选择仓库！');
                    return;
                }
                searchallinventory.append('warehouse', selectedwarehouse);
            }
            
            const response = await fetch(serverdomain+'searchinventory', {
                method: 'POST',
                body: searchallinventory,
            });
            const data = await response.json();
            
            const searchedinventoryall = data['data'];

            const checkdate = new Date(checkdateinput.value).getTime();
            var noncompletedinventory = searchedinventoryall.filter(item => new Date(item.date).getTime() < checkdate);
            noncompletedinventory=noncompletedinventory.filter(item => item.status=='预报');
            
            const noncompletedinventoryids = noncompletedinventory.map(item => item.id);
            
            console.log(noncompletedinventoryids);
            const deleteinventory = new FormData();
            deleteinventory.append('ids', noncompletedinventoryids.join(','));

            fetch(serverdomain+'deleteinventorybatch', {
                method: 'POST',
                body: deleteinventory,
            }).then(response => response.json())
            .then(data => {
                if (data.msg === '删除成功') {
                    createinventoryoperationdiv();
                }
            });
            
        }
    });

    deleteextrabutton.addEventListener('click', async function() {
        if(!adminauthorization()){
            return;
        }
        if(access!=3){
            const selectedwarehouse=document.getElementById('searchbox').querySelector('select').value;
            if(!selectedwarehouse){
                alert('此操作只能操作于选择的仓库，请选择仓库！');
                return;
            }
        }

        const completedinventory = searchedinventory.filter(item => item.status=='完成');
        const searchedinvenotryids = completedinventory.map(item => item.inventoryid);
        var searchcreteriain = new FormData();
        searchcreteriain.append('inventoryids', searchedinvenotryids.join(','));
        searchcreteriain.append('activity', '入库');
        searchcreteriain.append('status', '完成');
        const response = await fetch(serverdomain+'searchitems', {
            method: 'POST',
            body: searchcreteriain,
        });
        const data = await response.json();
        const inwardinventory = data['data'];
        var searchcreteriaout = new FormData();
        searchcreteriaout.append('inventoryids', searchedinvenotryids.join(','));
        searchcreteriaout.append('activity', '出库');
        searchcreteriaout.append('status', '完成');
        const responseout = await fetch(serverdomain+'searchitems', {
            method: 'POST',
            body: searchcreteriaout,
        });
        const dataout = await responseout.json();
        const outwardinventory = dataout['data'];

        // Create a map to store total pieces for each inventory ID from inward inventory
        const inwardMap = new Map();
        inwardinventory.forEach(item => {
            if (!inwardMap.has(item.inventoryid)) {
                inwardMap.set(item.inventoryid, 0);
            }
            inwardMap.set(item.inventoryid, inwardMap.get(item.inventoryid) + Number(item.pcs));
        });

        // Subtract pieces from the corresponding inventory ID in the map for outward inventory
        outwardinventory.forEach(item => {
            if (inwardMap.has(item.inventoryid)) {
                inwardMap.set(item.inventoryid, inwardMap.get(item.inventoryid) - Number(item.pcs));
            }
        });

        const unbalancedInventory=completedinventory.filter(item => {
            if(inwardMap.has(item.inventoryid)){
                if(inwardMap.get(item.inventoryid)!=item.pcs){
                    item.pcsdiff=inwardMap.get(item.inventoryid);
                    return true;
                }
            }
        });

        console.log(unbalancedInventory);

        // // Filter inventory IDs where the total pieces are zero
        // const balancedInventoryIds = Array.from(inwardMap.entries())
        //     .filter(([inventoryid, pcs]) => pcs === 0)
        //     .map(([inventoryid, pcs]) => inventoryid);

        // console.log('Balanced Inventory IDs:', balancedInventoryIds);

        // var deleteinventory = new FormData();
        // deleteinventory.append('inventoryids', balancedInventoryIds.join(','));
        // fetch(serverdomain+'deleteinventorybatch', {
        //     method: 'POST',
        //     body: deleteinventory,
        // }).then(response => response.json())
        // .then(data => {
        //     sysresponse.innerHTML = data.msg;
        // });
        
        
    });

    function createlastcheckcontent(lastcheckinventory){
        lastcheckdivcustomer.innerHTML = '';
        lastcheckdiv.innerHTML = '';
        const lastchecktotalpcs = lastcheckinventory.reduce((sum, item) => sum + Number(item.pcs), 0);
        //group the lastcheckinventory by customer
        const lastcheckbycusotmertitle = document.createElement('div');
        lastcheckbycusotmertitle.style.fontSize = '18px';
        lastcheckbycusotmertitle.innerHTML = '按照客户统计';
        lastcheckdivcustomer.appendChild(lastcheckbycusotmertitle);

        const lastcheckinventorycustomer = lastcheckinventory.reduce((acc, item) => {
            if (!acc[item.customer]) {
                acc[item.customer] = 0;
            }
            acc[item.customer] += Number(item.pcs);
            return acc;
        }, {});
        lastcheckdivcustomer.appendChild(createinfoline('总件数:', lastchecktotalpcs));
        //create a table for the lastcheckinventorycustomer
        const lastcheckinventorycustomertable = createsubtable(["客户", "件数"],lastcheckinventorycustomer);
        lastcheckinventorycustomertable.style.width = '100%';
        lastcheckdivcustomer.appendChild(lastcheckinventorycustomertable);
        
        //group the lastcheckinventory by label
        const lastcheckbylabeltitle = document.createElement('div');
        lastcheckbylabeltitle.style.fontSize = '18px';
        lastcheckbylabeltitle.innerHTML = '按照仓点统计';
        lastcheckdiv.appendChild(lastcheckbylabeltitle);
        const lastcheckinventorygroup = lastcheckinventory.reduce((acc, item) => {
            if (!acc[item.label]) {
                acc[item.label] = 0;
            }
            acc[item.label] += Number(item.pcs);
            return acc;
        }, {});
        lastcheckdiv.appendChild(createinfoline('总件数:', lastchecktotalpcs));
        //create a table for the lastcheckinventorygroup
        const lastcheckinventorytable = createsubtable(["仓点", "件数"],lastcheckinventorygroup);
        lastcheckinventorytable.style.width = '100%';
        lastcheckdiv.appendChild(lastcheckinventorytable);
    }
    
    function createinfoline(label, value) {
        const infoline = document.createElement('div');
        infoline.style.display = 'flex';
        infoline.style.flexDirection = 'row';
        infoline.style.fontSize = '16px';
        infoline.style.justifyContent = 'center';
        infoline.style.margin = '0px 0px 0px 0px';
        const infolabel = document.createElement('div');
        infolabel.innerHTML = label;
        const infovalue = document.createElement('div');
        infovalue.innerHTML = value;
        infoline.appendChild(infolabel);
        infoline.appendChild(infovalue);
        return infoline;
    }
    function createsubtable(headers,tabledata){

        var table = document.createElement("table");
        table.className = "inventory-table";
    
        // Create table header
        var thead = document.createElement("thead");
        thead.className = "inventory-table-header";
        var headerRow = document.createElement("tr");
        // var headers = ["客户", "箱号/单号", "箱唛","仓点", "件数", "托数"];
        headers.forEach(function(headerText, index) {
            var th = document.createElement("th");
            th.textContent = headerText;
            // th.addEventListener("click", function() {
            //     sortTable(index);
            // });
    
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        // Create table body
        var tbody = document.createElement("tbody");
        tbody.id = "inventory-table-body";
        tbody.className = "inventory-table-body";

        for (const label in tabledata) {
            const tr = document.createElement('tr');
            tr.className = "inventory-table-row";
            const td1 = document.createElement('td');
            td1.innerHTML = label;
            const td2 = document.createElement('td');
            td2.innerHTML = tabledata[label];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        }

       
        table.appendChild(tbody);
        return table;
    }

    function formatDate(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        var day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

}
function autoarrangeout(){
    const appointmentwindow = window.open('', '', 'height=1200px,width=1600px');
    var timestamp = new Date().getTime(); // Get current timestamp
    appointmentwindow.document.write('<html><head>');
    appointmentwindow.document.write('<link href="autoarrange.css?v=' + timestamp + '" rel="stylesheet" type="text/css">'); // Append timestamp
    appointmentwindow.document.write('</head><body>');
    appointmentwindow.document.write('</body></html>');

    const body=appointmentwindow.document.body;

    const searchbox = document.createElement('div');
    searchbox.className = 'searchbox';
    body.appendChild(searchbox);

    const searchform=document.createElement('form');
    searchbox.appendChild(searchform);

    const arrangebuttonslot = document.createElement('div');
    arrangebuttonslot.className = 'arrangebuttonslot';
    searchbox.appendChild(arrangebuttonslot);    

    const warehouseselectiondiv = createwarehouseselectiondiv();

    if(access==3){
        warehouseselectiondiv.querySelector('select').value = currentwarehouse;
        warehouseselectiondiv.querySelector('select').disabled = true;
        const hidewarehouse = document.createElement('input');
        hidewarehouse.type = 'hidden';
        hidewarehouse.name = 'warehouse';
        hidewarehouse.value = currentwarehouse;
        searchform.appendChild(hidewarehouse);
    }

    searchform.appendChild(warehouseselectiondiv);
    

    const labelinput = document.createElement('input');
    labelinput.type = 'text';
    labelinput.name = 'label';
    labelinput.placeholder = '仓点';
    labelinput.style.width = '100px';
    labelinput.style.fontSize = '14px';
    labelinput.style.margin = '0px 0px 0px 0px';
    const labelinputlabel = document.createElement('label');
    labelinputlabel.htmlFor = 'label';
    labelinputlabel.innerHTML = '仓点';
    labelinputlabel.style.fontSize = '16px';
    searchform.appendChild(labelinputlabel);
    searchform.appendChild(labelinput);

    const dateinput = document.createElement('input');
    dateinput.type = 'datetime-local';
    dateinput.name = 'date';
    dateinput.style.width = '150px';
    dateinput.style.fontSize = '16px';
    dateinput.style.margin = '0px 0px 0px 0px';
    const dateinputlabel = document.createElement('label');
    dateinputlabel.htmlFor = 'date';
    dateinputlabel.innerHTML = '预约日期';
    dateinputlabel.style.fontSize = '16px';
    searchform.appendChild(dateinputlabel);
    searchform.appendChild(dateinput);

    const plttypeinput = createplttypeselectiondiv();
    plttypeinput.style.display = 'inline-flex';
    searchform.appendChild(plttypeinput);

    const batchnumberinput = document.createElement('input');
    batchnumberinput.type = 'text';
    batchnumberinput.name = 'batchnumber';
    batchnumberinput.value = '1';
    batchnumberinput.placeholder = '批次号';
    batchnumberinput.style.width = '40px';
    batchnumberinput.style.fontSize = '14px';
    batchnumberinput.style.margin = '0px 0px 0px 0px';
    const batchnumberinputlabel = document.createElement('label');
    batchnumberinputlabel.htmlFor = 'batchnumber';
    batchnumberinputlabel.innerHTML = '批次号';
    batchnumberinputlabel.style.fontSize = '16px';
    searchform.appendChild(batchnumberinputlabel);
    searchform.appendChild(batchnumberinput);


    const searchbutton = document.createElement('button');
    searchbutton.type = 'submit';
    searchbutton.className = 'button';
    searchbutton.innerHTML = '查询';
    searchbutton.style.fontSize = '14px';
    searchbutton.style.padding = '5px 5px';
    searchform.appendChild(searchbutton);

    const searchresultdiv = document.createElement('div');
    searchresultdiv.id = 'searchresult';
    body.appendChild(searchresultdiv);

    searchform.addEventListener('submit', async function(event) {
        event.preventDefault();
        searchresultdiv.innerHTML = '';
        arrangebuttonslot.innerHTML = '';

        const searchcreteria = new FormData(searchform);
        console.log(searchcreteria.get('label'));

        searchcreteria.delete('date');

        const response = await fetch(serverdomain+'searchinventory', {
            method: 'POST',
            body: searchcreteria,
        });
        const data = await response.json();
        const searhresult = data['data'];

        const inventorycandidates = searhresult.filter(item => {
            const today = new Date().toISOString().split('T')[0];
            if(item.status=='预报' && new Date(item.date).getTime() < new Date(today).getTime()){
                return false;
            }
            if(dateinput.value){
                if(new Date(item.date).getTime() > new Date(dateinput.value).getTime()){
                    return false;
                }
            }
            return true;
        });
        inventorycandidates.sort((a, b) => {
            const priorityComparison = b.priority - a.priority;
            if (priorityComparison !== 0) {
                return priorityComparison;
            }
            return a.date.localeCompare(b.date);
        });

        var selecteditems = [];
        const batchnumber = Number(batchnumberinput.value);
        let volumnsum = -60*(batchnumber-1);
        let volumnsum2 = -60*(batchnumber-1);
        let pltsum = -33*(batchnumber-1);
        let pltsum2 = -33*(batchnumber-1);
        inventorycandidates.forEach(item => {
            volumnsum += Number(item.cbm)*Number(item.pcs);
            pltsum += item.plt?Number(item.plt):0;
            if((volumnsum>=0 || pltsum>=0) && (volumnsum2<60 && pltsum2<33)){
                selecteditems.push(item);
                item['selected']=true;
            }else{
                item['selected']=false;
            }
            volumnsum2 += Number(item.cbm)*Number(item.pcs);
            pltsum2 += item.plt?Number(item.plt):0;
        });

        const inventorytable = createcandidatetable(inventorycandidates,selecteditems);
        searchresultdiv.appendChild(inventorytable);

        createarrangebutton(inventorycandidates);

    });

    function createarrangebutton(items){
        const arrangebutton = document.createElement('button');
        arrangebutton.type = 'button';
        arrangebutton.className = 'button';
        arrangebutton.innerHTML = '生成预约';
        arrangebutton.style.margin = '20px 0px 0px 0px';
        arrangebutton.style.fontSize = '16px';
        arrangebutton.style.width = '200px';
        arrangebutton.style.padding = '5px 5px';
        arrangebuttonslot.appendChild(arrangebutton);

        arrangebutton.addEventListener('click', async function() {
            

            const selecteditems = items.filter(item => item['selected']);

            var clickeditem = {  "joblabel":labelinput.value,
                "customer":'',
                "date":dateinput.value?dateinput.value: Date.now(),
                "activity":"出库",
                "status":"预报",
                "deladdress":"",
                "ordernote":"",
                "orderid":"",
                "reference":"",
                
            };
            loaddetail(clickeditem,"出库",undefined,true);

            for(const item of selecteditems){
                createdetailline(1,item,'出库',true);
            }

            appointmentwindow.close();
        });
    }

    function createcandidatetable(data,selecteditems){
        var table = document.createElement("table");
        table.className = "inventory-table";

        // Create table header
        var thead = document.createElement("thead");
        thead.className = "inventory-table-header";
        var headerRow = document.createElement("tr");
        var headers = ["客户", "箱号/单号", "箱唛","仓点", "件数", "托数","体积","优先级","创建日期","仓库"];
        if(access==3){
            headers = ["客户", "箱号/单号", "箱唛","仓点", "件数", "托数","体积","优先级","创建日期"];
        }
        headers.forEach(function(headerText, index) {
            var th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        var tbody = document.createElement("tbody");
        tbody.id = "inventory-table-body";
        tbody.className = "inventory-table-body";
        data.forEach(function(item) {
            var row = document.createElement("tr");
            row.className = "inventory-table-row";
            if(item.status!="完成"){
                row.style.color = "grey";
            }
            if(item['selected']){
                row.style.backgroundColor = 'rgb(73 162 233)';
            }
            const priorityshow = item.priority==-6?'拦截':item.priority;
            var columns = [item.customer,item.container,item.marks,item.label, item.pcs, item.plt,item.cbm,priorityshow, item.date,item.warehouse];
            if(access==3){
                columns = [item.customer,item.container,item.marks,item.label, item.pcs, item.plt,item.cbm,priorityshow, item.date];
            }
            columns.forEach(function(columnText) {
                var td = document.createElement("td");
                td.textContent = columnText;
                row.appendChild(td);
            });
            tbody.appendChild(row);

            row.addEventListener("click", function() {
                if(item['selected']){
                    item['selected']=false;
                    this.style.backgroundColor = '';
                    const index = selecteditems.findIndex(selectedItem => selectedItem.id === item.id);
                    if (index !== -1) {
                        selecteditems.splice(index, 1);
                    }
                }else{
                    this.style.backgroundColor = 'rgb(73 162 233)';
                    selecteditems.push(item);
                    item['selected']=true;
                }

            });
        });
        table.appendChild(tbody);
        return table;
    }
}
function createTooltip(message){
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

    return tooltipContainer;
}
async function showinvoicewindow(clickeditem,items){
    const invoicewindow = window.open('', '', 'height=1200px,width=1200px');
    var timestamp = new Date().getTime(); // Get current timestamp
    invoicewindow.document.write('<html><head>');
    invoicewindow.document.write('<link href="invoice.css?v=' + timestamp + '" rel="stylesheet" type="text/css">'); // Append timestamp
    invoicewindow.document.write('</head><body>');
    invoicewindow.document.write('</body></html>');

    const body=invoicewindow.document.body;

    //create a datalists
    const datalist1 = document.createElement('datalist');
    datalist1.id = 'dischargefeelist';
    const dischargefees = ['卸货费','卸货费2','卸货费3'];
    dischargefees.forEach(fee => {
        const option = document.createElement('option');
        option.value = fee;
        option.innerHTML = fee;
        datalist1.appendChild(option);
    });
    body.appendChild(datalist1);

    //loaddate
    var searchcreteria = new FormData();
    searchcreteria.append('jobid', clickeditem['jobid']);
    const response = await fetch(serverdomain+'searchinvoiceitem', {
        method: 'POST',
        body: searchcreteria,
    });
    const data = await response.json();
    const invoiceitems = data['data']?data['data']:[];

    const buttonsdiv = document.createElement('div');
    buttonsdiv.className = 'buttonsdiv';
    
    body.appendChild(buttonsdiv);
    
    const submitbutton = document.createElement('button');
    submitbutton.type = 'button';
    submitbutton.className = 'button';
    submitbutton.innerHTML = '提交';
    submitbutton.style.fontSize = '16px';
    submitbutton.style.padding = '5px 5px';
    buttonsdiv.appendChild(submitbutton);

    // const templateselectiondiv = createcoolselect('quotetemplate','账单模板',['','佳成-单项目收费报价', '佳成-一口价方案有效期2024年8月1日至2025年3月31日', '账单模板3']);
    // buttonsdiv.appendChild(templateselectiondiv);

    const quotetemplate=clickeditem['quotetemplate']?clickeditem['quotetemplate']:'';
    const templateselectiondiv = createquotetemplateselectiondiv(Object.keys(getcustomerinvoicetempletelist(clickeditem['customer'])),quotetemplate);
    templateselectiondiv.style.margin = '0px 0px 0px 50px';
    buttonsdiv.appendChild(templateselectiondiv);
    body.appendChild(document.createElement('hr'));

    

    const mainboady = document.createElement('div');
    mainboady.className = 'mainbody';
    body.appendChild(mainboady);

    const jobdetaildiv = document.createElement('div');
    jobdetaildiv.className = 'jobdetail';
    mainboady.appendChild(jobdetaildiv);

    mainboady.appendChild(document.createElement('hr'));

    const invoicedetaildiv = document.createElement('div');
    invoicedetaildiv.className = 'invoicedetail';
    mainboady.appendChild(invoicedetaildiv);

    //create jobdetail
    jobdetaildiv.innerHTML = '';
    var tempElement = document.createElement('div');
    tempElement.style.fontFamily = 'Arial, sans-serif';
    var temph1 = document.createElement('h2');
    temph1.innerHTML = clickeditem['customer'];
    tempElement.appendChild(temph1);
    var temph1 = document.createElement('h2');
    temph1.innerHTML = clickeditem['reference']?clickeditem['joblabel']+ ' ' + clickeditem['reference']:clickeditem['joblabel'];
    tempElement.appendChild(temph1);
    var hr = document.createElement('hr');
    tempElement.appendChild(hr);
    var p = document.createElement('p');
    p.innerHTML = clickeditem['date'];
    tempElement.appendChild(p);
    var p = document.createElement('p');
    p.innerHTML = clickeditem['overview'];
    tempElement.appendChild(p);
    var p = document.createElement('p');
    p.innerHTML = clickeditem['ordernote'];
    tempElement.appendChild(p);
    jobdetaildiv.appendChild(tempElement);

    //create invoicedetail
    invoicedetaildiv.innerHTML = '';
    const templatelist = getcustomerinvoicetempletelist(clickeditem['customer']);
    if(templatelist[quotetemplate]=='unitprice'){
        invoicedetaildiv.appendChild(createunitpricetemplate(clickeditem,invoiceitems));
    }
    if(templatelist[quotetemplate]=='lumpsumprice'){
        invoicedetaildiv.appendChild(createlumpsumtemplate(clickeditem,invoiceitems));
    }
    function createunitpricetemplate(clickeditem,invoiceitems){
        const invoiceform = document.createElement('div');
        invoiceform.className = 'invoiceform';
        const invoiceblock1 = createitemblock('卸货费');
        invoiceblock1.id = '卸货费';
        invoiceform.appendChild(invoiceblock1);
        const invoiceline1 = createinvoiceline(clickeditem,undefined,'卸货费','dischargefeelist');
        invoiceblock1.querySelector('.blockcontent').appendChild(invoiceline1);

        const invoiceblock2 = createitemblock('分拣费');
        invoiceblock2.id = '分拣费';
        invoiceform.appendChild(invoiceblock2);
        const invoiceline2 = createinvoiceline(clickeditem,undefined,'分拣费','dischargefeelist');
        invoiceblock2.querySelector('.blockcontent').appendChild(invoiceline2);

        const invoiceblock3 = createitemblock('装货费');
        invoiceblock3.id = '装货费';
        invoiceform.appendChild(invoiceblock3);
        const invoiceline3 = createinvoiceline(clickeditem,undefined,'装货费','dischargefeelist');
        invoiceblock3.querySelector('.blockcontent').appendChild(invoiceline3);

        const invoiceblock4 = createitemblock('打托费');
        invoiceblock4.id = '打托费';
        invoiceform.appendChild(invoiceblock4);
        const invoiceline4 = createinvoiceline(clickeditem,undefined,'打托费','dischargefeelist');
        invoiceblock4.querySelector('.blockcontent').appendChild(invoiceline4);

        const invoiceblock5 = createitemblock('贴标费');
        invoiceblock5.id = '贴标费';
        invoiceform.appendChild(invoiceblock5);
        const invoiceline5 = createinvoiceline(clickeditem,undefined,'贴标费','dischargefeelist');
        invoiceblock5.querySelector('.blockcontent').appendChild(invoiceline5);

        const invoiceblock6 = createitemblock('仓储费');
        invoiceblock6.id = '仓储费';
        invoiceform.appendChild(invoiceblock6);
        const invoiceline6 = createinvoiceline(clickeditem,undefined,'仓储费','dischargefeelist');
        invoiceblock6.querySelector('.blockcontent').appendChild(invoiceline6);

        const invoiceblock7 = createitemblock('其他费用');
        invoiceblock7.id = '其他费用';
        invoiceform.appendChild(invoiceblock7);
        const invoiceline7 = createinvoiceline(clickeditem,undefined,'其他费用','dischargefeelist');
        invoiceblock7.querySelector('.blockcontent').appendChild(invoiceline7);

        invoiceitems.forEach(item => {
            const blockselected = document.getElementById(item['chargecat']);
            const invoiceline = createinvoiceline(clickeditem,item,item['chargecat'],'dischargefeelist');
            blockselected.inertBefore(invoiceline, blockselected.firstChild);
        });

        return invoiceform;
    }

    function createlumpsumtemplate(clickeditem,invoiceitems){}
    




    function createinvoicedetail(invoicecontent){
        invoiceform.innerHTML = '';
        for (const key in invoicecontent) {
            
        }
    }



    function createinvoiceline(jobinfo,item,name1,namedatalist){
        const invoiceline = document.createElement('div');
        invoiceline.className = 'invoiceline';

        if(!item){
            const addnewinput = document.createElement('div');
            addnewinput.className = 'addnewinput';
            const itemnameinput = document.createElement('input');
            itemnameinput.type = 'text';
            itemnameinput.placeholder = '条目名称';
            itemnameinput.setAttribute('list', namedatalist);

            const addnewbutton = document.createElement('button');
            addnewbutton.type = 'submit';
            addnewbutton.innerHTML = '+';
            addnewinput.appendChild(itemnameinput);
            addnewinput.appendChild(addnewbutton);
            invoiceline.appendChild(addnewinput);

            addnewbutton.addEventListener('click', function() {
                const newinvoiceline = createinvoiceline(jobinfo,{chargeitem:itemnameinput.value},name1,namedatalist);
                invoiceline.parentElement.insertBefore(newinvoiceline, invoiceline);
                itemnameinput.value = '';
            });
            return invoiceline;
        }

        const invoicelineform = document.createElement('form');
        invoicelineform.className = 'invoicelineform';

        invoiceline.appendChild(invoicelineform);
        
        const itemname2input = document.createElement('input');
        itemname2input.className = 'inputbox';
        itemname2input.style.width = '200px';
        itemname2input.type = 'text';
        itemname2input.name = 'chargeitem';
        itemname2input.value = item['chargeitem'];
        itemname2input.placeholder = '条目名称';
        itemname2input.setAttribute('list', namedatalist);

        invoicelineform.appendChild(itemname2input);

        const itemquantityinput = document.createElement('input');
        itemquantityinput.className = 'inputbox';
        itemquantityinput.type = 'text';
        itemquantityinput.name = 'qty';
        itemquantityinput.value = item['qty']?item['qty']:'';
        itemquantityinput.placeholder = '数量';
        invoicelineform.appendChild(itemquantityinput);

        const deletelinebutton = document.createElement('button');
        deletelinebutton.type = 'button';
        deletelinebutton.innerHTML = '-';
        deletelinebutton.style.margin = '0px 0px 0px 10px';
        invoicelineform.appendChild(deletelinebutton);

        
        invoicelineform.appendChild(createhiddeninput('chargecat',name1));
        invoicelineform.appendChild(createhiddeninput('status',"新添加"));
        invoicelineform.appendChild(createhiddeninput('jobid',jobinfo['jobid']));
        invoicelineform.appendChild(createhiddeninput('date',new Date().toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16)));
        invoicelineform.appendChild(createhiddeninput('invoicedate',jobinfo['date']));
        invoicelineform.appendChild(createhiddeninput('customer',jobinfo['customer']));
        invoicelineform.appendChild(createhiddeninput('quotetmp',jobinfo['quotetemplate']));
        // invoiceline.appendChild(createhiddeninput('invoiceid',jobinfo['invoiceid']));

        deletelinebutton.addEventListener('click', function() {
            invoiceline.remove();
        });

        invoicelineform.addEventListener('submit', async function(event) {
            event.preventDefault();
        });



        return invoiceline;
    }

}
function addnewvaswindow(clickeditem,callback){
    var vaswindow = window.open('', '', 'height=1200px,width=800px');
    var timestamp = new Date().getTime(); // Get current timestamp
    vaswindow.document.write('<html><head>');
    vaswindow.document.write('<link href="vaswindow.css?v=' + timestamp + '" rel="stylesheet" type="text/css">'); // Append timestamp
    vaswindow.document.write('</head><body>');
    vaswindow.document.write('</body></html>');
    var datalist2=document.createElement("datalist");
    datalist2.id="services";
    const services = ['贴标', '打托'];
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        datalist2.appendChild(option);
    });
    vaswindow.document.body.appendChild(datalist2);

    vaswindow.document.body.appendChild(vasdetailform(clickeditem,function(data){
        vaswindow.alert(data.responsemsg);
        vaswindow.close();
    }));
}
async function showdockappointments(currentjob,page){
    var searchcreteria = new FormData();
    searchcreteria.append('date', new Date()+' 23:59:59');
    if(currentjob){
        searchcreteria.append('warehouse', currentjob['warehouse']);
    }else{
        if(currentwarehouse){
            searchcreteria.append('warehouse', currentwarehouse);
        }else{
            alert('请先选择仓库');
            return;
        }
    }

    const appointmentwindow = window.open('appointment.html', '');
    appointmentwindow.onload = function() {
        const datepicker = appointmentwindow.document.getElementById('date-picker');
        datepicker.valueAsDate = new Date();

        const loadingstatus = appointmentwindow.document.getElementById('loadingstatus');
        datepicker.onchange = async function() {
            loadingstatus.innerHTML = '加载中...';
            // var searchcreteria = new FormData();
            // searchcreteria.append('date', datepicker.value+' 23:59:59');
            // if(currentjob){
            //     searchcreteria.append('warehouse', currentjob['warehouse']);
            // }else{
            //     if(currentwarehouse){
            //         searchcreteria.append('warehouse', currentwarehouse);
            //     }else{
            //         alert('请先选择仓库');
            //         return;
            //     }
            // }
            searchcreteria.set('date', datepicker.value+' 23:59:59');
            const response = await fetch(serverdomain+'searchjobsonly', {
                method: 'POST',
                body: searchcreteria,
            });
            const data = await response.json();
            const appointments = data['data'];
            generatetablebody(appointments);
            loadingstatus.innerHTML = '加载完成';

        };

        datepicker.onchange();

        const slots = [
            { label: 'Shift 1', start: '08:00', end: '11:00' },
            { label: 'Shift 1', start: '11:00', end: '13:00' },
            { label: 'Break', start: '', end: '', break: true },
            { label: 'Shift 2', start: '13:00', end: '15:00' },
            { label: 'Shift 2', start: '15:00', end: '17:00' }
        ];

        // const appointments = searchedjobs;

        const tableBody = appointmentwindow.document.getElementById('schedule-body');
        let selectedCell = null;
        let selectedTime = null;
        let selectedDock = null;

        function isWithinSlot(appointmentTime, slotStart, slotEnd) {
            const timePart = appointmentTime.split(' ')[1];
            const [appHour, appMin] = timePart.split(':').map(Number);
            const [startHour, startMin] = slotStart.split(':').map(Number);
            const [endHour, endMin] = slotEnd.split(':').map(Number);

            const appTime = appHour * 60 + appMin;
            const startTime = startHour * 60 + startMin;
            const endTime = endHour * 60 + endMin;

            return appTime >= startTime && appTime < endTime;
        }

        function generatetablebody(appointments) {
            tableBody.innerHTML = '';
            slots.forEach((slot, rowIndex) => {
                const row = document.createElement('tr');
    
                const slotCell = document.createElement('td');
                slotCell.textContent = `${slot.label} ${slot.start}-${slot.end}`;
                row.appendChild(slotCell);
    
                for (let dock = 1; dock <= 4; dock++) {
                    const cell = document.createElement('td');
                    var appointment = [];
                    if(appointments){
                        appointment = appointments.filter(app => app.dock == dock && isWithinSlot(app.date, slot.start, slot.end));
                    }
                    if (slot.break) {
                    cell.classList.add('break');
                    } else if (appointment.length > 0) {
                        appointment.forEach(app => {
                            if(currentjob && app['id'] == currentjob['id']){
                                // cell.classList.add('selected');
                                // selectedCell = cell;
                                // selectedDock = appointment['dock'];
                                // generateTimeSelector(cell, slot.start, slot.end, dock);
                                const occupied=generateTimeSelectordiv(slot.start, slot.end, dock);
                                cell.appendChild(occupied);
                                occupied.onclick();
                                // cell.onclick = () => generateTimeSelector(cell, slot.start, slot.end, dock);
                                // cell.onclick();
                            }else{
                                // cell.classList.add('unavailable');
                                const appdiv = generateappointmentdiv(app);
                                cell.appendChild(appdiv);
                                if(page=='showdockappointments'){
                                    appdiv.onclick = function(){
                                        appointmentwindow.close();
                                        const searchcreteria = new FormData();
                                        searchcreteria.append('id', app['id']);
                                        fetch(serverdomain+'searchjob', {
                                            method: 'POST',
                                            body: searchcreteria,
                                        }).then(response => response.json()).then(data => {
                                            const appointment = data['data'][0];

                                            loaddetail(app,app.activity,undefined,false);
                                        });

                                        
                                    }
                                }
                                // cell.style.backgroundColor = getcolor(appointment);
                                // cell.innerHTML = `${appointment.customer}  ${appointment.joblabel}`;
                            }
                        });
                        cell.appendChild(generateTimeSelectordiv(slot.start, slot.end, dock));
                    } else {
                        cell.appendChild(generateTimeSelectordiv(slot.start, slot.end, dock));
                    // cell.onclick = () => generateTimeSelector(cell, slot.start, slot.end, dock);
                    }
    
                    row.appendChild(cell);
                }
                tableBody.appendChild(row);
            });
        }

        function generateappointmentdiv(appointment){
            const appointmentdiv = document.createElement('div');
            appointmentdiv.className = 'appointmentdiv';
            appointmentdiv.style.backgroundColor = getcolor(appointment);
            appointmentdiv.innerHTML = `${appointment.customer}  ${appointment.joblabel}`;

            const dateTime = appointment.date.split(' ');
            const time = dateTime[1].split(':');
            const formattedTime = `${time[0]}:${time[1]}`;
            const timediv = document.createElement('div');
            timediv.innerHTML = formattedTime;
            timediv.style.position = 'absolute';
            timediv.style.right = '5px';
            appointmentdiv.appendChild(timediv);
            return appointmentdiv;
        }


        function generateTimeSelectordiv(start, end, dock){
            const selectdiv = document.createElement('div');
            if(page=='showdockappointments'){
                return selectdiv;
            }
            selectdiv.className = 'timeselectordiv';
            selectdiv.innerHTML = '+';
            selectdiv.onclick = function(event){
                generateTimeSelector(selectdiv, start, end, dock);
            }
            // selectdiv.addEventListener('click',clickhandler);
            return selectdiv;
        }

        function generateTimeSelector(cell, start, end, dock) {
            if (selectedCell && selectedCell !== cell) {
                selectedCell.innerHTML = "+"; // Clear previous selector
                selectedCell.classList.remove('selected');
            }
            selectedCell = cell;
            selectedDock = dock;
            cell.innerHTML = '';
            if(cell.querySelector('select')) {
                return;
            }
            const select = document.createElement('select');
            select.className = 'time-selector';
            select.value = start;
            select.onchange = (e) => selectedTime = e.target.value;
            select.onclick = (e) => e.stopPropagation();
            let [startHour, startMin] = start.split(':').map(Number);
            let [endHour, endMin] = end.split(':').map(Number);
            let currentTime = startHour * 60 + startMin;
            const endTime = endHour * 60 + endMin;

            while (currentTime <= endTime) {
                const hour = String(Math.floor(currentTime / 60)).padStart(2, '0');
                const minute = String(currentTime % 60).padStart(2, '0');
                const time = `${hour}:${minute}`;
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                select.appendChild(option);
                currentTime += 30; // Increment by 30 minutes
            }

            cell.appendChild(select);
            cell.classList.add('selected');
        }

        // slots.forEach((slot, rowIndex) => {
        //     const row = document.createElement('tr');

        //     const slotCell = document.createElement('td');
        //     slotCell.textContent = `${slot.label} ${slot.start}-${slot.end}`;
        //     row.appendChild(slotCell);

        //     for (let dock = 1; dock <= 4; dock++) {
        //         const cell = document.createElement('td');
        //         const appointment = appointments.find(app => app.dock == dock && isWithinSlot(app.date, slot.start, slot.end));

        //         if (slot.break) {
        //         cell.classList.add('break');
        //         } else if (appointment) {
        //         cell.classList.add('unavailable');
        //         cell.style.backgroundColor = getcolor(appointment);
        //         cell.innerHTML = `${appointment.label}`;
        //         } else {
        //         cell.onclick = () => generateTimeSelector(cell, slot.start, slot.end, dock);
        //         }

        //         row.appendChild(cell);
        //     }
        //     tableBody.appendChild(row);
        // });

        if(page!='showdockappointments'){
            appointmentwindow.document.getElementById('submit-btn').onclick = () => {
                const date = appointmentwindow.document.getElementById('date-picker').value;
                const selectedTime = appointmentwindow.document.querySelector('select')?.value;
                
                if (date && selectedCell && selectedTime) {
                    document.getElementById('inputdate').value = ""+date+" "+selectedTime+":00";
                    document.getElementById('detailform').querySelector('input[name="dock"]').value = selectedDock;
                    document.getElementById('showdockinfo').innerHTML = `已预约垛口: ${selectedDock}`;
                    appointmentwindow.close();
                } else {
                    alert('Please select a date, slot, and time first!');
                }
            };
            appointmentwindow.document.getElementById('cancel-btn').onclick = () => {
                
                document.getElementById('detailform').querySelector('input[name="dock"]').value = 'cancel';
                document.getElementById('showdockinfo').innerHTML = ``;
                appointmentwindow.close();
            };
        }

        function getcolor(job){
            if(job['bulkstatus'] == '托盘' && job ['activity']== '入库'){
                return '#F4E651';
            }
            if(job['bulkstatus'] == '托盘' && job['activity'] == '出库'){
                return '#A8EAE4';
            }
            if(job['bulkstatus'] == '散货' && job['activity'] == '入库'){
                return '#F4B7BE';
            }
            if(job['bulkstatus'] == '散货' && job['activity'] == '出库'){
                return '#99DDFF';
            }
            return 'gray';
        }
    };
}
function showinventorymap(warehouseinventory,activity,currentinventory,callback){
    
    // var mapwindow = window.open('', '', 'height=1200px,width=1200px');
    // var timestamp = new Date().getTime(); // Get current timestamp
    // mapwindow.document.write('<html><head>');
    // mapwindow.document.write('<link href="inventorymap.css?v=' + timestamp + '" rel="stylesheet" type="text/css">'); // Append timestamp
    // mapwindow.document.write('</head><body>');
    // mapwindow.document.write('</body></html>');

    // const form = document.createElement('form');
    // form.style.display='block';
    // const submitbutton = document.createElement('button');
    // submitbutton.type = 'submit';
    // submitbutton.className = 'button';
    // submitbutton.innerHTML = '提交';
    // submitbutton.style.fontSize = '14px';
    // submitbutton.style.padding = '5px 5px';

    // form.appendChild(submitbutton);

    // const warehouseA = document.createElement('div');
    // warehouseA.className = 'warA';
    // mapwindow.document.body.appendChild(form);
    // form.appendChild(warehouseA);

    // const warAleft = document.createElement('div');
    // warAleft.className = 'warAleft';

    // const passway = document.createElement('div');
    // passway.className = 'passway';
    // passway.innerHTML = '';

    // const warAright = document.createElement('div');
    // warAright.className = 'warAright';

    
    // warehouseA.appendChild(warAleft);
    // warehouseA.appendChild(passway);
    // warehouseA.appendChild(warAright);

    // //Warehouse A left side
    // for(var i=1;i<=10;i++){
    //     var asileid=i<10?"AL0"+i:"AL"+i;
    //     const asileleft = document.createElement('div');
    //     asileleft.className = 'asileleft';
    //     warAleft.appendChild(asileleft);

    //     const asilelabel = document.createElement('div');
    //     asilelabel.className = 'asilelabel';
    //     asilelabel.innerHTML = asileid;
    //     asileleft.appendChild(asilelabel);

    //     for(var j=0;j<24;j++){
    //         var idrow="0"+(Math.floor(j/12)+1);
    //         var idcolumn=j%12+1<10?"0"+(j%12+1):j%12+1;
    //         var skuid=asileid+idrow+idcolumn;

    //         const sku = document.createElement('div');
    //         sku.className = 'sku';
    //         sku.id = "div"+skuid;
    //         const skuinput = document.createElement('input');
    //         skuinput.type = 'checkbox';
    //         skuinput.name = 'inventoryloc';
    //         skuinput.id = skuid;
    //         skuinput.className = 'skuinput';
    //         skuinput.value = skuid;
    //         skuinput.disabled = false;
    //         const skuinputlabel = document.createElement('label');
    //         skuinputlabel.htmlFor = skuid;
    //         skuinputlabel.className = 'skulabel';
    //         skuinputlabel.innerHTML = j%12+1;
    //         sku.appendChild(skuinput);
    //         sku.appendChild(skuinputlabel);
    //         asileleft.appendChild(sku);
    //     }
    // }

    // //Warehouse A right side
    // for(var i=1;i<=20;i++){
    //     var asileid=i<10?"AR0"+i:"AR"+i;
    //     const asileright = document.createElement('div');
    //     asileright.className = 'asileright';
    //     warAright.appendChild(asileright);

    //     const asilelabel = document.createElement('div');
    //     asilelabel.className = 'asilelabel';
    //     asilelabel.innerHTML = asileid;
    //     asileright.appendChild(asilelabel);

    //     for(var j=21;j>=0;j--){
    //         var idrow="0"+(2-Math.floor(j/11));
    //         var idcolumn=j%11+1<10?"0"+(j%11+1):j%11+1;
    //         var skuid=asileid+idrow+idcolumn;

    //         const sku = document.createElement('div');
    //         sku.className = 'sku';
    //         sku.id = "div"+skuid;
    //         const skuinput = document.createElement('input');
    //         skuinput.type = 'checkbox';
    //         skuinput.name = 'inventoryloc';
    //         skuinput.id = skuid;
    //         skuinput.className = 'skuinput';
    //         skuinput.value = skuid;
    //         skuinput.disabled = false;
    //         const skuinputlabel = document.createElement('label');
    //         skuinputlabel.htmlFor = skuid;
    //         skuinputlabel.className = 'skulabel';
    //         skuinputlabel.innerHTML = j%11+1;
    //         sku.appendChild(skuinput);
    //         sku.appendChild(skuinputlabel);
    //         asileright.appendChild(sku);
    //     }
    // }
    if(!currentwarehouse){
        alert('请先选择仓库');
        return;
    }
    warehouseinventory=warehouseinventory.filter(inventory => inventory['warehouse'] === currentwarehouse);

    var mapwindow = window.open(currentwarehouse+'.html', '');
    mapwindow.onload = function() {
        window.addEventListener('message', function(event) {
            if (event.data === 'maploaded') {
                warehouseinventory.forEach(inventory => {
                    if(inventory['inventoryloc'] ){
                        const locations = inventory['inventoryloc'].split(',');
                        locations.forEach(loc => {
                            const location = mapwindow.document.getElementById('div' + loc.trim());
                            if (location) {
                                location.style.backgroundColor = 'grey';
                                location.querySelector('input').disabled = true;

                                // location.classList.add('tooltip-container');
                                const tooltip = document.createElement('span');
                                tooltip.className = 'tooltip';
                                tooltip.innerHTML = inventory['customer'] + '<br>' + inventory['container'] + '<br>' + inventory['label']+ '<br>' + inventory['date']+ '<br>' + inventory['pcs'] + '件 ' + inventory['plt'] + '托';
                                location.appendChild(tooltip);
                            }
                        });
                    }
                });
                if (activity == "") {
                    const checkboxes = mapwindow.document.querySelectorAll('input[name="inventoryloc"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.disabled = true;
                    });
                    if(currentinventory){
                        currentinventory.forEach(inventory => {
                            if(inventory['inventoryloc']){
                                const locations = inventory['inventoryloc'].split(',');
                                locations.forEach(loc => {
                                    const location = mapwindow.document.getElementById('div' + loc.trim());
                                    if (location) {
                                        location.style.backgroundColor = '';
                                        location.querySelector('input').checked = true;
                                        location.querySelector('input').disabled = true;
                                    }
                                });
                            }
                        });
                    }
                }
                if(activity=="入库"){
                    currentinventory.forEach(inventory => {
                        if(inventory['inventoryloc']){
                            const locations = inventory['inventoryloc'].split(',');
                            locations.forEach(loc => {
                                const location = mapwindow.document.getElementById('div' + loc.trim());
                                if (location) {
                                    location.style.backgroundColor = '';
                                    location.querySelector('input').checked = true;
                                    location.querySelector('input').disabled = false;
                                }
                            });
                        }
                    });
                }
                if(activity=="出库"){
                    const checkboxes = mapwindow.document.querySelectorAll('input[name="inventoryloc"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.disabled = true;
                    });
                    const foundItem = warehouseinventory.find(item => item.inventoryid === currentinventory[0]['inventoryid']);
                    const currentiteminwarehouse = foundItem['inventoryloc'].split(',');
                    currentiteminwarehouse.forEach(loc => {
                        const location = mapwindow.document.getElementById('div' + loc.trim());
                        if (location) {
                            location.style.backgroundColor = '';
                            location.style.opacity = 1;
                            location.style.boxShadow = '0px 0px 6px 3px rgb(91 175 49)';
                            location.querySelector('input').disabled = false;
                        }
                    });
                    currentinventory.forEach(inventory => {
                        if(inventory['inventoryloc']){
                            const locations = inventory['inventoryloc'].split(',');
                            locations.forEach(loc => {
                                const location = mapwindow.document.getElementById('div' + loc.trim());
                                if (location) {
                                    location.style.backgroundColor = '';
                                    location.querySelector('input').checked = true;

                                    location.querySelector('input').disabled = false;
                                }
                            });
                        }
                    });
                }

            
                mapwindow.document.getElementById('mapform').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const selectedLocations = Array.from(mapwindow.document.querySelectorAll('input[name="inventoryloc"]:checked')).map(checkbox => checkbox.value);
                    const selectedLocationString = selectedLocations.join(',');
                    mapwindow.close();
                    console.log(selectedLocationString);
                    if (callback) {
                        callback(selectedLocationString);
                    }
                });
            }
        });
    };
    

    
}
function opennewjobwindow(clickeditem){
    if(!clickeditem){
        alert('请先选择一个任务');
        return;
    }

    const newjobwindow = window.open('jobdetailwindow.html', '');
    newjobwindow.onload = function() {
        clickeditem['serverdomain'] = serverdomain;
        clickeditem['access']=access;
        clickeditem['currentwarehouse']=currentwarehouse;
        newjobwindow.postMessage(clickeditem, '*');
    }
}

//element creataion functions
function createwarehouseselectiondiv(selectedwarehouse){
    const warehouseselectiondiv=document.createElement('div');
    warehouseselectiondiv.className = 'selectiondiv';
    warehouseselectiondiv.style.display = 'flex';
    warehouseselectiondiv.style.flexDirection = 'row';

    const warehouseselectioninput = document.createElement('select');
    warehouseselectioninput.name = 'warehouse';
    warehouseselectioninput.id = 'warehouseselection';
    warehouseselectioninput.style.width = '60px';
    warehouseselectioninput.style.fontSize = '14px';
    warehouseselectioninput.style.margin = '0px 0px 0px 0px';

    const warehouseoptions = ['','NL001', 'DE001'];
    warehouseoptions.forEach(warehouse => {
        const option = document.createElement('option');
        option.value = warehouse;
        option.innerHTML = warehouse;
        warehouseselectioninput.appendChild(option);
    });
    warehouseselectioninput.value = selectedwarehouse?selectedwarehouse:'';
    const warehouseselectionlabel = document.createElement('label');
    warehouseselectionlabel.htmlFor = 'warehouseselection';
    warehouseselectionlabel.innerHTML = '仓库';
    warehouseselectionlabel.style.fontSize = '16px';

    warehouseselectiondiv.appendChild(warehouseselectionlabel);
    warehouseselectiondiv.appendChild(warehouseselectioninput);

    return warehouseselectiondiv;
}
function createplttypeselectiondiv(selectedplttype){
    const plttypeselectiondiv=document.createElement('div');
    plttypeselectiondiv.className = 'selectiondiv';
    plttypeselectiondiv.style.display = 'flex';
    plttypeselectiondiv.style.flexDirection = 'row';

    const plttypeselectioninput = document.createElement('select');
    plttypeselectioninput.name = 'plttype';
    plttypeselectioninput.id = 'plttypeselection';
    plttypeselectioninput.style.width = '50px';
    plttypeselectioninput.style.fontSize = '14px';
    plttypeselectioninput.style.margin = '0px 0px 0px 0px';

    const plttypeselectionlabel = document.createElement('label');
    plttypeselectionlabel.htmlFor = 'plttypeselection';
    plttypeselectionlabel.innerHTML = '托盘类型';
    plttypeselectionlabel.style.fontSize = '16px';

    const plttypeoptions = ['','散货','EU-FBA','Normal-EU', 'Block'];
    plttypeoptions.forEach(plttype => {
        const option = document.createElement('option');
        option.value = plttype;
        option.innerHTML = plttype;
        plttypeselectioninput.appendChild(option);
    });
    plttypeselectioninput.value = selectedplttype?selectedplttype:'';

    plttypeselectiondiv.appendChild(plttypeselectionlabel);
    plttypeselectiondiv.appendChild(plttypeselectioninput);

    return plttypeselectiondiv;
}
function createbulkstatusselectiondiv(selectedstatus){
    const bulkstatusselectiondiv=document.createElement('div');
    bulkstatusselectiondiv.style.display = 'flex';
    bulkstatusselectiondiv.style.flexDirection = 'row';

    const bulkstatusselectioninput = document.createElement('select');
    bulkstatusselectioninput.name = 'bulkstatus';
    bulkstatusselectioninput.id = 'bulkstatusselection';
    bulkstatusselectioninput.style.width = '100px';
    bulkstatusselectioninput.style.fontSize = '14px';
    bulkstatusselectioninput.style.margin = '0px 0px 0px 0px';

    const bulkstatusselectionlabel = document.createElement('label');
    bulkstatusselectionlabel.htmlFor = 'bulkstatusselection';
    bulkstatusselectionlabel.innerHTML = '任务操作类型';
    bulkstatusselectionlabel.style.fontSize = '16px';

    const bulkstatusoptions = ['散货','托盘','退件'];
    bulkstatusoptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.innerHTML = status;
        bulkstatusselectioninput.appendChild(option);
    });
    bulkstatusselectioninput.value = selectedstatus?selectedstatus:'散货';

    bulkstatusselectiondiv.appendChild(bulkstatusselectionlabel);
    bulkstatusselectiondiv.appendChild(bulkstatusselectioninput);

    return bulkstatusselectiondiv;
}
function createquotetemplateselectiondiv(options,selectedtemplate){
    const templateselectiondiv = document.createElement('div');
    templateselectiondiv.className = 'selectiondiv';
    templateselectiondiv.style.margin = '0px 0px 0px 0px';

    const quotetemplate = document.createElement('select');
    quotetemplate.name = 'quotetemplate';
    quotetemplate.id = 'quotetemplate';
    quotetemplate.style.width = '300px';
    quotetemplate.style.fontSize = '16px';
    quotetemplate.style.margin = '0px 0px 0px 0px';
    const quotetemplatelabel = document.createElement('label');
    quotetemplatelabel.htmlFor = 'quotetemplate';
    quotetemplatelabel.innerHTML = '报价模板';
    quotetemplatelabel.style.fontSize = '16px';
    templateselectiondiv.appendChild(quotetemplatelabel);
    templateselectiondiv.appendChild(quotetemplate);
    const quotetemplateoptions = options;
    quotetemplateoptions.forEach(template => {
        const option = document.createElement('option');
        option.value = template;
        option.innerHTML = template;
        quotetemplate.appendChild(option);
    });
    quotetemplate.value = selectedtemplate?selectedtemplate:'';

    return templateselectiondiv;
}
function createcheckbox(id,name,checked,parent){
    if (checked==1) {
        parent.style.boxShadow = '0px 0px 6px 3px rgb(91 175 49)';
    }
    // Create container div
    const container = document.createElement('div');
    container.className = 'cbxcontainer';

    // Create input element
    const input = document.createElement('input');
    input.style.display = 'none';
    input.id = id;
    input.name = name;
    input.type = 'checkbox';
    input.value = 1;
    input.checked = checked==1?true:false;
    

    // Create label element
    const label = document.createElement('label');
    label.className = 'check';
    label.htmlFor = id;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('height', '20px');
    svg.setAttribute('width', '20px');

    // Create path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z');

    // Create polyline element
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '1 9 7 14 15 4');

    // Append path and polyline to SVG
    svg.appendChild(path);
    svg.appendChild(polyline);

    // Append SVG to label
    label.appendChild(svg);

    // Append input and label to container
    container.appendChild(input);
    container.appendChild(label);

    input.addEventListener('change', function() {
        if (input.checked) {
            parent.style.boxShadow = '0px 0px 6px 3px rgb(91 175 49)';
        } else {
            parent.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.25)';
        }
    });

    return container;
}
function createhiddeninput(name,value){
    const hiddeninput = document.createElement('input');
    hiddeninput.type = 'hidden';
    hiddeninput.name = name;
    hiddeninput.value = value;
    return hiddeninput;
}
function createitemblock(title,item){
    const itemblock = document.createElement('div');
    itemblock.className = 'itemblock';

    const blocktitle = document.createElement('div');
    blocktitle.innerHTML = title+':';
    blocktitle.className = 'blocktitle';
    itemblock.appendChild(blocktitle);

    const blockcontent = document.createElement('div');
    blockcontent.className = 'blockcontent';
    itemblock.appendChild(blockcontent);

    return itemblock;
}
function createcoolinput(name,nameplate,placeholder,value,noneditable){
    const inputdiv = document.createElement('div');
    inputdiv.className = 'coolinput';
    const input = document.createElement('input');
    input.type = 'text';
    input.className='coolinputinput';
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;
    const label = document.createElement('label');
    label.innerHTML = nameplate;
    label.className='coolinputlabel';

    inputdiv.appendChild(label);
    inputdiv.appendChild(input);

    if(noneditable){
        input.readOnly = true;
        input.style.backgroundColor = 'lightgrey';
    }
    return inputdiv;
}
function createcoolselect(name,nameplate,options,value,noneditable){
    const selectdiv = document.createElement('div');
    selectdiv.className = 'coolinput';
    const select = document.createElement('select');
    select.className='coolinputinput';
    select.name = name;
    select.value = value;
    const label = document.createElement('label');
    label.innerHTML = nameplate;
    label.className='coolinputlabel';

    options.forEach(option => {
        const optionelement = document.createElement('option');
        optionelement.value = option;
        optionelement.innerHTML = option;
        select.appendChild(optionelement);
    });

    selectdiv.appendChild(label);
    selectdiv.appendChild(select);

    if(noneditable){
        select.readOnly = true;
        select.style.backgroundColor = 'lightgrey';
    }

    return selectdiv;
}
function vasdetailform(clickeditem,callback,replacement){
    function createinputelement(type,label, name, value) {
        const inputdiv = document.createElement('div');
        inputdiv.className = 'inputdiv';
        inputdiv.style.margin='10px 0px';
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.value = value;
        input.className = 'input';
        const inputlabel = document.createElement('label');
        inputlabel.htmlFor = name;
        inputlabel.innerHTML = label;
        inputlabel.className = 'label';
        inputdiv.appendChild(inputlabel);
        inputdiv.appendChild(input);
        return inputdiv;
    }
    function createhideninput(name, value) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        return input;
    }
    const form = document.createElement('form');
    form.style.display='block';
    form.style.width = '500px';
    form.style.position = 'relative';
    const submitbutton = document.createElement('button');
    submitbutton.type = 'submit';
    submitbutton.className = 'button';
    submitbutton.innerHTML = '提交';
    submitbutton.style.fontSize = '14px';
    submitbutton.style.padding = '5px 5px';

    form.appendChild(submitbutton);

    const taskstatusbar = createstatusbar((clickeditem['status']?clickeditem['status']:"预报"),'预报','处理中','暂停','完成');
    taskstatusbar.style.position="absolute";
    taskstatusbar.style.right="50px";
    taskstatusbar.style.top="35px";
    form.appendChild(taskstatusbar);

    const serviceinput = createinputelement('text','服务：','service',clickeditem['service']?clickeditem['service']:''); 
    serviceinput.querySelector('input').setAttribute('list', 'services');
    serviceinput.querySelector('input').required = true;
    serviceinput.querySelector('input').style.width = '150px';
    serviceinput.style.fontSize = '20px';
    serviceinput.style.fontWeight = 'bold';
    form.appendChild(serviceinput);

    const customerinput = createinputelement('text','客户：','customer',clickeditem['customer']?clickeditem['customer']:'');
    customerinput.querySelector('input').style.width = '150px';
    form.appendChild(customerinput);

    const containerinput = createinputelement('text','箱号：','container',clickeditem['container']?clickeditem['container']:'');
    containerinput.querySelector('input').style.width = '150px';
    form.appendChild(containerinput);

    const labelinput = createinputelement('text','仓点：','label',clickeditem['label']?clickeditem['label']:'');
    labelinput.querySelector('input').style.width = '150px';
    form.appendChild(labelinput);

    const pcsinput = createinputelement('number','件数：','pcs',clickeditem['pcs']?clickeditem['pcs']:'');
    pcsinput.querySelector('input').style.width = '140px';
    form.appendChild(pcsinput);
    const pltinput = createinputelement('number','托数：','plt',clickeditem['plt']?clickeditem['plt']:'');
    pltinput.querySelector('input').style.width = '140px';
    form.appendChild(pltinput);


    const deadlineinput = createinputelement('date','截止日期：','deadline',clickeditem['deadline']?clickeditem['deadline']:'');
    deadlineinput.querySelector('input').style.width = '160px';
    deadlineinput.querySelector('input').required = true;
    form.appendChild(deadlineinput);

    form.appendChild(createhideninput('id',clickeditem['id']?clickeditem['id']:''));
    form.appendChild(createhideninput('createdate',clickeditem['createdate']?clickeditem['createdate']:getformatteddate(0)));

    const instructioninputdiv=document.createElement('div');
    instructioninputdiv.className = 'inputdiv';
    const instructioninput = document.createElement('textarea');
    instructioninput.name = 'instruction';
    instructioninput.value = clickeditem['instruction']?clickeditem['instruction']:'';
    instructioninput.className = 'input';
    instructioninput.style.width = '600px';
    instructioninput.style.height = '150px';
    const instructioninputlabel = document.createElement('label');
    instructioninputlabel.htmlFor = 'instruction';
    instructioninputlabel.innerHTML = '操作指示：';
    instructioninputlabel.className = 'label';
    instructioninputdiv.appendChild(instructioninputlabel);
    instructioninputdiv.appendChild(instructioninput);
    form.appendChild(instructioninputdiv);

    const noteinputdiv=document.createElement('div');
    noteinputdiv.className = 'inputdiv';
    const noteinput = document.createElement('textarea');
    noteinput.name = 'note';
    noteinput.value = clickeditem['note']?clickeditem['note']:'';
    noteinput.className = 'input';
    noteinput.style.width = '600px';
    noteinput.style.height = '150px';
    const noteinputlabel = document.createElement('label');
    noteinputlabel.htmlFor = 'note';
    noteinputlabel.innerHTML = '备注：';
    noteinputlabel.className = 'label';
    noteinputdiv.appendChild(noteinputlabel);
    noteinputdiv.appendChild(noteinput);
    form.appendChild(noteinputdiv);

    const hidwarehouse=document.createElement('input');
    hidwarehouse.type = 'hidden';
    hidwarehouse.name = 'warehouse';
    hidwarehouse.value = clickeditem['warehouse']?clickeditem['warehouse']:'';
    form.appendChild(hidwarehouse);

    //file upload section
    const uploaddiv=document.createElement("div");
    uploaddiv.className="uploaddiv";
    uploaddiv.style.justifyContent="start";
    for (var i = 1; i <= 5; i++) {
        const uploadbuttonblock = document.createElement("div");
        uploadbuttonblock.className="uploadbuttonblock";
        uploadbuttonblock.style.margin="0px 10px";
        uploadbuttonblock.style.wordBreak="break-all";
        uploadbuttonblock.id="uploadbuttonblock"+i;

        const uploadbutton = document.createElement("button");
        uploadbutton.className="container-btn-file";
        
        uploadbutton.innerHTML="上传文件"+i;

        const input = document.createElement("input");
        input.type = "file";
        input.id = "attachment"+i;
        input.name = "attachment"+i;
        input.className="file";
        input.accept = "";
        input.multiple = false;

        const changestatuslog = document.createElement("input");
        changestatuslog.type = "hidden";
        changestatuslog.name = "changestatus"+i;
        changestatuslog.value = 0;
        
        uploadbutton.appendChild(input);
        uploadbuttonblock.appendChild(uploadbutton);
        uploadbuttonblock.appendChild(changestatuslog);

        const inumber = i;
        if (clickeditem != '' && clickeditem['attachment'+i] != '' && clickeditem['attachment'+i] != null) {
            const fileLink = document.createElement("a");
            fileLink.href = clickeditem['attachment'+i];

            const decodedUrl = decodeURIComponent(clickeditem['attachment'+i]);
            const urlParts = decodedUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            fileLink.textContent = fileName;
            fileLink.className = "file-name";
            fileLink.download = clickeditem['attachment'+i]; // Enable file download
            uploadbuttonblock.appendChild(fileLink);
        }
        uploadbutton.addEventListener('change', function() {
            var file = this.querySelector('input').files[0];
            var filename = file.name;
            var fileLink = document.createElement("a");
            fileLink.href = URL.createObjectURL(file);
            fileLink.textContent = filename;
            fileLink.className = "file-name";
            fileLink.download = filename; // Enable file download
            uploadbuttonblock.appendChild(fileLink);
            changestatuslog.value = 1;
        });
        
        
        
        uploaddiv.appendChild(uploadbuttonblock);
    }
    form.appendChild(uploaddiv);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(form);
        formData.append('jobid',clickeditem['jobid']?clickeditem['jobid']:'');
        formData.append('inventoryid',clickeditem['inventoryid']?clickeditem['inventoryid']:'');
        var vas = {};
        formData.forEach((value, key) => {
            vas[key] = value;
        });
        
        fetch(serverdomain+'updatevas', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
        .then(data => {
            vas['responsemsg']=data.msg;
            callback(vas);
            //replace div
            if(replacement){
                var vasid=new FormData();
                console.log(clickeditem['id']);
                vasid.append('id',clickeditem['id']);
                fetch(serverdomain+'searchvas', {
                    method: 'POST',
                    body: vasid,
                }).then(response => response.json())
                .then(data => {
                    createvasjob(data['data'][0],document.getElementById("activejobs"),replacement);
                });
            }
        });
        form.innerHTML = '上传中...';
    });

    return form;
}
function createJobTopPartInputDiv(name, value, label){
    const inputdiv = document.createElement('div');
    inputdiv.className = 'inputdiv';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = name;
    input.value = value;
    input.className = 'input';
    input.style.width = '150px';
    const inputlabel = document.createElement('label');
    inputlabel.htmlFor = name;
    inputlabel.innerHTML = label;
    inputlabel.className = 'label';
    inputdiv.appendChild(inputlabel);
    inputdiv.appendChild(input);
    return inputdiv;

}

//get functions
function getcustomerinvoicetempletelist(customer){
    if(customer=='佳成'){
        return {'':'unitprice','佳成-单项目收费报价':'unitprice', '佳成-一口价方案有效期2024年8月1日至2025年3月31日':'lumpsumprice', '其他':'unitprice'};
        return ['','佳成-单项目收费报价', '佳成-一口价方案有效期2024年8月1日至2025年3月31日', '其他'];
    }
    return {'':'unitprice'};
    return ['','其他'];
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
     }else if (ref === 'XPO1' && ref==='Slam') {
         return ['Slam Sp.z.o.o<br>Am Zeugamt 4, DE-04758', 'Oschatz, Germany']; 
     }else if (ref === 'DHL PAKET') {
         return ['DHL Freight Hagen<br>Dolomitstraße 20, DE-58099', 'Hagen, Germany']; 
     }else if (ref === 'DPD') {
         return ["DPD Belgium Depot<br>Rue de l'Arbre Saint-Michel 99, 4400 Flemalle", 'Flemalle, Belgium']; 
     }else if (ref === 'DHL EXPRESS') {
         return ['DHL Maastricht<br>Aviation Valley, Engelandlaan 7, NL-6199 AN', 'Maastricht, Netherlands']; 
     }else if (ref === 'XGEB') {
         return ['LEG1<br>Amazonstraße 1, Leipzig, Saxony 04347', 'Saxony, Germany'];
     }else if (ref === 'LEG1') {
        return ['XGEB<br>Steinauer Weg 7B, Aurach, 91589 Bavaria', 'Bavaria, Germany'];
    }else{
         return null;
     }
     
     
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
function getemailaddress(customer){
    // if(customer=='test'){
    //     return 'garfat@live.com';
    // }
    if(customer=='佳成'){
        return "mcck_cz@jcex.com";
    }
    if(customer=='QOT'){
        return "allqod@quanoutong.com";
    }
    return null;
}
function checkPalletExchange(destination) {
    return destinationMapping[destination];
  }
const destinationMapping = {
    HAJ1: true,
    DTM2: true,
    WRO5: true,
    XPO1: false,
    BER8: false,
    BRE4: true,
    CDG7: true,
    DUS2: true,
    LEJ1: true,
    LEJ3: true,
    MXP3: true,
    MXP5: true,
    STR1: true,
    WRO1: true,
    XMP2: true,
    XOR1: true,
    XSC1: true,
    RLG1: true,
};
const itemexporttilemapping = {
    'warehouse': '仓库',
    'jobid': '操作编号',
    'inventoryid': '库存编号',
    'orderid': '订单编号',
    'inventoryloc': '库存位置',
    'fba'  : 'FBA',
    'requirement': '需求',
    'channel': '渠道',
    'container': '箱号',
    'activity': '操作',
    'oripcs': '预报件数',
    'marks': '箱唛',
    'label': '仓点',
    'date': '操作日期',
    'createtime': '创建时间戳',
    'pcs': '实际件数',
    'plt': '托数',
    'customer': '客户',
    'status': '状态',
    'instruction': '操作指示',
    'note': '备注',
    'checked': '检查备忘',
    'createorder': '创建顺序',
};
