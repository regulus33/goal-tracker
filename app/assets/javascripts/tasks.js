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

	$(document).on("click", $("#due-this-week"), function(event){
		event.preventDefault();
	    $.ajax({
	      url: "/sortday",
	      method: 'get'
	    })
	     .done(function(response){
	        console.log(response);
	     })
	  }
	);

});
