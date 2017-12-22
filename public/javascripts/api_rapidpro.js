var pieChartf = function(data){
    /*
    var data = [{"name": "servicios","value": 100},
                {"name": "quejas", "value": 312},
                {"name": "seguridad", "value": 222},
                {"name": "pagos", "value": 254}]
    */
    var width, height
    var chartWidth, chartHeight
    var margin
    var svg        = d3.select("#graph").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)


    var colorScale = d3.scaleOrdinal()
                       .domain(['pri', 'prd', 'pan', 'morena'])
                       .range(['#0D47A1', '#3498DB', '#2962FF', '#BBDEFB'])

    width = document.querySelector("#graph").clientWidth
    height = document.querySelector("#graph").clientHeight

    margin = {top:40, left:0, bottom:40, right:0 }


    chartWidth = width - (margin.left+margin.right)
    chartHeight = height - (margin.top+margin.bottom)

    svg.attr("width", width).attr("height", height)


    chartLayer
       .attr("width", chartWidth)
       .attr("height", chartHeight)
       .attr("transform", "translate("+[margin.left, margin.top]+")")


    var arcs = d3.pie()
                 .sort(null)
                 .value(function(d) { return d.value; })
    (data)

    var arc = d3.arc()
                .outerRadius(chartHeight/2)
                .innerRadius(chartHeight/4)
                .padAngle(0.03)
                .cornerRadius(8)

    var pieG = chartLayer.selectAll("g")
                         .data([data])
                         .enter()
                         .append("g")
                         .attr("transform", "translate("+[chartWidth/2, chartHeight/2]+")")

    var block = pieG.selectAll(".arc")
                    .data(arcs)

    var newBlock = block.enter().append("g").classed("arc", true)

    newBlock.append("path")
                        .attr("d", arc)
                        .attr("id", function(d, i) { return "arc-" + i })
                        .attr("stroke", "gray")
                        .attr("fill", function(d,i){ return colorScale(d.data.name) })


    newBlock.append("text")
                        .attr("dx", 25)
                        .attr("dy", -5)
                        .append("textPath")
                        .attr("xlink:href", function(d, i) { return "#arc-" + i; })
                        .text(function(d) { console.log(d);return d.data.name })
                        .attr("font-size", "15px")
                        .style("font-weight", "bold")
                        .attr("fill", "#424242");
}

var get_users = function(){
    $.ajax({
        url: "https://atenciontodo.com/api/v2/contacts.json",
        type: 'GET',
        headers: { "Authorization": "Token " + "db99ba913d7362212710ee82c9503f589884ce44"}, 
        dateType: 'json',
        async:false,
        success: function(data){
            console.log('Obtuvimos ' + data.results.length + ' usuarios' );
            $('#n_users').html('<h4>Usuarios activos: <strong style="color:#3498DB">' + data.results.length + '</strong></h4>')
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
            $('#n_messages').html('<h4>Mensajes intercambiados: <strong style="color:#3498DB">' + data.results.length + '</strong></h4>')
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
            console.log(pieChart)
            console.log('De ' + Object.keys(pieChart).length + ' temas diferentes');
            // GRAPH
            var pieChartData = []
            var pieKeys      = Object.keys(pieChart)
            for(var i = 0; i < pieKeys.length; i++){
                pieChartData.push({'name': pieKeys[i], 'value': pieChart[pieKeys[i]]})
            }

            console.log('PIE DATA: ' + pieChartData)
            pieChartf(pieChartData)
            // Time Series
            var timeSeries = {};
            flows.map((e) => new Date(e.response_1.time).toDateString())
                 .map((e) => timeSeries[e] ? timeSeries[e] ++ : timeSeries[e] = 1);
            console.log('En ' + Object.keys(timeSeries).length + ' fechas distintas');
            // Type of Mantenimiento
            // Type of Seguridad
            // Type of Quejas
            $('#n_flows').html('<h4>Flujos recorridos: <strong style="color:#3498DB">' + data.results.length + '</strong></h4>')
        },
        error: function(xhr, errmsg, err){
            console.log('no')
            console.log(xhr.satatus + ': ' + xhr.responseText);
        }
    })
}
