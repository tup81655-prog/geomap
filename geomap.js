
Promise.all([
    d3.json("./topo.json"),
    d3.csv("./cities.csv"),
    d3.csv("./states.csv")
]).then((data) => {

    // Give our data sensible names
    const topology = data[0];
    const cities = data[1];
    const states = data[2];

    const topo = topojson.feature(topology, topology.objects.states);

// Create a dictionary for states and populations
const stateDictionary = new Map();

states.forEach((state) => {
    stateDictionary.set(state.State, +state["2018 Population"]);
});

console.log(stateDictionary);

    // Create the color scale
    var blues = d3.scaleSequential()
        .domain(d3.extent(stateDictionary.values()))
        .range(["white", "steelblue"]);

    // Create the projection
    var projection = d3.geoAlbersUsa()
        .scale(700)
        .translate([487.5, 305]);

    // Create a path generator
    var path = d3.geoPath(projection);

    // Create the SVG
    const svg = d3.select("#geomap").append("g")
        .attr("transform", "translate(50,50)");

    // Draw the states and color by population
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
            return blues(stateDictionary.get(d.properties.name));
        })
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

    // Add circles to represent capital cities
    svg.append("g")
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("cx", (d) => {
            return projection([+d.longitude, +d.latitude])[0];
        })
        .attr("cy", (d) => {
            return projection([+d.longitude, +d.latitude])[1];
        })
        .attr("r", 4)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", "0.5px")
        .append("title")
        .text((d) => {
            return d.description.replace(/<br\s*\/?>/gi, "") + ", " + d.name;
        });

});
