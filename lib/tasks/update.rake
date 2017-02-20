task :update => :environment do
   Task.all.each do |task|
   	task.generate_new_completion_and_duedate
   end
end