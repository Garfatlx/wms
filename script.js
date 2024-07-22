window.addEventListener("load", function(){
    var showtest = document.getElementById("showtest");
    if (showtest) {
        showtest.innerHTML="load page";
    }

    var sysresponse = document.getElementById("response");
    sysresponse.innerHTML=new Date().getTime();

    searchjobs();


    var newjobbutton = document.getElementById("newjobbutton");
    newjobbutton.addEventListener("click", function() {
        loaddetail("");
    });
});

function searchjobs(){
    showloading();
    // const searchjob = new FormData(document.getElementById("searchjobs"));
    const searchjobs = new FormData();
    
    console.log("searchjobs");
    const xhr  = new XMLHttpRequest();  
    xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/searchjobs", true);
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                var joblist = document.getElementById("activejobs");
                joblist.innerHTML="";
                for (var i = 0; i < xhr.response["data"].length; i++) {
                    createjob(xhr.response["data"][i]);
                }
            }
        }
    }
    xhr.responseType="json";
    xhr.send(searchjobs);

}
function addnewjob(jobid,detaillinenumber){

    const addjob = new FormData(document.getElementById("detailform"));
    if(jobid==""){
        jobid = new Date().getTime();
    }
    addjob.append("jobid",jobid);
    const xhr  = new XMLHttpRequest();  
    xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/addjob", true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    xhr.onreadystatechange= () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response["error_code"]==0){
                alert("success");
            }
        }
    }
    xhr.responseType="json";
    xhr.send(addjob);

    for (var i = 1; i <= detaillinenumber; i++) {
        const addjobline = new FormData(document.getElementById("detaillineform"+i));
        
        addjobline.append("jobid",jobid);
        addjobline.append("container",addjob.get("container"));
        addjobline.append("indate",addjob.get("date"));

        
        const xhr  = new XMLHttpRequest();  
        xhr.open("POST", "https://garfat.xyz/index.php/home/Wms/additem", true);
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
        xhr.onreadystatechange= () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                // restext.innerHTML=xhr.response["msg"];
            }
        }
        xhr.responseType="json";
        xhr.send(addjobline);

    }

    

}
function printSpecificContent() {
    var printContents = document.getElementById("itemdetail").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents; // Restore original content
}
function loaddetail(clickeditem){
    var detaillinenumber=1;

    var itemdetail = document.getElementById("itemdetail");
    itemdetail.innerHTML="";
    var detailform=document.createElement("form");
    detailform.id="detailform";
    detailform.className="detailform";
    itemdetail.appendChild(detailform);
    
    //control   bar
    var controlbar=document.createElement("div");
    controlbar.className="controlbar";
    var submitbutton=document.createElement("button");
    submitbutton.innerHTML="Submit";
    submitbutton.className="button";
    var printbutton=document.createElement("button");
    printbutton.innerHTML="Print &#x1F5B6";
    printbutton.className="button";
    detailform.appendChild(controlbar);
    controlbar.appendChild(submitbutton);
    controlbar.appendChild(printbutton);

    //title line
    var linecontrol0=document.createElement("div");
    linecontrol0.className="input-container";
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="customer";
    input0.id="input";
    input0.required=true;
    // input0.className="lineinput";
    input0.value=((clickeditem!='')?clickeditem['customer']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="工作标签";
    input0label.htmlFor="input";
    input0label.className="label";
    // input0label.className="lineinputlabel";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(inputbottomline);
    
    
    

    var linecontrol0=document.createElement("div");
    linecontrol0.className="input-container";
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="container";
    input0.id="input";
    input0.required=true;
    input0.value=((clickeditem!='')?clickeditem['container']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="箱号/单号";
    input0label.htmlFor="input";
    input0label.className="label";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(inputbottomline);

    var linecontrol0=document.createElement("div");
    linecontrol0.className="input-container";
    linecontrol0.style.position="absolute";
    linecontrol0.style.right="100px";
    linecontrol0.style.top="30px";
    var inputbottomline=document.createElement("div");
    inputbottomline.className="underline";
    var input0=document.createElement("input");
    input0.type="text";
    input0.name="reference";
    input0.id="input";
    input0.required=true;
    input0.value=((clickeditem!='')?clickeditem['reference']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="提货码";
    input0label.htmlFor="input";
    input0label.className="label";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(inputbottomline);

    createstatusbar();

    var linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    var input0=document.createElement("input");
    input0.type="date";
    input0.name="date";
    input0.className="lineinput";
    input0.value=((clickeditem!='')?clickeditem['date']:"");;
    var input0label=document.createElement("label");
    input0label.innerHTML="日期";
    input0label.className="lineinputlabel";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(input0);

    var linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    var input0=document.createElement("textarea");
    input0.name="deladdress";
    input0.className="lineinput";
    input0.value=((clickeditem!='')?clickeditem['deladdress']:"");
    var input0label=document.createElement("label");
    input0label.innerHTML="送货地址";
    input0label.className="lineinputlabel";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(input0);

    detailform.appendChild(document.createElement("hr"));
    
    createdetailline(detaillinenumber,"test1");

    var addnew = document.createElement("button");
    addnew.type="button";
    addnew.innerHTML="New Line";
    addnew.className="button";
    addnew.addEventListener("click", function(){
        detaillinenumber++;
        createdetailline(detaillinenumber,"");
        detailform.appendChild(addnew);
        
    });
    detailform.appendChild(addnew);
    
    //submit button    
    detailform.addEventListener("submit", function (event) {
        event.preventDefault();
        var inputform=document.getElementById("detailform");
        var formdata=new FormData(inputform);
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }

        addnewjob(clickeditem,detaillinenumber);
    });
    printbutton.addEventListener("click", function() {
        // Displaying an alert message
        alert("You clicked the button!");
        printSpecificContent();
    });
    
}

function createdetailline(id, clickeditem){
    var detailform=document.getElementById("detailform");

    var detaillineform=document.createElement("form");
    detaillineform.id="detaillineform"+id;
    detaillineform.className="detaillineform";
    detailform.appendChild(detaillineform);

    var input1=document.createElement("input");
    input1.type="text";
    input1.name="label";
    input1.className="lineinput";
    input1.value=clickeditem;
    var input1label=document.createElement("label");
    input1label.innerHTML="货物标签";
    input1label.className="lineinputlabel";
    detaillineform.appendChild(input1label);
    detaillineform.appendChild(input1);

    
    var input2=document.createElement("input");
    input2.type="text";
    input2.name="pcs";
    input2.className="lineinput";
    input2.style.width="50px";
    input2.value=clickeditem;
    var input2label=document.createElement("label");
    input2label.innerHTML="件数";
    input2label.className="lineinputlabel";
    detaillineform.appendChild(input2label);
    detaillineform.appendChild(input2);

    var input2=document.createElement("input");
    input2.type="text";
    input2.name="plt";
    input2.className="lineinput";
    input2.style.width="50px";
    input2.value=clickeditem;
    var input2label=document.createElement("label");
    input2label.innerHTML="托数";
    input2label.className="lineinputlabel";
    detaillineform.appendChild(input2label);
    detaillineform.appendChild(input2);

    detaillineform.appendChild(document.createElement("br"));
    
    //create an api connection to chatgpt
    
    var input3=document.createElement("textarea");
    
    input3.name="fba";
    input3.className="lineinput";
    input3.value=clickeditem;
    var input3label=document.createElement("label");
    input3label.innerHTML="FBA";
    input3label.className="lineinputlabel";
    detaillineform.appendChild(input3label);
    detaillineform.appendChild(input3);

    var input3=document.createElement("textarea");
    input3.name="note";
    input3.className="lineinput";
    input3.value=clickeditem;
    var input3label=document.createElement("label");
    input3label.innerHTML="备注";
    input3label.className="lineinputlabel";
    detaillineform.appendChild(input3label);
    detaillineform.appendChild(input3);
}

function createjob(jobcontent){
    const clickeditem=jobcontent;
    var joblist = document.getElementById("activejobs");

    var activejob = document.createElement("div");
    activejob.className="activejob";
    
    // Create the container div for the first item line
    const itemLine1 = document.createElement('div');
    itemLine1.className = 'itemline';

    // Create and append the item title to the first item line
    const itemTitle1 = document.createElement('p');
    itemTitle1.className = 'itemtitle';
    itemTitle1.textContent = jobcontent['customer'];
    itemLine1.appendChild(itemTitle1);
    activejob.appendChild(itemLine1);

    // Create and append the standalone item title
    const itemTitle2 = document.createElement('p');
    itemTitle2.className = 'itemtitle';
    itemTitle2.textContent = jobcontent['container'];
    activejob.appendChild(itemTitle2);

    // Create and append the first horizontal rule
    const hr1 = document.createElement('hr');
    activejob.appendChild(hr1);

    // Create the container div for the second item line
    const itemLine2 = document.createElement('div');
    itemLine2.className = 'itemline';

    // Create and append the list item (time label) to the second item line
    const listItem2 = document.createElement('p');
    listItem2.className = 'listitem';
    listItem2.textContent = "日期";
    itemLine2.appendChild(listItem2);
    
    // Create and append the list item (time value) to the second item line
    const listItem3 = document.createElement('p');
    listItem3.className = 'listitem';
    listItem3.textContent = jobcontent['date'];
    itemLine2.appendChild(listItem3);

    // Append the second item line to the document body or a specific container
    activejob.appendChild(itemLine2);

    // Create and append the second horizontal rule
    const hr2 = document.createElement('hr');
    activejob.appendChild(hr2);

    joblist.appendChild(activejob);
    activejob.addEventListener("click", function() {
        loaddetail(clickeditem);
    });
}

function showloading(){
    const banterLoader = document.createElement('div');
    banterLoader.className = 'banter-loader';

    // Loop to create and append each banter-loader__box to the banter-loader
    for (let i = 0; i < 9; i++) {
        const box = document.createElement('div');
        box.className = 'banter-loader__box';
        banterLoader.appendChild(box);
    }

    const activejobs = document.getElementById("activejobs");
    activejobs.innerHTML="";
    activejobs.appendChild(banterLoader);
}

function createstatusbar(){
    var detailform=document.getElementById("detailform");
    // Create the container div for the status-radio-input
    const statusRadioInput = document.createElement('div');
    statusRadioInput.className = 'status-radio-input';
    statusRadioInput.style.position="absolute";
    statusRadioInput.style.right="60px";
    statusRadioInput.style.top="80px";

    // Define the radio button options
    const options = [
        { value: '预报', id: 'value-1', checked: true },
        { value: '排队中', id: 'value-2', checked: false },
        { value: '作业中', id: 'value-3', checked: false },
        { value: '完成', id: 'value-4', checked: false } // Note: Corrected the duplicate id 'value-3' to 'value-4'
    ];

    // Loop through each option to create and append the labels, inputs, and spans
    options.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'value-radio');
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