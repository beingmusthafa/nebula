import React, { useEffect, useState } from "react";
import BannerAddForm from "../../components/admin/BannerAddForm";
import BannerTableRow from "../../components/admin/BannerTableRow";
import BannerTableRowSkeleton from "../../components/skeletons/BannerTableRowSkeleton";
import BannerEditForm from "../../components/admin/BannerEditForm";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import ConfirmationPopup_Admin from "../../components/ConfirmationPopup_Admin";
import { toast } from "react-toastify";

export interface Banner {
  _id: string;
  image: string;
  isActive: boolean;
  link: string;
}
const Banners_admin = () => {
  let [showAddForm, setShowAddForm] = useState(false);
  let [showEditForm, setShowEditForm] = useState(false);
  let [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  let [loading, setLoading] = useState(true);
  let [banners, setBanners] = useState<Banner[]>([]);
  let [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  let skeletons = new Array(7).fill(0);
  const getBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/get-banners").then((res) =>
        res.json()
      );
      if (!res.success) throw new Error(res.message);
      setBanners(res.banners);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);
  const handleDelete = async () => {
    try {
      setShowDeleteConfirm(false);
      setLoading(true);
      const res = await fetch(
        "/api/admin/delete-banner/" + selectedBanner?._id,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setLoading(false);
      getBanners();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleToggle = async (
    action: "enable" | "disable",
    bannerId: string
  ) => {
    const toastId = toast.loading("Toggling banner");
    try {
      const res = await fetch(`/api/admin/${action}-banner/` + bannerId, {
        method: "PATCH",
      }).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      toast.dismiss(toastId);
      toast.success(`Banner ${action}d`);
      getBanners();
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || error);
    }
  };
  return (
    <>
      {showAddForm && (
        <BannerAddForm getData={getBanners} setShow={setShowAddForm} />
      )}
      {showEditForm && (
        <BannerEditForm
          data={selectedBanner!}
          getData={getBanners}
          setShow={setShowEditForm}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmationPopup_Admin
          confirmText="Delete this banner?"
          isActionPositive={false}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
      <div className="w-full flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="_fill-btn-black"
        >
          + Banner
        </button>
      </div>
      <table className="w-full border-separate border-spacing-6">
        <thead>
          <tr>
            <th>Banner</th>
            <th>Status</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            skeletons.map((_, i) => <BannerTableRowSkeleton key={i} />)
          ) : banners.length > 0 ? (
            banners.map((banner) => (
              <BannerTableRow
                onDelete={() => {
                  setSelectedBanner(banner);
                  setShowDeleteConfirm(true);
                }}
                onEdit={() => {
                  setSelectedBanner(banner);
                  setShowEditForm(true);
                }}
                onEnable={() => {
                  handleToggle("enable", banner._id);
                }}
                onDisable={() => {
                  handleToggle("disable", banner._id);
                }}
                data={banner}
              />
            ))
          ) : (
            <>
              <tr>
                <td colSpan={4}></td>
              </tr>
              <tr>
                <td colSpan={4} className="font-semibold text-lg text-center">
                  No banners found
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Banners_admin;
