class Task < ApplicationRecord

	SECONDS_IN_AN_HOUR = 3600
	SECONDS_IN_A_DAY = SECONDS_IN_AN_HOUR * 24
	SECONDS_IN_A_WEEK = SECONDS_IN_A_DAY * 7

	belongs_to :user
	has_many :completions
	has_many :due_dates

	def clean_self 
		if self.completion_unit == "none"
			self.completion_max = 1
		 	self.save 
		end 
	end

	def due_today?
		return true if self.due_dates.last.date.strftime('%F') == Time.now.strftime('%F') 
		false 
	end

	def due_this_week?
	  return true if DateTime.now.to_i - self.due_dates.last.date.to_i <= SECONDS_IN_A_WEEK
	  false
	end

	def generate_new_completion
		# test
		if been_one_day?
			completion = Completion.new(completed: 0, completion_value: self.completions.last.completion_value)
			self.completions << completion
			completion.save!
		end
	  # if task is recurring hourly && today is 1 hour away from last completion 
	  #   completion = Completion.new(completed: 0, completen_max: self.completions.last.completen_max)  
	  # elsif task is recurring daily && today is 1 day away from last completion 
	  #   completion = Completion.new(completed: 0, completen_max: self.completions.last.completen_max) 
	  # elsif task is recurring weekly && today is one week away from last completion 
	  #   completion = Completion.new(completed: 0, completen_max: self.completions.last.completen_max)
	  #  elsif task is recurring monthly && today is one month away from last completion 
	  #   completion = Completion.new(completed: 0, completen_max: self.completions.last.completen_max) 
	  # end
	end

	private 

	def been_5_seconds? #since last completion
		return true if (DateTime.now.to_i - self.completions.last.completed_at.to_i) >= (5)
		false 
    end 

	def been_one_hour? #since last completion
		return true if (DateTime.now.to_i - self.completions.last.completed_at.to_i) >= (SECONDS_IN_AN_HOUR)
		false 
    end 

    def been_one_day? 
		return true if (DateTime.now.to_i - self.completions.last.completed_at.to_i) >= (SECONDS_IN_A_DAY)
		false
    end     

    def been_one_week?
		return true if (DateTime.now.to_i - self.completions.last.completed_at.to_i) >= (SECONDS_IN_A_WEEK)
		false
    end 
end
