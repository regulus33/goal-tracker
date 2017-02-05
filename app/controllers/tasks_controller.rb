class TasksController < ApplicationController
	def index 
	
	end

	def new
	 @task = Task.new 
	 # @task.completions.build 
	 @task.due_dates.build 
	end 
 
	def create 
	  task = Task.new(name: task_params[:name])#create a task
	  due_date = DueDate.new(date: task_params[:due_date][0][:date])#create a task
	  task.due_dates << due_date#create a task
	  current_user.tasks << task#create a task
	  completion = Completion.new(completion: 0, completion_value: params[:completion_value])
	  
    end 

    private 

	def task_params
		params.require(:task).permit!
	end 
end
