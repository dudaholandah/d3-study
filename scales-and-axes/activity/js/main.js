const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
   
const g = d3.select("#chart-area")
// creating the area of our chart
  .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
// adding our margin
  .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// adding x label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")
// adding y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

// reading csv file
d3.csv("data/revenues.csv").then(data => {

  // change data attr to number
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  // x 
  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  // y
  const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.revenue)])
  .range([HEIGHT, 0])

  
  // adding x to svg group
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(d3.axisBottom(x))

  // adding y to svg group
  g.append("g")
    .attr("class", "y axis")
    .call(
      d3.axisLeft(y)
        .ticks(10)
        .tickFormat(d => "$" + d)
    )

  const rects = g.selectAll("rect")
    .data(data)
  
  // appending rects to chart
  rects.enter().append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "green")

})


