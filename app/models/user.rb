class User < ApplicationRecord
	has_many :tasks
	# has_many :due_dates, through: :tasks
	has_secure_password

  def password
  	self.password_digest
  end 

  def is_password?(password)
    true
  end

  def completed_tasks
      self.tasks.select do 
      |task| task.completions.last.completed == 1 
    end 
  end 

  def tasks_due_today
    self.tasks.select {|task| task.due_today?}
  end

  def tasks_due_this_week
    self.tasks.select {|task| task.due_this_week?}
  end

  def task_completion_ratio_of_today
    x = self.tasks.select do |task| 
      task.due_dates.select do |due_date|
        due_date.date.strftime('%m/%d/%y') == DateTime.now.strftime('%m/%d/%y')
      end 
    end 
    # we need total tasks due this week and total tasks complete
    # we need total tasks that were/are due today or a given day and how many of THOSE are complete 
    x
  end 
  # uncommment for working authentication and delete above method
  # def password=(password)
  #   self.password_digest = BCrypt::Password.create(password)
  # end

  # def is_password?(password)
  #   BCrypt::Password.new(self.password_digest) == password
  # end
end
