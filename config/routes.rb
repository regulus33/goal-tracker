Rails.application.routes.draw do
	get '/', to: "users#new" 
	resources :users
	resources :sessions
	resources :tasks
	# resources :completions
	get '/login', to: "sessions#new"
	post '/login', to: "sessions#create"
	get '/logout', to: "sessions#destroy"
	get '/tasks/today', to: "tasks#today"
	get '/sortday', to: "tasks#today"
	get '/sortweek', to: "tasks#this_week"
	put '/complete/:id', to: "tasks#complete" #edit request for tasks to be completed, all tasks are initiated with completions	
	get '/completeindex', to: "tasks#complete_tasks_index" #index page for completed tasks
	get '/checkupdate', to: "tasks#updated_recently" 
	get '/showprogress', to: "tasks#show_progress"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
