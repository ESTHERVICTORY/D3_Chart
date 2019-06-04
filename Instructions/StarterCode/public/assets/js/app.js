

/*Setup everything that doesn't require data first*/
// svg container
const height = 600;
const width = 1000;
let chosenXAxis = 'age';

// margins
const margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left:100
};

// chart area minus margins
const chartHeight = height - margin.top - margin.bottom;
const chartWidth = width - margin.left - margin.right;

// Create a color map for challenge
// In a production application typically is generated using a color scale
const color_map = {'setosa': 'green', 'virginica':'red', 'versicolor':'blue'}

// create svg container
const svg = d3.select('#chart').append('svg')
      .attr('height', height)
      .attr('width', width)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('id', 'bar_chart');


// shift everything over by the margins
const labelsGroup = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${chartHeight+20})`);

labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'age') // value to grab for event listener
    .text('Age');

labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'healthcare') // value to grab for event listener
    .text('Health Care');

labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'income') // value to grab for event listener
    .text('Income');

// Add Y axis label
svg.append('g')
      .attr('transform', `translate(-25, ${chartHeight / 2}) rotate(-90)`)
    .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('value', 'poverty') // value to grab for event listener
      .text('Poverty');

// Define update functions that will be called when user selection is made
function xScale_update(sales_data, chosenXAxis){
  /* Generate yScale based on selected value */

  const xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(sales_data, d => d[chosenXAxis])])
        .range([0, chartWidth]);

  return xLinearScale
  }

function renderAxes(newXScale, xAxis_g) {
  /*Update xAxis with new scale value */

  const bottomAxis = d3.axisBottom(newXScale);

  xAxis_g.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis_g;
}


function UpdateBars(circleGroup, newXScale) {
  /* function used for updating circles group by clicking on event listener */
  circleGroup
    .transition()
    .duration(1000)
    .attr('cx', d =>newXScale(d[chosenXAxis]));

  return;
}


d3.csv('../assets/data/data.csv')
    .then(function( data_data){
      data = data_data;
      console.log(data_data);
      for (i=0; i<data.length; i++){
       let poverty = data[i].poverty;
        data[i].age ;
        console.log("poverty"+data[i].poverty);
        console.log("age"+data[i].age);
      }

        // Set Scales
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data_data.map(d =>d['sepal_length']))])
            .range([chartHeight, 0]);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data_data, d => d[chosenXAxis])])
            .range([0, chartWidth])

        // Create axes for Svg
        const yAxis_func = d3.axisLeft(yScale);
        const xAxis_func = d3.axisBottom(xScale);

        // set x to the bottom of the chart
        let xAxis_g = svg.append('g')
            .attr('id', 'xaxis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis_func);

        // Assign YAxis to variable so we can update it later
        svg.append('g')
            .attr('id', 'yaxis')
            .call(yAxis_func);

        // Create the circles using data binding
        const circleGroup = svg.selectAll('circle')
            .data(data_data)
                .enter()
            .append('circle')
            .attr('cx', d => xScale(d['age']))
            .attr('cy', d => yScale(d['poverty']))
            .attr('r', 10)
            .attr('fill', d => color_map[d['state']]);
// console.log(poverty);
        labelsGroup.selectAll('text')
            .on('click', function() {

              // get value of selection
              const value = d3.select(this).attr('value');
              console.log(value);
              if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;


                // functions here found above csv import
                // updates x scale for new data
                const xLinearScale = xScale_update(data_data, chosenXAxis);

                // updates x axis with transition
                xAxis_g = renderAxes(xLinearScale, xAxis_g);

                // updates circles with new x values
                UpdateBars(circleGroup, xLinearScale);

                }
        });
    });