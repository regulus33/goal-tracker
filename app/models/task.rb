class Task < ApplicationRecord

	SECONDS_IN_AN_HOUR = 3600
	SECONDS_IN_A_DAY = SECONDS_IN_AN_HOUR * 24
	SECONDS_IN_A_WEEK = SECONDS_IN_A_DAY * 7

	belongs_to :user
	has_many :completions
	has_many :due_dates

	def due_today?

		return true if self.due_dates.first.date.strftime('%F') == Time.now.strftime('%F') && self.completions.last.completed == 0
		false 
	end

	def due_this_week?
		return true if due_today?
		if self.completions.last.completed == 0
			due_array = self.due_dates.first.date.strftime('%m/%d/%y').split("/")
			today_array = Time.now.strftime('%m/%d/%y').split("/")
			# if in the same month
			if due_array[0] == today_array[0] && due_array[2] == today_array[2]
				return true if due_array[1].to_i - today_array[1].to_i <= 7 
			end
			#if separate months 
			if ( due_array[0]-1 ) == today_array[0] || ( due_array[0]+1 ) == today_array[0]
				this_month_days = self.due_dates.first.days_in_month
				todays_date_number = today_array[1].to_i 
				due_date_number = due_array[1].to_i 
				if (this_month_days - todays_date_number) + due_date_number <= 7
					return true
				end
			end
		end 
		false 
	end

	def generate_new_completion
		Rails.logger.debug '===========whenever is working================'
		if been_5_seconds?
			completion = Completion.new(completed: 0, completion_value: self.completions.last.completion_value)
			self.completions << completion
			completion.save!
			# self.due_dates
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

    def been_one_month? 
		
    end



end
