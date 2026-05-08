import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FolderOpen, Shield, ChevronDown, ChevronUp, X, FileText, Eye } from 'lucide-react'

const CATEGORIES = [
  { key: 'analisis', label: 'Análisis de sangre', emoji: '🩸' },
  { key: 'densitometria', label: 'Densitometría ósea', emoji: '🦴' },
  { key: 'ecografia', label: 'Ecografías ginecológicas', emoji: '🔬' },
  { key: 'mamografia', label: 'Mamografías', emoji: '📋' },
  { key: 'informes', label: 'Informes de consulta', emoji: '📄' },
  { key: 'recetas', label: 'Recetas actuales', emoji: '💊' },
  { key: 'otros', label: 'Otros', emoji: '📁' },
]

const BLOOD_MARKERS = [
  {
    name: 'FSH (Hormona foliculoestimulante)',
    value: '>25 mUI/mL',
    meaning: 'Sugiere menopausia en curso. En perimenopausia puede fluctuar. Un valor alto junto con síntomas confirma la transición.',
    color: '#EF4444',
  },
  {
    name: 'Estradiol (E2)',
    value: '<20 pg/mL',
    meaning: 'Confirma la menopausia establecida. Valores bajos explican la mayoría de síntomas: sofocos, sequedad vaginal, pérdida ósea.',
    color: '#F59E0B',
  },
  {
    name: 'TSH (Tiroides)',
    value: '0.4–4.0 mUI/L',
    meaning: 'El hipotiroidismo es frecuente en esta etapa y puede imitar síntomas de la menopausia (cansancio, aumento de peso, ánimo bajo). Importante descartarlo.',
    color: '#b84289',
  },
  {
    name: 'Vitamina D (25-OH)',
    value: '>30 ng/mL (óptimo: 40–60)',
    meaning: 'El 80% de las mujeres en menopausia en España tiene déficit. Clave para la absorción de calcio y la salud ósea.',
    color: '#F59E0B',
  },
  {
    name: 'Perfil lipídico (LDL)',
    value: '<100 mg/dL ideal',
    meaning: 'El colesterol LDL sube sin estrógenos. El riesgo cardiovascular aumenta en postmenopausia. Monitorizar anualmente.',
    color: '#10B981',
  },
  {
    name: 'Hemoglobina',
    value: '12–16 g/dL (mujer)',
    meaning: 'La anemia por déficit de hierro es frecuente en perimenopausia con ciclos abundantes. Puede agravar el cansancio y la niebla mental.',
    color: '#b84289',
  },
]

const MOCK_DOCS = [
  { id: 1, name: 'Analítica completa feb 2026', category: 'analisis', date: '2026-02-10', notes: 'Pre-consulta ginecología' },
  { id: 2, name: 'Mamografía 2025', category: 'mamografia', date: '2025-11-03', notes: '' },
]

function BloodMarkerInfo({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-[#1A1A1A]">Marcadores clave en tu analítica</h2>
              <p className="text-xs text-[#444444] mt-0.5">Valores relevantes para la menopausia</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {BLOOD_MARKERS.map((m, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: m.color }} />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1A1A1A] mb-0.5">{m.name}</div>
                  <div className="text-[10px] font-bold mb-1.5" style={{ color: m.color }}>Referencia: {m.value}</div>
                  <p className="text-xs text-[#444444] leading-relaxed">{m.meaning}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-blue-50 rounded-2xl p-3">
            <p className="text-[10px] text-blue-700 leading-relaxed">
              Estos valores son orientativos. Tu ginecóloga de Herya puede revisar tu analítica completa en consulta y darte un contexto personalizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocCard({ doc, onDelete }) {
  const cat = CATEGORIES.find(c => c.key === doc.category)
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{cat?.emoji || '📄'}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-[#1A1A1A]">{doc.name}</div>
          <div className="text-[10px] text-[#666666] mt-0.5">{cat?.label} · {doc.date}</div>
          {doc.notes && <div className="text-[10px] text-[#444444] mt-1 italic">{doc.notes}</div>}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="w-7 h-7 rounded-lg bg-[#b84289]/10 flex items-center justify-center">
            <Eye size={12} className="text-[#b84289]" />
          </button>
          <button onClick={() => onDelete(doc.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <X size={12} className="text-[#EF4444]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MiHistorial() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [showUpload, setShowUpload] = useState(false)
  const [showMarkers, setShowMarkers] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [newDoc, setNewDoc] = useState({ name: '', category: 'analisis', date: '', notes: '' })
  const [showBloodPrompt, setShowBloodPrompt] = useState(false)

  const handleUpload = () => {
    if (!newDoc.name || !newDoc.date) return
    setUploading(true)
    setTimeout(() => {
      const added = { id: Date.now(), ...newDoc }
      setDocs(d => [added, ...d])
      setUploading(false)
      setUploadDone(true)
      if (newDoc.category === 'analisis') setShowBloodPrompt(true)
      setTimeout(() => {
        setUploadDone(false)
        setShowUpload(false)
        setNewDoc({ name: '', category: 'analisis', date: '', notes: '' })
      }, 1500)
    }, 1000)
  }

  const handleDelete = (id) => {
    setDocs(d => d.filter(doc => doc.id !== id))
  }

  const byCategory = CATEGORIES.map(c => ({
    ...c,
    docs: docs.filter(d => d.category === c.key),
  })).filter(c => c.docs.length > 0)

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/user/profile')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Mi historial clínico</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Documentos médicos organizados y privados</p>
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">
        {/* Privacy banner */}
        <div className="rounded-2xl p-4 bg-[#1A2942] flex items-start gap-3">
          <Shield size={18} className="text-white/70 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/80 leading-relaxed">
            Tus documentos médicos son completamente privados. Nunca son compartidos con tu empresa ni aparecen en ningún informe corporativo. Solo tú y los especialistas de Herya que tú autorices pueden acceder.
          </p>
        </div>

        {/* Upload button */}
        <button onClick={() => setShowUpload(true)}
          className="w-full card p-4 flex items-center gap-3 hover:shadow active:scale-[0.99] transition-all">
          <div className="w-10 h-10 rounded-2xl bg-[#b84289]/10 flex items-center justify-center flex-shrink-0">
            <Upload size={18} className="text-[#b84289]" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-sm text-[#1A1A1A]">Subir documento</div>
            <div className="text-xs text-[#444444]">PDF, imagen · Analítica, ecografía, informe...</div>
          </div>
        </button>

        {/* Blood marker prompt */}
        {showBloodPrompt && (
          <div className="card p-4 border-l-4 border-[#EF4444]">
            <p className="text-sm font-semibold text-[#1A1A1A] mb-1">¿Quieres que Herya te explique los valores más relevantes para tu etapa hormonal?</p>
            <p className="text-xs text-[#444444] mb-3">Te mostramos qué mirar en tu analítica y qué significa para ti.</p>
            <div className="flex gap-2">
              <button onClick={() => { setShowMarkers(true); setShowBloodPrompt(false) }}
                className="flex-1 py-2 rounded-xl gradient-primary text-white text-xs font-semibold">
                Ver marcadores clave
              </button>
              <button onClick={() => setShowBloodPrompt(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs text-[#444444] font-semibold">
                Ahora no
              </button>
            </div>
          </div>
        )}

        {/* Documents by category */}
        {byCategory.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-[#444444]">Todavía no tienes documentos guardados.</p>
            <p className="text-xs text-[#666666] mt-1">Sube tu analítica o informes de consulta para tenerlos siempre a mano.</p>
          </div>
        ) : (
          byCategory.map(cat => (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{cat.emoji}</span>
                <h3 className="font-semibold text-sm text-[#1A1A1A]">{cat.label}</h3>
                <span className="text-[10px] text-[#666666]">({cat.docs.length})</span>
              </div>
              <div className="space-y-2">
                {cat.docs.map(doc => <DocCard key={doc.id} doc={doc} onDelete={handleDelete} />)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base font-bold text-[#1A1A1A]">Subir documento</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {uploadDone ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-[#1A1A1A]">Documento guardado</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#444444] mb-1 block">Nombre del documento</label>
                  <input type="text" value={newDoc.name} onChange={e => setNewDoc(d => ({ ...d, name: e.target.value }))}
                    placeholder="Ej. Analítica completa enero 2026"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444444] mb-1 block">Categoría</label>
                  <select value={newDoc.category} onChange={e => setNewDoc(d => ({ ...d, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289] bg-white">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444444] mb-1 block">Fecha del documento</label>
                  <input type="date" value={newDoc.date} onChange={e => setNewDoc(d => ({ ...d, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444444] mb-1 block">Notas (opcional)</label>
                  <input type="text" value={newDoc.notes} onChange={e => setNewDoc(d => ({ ...d, notes: e.target.value }))}
                    placeholder="Ej. Pre-consulta ginecología"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                  <FileText size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-[#444444]">PDF, JPG o PNG</p>
                  <p className="text-[10px] text-[#666666] mt-0.5">Simulación de subida — sin backend real</p>
                </div>
                <button onClick={handleUpload} disabled={!newDoc.name || !newDoc.date || uploading}
                  className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold text-sm disabled:opacity-40">
                  {uploading ? 'Guardando...' : 'Guardar documento'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showMarkers && <BloodMarkerInfo onClose={() => setShowMarkers(false)} />}
    </div>
  )
}
