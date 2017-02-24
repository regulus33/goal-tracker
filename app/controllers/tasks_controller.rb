class TasksController < ApplicationController
	def index 
		
	end

	def today 
	  @task = ""	
	  render :partial => "/index/indextoday"
	end

	def this_week
		render :partial => "/index/indexthisweek"
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
		task.clean_self
		redirect_to '/tasks'
	end 

	def edit 
	end 

	def update

	end 

	def destroy 
	end 

	def update_completion
	   	task = Task.find_by(id: complete_params[:id])
		completion = task.completions.last
		completion.completion_value = task_params[:completion_value].to_i
		completion.save! 
	end 

	def complete
		task = Task.find_by(id: complete_params[:id])
		completion = task.completions.last
		completion.complete
		completion.save! 
		render :partial => "/graphics/completed"
	end

	def complete_tasks_index 
		render :partial => '/index/complete_index', :locals => {complete_tasks: current_user.completed_tasks} 
	end 

	def updated_recently
		if Task.all.find {|task| updated_in_the_last_hour?(task.completions.last.updated_at)}
			@task_status = {updated: "true"}
			render json: @task_status
		else 
		  	@task_status = {updated: "false"}
		  	render json: @task_status
		end 
	end 

	def updated_in_the_last_hour?(updated_at)
		return true if (DateTime.now.to_i - updated_at.to_i) <= (Task::SECONDS_IN_AN_HOUR)
		false 
	end 

	def show_progress 
		ratio = current_user.task_completion_ratio_of_today
		render :partial => '/index/progress', :locals => {ratio: ratio.to_json} 
	end 

	def show_progress_week 
		ratio = current_user.task_completion_ratio_of_this_week
		render :partial => '/index/progress', :locals => {ratio: ratio.to_json} 
	end

    def show_progress_all 
		ratio = current_user.task_completion_ratio_of_all_time
		render :partial => '/index/progress', :locals => {ratio: ratio.to_json} 
	end 

	def show_progress_each_day_of_month
		ratios = current_user.array_of_ratios
		render :partial => '/index/thirty_days_progress', :locals => {ratios: ratios} 
	end  

	private 

	def task_params
		params.require(:task).permit!
	end 

	def complete_params
		params.permit(:id)
	end 
end
