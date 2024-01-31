// type PopulateOptions = {
//   path: string;
//   select?: string | Record<string, 0 | 1>;
//   match?: Record<string, any>;
//   model?: string;
//   options?: {
//     limit?: number;
//     sort?: Record<string, 1 | -1>;
//     skip?: number;
//   };
// };
export default interface QueryOptionsInterface {
  select?: string | Record<string, 0 | 1>;
  sort?: string | Record<string, 1 | -1>;
  populate?: string | string[];
  limit?: number;
  skip?: number;
}
