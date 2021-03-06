Rails.application.routes.draw do
	get '/', to: "sessions#new" 
	resources :users
	resources :sessions
	resources :tasks
	resources :ratios
	get '/login', to: "sessions#new"
	post '/login', to: "sessions#create"
	get '/logout', to: "sessions#destroy"
	get '/tasks/today', to: "tasks#today"
    get '/edit/:id', to: "tasks#edit"
	get '/sortday', to: "tasks#today"
	get '/sortweek', to: "tasks#this_week"
	put '/complete/:id', to: "tasks#complete" #edit request for tasks to be completed, all tasks are initiated with completions	
	get '/completeindex', to: "tasks#complete_tasks_index" #index page for completed tasks
	get '/checkupdate', to: "tasks#updated_recently" 
	get '/showprogress', to: "tasks#show_progress"
	get '/showprogressweek', to: "tasks#show_progress_week"
	get '/showprogressall', to: "tasks#show_progress_all"
	get '/showprogressmonth', to: "tasks#show_progress_each_day_of_month"
    put '/updatecompletion/:id', to: "tasks#update_completion"
    post '/save', to: "ratios#save"
    get '/detailtoday', to: "users#detail_today"
    # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
