# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
set :output, "/cron_log.log"

def task_gen

end

# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end

every 1.minutes do
  runner "Task.all.to_a.each{|task| task.generate_new_completion}"
end

# Learn more: http://github.com/javan/whenever
