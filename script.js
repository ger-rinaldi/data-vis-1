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

  // Create d3.svg object
  const svg = d3.select("body").select("svg");

  // Get height and width to compute scales and positioning of bars and axis
  const svgH = svg.node().clientHeight;
  const svgW = svg.node().clientWidth;
  // get standar width of each bar
  const rectW = svgW / dataset.length;
};

main();