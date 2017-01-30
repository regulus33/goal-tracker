class User < ApplicationRecord
	has_many :tasks
	# has_many :due_dates, through: :tasks
end
