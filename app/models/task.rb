class Task < ApplicationRecord
	belongs_to :user
	has_many :completions
	has_many :due_dates
end
