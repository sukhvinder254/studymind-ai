import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { uploadPDF, listPDFs, deletePDF } from "../services/api"

export default function Dashboard() {
  const [pdfs, setPdfs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const navigate = useNavigate()

  // Humne variables ko state mein daal diya taaki jab bhi component render ho, fresh ID mile
  const userId = localStorage.getItem("userId")
  const userName = localStorage.getItem("userName")

  useEffect(() => {
    // Agar login nahi hai ya ID undefined hai, toh wapas login par bhej do
    if (!userId || userId === "undefined") {
      navigate("/")
      return
    }
    fetchPDFs()
  }, [userId]) // userId badalne par ye fir se chalega

  const fetchPDFs = async () => {
    const currentUserId = localStorage.getItem("userId")
    if (!currentUserId || currentUserId === "undefined") return
    
    try {
      const res = await listPDFs(currentUserId)
      setPdfs(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpload = async (file) => {
    if (!file) return
    const currentUserId = localStorage.getItem("userId")
    if (!currentUserId || currentUserId === "undefined") {
      alert("Session expired, please login again.")
      navigate("/")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("user_id", currentUserId) // Yahan fresh local storage se ID ja rahi hai
    try {
      await uploadPDF(formData)
      await fetchPDFs()
    } catch (e) {
      console.log(e)
    }
    setUploading(false)
  }

  const handleDelete = async (pdfId) => {
    if (window.confirm("Delete this PDF?")) {
      await deletePDF(pdfId)
      await fetchPDFs()
    }
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)"}}>
      <div style={{position:"fixed", top:"10%", left:"5%", width:"400px", height:"400px", background:"rgba(124,58,237,0.1)", borderRadius:"50%", filter:"blur(100px)", pointerEvents:"none"}}></div>
      <div style={{position:"fixed", bottom:"10%", right:"5%", width:"300px", height:"300px", background:"rgba(37,99,235,0.1)", borderRadius:"50%", filter:"blur(100px)", pointerEvents:"none"}}></div>

      <nav style={{background:"rgba(255,255,255,0.03)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <div style={{width:"36px", height:"36px", background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px"}}>🧠</div>
          <span style={{color:"white", fontSize:"20px", fontWeight:"700"}}>StudyMind AI</span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
          <span style={{color:"rgba(255,255,255,0.6)", fontSize:"14px"}}>Hey, {userName}! 👋</span>
          <button
            onClick={() => { localStorage.clear(); navigate("/") }}
            style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"8px 16px", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"14px", transition:"all 0.3s"}}
            onMouseEnter={(e) => e.target.style.background="rgba(255,255,255,0.12)"}
            onMouseLeave={(e) => e.target.style.background="rgba(255,255,255,0.07)"}
          >Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"900px", margin:"0 auto", padding:"40px 24px"}}>
        <div style={{marginBottom:"40px"}}>
          <h1 style={{color:"white", fontSize:"32px", fontWeight:"700", margin:"0 0 8px"}}>Your Study Library 📚</h1>
          <p style={{color:"rgba(255,255,255,0.5)", margin:0}}>Upload PDFs and chat with them using AI</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById("fileInput").click()}
          style={{background: dragOver ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)", border: dragOver ? "2px dashed #7c3aed" : "2px dashed rgba(255,255,255,0.15)", borderRadius:"20px", padding:"48px", textAlign:"center", cursor:"pointer", transition:"all 0.3s", marginBottom:"40px"}}
          onMouseEnter={(e) => e.currentTarget.style.background="rgba(124,58,237,0.08)"}
          onMouseLeave={(e) => !dragOver && (e.currentTarget.style.background="rgba(255,255,255,0.03)")}
        >
          <input id="fileInput" type="file" accept=".pdf" style={{display:"none"}} onChange={(e) => handleUpload(e.target.files[0])} />
          <div style={{fontSize:"48px", marginBottom:"16px"}}>📄</div>
          <p style={{color:"white", fontSize:"18px", fontWeight:"600", margin:"0 0 8px"}}>
            {uploading ? "Uploading..." : "Drop your PDF here"}
          </p>
          <p style={{color:"rgba(255,255,255,0.4)", margin:0, fontSize:"14px"}}>or click to browse files</p>
        </div>

        {pdfs.length === 0 ? (
          <div style={{textAlign:"center", padding:"60px 0"}}>
            <div style={{fontSize:"64px", marginBottom:"16px"}}>🎓</div>
            <p style={{color:"rgba(255,255,255,0.4)", fontSize:"16px"}}>No PDFs yet — upload your first one!</p>
          </div>
        ) : (
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"20px"}}>
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                style={{background:"rgba(255,255,255,0.05)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"24px", transition:"all 0.3s"}}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.border="1px solid rgba(124,58,237,0.4)"; e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.3)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow="none" }}
              >
                <div style={{fontSize:"32px", marginBottom:"12px"}}>📑</div>
                <p style={{color:"white", fontWeight:"600", margin:"0 0 8px", fontSize:"15px"}}>{pdf.filename}</p>
                <p style={{color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:"0 0 16px"}}>{new Date(pdf.uploaded_at).toLocaleDateString()}</p>
                <div style={{display:"flex", gap:"8px"}}>
                  <div
                    onClick={() => navigate(`/chat/${pdf.id}`)}
                    style={{flex:1, background:"linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius:"8px", padding:"8px 14px", cursor:"pointer", textAlign:"center"}}
                  >
                    <span style={{color:"white", fontSize:"13px", fontWeight:"600"}}>Chat with AI →</span>
                  </div>
                  <div
                    onClick={(e) => { e.stopPropagation(); handleDelete(pdf.id) }}
                    style={{background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"8px", padding:"8px 12px", cursor:"pointer"}}
                  >
                    <span style={{color:"#f87171", fontSize:"13px"}}>🗑️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
