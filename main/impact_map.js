function impact_map(data, svgId) {
    const width = 1200;
    const height = 800;
    const margin = { top: 25, right: 25, bottom: 25, left: 25 };

    // Select the existing SVG element, or create it if it does not exist
    let svg = d3.select(`#${svgId}`);
    if (svg.empty()) {
        svg = d3.create("svg")
            .attr("id", svgId)
            .attr("width", width)
            .attr("height", height);
        d3.select("body").append(() => svg.node());
    }

    // Load and display the World Atlas data
    d3.json('../data/custom.geo.json').then(geoData => {
        const projection = d3.geoEqualEarth()
            .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], geoData);

        const geoGenerator = d3.geoPath()
            .projection(projection);

        // Ensure the map is only appended once
        let mapCanvas = svg.select("g.map-canvas");
        if (mapCanvas.empty()) {
            mapCanvas = svg.append('g').attr("class", "map-canvas");
            mapCanvas.selectAll('path')
                .data(geoData.features)
                .enter().append('path')
                .attr("d", geoGenerator)
                .attr("class", "map")
                .attr("fill", "lightgreen")
                .attr("stroke", "black")
                .attr("stroke-width", 0.5);
        }

        // Clear existing circles before drawing new ones
        mapCanvas.selectAll("circle").remove();

        // Draw meteorites if data is provided
        mapCanvas.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => projection([d.reclong, d.reclat])[0])
            .attr("cy", d => projection([d.reclong, d.reclat])[1])
            .attr("r", d => Math.sqrt(d.mass) * 0.005)
            .style("fill", "red")
            .style("opacity", 0.75)
            .append("title") // Tooltip
            .text(d => `Name: ${d.name}\nMass: ${d.mass}g\nYear: ${d.year}\nClass: ${d.recclass}\nFall: ${d.fall}\nCoordinates: ${d.GeoLocation}\n`);

        // zoom
        svg.call(
            d3.zoom()
                .extent([[0, 0], [width, height]])
                .scaleExtent([1, 8])
                .on("zoom", zoomed)
        );

        function zoomed(event) {
            mapCanvas.attr("transform", event.transform);
        }
    });
}
