class TasksController < ApplicationController
	def index 
		
	end

	def today 
	  @task = ""	
	  render :partial => "/index/index"
	end

	def new
		@task = Task.new 
		@task.due_dates.build 
	    @task.completions.build 
	end 

	def create 
		task = Task.new(
		 name: task_params[:name],
		 completion_max: task_params[:completion_max].to_i,
         description: task_params[:description],
	     completion_unit:task_params[:completion_unit],
	     term: task_params[:term]
	      )
		unless task_params[:due_date][0][:date] == ""
			due_date = DueDate.new(date: DateTime.parse(task_params[:due_date][0][:date]))
			task.due_dates << due_date
		    due_date.save!
		else
		    due_date = DueDate.new(date: DateTime.parse(Time.now.to_s))
		    task.due_dates << due_date
		    due_date.save!
		end
		current_user.tasks << task
		completion = Completion.new(completed: task_params[:completed].to_i, completion_value: task_params[:completion_value].to_i)
		task.completions << completion
		completion.save!
		task.save!
		redirect_to '/tasks'
	end 

	private 

	def task_params
		params.require(:task).permit!
	end 
end
