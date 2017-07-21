$(function(){
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    /*
     var nodes = [
        {"id": "Myriel", "group": 1},
        {"id": "Napoleon", "group": 1},
        {"id": "Mlle.Baptistine", "group": 1},
        {"id": "Mme.Magloire", "group": 1},
        {"id": "CountessdeLo", "group": 1},
        {"id": "Geborand", "group": 1},
        {"id": "Champtercier", "group": 1},
        {"id": "Cravatte", "group": 1},
        {"id": "Count", "group": 1}
    ];

    var links = [
        {"source": "Napoleon", "target": "Myriel", "value": 1},
        {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
        {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
        {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6}
    ];
    */

    var nodes = [
        {"id" : "parent", "group": 1, "radius": 60},
        {"id" : "child1", "group": 1, "radius": 30},
        {"id" : "child2", "group": 1, "radius": 30},
        {"id" : "child3", "group": 1, "radius": 30},
        {"id" : "child4", "group": 1, "radius": 30},
        {"id" : "child5", "group": 1, "radius": 30},
        {"id" : "child6", "group": 1, "radius": 30},
        {"id" : "child7", "group": 1, "radius": 30},
        {"id" : "child8", "group": 1, "radius": 30},
        {"id" : "child9", "group": 1, "radius": 30},
        {"id" : "child10", "group": 1, "radius": 30},


        {"id" : "child11", "group": 2, "radius": 10},
        {"id" : "child12", "group": 2, "radius": 10},
        {"id" : "child13", "group": 2, "radius": 10},
        {"id" : "child14", "group": 2, "radius": 10},
        {"id" : "child15", "group": 2, "radius": 10},
        {"id" : "child16", "group": 2, "radius": 10},
        {"id" : "child17", "group": 2, "radius": 10}
    ];

    var links = [
        {"source": "parent", "target" : "child1", "value": 1},
        {"source": "parent", "target" : "child2", "value": 1},
        {"source": "parent", "target" : "child3", "value": 1},
        {"source": "parent", "target" : "child4", "value": 1},
        {"source": "parent", "target" : "child5", "value": 1},
        {"source": "parent", "target" : "child6", "value": 1},
        {"source": "parent", "target" : "child7", "value": 1},
        {"source": "parent", "target" : "child8", "value": 1},
        {"source": "parent", "target" : "child9", "value": 1},
        {"source": "parent", "target" : "child10", "value": 1},

        {"source": "child5", "target" : "child11", "value": 1, "dist": 25, "charge": 0.01},
        {"source": "child5", "target" : "child12", "value": 1, "dist": 25, "charge": 0.01},
        {"source": "child5", "target" : "child13", "value": 1, "dist": 25, "charge": 0.01},
        {"source": "child5", "target" : "child14", "value": 1, "dist": 25, "charge": 0.01},
        {"source": "child5", "target" : "child15", "value": 1, "dist": 25, "charge": 0.01},
        {"source": "child5", "target" : "child16", "value": 1, "dist": 25, "charge": 0.01},
        {"source": "child5", "target" : "child17", "value": 1, "dist": 25, "charge": 0.01}

    ];

    var paths = [
      
    ];

    //center the parent node
    nodes[0].fixed = true;
    nodes[0].x = width/2;
    nodes[0].y = height/2;


    var color = d3.scaleOrdinal(d3.schemeCategory20);   

     //create simulation for all our nodes
     //or a collection of forces 
     //here we have two forces defined; 'link', 'charge' and 'center'
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .distance(function(d){if(d.dist) return d.dist; return 200;})    
            .id(function(d) { return d.id; })
            .strength(1))


        .force("charge", d3.forceManyBody().strength(function(d){
          var charge = -500;
          if(d.index === 0) charge = 10*charge;
          return charge;
        }))
        .force("center", d3.forceCenter(width/2, height/2))

    var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
     .attr("class", "nodes")
     .selectAll("circle")
     .data(nodes)
     .enter().append("circle")
      .attr("r", function(d){ return d.radius; })
      .attr("fill", function(d) { return color(d.group); })
     .on("mouseup", mouseup);

     node.append("title")
        .text(function(d) { return d.id; });      

  //fire the function 'ticked' on simulation tick
  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);


   function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }  

  function mouseup(d, i){
    //console.log(d3.event);
  d3.select(this).transition()
      .style("fill", "black")
      .attr("r", 64)
    .transition()
      .attr("r", d.radius)
      .style("fill", color(d.group));    
  }  

});