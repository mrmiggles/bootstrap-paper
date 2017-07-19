$(function(){
	
	var svg = d3.select("svg");
	//var circle = d3.selectAll("circle");
	//circle.style("fill", "steelblue");
	//circle.attr("r", 30);
	//circle.data([32, 57, 112, 298]);
	//circle.attr("r", function(d) { return Math.sqrt(d); });
	//circle.attr("cx", function() { return Math.random() * 720; });

	/*
	
	svg.selectAll("circle")
    .data([32, 57, 112, 293])
  	.enter().append("circle")
    .attr("cy", 60)
    .attr("cx", function(d, i) { return i * 100 + 30; })
    .attr("r", function(d) { return Math.sqrt(d); })
    .attr("style", "fill:steelblue;");	
    */
    var initialBubble = {"x" : 200, "y" : 200};
    x = 
    var graph = {
    	"nodes" : [
    		{"name": "1", "x" : 200, "y" : 200, "r" : 60},
    		{"name": "2", "x" : 90, "y" : 200, "r" : 30},
    		{"name": "3", "x" : 200, "y" : 200, "r" : 30},
    		{"name": "4", "x" : 250, "y" : 200, "r" : 30},
    		{"name": "5", "x" : 350, "y" : 200, "r" : 30},
    	]
    };

   var circles = svg.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .style("stroke", "black")
            .style("fill", "white")
            .attr("r", function(d, i){ return d.r })
            .attr("cx", function(d, i){ return d.x })
            .attr("cy", function(d, i){ return d.y })    
});