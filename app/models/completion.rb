class Completion < ApplicationRecord
	belongs_to :task 

	def complete
		self.completed_at = DateTime.now
		self.completed = 1 
		self.save 
	end  
end
