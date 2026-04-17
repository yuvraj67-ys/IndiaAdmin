export async function uploadToImgBB(base64Image) {
  const apiKey = process.env.IMGBB_API_KEY;
  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', base64Image.replace(/^data:image\/[a-z]+;base64,/, ''));

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error('ImgBB Upload Failed');
  return data.data.url;
}
