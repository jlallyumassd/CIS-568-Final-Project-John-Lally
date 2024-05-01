function time_series(data, axis_key, title = "", xLabel = "", yLabel = "", margin = 50) {
    let axis = d3.select(`#${axis_key}`);
    let svgHeight = parseInt(axis.attr("height"));
    let svgWidth = parseInt(axis.attr("width"));
    let height = svgHeight - 2 * margin;
    let width = svgWidth - 2 * margin;

    // Calculate counts per year from array of years
    let counts = {};
    data.forEach(year => {
        if (!isNaN(year) && year != null) {
            counts[year] = (counts[year] || 0) + 1;
        }
    });

    let dataForPlot = Object.keys(counts).map(year => ({
        year: new Date(year, 0, 1),
        count: counts[year]
    }));

    let xScale = d3.scaleTime()
        .domain(d3.extent(dataForPlot, d => d.year))
        .range([margin, width + margin]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(dataForPlot, d => d.count)])
        .range([height, 0]);

    // Clear previous bars
    axis.selectAll('rect').remove();

    // Draw new bars
    axis.selectAll('rect')
        .data(dataForPlot)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.year))
        .attr('width', Math.max(1, width / dataForPlot.length - 2))
        .attr('y', d => yScale(d.count))
        .attr('height', d => Math.max(0, yScale(0) - yScale(d.count)))
        .attr('fill', 'orange');

    // Add or update x-axis
    if (axis.select('.x-axis').empty()) {
        axis.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));
    } else {
        axis.select('.x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));
    }

    // Add or update y-axis
    if (axis.select('.y-axis').empty()) {
        axis.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin},0)`)
            .call(d3.axisLeft(yScale));
    } else {
        axis.select('.y-axis')
            .call(d3.axisLeft(yScale));
    }

    // Add or update labels
    updateText(axis, '.chart-title', title, (svgWidth / 2), margin / 4, '');
    updateText(axis, '.x-label', xLabel, (svgWidth / 2), svgHeight - margin, '');
    updateText(axis, '.y-label', yLabel, -(height / 2), margin / 4, 'rotate(-90)');

    function updateText(container, className, text, x, y, transform) {
        let textElement = container.select(className);
        if (textElement.empty()) {
            container.append('text')
                .attr('class', className)
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('transform', transform)
                .text(text);
        } else {
            textElement
                .attr('x', x)
                .attr('y', y)
                .attr('transform', transform)
                .text(text);
        }
    }
}
