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
      self.tasks.select do |task| 
        # binding.pry
        task.completions.last.completed == 1 
    end 
  end 

  def tasks_due_today
    self.tasks.select {|task| task.due_today?}
  end

  def tasks_due_this_week
    self.tasks.select {|task| task.due_this_week?}
  end

  def tasks_completed_today
    tasks_due_today.select{ |task| task.completions.last.completed == 1}
  end
  # here we get the value of things as far as their completion value goes, not their potential
  def total_completions_value(tasks)
    tasks.map do |task| 
      task.completions.last.completion_value.to_f / task.completion_max.to_f 
    end.reduce(:+) #should continuosly return a decimal number between zero and one
  end
  # we need to get the total values that NEED to be completed aka the total-potential completion values
  def total_possible_completions_value(tasks)
    tasks.map {|task| task.completion_max}.reduce(:+)
  end
 
  def task_completion_ratio_of_today
    total_value = tasks_due_today.count
    completed_value = total_completions_value(tasks_due_today)
    incomplete_value = total_value - completed_value
    ratio = [{label: "incomplete", value: incomplete_value}, {label: "completed", value: completed_value}]
  end 

  def task_completion_ratio_of_this_week
    total_value = tasks_due_today.count
    completed_value = self.tasks.select{ |task| task.completions.last.completed == 1}.count
    ratio = [{label: "total", value: total_value}, {label: "completed", value: completed_value}]
  end 
    # we need total tasks due this week and total tasks complete
    # we need total tasks that were/are due today or a given day and how many of THOSE are complete 
 
  # uncommment for working authentication and delete above method
  # def password=(password)
  #   self.password_digest = BCrypt::Password.create(password)
  # end

  # def is_password?(password)
  #   BCrypt::Password.new(self.password_digest) == password
  # end
end
