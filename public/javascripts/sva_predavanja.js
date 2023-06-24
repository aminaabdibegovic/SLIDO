function openForm(i) {
    document.getElementById(`myForm${i}`).style.display = "block";
    document.getElementById(`dugme${i}`).style.display="none";
}
function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("dugme").style.display="block";
}
function obrisiNeodgovoreno(id){
    $.ajax({
        url: '/obrisi_pitanje',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#ne-odg-pitanja-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
}
function obrisiOdgovoreno(id){
    $.ajax({
        url: '/obrisi_pitanje',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#odg-pitanja-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
}
function obrisiSkriveno(id){
    $.ajax({
        url: '/obrisi_pitanje',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#skr-pitanja-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
}
function vidiSkrivenaPitanja(){
    document.getElementById("skrivena_pitanja").style.display="block";
    document.getElementById("sakrij").style.display="block";

}
function sakrijSkrivenaPitanja(){
    document.getElementById("sakrij").style.display="none";
    document.getElementById("prikazi").style.display="block";
    document.getElementById("skrivena_pitanja").style.display="none";
}
function sakrijNeodgovoreno(id){
    $.ajax({
        url: '/sakrij_pitanje',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#ne-odg-pitanja-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
    location.reload();
}
function sakrijOdgovoreno(id){
    $.ajax({
        url: '/sakrij_pitanje',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#odg-pitanja-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
    location.reload();
}
function odgovoreno(id,id_pred){
    $.ajax({
        url:"/odgovoreno_pitanje",
        data:{
            id:id,
            id_pred: id_pred
        },
        type:'POST',
        beforeSend: function(){}
    }).done(function (data){
    })
    location.reload();
}
