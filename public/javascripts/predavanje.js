
var socket = io.connect('ws://localhost:3000');

socket.on('poruka_sa_servera',function (d,id) {
    // Create a new div element
    var newDiv = document.createElement("div");
    newDiv.innerHTML ="<br>";
    newDiv.innerHTML += d;
    newDiv.style.color = "black";
    newDiv.style.backgroundColor="white";
    newDiv.style.marginLeft= "40%";
    newDiv.style.marginBottom= "1%";
    newDiv.style.height="70px";
    newDiv.style.width="50%";
    newDiv.style.borderRadius="15px";
    newDiv.style.fontWeight="bold";
    newDiv.style.fontSize="20px;";
    newDiv.innerHTML+= "<br>"
    //newDiv.id=id;
    newDiv.innerHTML += "<i  style='margin-left: 90%;' class='bi bi-heart' onclick='lajk(id)' id=" + id + "></i>";

    //newDiv.innerHTML += "<i class='bi bi-heart' onclick='lajk(id)'></i>";
    newDiv.classList.add("pitanje");

    // Get the element where you want to add the new div
    var parentDiv = document.getElementById("sva_pitanja");
    // Add the new div to the parent div
    parentDiv.appendChild(newDiv);

    //document.getElementById("poruke").innerHTML+="<br>"

});
socket.on('sve_poruke',function (d) {
    document.getElementById("sva_pitanja").innerHTML=d;

});

function posaljiPoruku(){
    let tekst = document.getElementById("tekst_poruke").value;
    socket.emit('klijent_salje_poruku', tekst);
}

function lajk(id){
    document.getElementById(id).classList="bi bi-heart-fill"
    document.getElementById(id).style.color="red";

    $.ajax({
        url:"/lajk_na_pitanje",
        data:{
            id:id
        },
        type:'POST',
        beforeSend: function(){}
    }).done(function (data){
    })

};
