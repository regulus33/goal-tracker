class CreateDueDates < ActiveRecord::Migration[5.0]
  def change
    create_table :due_dates do |t|
   		t.datetime :date
   		t.integer :task_id
        t.timestamps
    end
  end
end
