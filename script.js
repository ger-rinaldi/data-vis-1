function main(){

  const data_src = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  const data_request = new XMLHttpRequest();

  data_request.open("GET", data_src, true);
  
  data_request.onload = function(){
    const data = JSON.parse(data_request.responseText).data;
    console.log(data);
    render_bars(data);
  };

  data_request.send();
};

function render_bars(dataset){
  const pad = 40;
  
  // Create d3.svg object
  const svg = d3.select("body").select("svg");

  // Get height and width to compute scales and positioning of bars and axis
  const svgH = svg.node().clientHeight;
  const svgW = svg.node().clientWidth;
  // get standar width of each bar
  const rectW = svgW / dataset.length;
  
  // get scales and axes
  const [xScale, yScale, dateScale, gdpScale] = get_scales(dataset, svgH, svgW, pad);
  const [xAxis, yAxis] = get_axes(dateScale, gdpScale);

  svg.append("g").call(xAxis).attr("id", "x-axis").attr("transform", `translate(0, ${svgH - (pad - 5) })`)
  svg.append("g").call(yAxis).attr("id", "y-axis").attr("transform", `translate(${pad})`)

  let bars = svg.selectAll("rect").data(dataset).enter().append("rect") // append rect per data entry

  bars.attr("class", "bar").attr("data-date", d => d[0]).attr("data-gdp", d => d[1]) // add tooltip attributes

  bars.attr("width",rectW).attr("height", d => yScale(d[1])) // set height and width

  bars.attr("x", (d, i) => xScale(i)).attr("y", d => svgH - pad - yScale(d[1])); // position bars in chart
};

function get_scales(dataset, height, width, pad){
  // get end of ranges
  const xRangeEnd = width - pad;
  const yRangeEnd = height - pad*2;
  // get max domain value
  const maxXvalue = dataset.length-1;
  const maxYvalue = d3.max(dataset, d => d[1]);
  // Get scale of X and Y
  const xScale = d3.scaleLinear().domain([0,maxXvalue]).range([pad, xRangeEnd]);
  const yScale = d3.scaleLinear().domain([0, maxYvalue]).range([0, yRangeEnd]);
  // get all dates to format thedate scale
  const dates = dataset.map(d => new Date(d[0]));
  const dateScale = d3.scaleTime().domain([d3.min(dates), d3.max(dates)]).range([pad, xRangeEnd])
  const gdpScale = d3.scaleLinear().domain([0, maxYvalue]).range([yRangeEnd + pad, pad]);

  return [xScale, yScale, dateScale, gdpScale]
};

function get_axes(datesScale, gdpScale){
  const xAxis = d3.axisBottom(datesScale);
  const yAxis = d3.axisLeft(gdpScale);

  return [xAxis, yAxis];
};

main();