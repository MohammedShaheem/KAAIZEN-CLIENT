import { getCloudinarySignature } from "./service";


export const uploadToCloudinary = async (file, type = "raw") => {
  const sig = await getCloudinarySignature(type);
  const {
    signature,
    timestamp,
    cloud_name,
    api_key,
    folder,
    resource_type,
  } = sig

  console.log("Cloudinary signature response:", sig);


  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("resource_type", resource_type)
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("access_mode", "public");


  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  return await res.json();
};
