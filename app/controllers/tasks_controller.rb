class TasksController < ApplicationController
	def index 
	
	end

	def new
	 @task = Task.new 
	 # @task.completions.build 
	 @task.due_dates.build 
	end 
 
	def create 
		binding.pry

    end 

    private 

	def task_params
		params.require(:task).permit(:name, :due_date => [{:date}])
	end 
end
