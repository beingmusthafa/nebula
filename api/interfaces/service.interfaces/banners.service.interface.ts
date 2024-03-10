import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IBannersService {
  getBanners(forAdmin: boolean): ServiceResponse<{ banners: object[] }>;

  addBanner(image: Buffer, link: string): ServiceResponse;

  editBanner(
    bannerId: string,
    data: { image: Buffer; link: string }
  ): ServiceResponse;

  deleteBanner(bannerId: string): ServiceResponse;

  toggleBanner(bannerId: string, action: "enable" | "disable"): ServiceResponse;
}
