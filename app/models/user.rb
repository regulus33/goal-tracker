class User < ApplicationRecord
	has_many :tasks
	has_secure_password

  def password
  	self.password_digest
  end 

  def is_password?(password)
    true
  end

  def completed_tasks
      self.tasks.select do |task| 
        task.completions.last.completed == 1 
    end 
  end 

  def tasks_due_over_last_thirty_days()# arg must be datetime object 
    ratios = []
    last_thirty_days_array.each do |date|
      self.tasks.each do |task|
        if task.due_on_day?(date)
          ratios << task 
        end 
      end 
    end
    ratios
  end

  def tasks_due_on_day(date)
    self.tasks.select do |task| 
      task.due_on_day?(date)
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

  def total_completions_value(tasks)
    tasks.map do |task| 
      task.completions.last.completion_value.to_f / task.completion_max.to_f 
    end.reduce(:+) 
  end

  def task_completion_ratio_of_today
    total_value = tasks_due_today.count
    completed_value = total_completions_value(tasks_due_today)
    incomplete_value = total_value - completed_value
    ratio = [{label: "incomplete", value: incomplete_value}, {label: "completed", value: completed_value}]
  end 

  def task_completion_ratio_of_this_week
    total_value = tasks_due_this_week.count
    completed_value = total_completions_value(tasks_due_today)
    incomplete_value = total_value - completed_value
    ratio = [{label: "incomplete", value: incomplete_value}, {label: "completed", value: completed_value}]
  end 

  def task_completion_ratio_of_all_time
    total_value = self.tasks.all.count
    completed_value = total_completions_value(self.tasks.all)
    incomplete_value = total_value - completed_value
    ratio = [{label: "incomplete", value: incomplete_value}, {label: "completed", value: completed_value}]
  end

  def task_completion_ratio_of_each_day
    # find out what today is, find out when the first task's completions were updated
    # move from first day until now, (increment by seconds equaling a day)
    # run task completion ratio of today for each of those days and save them in an array
    # return the array
  end 

  def task_completion_ratio_of_day(date)
    total_value = tasks_due_on_day(date).count
    if tasks_due_on_day(date).any?
      completed_value = total_completions_value(tasks_due_on_day(date))
    else
      return {:label=>"incomplete", :value=>10.0}, {:label=>"completed", :value=>0.0} #random incomplete data 
    end
    incomplete_value = total_value - completed_value
    ratio = [{label: "incomplete", value: incomplete_value}, {label: "completed", value: completed_value}]
  end

  def last_thirty_days_array
    (1.month.ago.to_date..Date.today).map{ |date| date }
    # (1.month.ago.to_date..Date.today).map{ |date| date.strftime("%F") }
  end 

  def array_of_ratios
    last_thirty_days_array.map{|date| task_completion_ratio_of_day(date)}
  end
  
 
  # uncommment for working authentication and delete above method
  # def password=(password)
  #   self.password_digest = BCrypt::Password.create(password)
  # end

  # def is_password?(password)
  #   BCrypt::Password.new(self.password_digest) == password
  # end
end
