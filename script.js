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
  const pad = 30;
  
  // Create d3.svg object
  const svg = d3.select("body").select("svg");

  // Get height and width to compute scales and positioning of bars and axis
  const svgH = svg.node().clientHeight;
  const svgW = svg.node().clientWidth;
  // get standar width of each bar
  const rectW = svgW / dataset.length;
  
  // get scales and axes
  const [xScale, yScale] = get_scales(dataset, svgH, svgW, pad);
  const [xAxis, yAxis] = get_axes(xScale, yScale);

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
  return [xScale, yScale]
};

function get_axes(xScale, yScale){
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  return [xAxis, yAxis];
};

main();