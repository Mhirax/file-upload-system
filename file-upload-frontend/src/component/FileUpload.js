import React, { useState } from 'react';
import API from '../api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Select file
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) {
      return setMessage('Please select a file');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFileId(res.data.fileId);
      setMessage('Upload successful ✅');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Upload failed ❌');
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const handleDownload = async () => {
    if (!fileId) return setMessage('Enter file ID');

    try {
      const res = await API.get(`/${fileId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setMessage('Download failed ❌');
    }
  };

  // Delete file
  const handleDelete = async () => {
    if (!fileId) return setMessage('Enter file ID');

    try {
      await API.delete(`/${fileId}`);
      setMessage('File deleted ✅');
      setFileId('');
    } catch (err) {
      setMessage('Delete failed ❌');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: 'auto' }}>
      <h2>File Upload System</h2>

      <input type="file" onChange={handleChange} />
      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      <hr />

      <input
        type="text"
        placeholder="Enter File ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        style={{ width: '100%' }}
      />

      <br /><br />

      <button onClick={handleDownload}>Download</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
        Delete
      </button>

      <p>{message}</p>
    </div>
  );
};

export default FileUpload;