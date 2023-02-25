/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/


d3.json("data/buildings.json").then(data => {
	
    data.forEach(d => {
		d.height = Number(d.height)
        console.log(d)
	})
	
	const svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500)

	const rect = svg.selectAll("rect")
		.data(data)

	rect.enter().append("rect")
        .attr("x", (d, i) => (i * 50))
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", (d) => d.height)
        .attr("fill", "red")
}).catch(error => {
	console.log(error)
})