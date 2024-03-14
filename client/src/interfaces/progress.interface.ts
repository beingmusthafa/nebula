export default interface IProgress {
  course: string;
  chapter: string;
  target: number;
  videos: Set<string>;
  exercises: Set<string>;
}
