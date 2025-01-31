import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  id: number;
  title: string;
  description: string;
  category: string;
}

const TaskSchema: Schema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  
});

const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema);
export default Task;