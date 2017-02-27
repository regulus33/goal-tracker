class DueDate < ApplicationRecord
	belongs_to :task
	has_one :ratio
	COMMON_YEAR_DAYS_IN_MONTH = [nil, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    
	def print_pretty 
		self.date.strftime('%F') 
	end 

	def days_in_month
	   month = self.date.strftime('%m/%d/%y').split("/")[0].to_i 
	   year = Time.now.year
	   return 29 if month == 2 && Date.gregorian_leap?(year)
	   COMMON_YEAR_DAYS_IN_MONTH[month]
	end

    def been_one_second #since last completion
		return true if (DateTime.now.to_i - self.task.completions.completed_at.to_i) >= (1)
		false 
    end 

	def been_one_hour #since last completion
		return true if (DateTime.now.to_i - self.task.completions.completed_at.to_i) >= (SECONDS_IN_AN_HOUR)
		false 
    end 

    def been_one_day 
		return true if (DateTime.now.to_i - self.task.completions.completed_at.to_i) >= (SECONDS_IN_A_DAY)
		false
    end     

    def been_one_week 
		return true if (DateTime.now.to_i - self.task.completions.completed_at.to_i) >= (SECONDS_IN_A_WEEK)
		false
    end 
end
