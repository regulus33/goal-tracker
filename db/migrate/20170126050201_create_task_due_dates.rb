class CreateTaskDueDates < ActiveRecord::Migration[5.0]
  def change
    create_table :task_due_dates do |t|	
    	t.integer :task_id 
    	t.integer :due_dates_id
      t.timestamps
    end
  end
end
