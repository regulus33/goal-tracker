	$(document).ready(function() {
	updateSliders();
	$termSelect = $('#task_term').find(":selected").text();
	$('#task_term').change(function(){
		if($(this).find(":selected").text() == "never"){
			$("#due-date").css({"visibility":"visible" });
		}
		else{
			$("#due-date").css({"visibility":"hidden" });	
		}
	});
    //sort by day
	$(document).on("click", "#due-today", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/sortday",
	      method: 'get' 
	    })
	     .done(function(response){			
	        $(".row").remove();
	        $(".row").remove();
	        clearDom();
	        $(".task-render").append(response);
	        updateSliders();
	     })
	  }
	);
    //sort by week
	$(document).on("click", "#due-this-week", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/sortweek",
	      method: 'get'
	    })
	     .done(function(response){
		 	$( "#row" ).remove();
	        $(response).hide().appendTo(".task-render").slideDown(100);
	        // $('response').show().animate({ top: 305 }, {duration: 1000, easing: 'easeOutBounce'});
	        updateSliders();
	    })
	  }
	);
	//done animation NEWEST
	$(document).on("click", "input.submit-slide", function(event){
		console.log($(this).parents().eq(1))
		// $("h1").css({"text-decoration":"line-through"})
	  }
	);
    //sort by completed
	$(document).on("click", "a#completed-all", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/completeindex",
	      method: 'get'
	    })
	     .done(function(response){
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	        updateSliders();
	    })
	  }
	);
	//show progress chart for today
	$(document).on("click", "a#show-progress", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/showprogress",
	      method: 'get'
	    })
	     .done(function(response){
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	        drawD3Pie();
	    })
	  }
	);
	//show progress chart for this week
	$(document).on("click", "a#show-week-progress", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/showprogressweek",
	      method: 'get'
	    })
	     .done(function(response){
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	        drawD3Pie();
	    })
	  }
	);
	//show progress chart for all time
	$(document).on("click", "a#show-all-progress", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/showprogressall",
	      method: 'get'
	    })
	     .done(function(response){
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	        drawD3Pie();
	    })
	  }
	);
	//daily barchart
	$(document).on("click", "a#show-detail-today", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/detailtoday",
	      method: 'get'
	    })
	     .done(function(response){
	     	// debugger
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	        barchart();
	    })
	  }
	);
    //show progress for eachday of month
	$(document).on("click", "a#show-progress-each-day-of-month", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/showprogressmonth",
	      method: 'get'
	    })
	     .done(function(response){
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	        drawThirtyDays();
	        // date();
	    })
	  }
	);
    //complete a task
	$(document).on("click", "a.complete", function(event){
		event.preventDefault();
		task_id = $(this).attr("id");
		that = $(this).parent();
	    $.ajax({
	      url: ("/complete/" + task_id),
	      method: 'put'
	    })
	     .done(function(response){
	     	dimensions = {
	     		height : $(("div" + "#task-" + task_id)).height(),
	     		width  : $(("div" + "#task-" + task_id)).width()
			};
		 	$(("div" + "#task-" + task_id)).remove();
		    $fadeDiv = makeDiv(task_id, dimensions);
		    graphic(task_id);
		    $fadeDiv.parent().fadeOut(1000);
		    $fadeDiv.fadeOut(1000);
	     })
	  }
	);
	// task slider 
	$(document).on("input change", "input.slider", function() {
      val = $(this).val();
      $(this).siblings().eq(2).text(val);
    })
	// updateTasks();
	$(document).on("click", "a.show-slide", function(event){
		$(this).next().slideToggle("slow");	
	});
});

 function updateSliders(){
	$.each($("input.slider"), function( index, slider ) {
		value = $(this).attr("data");
		$(this).val(value)
	});
}


function drawD3Pie(){
	var width = 400,
    height = 400,
    radius = 200
    colors = d3.scale.ordinal()
        .range(['#595AB7','#A57706','#D11C24','#C61C6F','#BD3613','#2176C7','#259286','#738A05']);
    var ratio = jQuery.parseJSON($("#chart").attr("data-row")); //returns an array of JSONs like the commented out
	var pie = d3.layout.pie()
	    .value(function(d) {
	        return d.value;
	    })

	var arc = d3.svg.arc()
	    .outerRadius(radius)

	var myChart = d3.select('#chart').append('svg')
	    .attr('width', width)
	    .attr('height', height)
	    .append('g')
	    .attr('transform', 'translate('+(width-radius)+','+(height-radius)+')')
	    .selectAll('path').data(pie(ratio))
	    .enter().append('g')
	        .attr('class', 'slice')

	var slices = d3.selectAll('g.slice')
	        .append('path')
	        .attr('fill', function(d, i) {
	            return colors(i);
	        })
	        .attr('d', arc)

	var text = d3.selectAll('g.slice')
	    .append('text')
	    .text(function(d, i) {
	        return d.data.label;
	    })
	    .attr('text-anchor', 'middle')
	    .attr('fill', 'white')
	    .attr('transform', function(d) {
	        d.innerRadius = 0;
	        d.outerRadius = radius;
	        return 'translate('+ arc.centroid(d)+')'
	})
}

function drawManyD3Pie(){
	var width = 400,
    height = 400,
    radius = 200
    colors = d3.scale.ordinal()
        .range(['#595AB7','#A57706','#D11C24','#C61C6F','#BD3613','#2176C7','#259286','#738A05'])
    var ratios = jQuery.parseJSON($("#chart").attr("data-row")); //returns an array of JSONs like the commented out
	for (i = 0; i < ratios.length; i++){
		var pie = d3.layout.pie()
		    .value(function(d) {
		        return d.value;
		    })

		var arc = d3.svg.arc()
		    .outerRadius(radius)

		var myChart = d3.select("#index" + String(i)).append('svg')
		    .attr('width', width)
		    .attr('height', height)
		    .append('g')
		    .attr('transform', 'translate('+(width-radius)+','+(height-radius)+')')
		    .selectAll('path').data(pie(ratios[i]))
		    .enter().append('g')
		        .attr('class', 'slice')

		var slices = d3.selectAll('g.slice')
		        .append('path')
		        .attr('fill', function(d, i) {
		            return colors(i);
		        })
		        .attr('d', arc)

		var text = d3.selectAll('g.slice')
		    .append('text')
		    .text(function(d, i) {
		        return d.data.label;
		    })
		    .attr('text-anchor', 'middle')
		    .attr('fill', 'white')
		    .attr('transform', function(d) {
		        d.innerRadius = 0;
		        d.outerRadius = radius;
		        return 'translate('+ arc.centroid(d)+')'
		})
    }
}

function updateTasks() {
    //send a request to the server. If the server says that a task has been updated in the last 
    // hour, then we must call one of our partial display methods above, make sure to wrap them in their own 
    // functions
    $.ajax({
    	url: "/checkupdate",
	    method: 'get'
    }).done(function(taskStatus){
    	console.log(taskStatus.updated)
    	if (taskStatus.updated === "true"){
    	  $.ajax({
	        url: "/sortweek",
	        method: 'get'
	      }).done(function(response){
	     	$("h1.text-center").text("New Tasks!")
	     	$(".row").remove();
	     	$(".row").remove();
	        $(".task-render").append(response);
	      })
    	}
     });
  	    // Sets a timer that calls the updateTask function 1x a minute
    setTimeout(function () { updateTasks(); }, 60000);   
}

function makeDiv(task_id, dimensions){
	info = document.createElement( 'div' );
	info.style.position = 'relative';
	info.style.width = dimensions.height + 'px'
	info.style.height = dimensions.width + 'px' 
	info.style.textAlign = 'center';
	info.style.color = '#f00';
	info.style.backgroundColor = 'transparent';
	info.style.fontFamily = 'Monospace';
	info.style.userSelect = "none";
	info.style.webkitUserSelect = "none";
	info.style.MozUserSelect = "none";
	// info.innerHTML = "COMPLETE";
	info.setAttribute("id", "graphic-" + task_id);
	$(("#task-window-" + task_id)).append(info);
	return $(info)
}

function graphic(divIdNums){

	var container, camera, scene, renderer, mesh,

    mouse = { x: 0, y: 0 },
    objects = [],
    
    count = 0,

    // container = document.getElementById( 'canvas' );
    container = document.getElementById( 'graphic-' + divIdNums );//newly created div
    CANVAS_WIDTH = container.offsetWidth,
    CANVAS_HEIGHT = container.offsetHeight;


    renderer = new THREE.WebGLRenderer();
	renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
	camera.position.y = 150;
	camera.position.z = 500;
	camera.lookAt( scene.position );

	mesh = new THREE.Mesh( 
	    new THREE.BoxGeometry( 200, 200, 200, 1, 1, 1 ), 
	    new THREE.MeshBasicMaterial( { color : 0xff0000, wireframe: true } 
	) );
	scene.add( mesh );
	objects.push( mesh );
	// find intersections
	var vector = new THREE.Vector3();
	var raycaster = new THREE.Raycaster();
    // mouse listener
	document.addEventListener( 'mousedown', function( event ) {
	    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
	    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.height ) * 2 + 1;

	    vector.set( mouse.x, mouse.y, 0.5 );
	    vector.unproject( camera );

	    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	    intersects = raycaster.intersectObjects( objects );


	}, false );

	window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
          camera.aspect = (container.offsetWidth / container.offsetHeight)
          camera.updateProjectionMatrix();
          renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
       

	function render() {

	    mesh.rotation.y += 0.01;
	    
	    renderer.render( scene, camera );

	}

	(function animate() {

	    requestAnimationFrame( animate );

	    render();

	})();

}

function barchart(){
	var dataObjects = []; //we will iterate through the dom and add JSON objects to this array

	var list = document.getElementsByClassName("data-div");
	for (var i = 0; i < list.length; i++) {
		let taskObject =  JSON.parse(list[i].getAttribute("data-row"));
		taskObject.relevantData = taskObject.completion_value / taskObject.completion_max; 
	    dataObjects.push(  taskObject  ); //second console output
	}

	var height = 400,
	    width = 700,
	    barWidth = (width/dataObjects.length)*.5, //space bars out 
	    barOffset = 5;
	debugger
	var tempColor;
	var bardata = dataObjects.map(function(t){return t.relevantData});
	var colors = d3.scale.linear()
	.domain([0, d3.max(bardata)])
	// domain is the min and max of your data in this case 0 to 100 percent	
	.range(['#addbd8','#0092ed'])
	// You usu­ally make use of a range when you want to trans­form the value of a raw data point into a cor­re­spond­ing pixel coor­di­nate.
	//above, linear() returns a function, so colors is a function not a var 
	//sam goes below 
	var yScale = d3.scale.linear()
	        .domain([0, d3.max(bardata)])
	        .range([0, height]);

	var xScale = d3.scale.ordinal()
	        .domain(d3.range(0, dataObjects.length))
	        .rangeBands([0, width])

	var tooltip = d3.select('body').append('div')
	        .style('position', 'absolute')
	        .style('padding', '5px 10px')
	        .style('background', 'white')
	        .style('opacity', 0)

	var myChart = d3.select('#chart').append('svg')
	    .attr('width', width)
	    .attr('height', height)
	    .selectAll('rect').data(dataObjects)
	    .enter().append('rect')
	        .style('fill', function(d){
	        	return colors(d.relevantData);
	        })
	        .attr('width', barWidth)
	        .attr('x', function(d,i) {
	            return xScale(i);
	        })
	        .attr('height', 0)
	        .attr('y', height)

	    .on('mouseover', function(d) {

	        tooltip.transition()
	            .style('opacity', .9)
	        tooltip.html(d.relevantData + " " + d.task_name + " " + d.completion_unit)
	            .style('left', (d3.event.pageX - 35) + 'px')
	            .style('top',  (d3.event.pageY - 30) + 'px')


	        tempColor = this.style.fill;
	        d3.select(this)
	            .style('opacity', .5)
	            .style('fill', '#35607a')
	    })

	    .on('mouseout', function(d) {
	        d3.select(this)
	            .style('opacity', 1)
	            .style('fill', tempColor)
	    })

	myChart.transition()
	    .attr('height', function(d) {
	        return yScale(d.relevantData);
	    })
	    .attr('y', function(d) {
	        return height - yScale(d.relevantData);
	    })
	    .delay(function(d, i) {
	        return i * 20;
	    })
	    .duration(1000)
	    .ease('elastic')
}

function drawThirtyDays(){

	var bardata = [];
	// var data = [{"jsonDate":"09\/22\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"09\/26\/11","ratio":9,"seriesKey":"Website Usage"},{"jsonDate":"09\/27\/11","ratio":9,"seriesKey":"Website Usage"},{"jsonDate":"09\/29\/11","ratio":26,"seriesKey":"Website Usage"},{"jsonDate":"09\/30\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"10\/03\/11","ratio":3,"seriesKey":"Website Usage"},{"jsonDate":"10\/06\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"10\/11\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"10\/12\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"10\/13\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"10\/14\/11","ratio":5,"seriesKey":"Website Usage"},{"jsonDate":"10\/17\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"10\/18\/11","ratio":6,"seriesKey":"Website Usage"},{"jsonDate":"10\/19\/11","ratio":8,"seriesKey":"Website Usage"},{"jsonDate":"10\/20\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"10\/21\/11","ratio":4,"seriesKey":"Website Usage"},{"jsonDate":"10\/24\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"10\/25\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"10\/27\/11","ratio":3,"seriesKey":"Website Usage"},{"jsonDate":"11\/01\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"11\/02\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"11\/03\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"11\/04\/11","ratio":37,"seriesKey":"Website Usage"},{"jsonDate":"11\/08\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"11\/10\/11","ratio":39,"seriesKey":"Website Usage"},{"jsonDate":"11\/11\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"11\/14\/11","ratio":15,"seriesKey":"Website Usage"},{"jsonDate":"11\/15\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"11\/16\/11","ratio":5,"seriesKey":"Website Usage"},{"jsonDate":"11\/17\/11","ratio":4,"seriesKey":"Website Usage"},{"jsonDate":"11\/21\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"11\/22\/11","ratio":3,"seriesKey":"Website Usage"},{"jsonDate":"11\/23\/11","ratio":11,"seriesKey":"Website Usage"},{"jsonDate":"11\/24\/11","ratio":2,"seriesKey":"Website Usage"},{"jsonDate":"11\/25\/11","ratio":1,"seriesKey":"Website Usage"},{"jsonDate":"11\/28\/11","ratio":10,"seriesKey":"Website Usage"},{"jsonDate":"11\/29\/11","ratio":3,"seriesKey":"Website Usage"}];
	var list= document.getElementsByClassName("data-div");
	var data = [];
	for (var i = 0; i < list.length; i++) {
		let dataObject =  JSON.parse(list[i].getAttribute("data-row"));
		// dataObject.relevantData = dataObject.completion_value / dataObject.completion_max; 
	    data.push(  dataObject  ); //second console output
	}
    var dataArray = data.map(function(object){return object.ratio;})
	    // helper function
    function getDate(d) {
        return new Date(d.date);
    }
    
    // get max and min dates - this assumes data is sorted
    var minDate = getDate(data[0]),
        maxDate = getDate(data[data.length-1]);

	for (var i=0; i < 37; i++) {
	    bardata.push(Math.round(Math.random()*1000)+10)
	}

	//sorts horizontal ordinal
	bardata.sort(function compareNumbers(a,b) {
	    return a -b;
	});
	//to be passed to css declarations later 
	var margin = { top: 30, right: 30, bottom: 40, left:50 }
	//specify dimensions of graphic 
	var height = 400 - margin.top - margin.bottom,
	    width = 600 - margin.left - margin.right,
	    barWidth = (width/bardata.length)*.5, //this is where the bar size is defined
	    barOffset = 5;

	//declaring a var before it is fiven a value
	var tempColor;
	//setting up the color function 
	var colors = d3.scale.linear()
	.domain([0, dataArray.length*.33, dataArray.length*.66, dataArray.length])
	.range(['#B58929','#C61C6F', '#268BD2', '#85992C'])
	//setting up attributes for y axis, the scale, the height, domain etc.
	var yScale = d3.scale.linear()
	        .domain([0, d3.max(dataArray)])
	        .range([0, height]);
	//sizing of x axis
	var xScale = d3.scale.ordinal()
	        .domain(d3.range(0, data.length))
	        .rangeBands([0, width], 0.2)
	// newly inserted code for time 
	var timeScale = d3.time.scale().domain([minDate, maxDate]).range([0, width]);
	//pop up info 
	tooltip = d3.select('body').append('div')
	        .style('position', 'absolute')
	        .style('padding', '0 10px')
	        .style('background', 'white')
	        .style('opacity', 0)
	        .attr("class", "tooltip")
	
    //the actual graphic 
  	//adding attributes for svg elements  
	var myChart = d3.select('#chart').append('svg')
	    .style('background', 'white')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
	    .append('g')
	    .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
	    .selectAll('rect').data(dataArray)
	    .enter().append('rect')
	        .style('fill', function(d,i) {
	            return colors(i);
	        })
	        .attr('width', barWidth )
	        .attr('x', function(d,i) {
	            return xScale(i);
	        })
	        .attr('height', 0)
	        .attr('y', height)

	    .on('mouseover', function(d) {

	        tooltip.transition()
	            .style('opacity', .9)

	        tooltip.html(d)
	            .style('left', (d3.event.pageX - 35) + 'px')
	            .style('top',  (d3.event.pageY - 30) + 'px')

	        // declared on line ~512
	        tempColor = this.style.fill;
	        d3.select(this)
	            .style('opacity', .5)
	            .style('fill', 'yellow')
	    })

	    .on('mouseout', function(d) {
	        d3.select(this)
	            .style('opacity', 1)
	            .style('fill', tempColor)
	    })
	//animation 
	myChart.transition()
	    .attr('height', function(d) {
	        return yScale(d);
	    })
	    .attr('y', function(d) {
	        return height - yScale(d);
	    })
	    .delay(function(d, i) {
	        return i * 20;
	    })
	    .duration(800)
	    .ease('elastic')
	//guide
	var vGuideScale = d3.scale.linear()
	    .domain([0, d3.max(dataArray)*100])
	    .range([height, 0])
	//the axis needs to know the scale so we can end and begin appropriatetly 
	var vAxis = d3.svg.axis()
	    .scale(vGuideScale)
	    .orient('left')
	    .ticks(10)
	//this is the actual guide and its visual properties 
	var vGuide = d3.select('svg').append('g')
	    vAxis(vGuide)
	    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
	    vGuide.selectAll('path')
	        .style({ fill: 'none', stroke: "#000"})
	    vGuide.selectAll('line')
	        .style({ stroke: "#000"})
	//heres what were concerned with 

	var hAxis = d3.svg.axis()
	    .scale(timeScale)
	    .orient('bottom')
	    // .ticks(d3.time.month, 1)
        .tickFormat(d3.time.format('%x'))
	    .tickValues(timeScale.domain());
	    //this is basically working we just need to specify amount of printed dates
	    //and make sure data is same length?

	var hGuide = d3.select('svg').append('g')
	    hAxis(hGuide)
	    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
	    hGuide.selectAll('path')
	        .style({ fill: 'none', stroke: "#000"})
	    hGuide.selectAll('line')
	        .style({ stroke: "#000"})
}	

function date(){
	var data = [
  {
    "air_produced": 0.660985, 
    "air_used": 0.342706, 
    "datestr": "2012-12-01 00:00:00", 
    "energy_used": 0.106402
  }, 
  {
    "air_produced": 0.824746, 
    "air_used": 0.400776, 
    "datestr": "2013-01-01 00:00:00", 
    "energy_used": 0.250462
  }, 
  {
    "air_produced": 0.181898, 
    "air_used": 0.003541, 
    "datestr": "2013-02-01 00:00:00", 
    "energy_used": 0.000582
  }, 
  {
    "air_produced": 1.096685, 
    "air_used": 0.97719, 
    "datestr": "2013-03-01 00:00:00", 
    "energy_used": 0.923212
  }, 
  {
    "air_produced": 0.283379, 
    "air_used": 0.241088, 
    "datestr": "2013-04-01 00:00:00", 
    "energy_used": 0.23381
  }
];

// Margins, width and height. 
var margin = {top: 20, right: 20, bottom: 30, left: 10},
    body_width = 500,
    width = body_width - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// Scales.
var x = d3.time.scale().range([width/data.length/2, width-width/data.length/2]);
var y = d3.scale.linear().range([height, 0]);

// Construct our SVG object.
var svg = d3.select(".system-efficiency").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X-axis.
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // COULD BE IMPORTANT///////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    .ticks(d3.time.month, 1)
    .tickFormat(d3.time.format('%b %Y'));
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Date parsing.
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S");
data.forEach(function(d) {
  d.date = parseDate.parse(d.datestr);
});

// Set scale domains. 
x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) { return d.air_used; })]);

// Call x-axis. 
d3.select(".x.axis")
    .transition().duration(1000)
    .call(xAxis);

// Draw bars. 
var bars = svg.selectAll(".air_used")
        .data(data, function(d) { return d.datestr; });

bars.exit().remove();
    
bars.transition().duration(1000)
    .attr("x", function(d) { return x(d.date) - width/data.length/2; })
    .attr("width", width / data.length)
    .attr("y", function(d) { return y(d.air_used); })
    .attr("height", function(d) { return height - y(d.air_used);});
    
bars.enter().append("rect")
    .attr("class", "air_used")
    .attr("width", width / data.length)
    .attr("x", function(d) { return x(d.date) - (width/data.length)/2; })
    .attr("y", height)
    .attr("height", 0)
    .transition().duration(1000)
    .attr("y", function(d) { return y(d.air_used); })
    .attr("height", function(d) { return height - y(d.air_used);});

}

function clearDom() {
	$(".tooltip").remove();
} 


