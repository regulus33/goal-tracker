# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
 completion_units = ["minutes", "reps", "boolean"]
 terms = ["daily", "weekly", "monthly", "1 time"]
20.times do |id| 
	User.create!(username: Faker::Name.name, email: Faker::Internet.free_email,  password_digest: "password")
	Task.create!(user_id: (id + 1), name: (Faker::Hacker.verb + " " + Faker::Hacker.noun), completion_max: rand(1..100), completion_unit: completion_units.sample, term: terms.sample)
	DueDate.create!(task_id: (id + 1), date: Faker::Date.forward(rand(1..20)))
	Completion.create!(task_id: (id + 1), completed: 0, completion_value: 0)
end