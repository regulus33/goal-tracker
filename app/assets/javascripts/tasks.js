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
		 	$(("div" + "#task-" + task_id)).css({"visibility": "hidden"});
		    makeDiv(task_id);
		    graphic(task_id);
	     })
	  }
	);

});

function makeDiv(task_id){
	info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.padding = '7px';
	info.style.top = '-7px';
	info.style.width = ($(("#task-window-" + task_id)).width()/1.2).toString() + 'px'
	info.style.height = ($(("#task-window-" + task_id)).height()/1.2).toString() + 'px' 
	info.style.textAlign = 'center';
	info.style.color = '#f00';
	info.style.backgroundColor = 'transparent';
	info.style.fontFamily = 'Monospace';
	info.style.userSelect = "none";
	info.style.webkitUserSelect = "none";
	info.style.MozUserSelect = "none";
	info.innerHTML = "COMPLETE";
	info.setAttribute("id", "graphic-" + task_id);
	$(("#task-window-" + task_id)).append(info);
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

	// window.addEventListener('resize', onWindowResize, false);
 //        function onWindowResize() {
 //          camera.aspect = window.innerWidth / window.innerHeight;
 //          camera.updateProjectionMatrix();
 //          renderer.setSize(window.innerWidth, window.innerHeight);
 //    }
       

	function render() {

	    mesh.rotation.y += 0.01;
	    
	    renderer.render( scene, camera );

	}

	(function animate() {

	    requestAnimationFrame( animate );

	    render();

	})();
}
