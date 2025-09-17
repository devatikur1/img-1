export const handleUploadConvartToLink = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=82961e2fd2171ce2e924fc0337aa7124`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json(); 
  return data.data.url;
};
