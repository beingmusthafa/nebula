export default interface IExercise {
  _id: string;
  order: number;
  title: string;
  chapter: string;
  course: string;
  question: string;
  options: string[];
  answer: string;
}
