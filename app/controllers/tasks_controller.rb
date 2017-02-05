class TasksController < ApplicationController
	def index 
	
	end

	def new
	 @task = Task.new 
	 # @task.completions.build 
	 @task.due_dates.build 
	end 
 
	def create 
	  task = Task.new(name: task_params[:name])
	  due_date = DueDate.new(date: task_params[:due_date][0][:date])
	  task.due_dates << due_date
	  current_user.tasks << task
	  
    end 

    private 

	def task_params
		params.require(:task).permit!
	end 
end
