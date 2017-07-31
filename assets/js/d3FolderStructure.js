var flatData;
$(function(){

var droppedFiles = new Object();
flatData = [
  {"name": "Uploads", "parent": null, "isFolder": true},
  {"name": "Documents", "parent": "Uploads", "isFolder": true},
  {"name": "Images", "parent": "Uploads", "isFolder": true},
  {"name": "John.jpg", "parent": "Images"},
  {"name": "Report.docx", "parent": "Documents"},
  {"name": "Jane.png", "parent": "Images"}
];

var i = 0,
    duration = 550,
    rectW = 70,
    rectH = 30;

// convert the flat data into a hierarchy 
var treeData = d3.stratify()
  .id(function(d) { return d.name; })
  .parentId(function(d) { return d.parent; })
  (flatData);

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
   .data(nodes, function (d) {
        return d.id || (d.id = ++i);
    });

   var nodeEnter = node.enter().append("g")
   .attr("class", function(d) { 
      return "node" + 
        (d._children ? " node--internal" : " node--leaf"); })
   .attr("transform", function(d) { 
      return "translate(" + (source.x0 - 30) + "," + source.y0 + ")"; })
   .on("click", click)
   .on('dragover', handleDragOver)
   .on("drop", handleFileSelect);

// adds icon to the node
nodeEnter.append("image")
  .attr("xlink:href", function(d) {
        var img_dir = "assets/img/"; 
        if(d.data.isFolder) return img_dir + "folder_full.png"; 
        return img_dir + "file_icon.png";
      })
  .attr("x", "-12px")
  .attr("y", "-12px")
  .attr("width", "48px")
  .attr("height", "48px")
  
// adds the text to the node
  nodeEnter.append("text")
   .attr("x", rectW / 2)
   .attr("y", rectH / 2)
   .attr("dy", 0)
   .attr("transform", "translate(0," + 5 + ")")
   .attr("text-anchor", "middle")
   .text(function(d){return d.data.name})
   .attr("class", "new-file")
   .call(wrap, rectW);  

    // Transition nodes to their new position.
    var nodeUpdate = node.merge(nodeEnter).transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
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
        var n = d.data.name.split(" ");
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
                      .attr("class", function(d){ if(d.data.newFile) return "link new"; return "link"})
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

function handleFileSelect(d) {
  
  var event = d3.event;
  event.preventDefault();
  event.stopPropagation();

  if(!d.data.isFolder || d.data.parent == null) return; //is not a folder node or is the root

  if(d._children) click(d); //expand node before adding to it
  var files = event.dataTransfer.files // FileList object
  var selected = d;
  //console.log(d)
  for (var i = 0, file; file = files[i]; i++) {
    flatData.push({"name": file.name, "parent": d.data.name});
       //creates New OBJECT
      var newNodeObj = {
        name: file.name,
        parent: d.data.name,
        newFile: true
      };
      //Creates new Node 
      var newNode = d3.hierarchy(newNodeObj);
      newNode.depth = d.depth + 1; 
      newNode.height = d.height - 1;
      newNode.parent = d; 
      newNode.id = file.name;

      //Selected is a node, to which we are adding the new node as a child
      //If no child array, create an empty array
      if(!d.children){
        d.children = [];
        d.data.children = [];
      }

      //Push it to parent.children array  
      d.children.push(newNode);
     // d.data.children.push(newNode);
  }

    updateNodes(d);
}

function handleDragOver() {
  var ev = d3.event;
  ev.stopPropagation();
  ev.preventDefault();
  ev.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
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