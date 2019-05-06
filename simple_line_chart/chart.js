// Set globals
const url = "https://api.iextrading.com/1.0/"
const endpoint = "/stock/msft/chart/1m"
var data, n, points, max, min, r;


// set margin, height & width
var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width = window.innerWidth - margin.left - margin.right; // Use the window's width 
var height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

// fade body background & axis text
d3.select("body").transition()
	.duration(1000)
    .style("background-color", "#434343")
    .style("color", "#fff");

// get the data
d3.json(url+endpoint)
  .then(function(json) { 
  		data = json;
  		drawChart(json);
  });

function drawChart(data) {
	// number of datapoints
	n = data.length;
	
	// use vwap for data points
	points = data.map(function(d) {
		return {y:d.vwap};
	});

	// get minimum y
	function getMinY() {
	  return points.reduce((min, p) => p.y < min ? p.y : min, points[0].y);
	}
	min = getMinY();
	// get maximum y
	function getMaxY() {
	  return points.reduce((max, p) => p.y > max ? p.y : max, points[0].y);
	}
	max = getMaxY();

	// set X scale
	var xScale = d3.scaleLinear()
				   .domain([0, n-1])
				   .range([0, width]);

	// set Y scale
	var yScale = d3.scaleLinear()
				   .domain([min-(min*0.05), max+(max*0.05)])
				   .range([height, 0]);

	// line generator
	var line = d3.line()
				 .x(function(d, i) { return xScale(i); })
				 .y(function(d) { return yScale(d.y); })
				 .curve(d3.curveMonotoneX)

	// append svg
	var svg = d3.select("body")
				.select("#chart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
	   .attr("class", "x axis")
	   .attr("transform", "translate(0," + height + ")")
	   .call(d3.axisBottom(xScale));

	svg.append("g")
	   .attr("class", "y axis")
	   .call(d3.axisLeft(yScale));

	svg.append("path")
	   .datum(points)
	   .attr("class", "line")
	   .attr("d", line);

	svg.selectAll(".dot")
       .data(points)
  	   .enter().append("circle") // Uses the enter().append() method
       .attr("class", "dot") // Assign a class for styling
       .attr("cx", function(d, i) { return xScale(i); })
       .attr("cy", function(d) { return yScale(d.y); })
       .attr("r", 5)
       .attr("data-toggle", "tooltip")
       .attr("data-placement", "top")
       .attr("title", function(d) {return d.y;});


};
