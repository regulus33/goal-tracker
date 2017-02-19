class Completion < ApplicationRecord
	belongs_to :task 

	def complete
		self.completed_at = DateTime.now
		self.completion_value = self.task.completion_max
		self.completed = 1 
		self.save! 
	end  
end
