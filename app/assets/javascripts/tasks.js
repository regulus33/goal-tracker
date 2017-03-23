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
	     	$(".row").remove();
	        $(".task-render").append(response);
	        updateSliders();
	    })
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
	        $(".task-render").append(response);
	        drawD3Pie();
	    })
	  }
	);
	//TEST TEST TEST ALERT ALERT 
	$(document).on("click", "a#show-detail-today", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/detailtoday",
	      method: 'get'
	    })
	     .done(function(response){
	     	// debugger
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
	        $(".task-render").append(response);
	        drawManyD3Pie();
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
      $(this).siblings().first().text(val);
    })
	// updateTasks();
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
    //'piedata' below
	// var piedata = [
	//     {   label: "Barot",
	//         value: 50 },
	//     {   label: "Gerard",
	//         value: 50},
	//     {   label: "Jonathan",
	//         value: 50},
	//     {   label: "Lorenzo",
	//         value: 50},
	//     {   label: "Hillary",
	//         value: 50},
	//     {   label: "Jennifer",
	//         value: 50}
	// ]
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
    debugger
    //'piedata' below
	// var piedata = [
	//     {   label: "Barot",
	//         value: 50 },
	//     {   label: "Gerard",
	//         value: 50},
	//     {   label: "Jonathan",
	//         value: 50},
	//     {   label: "Lorenzo",
	//         value: 50},
	//     {   label: "Hillary",
	//         value: 50},
	//     {   label: "Jennifer",
	//         value: 50}
	// ]
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

	// var bardata = [];
	var dataObjects = []; //we will iterate through the dom and add JSON objects to this array

	var list= document.getElementsByClassName("data-div");
	for (var i = 0; i < list.length; i++) {
		let taskObject =  JSON.parse(list[i].getAttribute("data-row"));
		taskObject.relevantData = taskObject.completion_value / taskObject.completion_max; 
	    dataObjects.push(  taskObject  ); //second console output
	}

	var height = 400,
	    width = 600,
	    barWidth = (width/dataObjects.length)*.5, //space bars out 
	    barOffset = 5;

	var tempColor;
	var bardata = dataObjects.map(function(t){return t.relevantData});
	debugger
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
