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
	        console.log(response)
	     })
	  }
	);
    //complete a task
	$(document).on("click", "a.complete", function(event){
		event.preventDefault();
		task_id = $(this).attr("id")
		that = $(this).parent()
	    $.ajax({
	      url: ("/complete/" + task_id),
	      method: 'put'
	    })
	     .done(function(response){
	        console.log(response)
	      $(("div" + "#task-" + task_id)).remove()
	      $(("div" + "#task-window-" + task_id)).append(response)

	     })
	  }
	);

});
