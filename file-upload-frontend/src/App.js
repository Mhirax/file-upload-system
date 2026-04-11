import React, { useEffect, useRef } from 'react';
import FileUpload from './component/FileUpload'; // adjust path if needed

function ParticleBackground() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId, particles = [], W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const mkP = () => ({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.8+0.4, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, a: Math.random()*0.55+0.15, color: Math.random()<0.6?'127,119,221':'93,202,165' });
    const init = () => { particles = Array.from({length:100}, mkP); };
    const tick = () => {
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){ ctx.strokeStyle=`rgba(127,119,221,${(1-d/120)*0.2})`; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); }
      }
      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.color},${p.a})`; ctx.fill();
      });
      animId = requestAnimationFrame(tick);
    };
    resize(); init(); tick();
    window.addEventListener('resize', ()=>{resize();init();});
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0 }} />;
}

export default function App() {
  return (
    <div style={{ background:'#0d0d12', minHeight:'100vh', position:'relative' }}>
      <ParticleBackground />
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'3rem 1rem 4rem' }}>

        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#14122a', border:'1px solid #2e2a50', borderRadius:24, padding:'6px 18px', fontSize:12, color:'#9b8fe8', letterSpacing:'0.05em', marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#7f77dd' }} />
            Secure cloud storage
          </div>
          <h1 style={{ fontSize:42, fontWeight:700, color:'#eeeef8', letterSpacing:'-0.03em', lineHeight:1.15, margin:0 }}>
            Store your files
          </h1>
          <h1 style={{ fontSize:42, fontWeight:700, color:'#7f77dd', letterSpacing:'-0.03em', lineHeight:1.15, margin:'0 0 16px' }}>
            safely &amp; instantly
          </h1>
          <p style={{ fontSize:15, color:'#4a4a66', lineHeight:1.7, maxWidth:380, margin:'0 auto 24px' }}>
            Upload images and PDFs. Retrieve or remove them anytime using your unique file ID.
          </p>
          <div style={{ display:'flex', gap:'3rem', justifyContent:'center' }}>
            {[['5 MB','Max file size'],['GridFS','Storage engine'],['Instant','Retrieval speed']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:600, color:'#c8c8e8' }}>{v}</div>
                <div style={{ fontSize:11, color:'#3a3a55', marginTop:4, letterSpacing:'0.05em' }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        <FileUpload />

        <p style={{ marginTop:'2rem', fontSize:12, color:'#2a2a3a' }}>
          Files stored securely via MongoDB GridFS & Developed By Minoka Wickramasinghe
        </p>
      </div>
    </div>
  );
}