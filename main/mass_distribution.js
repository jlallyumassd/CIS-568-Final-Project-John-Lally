function mass_distribution(data, bins_count = 10, axis_key, title = "Meteorite Mass Distribution", xLabel = "Total Count per Bin", yLabel = "Frequency", margin = 50) {
    let axis = d3.select(`#${axis_key}`);
    let height = parseInt(axis.attr("height"));
    let width = parseInt(axis.attr("width"));

    // Clear previous content
    axis.selectAll(".bars").remove();
    axis.selectAll(".axis-label").remove();
    axis.selectAll(".chart-title").remove();

    let values = data.filter(mass => !isNaN(mass) && mass > 0);
    if (values.length === 0) {
        console.error("No valid mass data available. Filtered data is empty.");
        axis.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .text("No valid mass data available.");
        return;
    }

    let xScale = d3.scaleLinear()
        .domain([Math.min(...values), Math.max(...values)])
        .range([margin, width - margin]);

    let histogram = d3.histogram()
        .value(d => d)
        .domain(xScale.domain())
        .thresholds(xScale.ticks(bins_count));

    let bins = histogram(values);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height - margin, margin]);

    let bars = axis.selectAll(".bars")
        .data(bins)
        .enter()
        .append("g")
        .attr("class", "bars");

    bars.append('rect')
        .attr("transform", d => `translate(${xScale(d.x0)}, ${yScale(d.length)})`)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => Math.max(0, yScale(0) - yScale(d.length)))
        .style("fill", "purple");

    // Append tooltip to the group
    bars.append("title")
        .text(d => `Bin range: [${d.x0.toFixed(2)}, ${d.x1.toFixed(2)})`);

    bars.append("text")
        .attr("x", d => xScale((d.x0 + d.x1) / 2))
        .attr("y", d => yScale(d.length) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.length);

    // Add X axis label:
    axis.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - margin / 2)
        .style("text-anchor", "middle")
        .text(xLabel);

    // Add Y axis label:
    axis.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin)
        .attr("dy", "-1.1em")
        .style("text-anchor", "middle")
        .text(yLabel);

    // Add chart Title:
    axis.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
}
