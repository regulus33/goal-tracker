class User < ApplicationRecord
  has_many :tasks
	has_many :due_dates, through: :tasks

	has_secure_password

  def ratio_persisted_today?
    return true if self.due_dates.last.ratio 
    false 
  end 

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

  def total_completions_value_and_task(tasks)
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

  def float_task_completion_ratio_of_today
    total_value = tasks_due_today.count
    completed_value = total_completions_value(tasks_due_today)
    incomplete_value = total_value - completed_value
    ratio = completed_value / total_value
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

  def task_completion_ratio_of_day(date)
    if tasks_due_on_day(date).any?
      total_value = tasks_due_on_day(date).count
      completed_value = total_completions_value(tasks_due_on_day(date))
      incomplete_value = total_value - completed_value
      ratio = [{label: "incomplete", value: incomplete_value}, {label: "completed", value: completed_value}]
      return ratio
    else
      return {:label=>"incomplete", :value=>10.0}, {:label=>"completed", :value=>0.0} #random incomplete data 
    end
  end

  def last_thirty_days_array
    (1.month.ago.to_date..Date.today).map{ |date| date }
  end 

  def last_thirty_due_date_objects 
    last_thirty_due_dates = []
    last_thirty_days_array.each do |x|  
      self.due_dates.each do |y|
        if x.strftime("%m/%d/%Y") == y.date.strftime("%m/%d/%Y")
          last_thirty_due_dates << y 
        end
      end
    end
    last_thirty_due_dates
  end

  def last_month_data 
    data = last_thirty_due_date_objects.map do |x|
      {date: x.date.strftime("%m/%d/%Y"), ratio: x.ratio || x.ratio.to_f}#to_f for nils
    end
    data.each do |y|
      unless y[:ratio] == 0.0 || y[:ratio] == nil 
        y[:ratio] = y[:ratio].value
      end
    end
      data
  end

  
  def array_of_ratios
    self.due_dates.map do |date|
      if date.ratio 
        [{label: "complete", value: date.ratio.value}, {label: "incomplete", value: 1}] 
      end
    end.compact
  end

  # this should return an array of objects with task names, their completion values for the day and so on
  def tasks_data_today  
    tasks_of_today = self.tasks_due_today
    tasks = []
    tasks_of_today.each do |task|
      task = {
        task_name: task.name, 
        completion_value: task.completions.last.completion_value,
        completion_max: task.completion_max,
        completion_unit: task.completion_unit
      }
      tasks << task 
    end
    tasks 
  end 

  def tasks_incomplete_and_due_today 
    self.tasks.select{|task| task.due_today? && !task.completed?}
  end 

  # uncommment for working authentication and delete above method
  # def password=(password)
  #   self.password_digest = BCrypt::Password.create(password)
  # end

  # def is_password?(password)
  #   BCrypt::Password.new(self.password_digest) == password
  # end
end
