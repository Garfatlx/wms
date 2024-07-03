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
    var detailform=document.createElement("form");
    var input1=document.createElement("input");
    var input1label=document.createElement("label");
    input1.type="text";
    input1.name="jobid";
    input1.value=clickeditem;
    input1label.innerHTML="Job ID";
    detailform.appendChild(input1label);
    detailform.appendChild(input1);
    itemdetail.appendChild(detailform);
    var submitbutton=document.createElement("button");
    submitbutton.innerHTML="Submit";
    submitbutton.addEventListener("click", function(){
        alert("You clicked the submit button!");
    });
    detailform.appendChild(submitbutton);
    

}