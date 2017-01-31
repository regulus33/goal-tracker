Rails.application.routes.draw do
	get '/', to: "users#new" 
	resources :users
	resources :sessions
	get '/login', to: "sessions#new"
	post '/login', to: "sessions#create"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
