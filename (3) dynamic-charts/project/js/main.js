const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

let flag = 0
let year = 1800

// create the area of our chart and adding our margin
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// x label
g.append("text")
  .attr("class", "x label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)")

// y label
g.append("text")
  .attr("class", "y label")
  .attr("x", -HEIGHT/2)
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)")

// year label
const yearLabel = g.append("text")
	.attr("y", HEIGHT - 10)
	.attr("x", WIDTH - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text(String(year))

// log scale for x
const x = d3.scaleLog()
  .base(10)
  .range([0, WIDTH])
  .domain([142, 150000])
  
// linear scale for y
const y = d3.scaleLinear()
  .range([HEIGHT, 0])
  .domain([0,90])

// area of each circle
const area = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000])

// continent color
const continentColor = d3.scaleOrdinal(d3.schemePastel1)

// x and y axis (no transitionS so we can keep it here)
const xAxisCall = d3.axisBottom(x)
  .ticks([400, 4000, 40000])
  .tickFormat(d => d + "$")
g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .call(xAxisCall)

const yAxisCall = d3.axisLeft(y)
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall)

d3.json("data/data.json").then(function(data){

  // clean data
	const formattedData = data.map(year => {
		return year["countries"].filter(country => {
			const dataExists = (country.income && country.life_exp)
			return dataExists
		}).map(country => {
			country.income = Number(country.income)
			country.life_exp = Number(country.life_exp)
			return country
		})
	})

  d3.interval(() => {
    flag = (flag + 1) % 214
    year = 1800 + flag
    update(formattedData[flag])
  }, 100)

  update(formattedData[flag])

})

function update(data){
  const t = d3.transition().duration(75)

  // join new data with old elements
  const circles = g.selectAll("circle")
		.data(data, d => d.country)

  // exit old elements not present in new data
	circles.exit().remove()

  // enter new elements present in new data.
  circles.enter().append("circle")
		.attr("fill", d => continentColor(d.continent))
		.merge(circles)
		.transition(t)
			.attr("cy", d => y(d.life_exp))
			.attr("cx", d => x(d.income))
			.attr("r", d => Math.sqrt(area(d.population) / Math.PI))

  // update the time label
	yearLabel.text(String(year))      
}