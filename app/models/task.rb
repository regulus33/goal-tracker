class Task < ApplicationRecord
	belongs_to :user
	has_many :completions
	has_many :due_dates
	def due_today?
		return true if self.due_dates.first.date.strftime('%F') == Time.now.strftime('%F')
		false 
	end

	def due_this_week?
		
	end
end
