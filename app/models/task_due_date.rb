class TaskDueDate < ApplicationRecord
	belongs_to :tasks
	belongs_to :due_dates
end
