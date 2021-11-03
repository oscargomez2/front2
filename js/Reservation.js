function autoInicioRelacionCliente(){
    
    $.ajax({
        url:"http://150.230.85.250:8080/api/Client/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
          
            let $select = $("#select-client");
            $.each(respuesta, function (id, name) {
                $select.append('<option value='+name.idClient+'>'+name.name+'</option>');
            
            }); 
        }
    
    })
}
function autoTraePartyroom(){

    $.ajax({
        url:"http://150.230.85.250:8080/api/Partyroom/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
        
            let $select = $("#select-partyroom");
            $.each(respuesta, function (id, name) {
                $select.append('<option value='+name.id+'>'+name.name+'</option>');
         
            }); 
        }
    
    })
}

//Manejador "POST"
function agregarReservation() {

    /*let status = $("#status").val()
    let status1 
    if(status == 1){
        status1 = 'completed'
    }else {
        status1 = 'cancelled'
    }*/
    
    if($("#startDate").val().length == 0 || $("#devolutionDate").val().length == 0 || $("#status").val().length == 0){
        alert("Todos los campos son Obligatorios")
    }else{  
        let elemento = {
            startDate: $("#startDate").val(),
            devolutionDate: $("#devolutionDate").val(),
            status: $("#status").val(),
            partyroom:{id: +$("#select-partyroom").val()},
            client:{idClient: +$("#select-client").val()},
            
        }

        let dataToSend = JSON.stringify(elemento);

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url:"http://150.230.85.250:8080/api/Reservation/save",
            //url: "http://localhost:8080/api/Reservation/save",
            data: dataToSend,
            datatype: "json",

            success: function (response) {
                console.log(response);
                //Limpiar Campos
                $("#resultado5").empty();
                $("#startDate").val("");
                $("#devolutionDate").val("");
                $("#status").val("");

                //Listar Tabla

                alert("Se ha guardado Correctamente!")
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("No se guardo Correctamente!")
            }
        });
    }
}



function listarReservation(){
    $.ajax({
        url:"http://150.230.85.250:8080/api/Reservation/all",
        //url: "http://localhost:8080/api/Reservation/all",
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            console.log(response);
            pintarRespuestaReservation(response);
        }
    });
}

function pintarRespuestaReservation(response){
   
    let myTable="<table class='ui center aligned celled table'>" + 
    "<thead><tr><th>Fecha Inicio</th><th>fecha Devolucion</th><th>Estado de la Reserva</th><th>SALON FIESTAS</th><th>CLIENTE</th><th colspan='3'></th></tr></thead>";
      
    for(i=0;i<response.length;i++){
    myTable+="<tr>";
        myTable+="<td>"+response[i].startDate.split("T")[0]+"</td>";
        myTable+="<td>"+response[i].devolutionDate.split("T")[0]+"</td>";
        myTable+="<td>"+response[i].status+"</td>";
        myTable+="<td>"+response[i].partyroom.name+"</td>";
        myTable+="<td>"+response[i].client.name+"</td>";
        myTable+='<td><button class="ui yellow button" onclick="borrarReservation(' + response[i].idReservation + ')">Borrar Reserva!</button></td>';
        myTable+='<td><button class="ui green button" onclick="cargarDatosReservation(' + response[i].idReservation + ')">Editar Reserva!</button></td>';
        myTable+='<td><button class="ui yellow button" onclick="actualizarReservation(' + response[i].idReservation + ')">Actualizar Reserva!</button></td>';
        myTable+="</tr>";
    }
    myTable+="</table>";
    $("#miListaReservation").html(myTable);
}


//Manejador DELETE
function borrarReservation(idElemento) {
    let elemento = {
        id: idElemento
    }

    let dataToSend = JSON.stringify(elemento);

    $.ajax(
        {
            dataType: 'json',
            data: dataToSend,
            url:"http://150.230.85.250:8080/api/Reservation/"+idElemento,
            //url: "http://localhost:8080/api/Reservation/" + idElemento,
            type: 'DELETE',
            contentType: "application/JSON",
            success: function (response) {
                console.log(response);
                $("#miListaReservation").empty();

                alert("se ha Eliminado Correctamente!")
            },

            error: function (jqXHR, textStatus, errorThrown) {
                alert("No se Elimino Correctamente!")
            }
        });
}

//Capturar informacion para Actualizar
function cargarDatosReservation(id) {

//     n =  new Date();
//     //Año
//     y = n.getFullYear();
//     //Mes
//     m = n.getMonth() + 1;
//     //Día
//     d = n.getDate();

// //Lo ordenas a gusto.
// document.getElementById("date").innerHTML = d + "/" + m + "/" + y;
//     $("#startDate").value = d + "/" + m + "/" + y;



    $.ajax({
        dataType: 'json',
        url:"http://150.230.85.250:8080/api/Reservation/"+id,
        //url: "http://localhost:8080/api/Reservation/" + id,
        type: 'GET',

        success: function (response) {
            console.log(response);
            var item = response;
            $("#startDate").val(item.startDate.split("T")[0]);
            $("#devolutionDate").val(item.devolutionDate.split("T")[0]);
            //$(`#status option[value="${status}"]`).prop("selected", true);
            //select client = <option value='+name.idClient+'>'+name.name+'</option>
            $("#status").val(item.status);
            $("#select-client").val(item.client.idClient);
            $("#select-partyroom").val(item.partyroom.id);
            



        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

//Manejador PUT
function actualizarReservation(idElemento) {

    let status = $("#status").val()
    let status1 
    if(status == 1){
        status1 = 'completed'
    }else {
        status1 = 'cancelled'
    }
    
    if($("#startDate").val().length == 0 || $("#devolutionDate").val().length == 0 || $("#status").val().length == 0){
        alert("Todos los campos deben estar llenos")
    }else{
        let elemento = {
            idReservation: idElemento,
            startDate: $("#startDate").val(),
            devolutionDate: $("#devolutionDate").val(),
            status: status1,
            skate:{id: +$("#select-partyroom").val()},
            client:{idClient: +$("#select-client").val()},
        }

        let dataToSend = JSON.stringify(elemento);

        $.ajax({
            datatype: 'json',
            data: dataToSend,
            contentType: "application/JSON",
            url:"http://150.230.85.250:8080/api/Reservation/update",
            //url: "http://localhost:8080/api/Reservation/update",
            type: "PUT",

            success: function (response) {
                console.log(response);
                $("#miListaReservation").empty();
                alert("se ha Actualizado Correctamente!")

                //Limpiar Campos
                $("#resultado5").empty();

                $("#startDate").val("");
                $("#devolutionDate").val("");
                $("#status").val("");

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("No se Actualizo Correctamente!")
            }
        });
    }
}