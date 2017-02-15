class CreateCompletions < ActiveRecord::Migration[5.0]
  def change
    create_table :completions do |t|
    	t.integer :task_id
    	t.integer :completed
    	t.integer :completion_value
    	t.datetime :completed_at 
      t.timestamps
    end
  end
end
