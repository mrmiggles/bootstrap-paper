$(function(){
  
var flatData = [
  {"name": "Components", "parent": null},
  {"name": "Other", "parent": "Components"},
  {"name": "Relay", "parent": "Components"},
  {"name": "Switch", "parent": "Components"},
  {"name": "Resistitve Position Sensor", "parent": "Other"},
  {"name": "Inclinometer", "parent": "Other"},
  {"name": "SPST", "parent": "Relay"},
  {"name": "DPDT", "parent": "Relay"},
  {"name": "Momentary", "parent": "Switch"},
  {"name": "4PDT", "parent": "Relay"},
  {"name": "Tilt", "parent": "Switch"},
  {"name": "Pirate", "parent": "Tilt"},
];

var flatData = [
  {"@unid": "1", "Subtype": "Components", "Type": null},
  {"@unid": "2", "Subtype": "Communication", "Type": "Components"},
  {"@unid": "2", "Subtype": "Other", "Type": "Components"},
  {"@unid": "3", "Subtype": "Relay", "Type": "Components"},
  {"@unid": "4", "Subtype": "Switch", "Type": "Components"},
  {"@unid": "5", "Subtype": "Resistitve Position Sensor", "Type": "Other"},
  {"@unid": "6", "Subtype": "Inclinometer", "Type": "Other"},
  {"@unid": "7", "Subtype": "SPST", "Type": "Relay"},
  {"@unid": "8", "Subtype": "DPDT", "Type": "Relay"},
  {"@unid": "9", "Subtype": "Momentary", "Type": "Switch"},
  {"@unid": "10", "Subtype": "4PDT", "Type": "Relay"},
  {"@unid": "11", "Subtype": "Tilt", "Type": "Switch"},
  {"@unid": "12", "Subtype": "Pirate", "Type": "Tilt"},
];


var i = 0,
    duration = 550,
    rectW = 70,
    rectH = 30;

// convert the flat data into a hierarchy 
var treeData = d3.stratify()
  .id(function(d) { return d.Subtype; })
  .parentId(function(d) { return d.Type; })
  (flatData);

treeData.each(function(d) {
    d.name = d.data.Subtype;
  });
  // assign the name to each node
  treeData.each(function(d) {
    d.name = d.id; //transferring name to a name variable
    d.id = i; //Assigning numerical Ids
    i++;
  });

// set the dimensions and margins of the diagram
var margin = {top: 40, right: 90, bottom: 50, left: 90},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

treeData.x0 = 0;
treeData.y0 = height / 2;


  // append the svg obgect to the body of the page
  // moves the 'group' element to the top left margin
  var svg = d3.select("svg")
        .attr("width", 1000)
        .attr("height", 1000),
      g = svg.append("g")
        .attr("transform",
              "translate(" + 390 + "," + margin.top + ")");

// declares a tree layout and assigns the size
var treemap = d3.tree()
    .nodeSize([width/3, height/3])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

//collapese the first level
treeData.children.forEach(collapse);
updateNodes(treeData);

function updateNodes(source) {

  /*
  // assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData);
  // maps the node data to the tree layout
  nodes = treemap(nodes);
  */
  var nodes = treemap(treeData).descendants();
  var links = nodes.slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function (d) {
      d.y = d.depth * 180;
  });

  /*************************************
      Node
  **************************************/
  // adds each node as a group
  var node = g.selectAll(".node")
   //.data(nodes.descendants())
   .data(nodes, function (d) {
        return d.id || (d.id = ++i);
    });

   var nodeEnter = node.enter().append("g")
   .attr("class", function(d) { 
      return "node" + 
        (d._children ? " node--internal" : " node--leaf"); })
   .attr("transform", function(d) { 
      return "translate(" + (source.x0 - 30) + "," + source.y0 + ")"; })
   .on("click", click);

// adds the rect to the node
  nodeEnter.append("rect")
    .attr("width", rectW)
    .attr("height", function(d){
      var n = d.data.Subtype.split(" ");
      if(n.length > 1) return rectH*2;
      return rectH;
    })

// adds the text to the node
  nodeEnter.append("text")
   .attr("x", rectW / 2)
   .attr("y", rectH / 2)
   .attr("dy", 0)
   .attr("transform", "translate(0," + 5 + ")")
   .attr("text-anchor", "middle")
   .text(function(d){return d.data.Subtype})
   .call(wrap, rectW);  

    // Transition nodes to their new position.
    var nodeUpdate = node.merge(nodeEnter).transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + (d.x - 30) + "," + d.y + ")";
    });

    nodeUpdate.select("rect")
        .attr("width", rectW)
        .attr("height", function(d){
          var n = d.data.Subtype.split(" ");
          if(n.length > 1) return rectH*2;
          return rectH;
        })
        .attr("stroke", "#3F88FF")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
        return d._children ? "#FFDFC7" : "#fff";
    });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
    }).remove();

    nodeExit.select("rect")
     .attr("width", rectW)
      .attr("height", function(d){
        var n = d.data.Subtype.split(" ");
        if(n.length > 1) return rectH*2;
        return rectH;
      })
     .attr("stroke", "#3F88FF")
     .attr("stroke-width", 1);

    nodeExit.select("text");   

 /*************************************
      Link 
  **************************************/
  // adds the links between the nodes
  var link = g.selectAll("path.link")
    //.data(nodes.descendants().slice(1))
    .data(links, function(link) { var id = link.id + '->' + link.parent.id; return id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert("path", "g")
                      .attr("class", "link")
                      .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0, parent:{x: source.x0, y: source.y0}};
      return connector(o);
    });   

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", connector);

    // Transition links to their new position.
    link.merge(linkEnter).transition()
        .duration(duration)
        .attr("d", connector);      

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
          var o = {x: source.x, y: source.y, parent:{x: source.x, y:source.y}};
          return connector(o);
        }).remove();

     
    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });       
}


// Draw Bezier curve for a link
function connector(d) {
   return "M" + d.x + "," + d.y
     + "C" + d.x + "," + (d.y + d.parent.y) / 2
     + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
     + " " + d.parent.x + "," + d.parent.y;
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    updateNodes(d);
}

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}        

//wrap text if it's too long for the rectangle
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}        

});