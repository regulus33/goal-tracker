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

	def due_on_day?(date_time)
		return true if self.due_dates.select {|date| date.date.strftime('%F') == date_time.strftime('%F')}.any? 
		false 
	end	

	def due_this_week?
	  return true if DateTime.now.to_i - self.due_dates.last.date.to_i <= SECONDS_IN_A_WEEK
	  false
	end
	def generate_new_completion_and_duedate
		if self.term == "daily" 
			completion = Completion.new(completed: 0, completion_value: 0)
			due_date  = DueDate.new(date: DateTime.now)
			self.completions << completion
			self.due_dates << due_date
			completion.save
		end
	    if self.term == "weekly" && been_one_week? 
			completion = Completion.new(completed: 0, completion_value: 0)
			date_integer = DateTime.now.to_i
			one_week_from_now_sec = (date_integer + SECONDS_IN_A_WEEK)
			one_week_from_now_string = one_week_from_now_sec.to_s
			date = DateTime.strptime(one_week_from_now_string,'%s')
			due_date = DueDate.new(date: date )
			self.completions << completion
			self.due_dates << due_date
			completion.save!
		end
	end

	private 

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
