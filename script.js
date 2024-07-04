window.addEventListener("load", function(){
    var showtest = document.getElementById("showtest");
    if (showtest) {
        showtest.innerHTML="load page";
    }

    var button = document.getElementById("printbutton");
    // Adding an event listener to the button that executes a function when the button is clicked
    button.addEventListener("click", function() {
        // Displaying an alert message
        alert("You clicked the button!");
        printSpecificContent();
    });

    var itemclicked = document.getElementById("activejob1");
    itemclicked.addEventListener("click", function() {
        loaddetail("101");
    });

});


function printSpecificContent() {
    var printContents = document.getElementById("printframe").innerHTML;
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
    itemdetail.appendChild(detailform);

    var controlbar=document.createElement("div");
    controlbar.className="controlbar";
    var submitbutton=document.createElement("button");
    submitbutton.innerHTML="Submit";
    submitbutton.className="button";
    detailform.appendChild(controlbar);
    controlbar.appendChild(submitbutton);

    //one detail line
    var input1=document.createElement("input");
    input1.type="text";
    input1.name="cargolabel";
    input1.className="lineinput";
    input1.value=clickeditem;
    var input1label=document.createElement("label");
    input1label.innerHTML="Cargo Label";
    detailform.appendChild(input1label);
    detailform.appendChild(input1);

    var input2=document.createElement("input");
    input2.type="text";
    input2.name="quantity";
    input2.className="lineinput";
    input2.value=clickeditem;
    var input2label=document.createElement("label");
    input2label.innerHTML="Quantity";
    detailform.appendChild(input2label);
    detailform.appendChild(input2);

    var input3=document.createElement("input");
    input3.type="textarea";
    input3.name="note";
    input3.className="lineinput";
    input3.value=clickeditem;
    var input3label=document.createElement("label");
    input3label.innerHTML="Note";
    detailform.appendChild(input3label);
    detailform.appendChild(input3);

    var addnew = document.createElement("button");
    addnew.type="button";
    addnew.innerHTML="New Line";
    addnew.className="button";
    addnew.addEventListener("click", function(){
        var input1=document.createElement("input");
        input1.type="text";
        input1.name="cargolabel";
        input1.className="lineinput";
        input1.value=clickeditem;
        var input1label=document.createElement("label");
        input1label.innerHTML="Cargo Label";
        detailform.appendChild(input1label);
        detailform.appendChild(input1);

        var input2=document.createElement("input");
        input2.type="text";
        input2.name="quantity";
        input2.className="lineinput";
        input2.value=clickeditem;
        var input2label=document.createElement("label");
        input2label.innerHTML="Quantity";
        detailform.appendChild(input2label);
        detailform.appendChild(input2);

        var input3=document.createElement("input");
        input3.type="text";
        input3.name="note";
        input3.className="lineinput";
        input3.value=clickeditem;
        var input3label=document.createElement("label");
        input3label.innerHTML="Note";
        detailform.appendChild(input3label);
        detailform.appendChild(input3);

        detailform.appendChild(addnew);
        
    });
    detailform.appendChild(addnew);
    
    
    
    
    
    
    detailform.addEventListener("submit", function (event) {
        event.preventDefault();
        var inputform=document.getElementById("detailform");
        var formdata=new FormData(inputform);
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        
    });
    
    

}