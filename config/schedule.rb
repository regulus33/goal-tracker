set :environment, "development"
# run  whenever -w to initiate
every 1.minutes do
  runner "Task.all.to_a.each{|task|task.generate_new_completion}"
end


