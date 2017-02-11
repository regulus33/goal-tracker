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

	$(document).on("click", "#due-this-week", function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/sortweek",
	      method: 'get'
	    })
	     .done(function(response){
	     	$(".row").remove();
	        $(".task-render").append(response);
	        console.log(response)
	     })
	  }
	);

});