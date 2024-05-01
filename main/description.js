function updateDescription(axis_key) {
    let axis = d3.select(`#${axis_key}`);

    axis.selectAll("text").remove();

    // Array of hardcoded lines of description
    const lines = [
        "John Lally",
        "CIS 568: Data Visualization",
        "Spring 2024",
        " ",
        "Visualizing the Impact of Meteorite Landings",
        "",
        "This visualization represents various aspects of meteorite landings:",
        "1. Interactive Worldmap Visualization",
        "2. Time Series Analysis",
        "3. Mass Distribution Histogram",
        "4. Adjustable Filters and Sliders",
        "",
        "Data Source: NASA.gov"

    ];

    // Add new description texts
    lines.forEach((line, index) => {
        axis.append("text")
            .attr("x", 20)
            .attr("y", 50 + index * 20)
            .attr("text-anchor", "start")
            .style("font-size", "14px")
            .style("font-family", "Arial, sans-serif")
            .text(line);
    });
}
