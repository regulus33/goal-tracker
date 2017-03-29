# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
completion_units = ["minutes", "reps", "boolean"]

def last_thirty_days_array
(1.month.ago.to_date..Date.today).map{ |date| date }
end 

terms = ["daily"]#, "weekly", "monthly", "1 time"]

completions = [0,1]

1.times do |user_id| 
	User.create!(username: Faker::Name.name, email: Faker::Internet.free_email,  password_digest: "password")
	10.times do |task_id| 
		# all completion max is 10 randomizing value on completions table 
		Task.create!(user_id: (user_id + 1), name: (Faker::Hacker.verb + " " + Faker::Hacker.noun), completion_max: 10, completion_unit: completion_units.sample, term: terms.sample, description: Faker::ChuckNorris.fact) 
		30.times do |date_id|
			# binding.pry
			DueDate.create!(task_id: (task_id + 1), date: last_thirty_days_array[date_id - 1])
			Ratio.create!(due_date_id: (date_id +1), value: rand(0.01..1))
			Completion.create!(task_id: (task_id + 1), completed: x = completions.sample, completion_value: x = 0 ? rand(1..9) : 10)
		end
	end 
end

# Faker::Date.backward(rand(1..20))

    # create_table :ratios do |t|
  	 #  t.integer :due_date_id 
  	 #  t.float :value 
     # t.timestamps

