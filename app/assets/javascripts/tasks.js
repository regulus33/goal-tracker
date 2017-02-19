$(document).ready(function() {
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
	        console.log(response)
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
	    })
	  }
	);
	//show progress chart 
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

      val = $(this).val()
      $(this).siblings().first().text(val)
    })
	// updateTasks();
});

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
	    })
	     .done(function(response){
	     	$("h1.text-center").text("New Tasks!")
	     	$(".row").remove();
	        $(".task-render").append(response);
	    })
    	}//is this a bug?

    });
  	    // Sets a timer that calls the updateTask function 1x a minute
    setTimeout(function () { updateTasks(); }, 10000);   
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
