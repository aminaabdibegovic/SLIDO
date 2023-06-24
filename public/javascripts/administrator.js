function obrisi_predavaca(id){
    $.ajax({
        url: '/obrisi_predavaca',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#predavac-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
}
function obrisiPredavanje(id) {
        $.ajax({
            url: '/obrisi_predavanje',
            type: 'post',
            data: {id: id},
            success: function (result) {
                $("#predavanje-" + id).remove();
            },
            error: function (error) {
                console.log(error);
                alert('Brisanje nije uspjelo!');
            }
        });

    };

    function obrisiZabranjenuRijec(id) {
        $.ajax({
            url: '/obrisi_rijec',
            type: 'post',
            data: {id: id},
            success: function (result) {
                // Remove the deleted word from the list
                $("#rijec-" + id).remove();
                $("#kanta-" + id).remove();
            },
            error: function (error) {
                console.log(error);
                alert('Brisanje nije uspjelo');
            }
        });
    }

function obrisiPitanje(id) {
    $.ajax({
        url: '/obrisi_pitanje',
        type: 'post',
        data: {id: id},
        success: function(result) {
            $("#pitanje-" + id).remove();
        },
        error: function(error) {
            console.log(error);
            alert('Brisanje nije uspjelo!');
        }
    });
}
