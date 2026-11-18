
d3.json("./topo.json").then((data) => {

    const topo = topojson.feature(data, data.objects.states);

    // create the projection
    var projection = d3.geoAlbersUsa()
        .scale(700)
        .translate([487.5, 305]);

    // create a path generator
    var path = d3.geoPath(projection);

    // create the svg
    const svg = d3.select("#geomap").append("g")
        .attr("transform", "translate(50,50)");

    // draw the states
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "whitesmoke")
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

});
