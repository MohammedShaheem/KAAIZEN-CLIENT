import api from "@/api/axios";

export const getCloudinarySignature = async (type = "raw") => {
  const res = await api.get(`/api/cloudinary/?type=${type}`, {
    withCredentials: true,
  });
  return res.data;
};