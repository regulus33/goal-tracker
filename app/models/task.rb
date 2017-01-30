class Task < ApplicationRecord
	belongs_to :user
	has_many :completions
	has_many :task_due_dates
	
end
