class CreateRatios < ActiveRecord::Migration[5.0]
  def change
    create_table :ratios do |t|
  	  t.integer :due_date_id 
  	  t.float :value 
      t.timestamps
    end
  end
end
