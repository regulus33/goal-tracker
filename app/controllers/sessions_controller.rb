class SessionsController < ApplicationController
	def new 
		render 'new'
	end

	def create 
		user = User.find_by(email: params[:email])
		if user.is_password?(params[:password])
			session[:user_id] = user.id
		else 
			flash[:notice] = "Hmm, who the heck r u?"
		end
		redirect_to '/'
	end

	def destroy
	    session[:user_id] = nil
	    redirect_to '/'
    end

	private 

	def session_params
		params.require(:session).permit(:email, :password)
	end


end