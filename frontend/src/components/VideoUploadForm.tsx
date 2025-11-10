import { useState } from "react";
import ReactPlayer from "react-player";

function VideoUploadForm({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!videoFile) return alert("Select a video file first");

  setUploading(true);
  console.log("videoFile:", videoFile);
  const formData = new FormData();
  formData.append("video", videoFile);            // Make sure 'video' matches backend multer config
  formData.append("title", videoFile.name);

  try {
    const response = await fetch("http://localhost:3001/api/upload-video", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Upload failed. Status:", response.status);
      throw new Error("Upload failed");
    }

    const data = await response.json();
    console.log("Upload success response:", data);

    if (data && data.video_url) {
      const fullUrl = "http://localhost:3001" + data.video_url;
      setUploadedUrl(fullUrl);
      onUploadSuccess(fullUrl);
      alert("Upload successful");
    } else {
      console.error("No video_url in response data");
      alert("Upload error: missing video URL");
    }
  } catch (error) {
    console.error("Upload error caught:", error);
    alert("Upload error");
  } finally {
    setUploading(false);
  }
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/mp4" onChange={handleFileChange} />
       <button type="submit" disabled={uploading || !videoFile}>
  {uploading ? "Uploading..." : "Upload Video"}
</button>
      </form>
       
      {uploadedUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Uploaded Video Preview:</h3>
          <ReactPlayer url={uploadedUrl} controls width="400px" />
        </div>
      )}
    </div>
  );
}

export default VideoUploadForm;
