import IVideo from "./videos.interface";
import IExercise from "./exercises.interface";
export default interface IChapter {
  _id: string;
  title: string;
  order: number;
  videos: IVideo[];
  exercises: IExercise[];
}
