var get_users = function(){
    $.ajax({
        url: "https://atenciontodo.com/api/v2/contacts.json",
        type: 'GET',
        headers: { "Authorization": "Token " + "db99ba913d7362212710ee82c9503f589884ce44"}, 
        dateType: 'json',
        async:false,
        success: function(data){
            console.log('Obtuvimos ' + data.results.length + ' usuarios' );
        },
        error: function(xhr, errmsg, err){
            console.log(xhr.status + ': ' + xhr.responseText);
        }
    })
}


var get_messages = function(){
    $.ajax({
        url: "https://atenciontodo.com/api/v2/messages.json/?folder=flows",
        type: 'GET',
        headers: { "Authorization": "Token " + "db99ba913d7362212710ee82c9503f589884ce44"}, 
        dateType: 'json',
        async:false,
        success: function(data){
            console.log('Obtuvimos ' + data.results.length + ' mensajes');
        },
        error: function(xhr, errmsg, err) {
            console.log(xhr.status + ': ' + xhr.responseText);
        }
    })
}

//Cada conversacion con un usuario se llama run, haya terminado un flujo o no, las respuestas que dio 
// por cada pregunta también esta almacenada en el run:
var get_runs = function(){
    $.ajax({
        url:       "https://atenciontodo.com/api/v2/runs.json/?flow=9a28ef69-9b20-4b7e-b9a0-b0ebe12ceaf0",
        type:      'GET',
        headers:   { "Authorization": "Token " + "db99ba913d7362212710ee82c9503f589884ce44"}, 
        dateType: 'json',
        async:    false,
        success: function(data){
            console.log('Obtuvimos ' + data.results.length + ' flujos');
            // Get Flows
            var flows = data.results
                            .map((e) => e.values)
                            .filter((e) => 'response_1' in e)
            // Pie Values
            var pieChart    = {};
            flows.map((e) => e.response_1.category)
                 .map((e) => pieChart[e] ? pieChart[e] ++ : pieChart[e] = 1);
            console.log('De ' + Object.keys(pieChart).length + ' temas diferentes');
            // Time Series
            var timeSeries = {};
            flows.map((e) => new Date(e.response_1.time).toDateString())
                 .map((e) => timeSeries[e] ? timeSeries[e] ++ : timeSeries[e] = 1);
            console.log('En ' + Object.keys(timeSeries).length + ' fechas distintas');
            // Type of Mantenimiento
            // Type of Seguridad
            // Type of Quejas
        },
        error: function(xhr, errmsg, err){
            console.log('no')
            console.log(xhr.satatus + ': ' + xhr.responseText);
        }
    })
}
