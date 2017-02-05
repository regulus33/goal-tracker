class TasksController < ApplicationController
	def index 
	
	end

	def new
	 @task = Task.new 
	 # @task.completions.build 
	 @task.due_dates.build 
	 @task.completions.build 
	end 
 
	def create 
	  task = Task.new(name: task_params[:name])#create a task
	  due_date = DueDate.new(date: DateTime.parse(task_params[:due_date][0][:date]))#create a task
	  task.due_dates << due_date#create a task
	  current_user.tasks << task#create a task
	  completion = Completion.new(completed: 0, completion_value: params[:completion_value].to_i)
	  task.completions << completion
	  due_date.save!
	  completion.save!
	  task.save!
	  redirect_to '/tasks'
    end 

    private 

	def task_params
		params.require(:task).permit!
	end 
end
