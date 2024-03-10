export default interface QueryOptionsInterface {
  select?: string | Record<string, 0 | 1>;
  sort?: string | Record<string, 1 | -1>;
  populate?: string | string[];
  limit?: number;
  skip?: number;
}
