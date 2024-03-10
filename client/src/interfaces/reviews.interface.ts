export default interface IReview {
  _id: string;
  user: {
    _id: string;
    name: string;
    image: string;
  };
  rating: number;
  comment: string;
}
