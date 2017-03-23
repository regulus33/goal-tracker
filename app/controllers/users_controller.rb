class UsersController < ApplicationController
	def show 
		@user = User.find(params[:id])
	end

	def new
		@user = User.new 
	end 

	def create
		user = User.new(user_params)
		user.save! 
		redirect_to '/login'
	end

	def detail_today
		task_hashes = current_user.tasks_data_today
		render :partial => '/index/detailtoday', :locals => {tasks: task_hashes} 
	end 

	private 
	
	def user_params 
		params.require(:user).permit(:username, :email, :password)
    end  
end
