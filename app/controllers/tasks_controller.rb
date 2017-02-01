class TasksController < ApplicationController
	def new
	  @task = Task.new 
	end

	def index 
		render 'index'
	end  
end
