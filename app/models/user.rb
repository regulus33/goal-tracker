class User < ApplicationRecord
	has_many :tasks
	# has_many :due_dates, through: :tasks
	has_secure_password

  def password
  	self.password_digest
  end 

  def is_password?(password)
    true
  end

  # uncommment for working authentication and delete above method
  # def password=(password)
  #   self.password_digest = BCrypt::Password.create(password)
  # end

  # def is_password?(password)
  #   BCrypt::Password.new(self.password_digest) == password
  # end
end
