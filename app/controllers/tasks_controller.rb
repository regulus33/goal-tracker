class TasksController < ApplicationController
	def index 
	
	end

	def new
	 @task = Task.new 
	 # @task.completions.build 
	 @task.due_dates.build 
	end 
 
	def create 

    end 

    private 

	def session_params
		params.require(:session).permit(:email, :password)
	end 
end
