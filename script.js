window.addEventListener("load", function(){
    showtest.innerHTML="load page";
});
var button = document.getElementsByTagName("button")[0];
// Adding an event listener to the button that executes a function when the button is clicked
button.addEventListener("click", function() {
    // Displaying an alert message
    alert("You clicked the button!");
    printSpecificContent();
});

function printSpecificContent() {
    var printContents = document.getElementById("printframe").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents; // Restore original content
}