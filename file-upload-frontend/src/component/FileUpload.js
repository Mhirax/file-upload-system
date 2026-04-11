import React, { useState, useRef } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'https://file-upload-api-mx3u.onrender.com' });
const fmt = (b) => b < 1024 ? b + 'B' : b < 1048576 ? (b/1024).toFixed(1) + 'KB' : (b/1048576).toFixed(1) + 'MB';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState('');
  const [filename, setFilename] = useState('');
  const [status, setStatus] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setStatus(null);
    if (f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = (e) => { setPreview(e.target.result); setPreviewType('image'); };
      r.readAsDataURL(f);
    } else if (f.type === 'application/pdf') {
      setPreview(null); setPreviewType('pdf');
    } else {
      setPreview(null); setPreviewType(null);
    }
  };

  const clearFile = () => {
    setFile(null); setPreview(null); setPreviewType(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true); setStatus({ type: 'info', msg: 'Uploading...' });
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await API.post('/upload', fd);
      setFileId(res.data.fileId); setFilename(res.data.filename || file.name);
      setStatus({ type: 'success', msg: 'Uploaded successfully — ID copied below' });
      clearFile();
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || err.message });
    } finally { setLoading(false); }
  };

  const download = async () => {
    if (!fileId) return;
    setStatus({ type: 'info', msg: 'Downloading...' });
    try {
      const res = await API.get(`/${fileId}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = filename || 'file';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setStatus({ type: 'success', msg: 'Download started' });
    } catch { setStatus({ type: 'error', msg: 'File not found' }); }
  };

  const remove = async () => {
    if (!fileId) return;
    setStatus({ type: 'info', msg: 'Deleting...' });
    try {
      await API.delete(`/${fileId}`);
      setFileId(''); setFilename('');
      setStatus({ type: 'success', msg: 'File deleted successfully' });
    } catch (err) { setStatus({ type: 'error', msg: err.response?.data?.error || err.message }); }
  };

  const statusColors = {
    success: { bg: '#0a2018', color: '#4ecca3' },
    error:   { bg: '#200a0a', color: '#e05555' },
    info:    { bg: '#12102a', color: '#9b8fe8' },
  };

  return (
    <div style={{
      width: '100%', maxWidth: 560,
      background: 'rgba(18,18,26,0.95)',
      border: '1px solid #252535',
      borderRadius: 20, padding: '2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, background: '#1e1b38', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#e8e8f4' }}>File manager</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 1 }}>Upload, download or delete files</div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${drag ? '#7f77dd' : '#2a2a40'}`,
          borderRadius: 14, padding: '2.5rem 1.5rem',
          textAlign: 'center', cursor: 'pointer',
          background: drag ? '#16142a' : '#0e0e18',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*,.pdf"
          style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
        <div style={{ width: 52, height: 52, background: '#1a1830', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#d0d0e8' }}>Drop your file here</div>
        <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
          or <span style={{ color: '#9b8fe8', cursor: 'pointer' }}>click to browse</span>
        </div>
        <div style={{ fontSize: 12, color: '#3a3a52', marginTop: 8 }}>Images &amp; PDFs · Max 5 MB</div>
      </div>

      {/* Selected file info */}
      {file && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#13131f', border: '1px solid #252535', borderRadius: 12, padding: '12px 16px', marginTop: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1e1b38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#c8c8e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{fmt(file.size)}</div>
          </div>
          <button onClick={clearFile} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
      )}

      {/* Image preview */}
      {preview && (
        <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid #252535' }}>
          <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 240, objectFit: 'contain', display: 'block', background: '#0e0e18' }} />
        </div>
      )}
      {previewType === 'pdf' && !preview && (
        <div style={{ marginTop: 12, borderRadius: 12, border: '1px solid #252535', padding: '1.2rem', textAlign: 'center', background: '#0e0e18' }}>
          <div style={{ fontSize: 13, color: '#555' }}>PDF ready to upload</div>
        </div>
      )}

      {/* Upload button */}
      <button onClick={upload} disabled={!file || loading} style={{
        width: '100%', marginTop: 14, padding: '13px',
        background: file && !loading ? '#534ab7' : '#1a1828',
        border: 'none', borderRadius: 12,
        color: file && !loading ? '#fff' : '#3a3a52',
        fontSize: 15, fontWeight: 600, cursor: file && !loading ? 'pointer' : 'not-allowed',
        transition: 'background 0.2s', letterSpacing: 0.2,
      }}>
        {loading ? 'Uploading...' : 'Upload file'}
      </button>

      {/* Status */}
      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 14px', borderRadius: 10, fontSize: 13, background: statusColors[status.type].bg, color: statusColors[status.type].color }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
          {status.msg}
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #1a1a28', margin: '1.5rem 0' }} />

      {/* Manage section */}
      <div style={{ fontSize: 11, color: '#444', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 10 }}>MANAGE FILE</div>
      <input
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        placeholder="File ID  (auto-filled after upload)"
        style={{ width: '100%', background: '#0e0e18', border: '1px solid #252535', borderRadius: 10, padding: '11px 14px', color: '#c0c0d8', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <button onClick={download} disabled={!fileId} style={{ padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: fileId ? 'pointer' : 'not-allowed', border: '1px solid #252535', background: '#13131f', color: fileId ? '#a0a0c0' : '#333', transition: 'all 0.2s' }}>
          ↓ Download
        </button>
        <button onClick={remove} disabled={!fileId} style={{ padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: fileId ? 'pointer' : 'not-allowed', border: `1px solid ${fileId ? '#3a1a1a' : '#1a1a28'}`, background: '#13131f', color: fileId ? '#e05555' : '#333', transition: 'all 0.2s' }}>
          ✕ Delete
        </button>
      </div>
    </div>
  );
}