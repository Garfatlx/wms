window.addEventListener("load", function(){
    var showtest = document.getElementById("showtest");
    if (showtest) {
        showtest.innerHTML="load page";
    }

    

    var itemclicked = document.getElementById("activejob1");
    itemclicked.addEventListener("click", function() {
        loaddetail("101");
    });

    var newjobbutton = document.getElementById("newjobbutton");
    newjobbutton.addEventListener("click", function() {
        loaddetail("");
    });
});


function printSpecificContent() {
    var printContents = document.getElementById("itemdetail").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents; // Restore original content
}
function loaddetail(clickeditem){

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
    input0.name="joblabel";
    input0.id="input";
    input0.required=true;
    // input0.className="lineinput";
    input0.value="";
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
    input0.name="containernumber";
    input0.id="input";
    input0.required=true;
    input0.value=clickeditem;
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
    input0.name="jobreference";
    input0.id="input";
    input0.required=true;
    input0.value=clickeditem;
    var input0label=document.createElement("label");
    input0label.innerHTML="提货码";
    input0label.htmlFor="input";
    input0label.className="label";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(inputbottomline);

    var linecontrol0=document.createElement("div");
    linecontrol0.className="linecontrol";
    var input0=document.createElement("input");
    input0.type="date";
    input0.name="jobdate";
    input0.className="lineinput";
    input0.value=clickeditem;
    var input0label=document.createElement("label");
    input0label.innerHTML="日期";
    input0label.className="lineinputlabel";
    detailform.appendChild(linecontrol0);
    linecontrol0.appendChild(input0label);
    linecontrol0.appendChild(input0);

    createdetailline(1,"test1");

    var addnew = document.createElement("button");
    addnew.type="button";
    addnew.innerHTML="New Line";
    addnew.className="button";
    addnew.addEventListener("click", function(){
        createdetailline(2,"");
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
    input1.name="cargolabel";
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