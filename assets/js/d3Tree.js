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
  {"name": "Tilt", "parent": "Switch"}
];

var i = 0,
    duration = 750,
    rectW = 60,
    rectH = 30;

// convert the flat data into a hierarchy 
var treeData = d3.stratify()
  .id(function(d) { return d.name; })
  .parentId(function(d) { return d.parent; })
  (flatData);

// assign the name to each node
treeData.each(function(d) {
    d.name = d.id;
  });

// set the dimensions and margins of the diagram
var margin = {top: 40, right: 90, bottom: 50, left: 90},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree()
    .nodeSize([width/3, height/3])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData);

// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg obgect to the body of the page
// moves the 'group' element to the top left margin
var svg = d3.select("svg")
      .attr("width", 1000)
      .attr("height", 1000),
    g = svg.append("g")
      .attr("transform",
            "translate(" + 390 + "," + margin.top + ")");

// adds the links between the nodes
var link = g.selectAll("path.link")
    .data( nodes.descendants().slice(1))
  .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
       return "M" + d.x + "," + d.y
         + "C" + d.x + "," + (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," + d.parent.y;
       });

// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants())
  .enter().append("g")
    .attr("class", function(d) { 
      return "node" + 
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });

// adds the rect to the node
      node.append("rect")
        .attr("width", rectW)
        .attr("height", function(d){
          var n = d.data.name.split(" ");
          if(n.length > 1) return rectH*2;
          return rectH;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    });

// adds the text to the node
    node.append("text")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
          var n = d.data.name.trim().split(" ");
          console.log(n.length)
          var nameFormatted = "";
          for(let i in n) {
            nameFormatted += (nameFormatted == "") ? n[i] : "\r\n" + n[i];
          }
        return nameFormatted;
    });

});