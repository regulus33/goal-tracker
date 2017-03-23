class RatiosController < ApplicationController
	def create 

	end 

	def save #update extract logic and make this cleaner!
	  if current_user.ratio_persisted_today?
	  	today = current_user.due_dates.last
	  	todays_updated_ratio = current_user.float_task_completion_ratio_of_today 
	  	today.ratio.value = todays_updated_ratio
	  	today.ratio.save!
	 else 
		if current_user.due_dates.any?
		 today = current_user.due_dates.last
		 todays_ratio = current_user.float_task_completion_ratio_of_today
		 ratio = Ratio.new(value: todays_ratio)
		 ratio.due_date = today 
		 ratio.save!
		end
	  end
	end 
end
