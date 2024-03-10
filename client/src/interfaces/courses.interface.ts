export default interface ICourse {
  _id: string;
  title: string;
  rating: number;
  ratingCount: number;
  price: number;
  discount: number;
  thumbnail: string;
  description: string;
  language: string;
  benefits?: string[];
  requirements?: string[];
  tutor: {
    name: string;
    image: string;
    bio?: string;
  };
}
