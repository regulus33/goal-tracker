class RatiosController < ApplicationController
	def create 

	end 

	def save 
		if current_user.due_dates.any?
		 today = current_user.due_dates.last
		 todays_ratio = current_user.task_completion_ratio_of_today[1][:value] / current_user.task_completion_ratio_of_today[0][:value] 
		 ratio = Ratio.new(value: todays_ratio)
		 ratio.due_date = today 
		 ratio.save!
		end
	end 
end
