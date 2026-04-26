// Cloudinary unsigned upload utility
// We use unsigned uploads so the frontend can upload directly
// without exposing API secrets. You need to create an
// "unsigned upload preset" in your Cloudinary dashboard:
// Settings → Upload → Upload presets → Add upload preset → Unsigned

const CLOUD_NAME = 'dycifjq4o';
const UPLOAD_PRESET = 'jurisfile_preset'; // change to your preset name

export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'jurisfile/documents');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, { method: 'POST', body: formData });

  if (!response.ok) {
    throw new Error('Failed to upload file to Cloudinary.');
  }

  const data = await response.json();

  return {
    file_url: data.secure_url,
    file_name: file.name,
    mime_type: file.type,
    file_size_bytes: file.size,
  };
}
