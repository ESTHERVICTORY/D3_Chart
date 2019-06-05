// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    const svgArea = d3.select('body').select('svg');

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // svg container
    const svgHeight = window.innerHeight;
    const svgWidth = window.innerWidth;

    // margins
    const margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // chart area minus margins
    const chartHeight = svgHeight - margin.top - margin.bottom;
    const chartWidth = svgWidth - margin.left - margin.right;

    // create svg container
    const svg = d3.select('#chart').append('svg')
        .attr('width', svgHeight + margin.left + margin.right)
        .attr('height', svgHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    // shift everything over by the margins
    const chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Zero is intentionally second because down is positive in SVGs
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d['data.poverty']))])
        .range([svgHeight, 0]);


    // Create Scales for Sepal Width on X Axis and Petal Length on Y Axis
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d['data.age']))])
        .range([0, svgWidth]);

    // create axes
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append('g')
        .call(yAxis);
    //code goes here


}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on('resize', makeResponsive);