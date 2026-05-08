import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { INTIMATE_ARTICLES, DOCTOR_PROFILE } from '../../data/mockData'

const TOPICS = [
  { key: 'sequedad', label: 'Sequedad vaginal', emoji: '💧', color: '#b84289' },
  { key: 'deseo', label: 'Deseo sexual', emoji: '💜', color: '#b84289' },
  { key: 'suelo', label: 'Suelo pélvico', emoji: '🏋️', color: '#10B981' },
  { key: 'urinario', label: 'Salud urinaria', emoji: '🛡️', color: '#F59E0B' },
]

const TOPIC_CONTENT = {
  sequedad: {
    title: 'Sequedad vaginal y atrofia vulvovaginal',
    intro: 'El síndrome genitourinario de la menopausia (SGM) afecta al 50–70% de mujeres. A diferencia de los sofocos, empeora progresivamente sin tratamiento. Tiene solución.',
    options: [
      { level: '1', label: 'Primer paso', title: 'Hidratante vaginal', desc: 'Replens, Gynatrof o Regelle — aplicar 3 veces/semana de forma continua. Actúa sobre el tejido a largo plazo, no es un lubricante.', tag: 'Sin receta · Primera línea' },
      { level: '2', label: 'Relaciones', title: 'Lubricante vaginal', desc: 'Base agua o silicona para las relaciones sexuales. Usar generosamente. Nunca base aceite con preservativos.', tag: 'Sin receta' },
      { level: '3', label: 'Tratamiento', title: 'Estrógeno local vaginal', desc: 'Óvulos o gel de estriol o estradiol. El más eficaz. Absorción sistémica mínima — se puede usar incluso con contraindicaciones para THS sistémica.', tag: 'Con receta · Prescripción médica' },
      { level: '4', label: 'Oral', title: 'Ospemifeno', desc: 'Tratamiento oral (comprimido diario) para dispareunia y sequedad. Solo con prescripción médica.', tag: 'Con receta · Solo prescripción' },
    ],
  },
  deseo: {
    title: 'Deseo sexual en menopausia',
    intro: 'La libido baja afecta al 40–50% de mujeres. No es "normal a esta edad". Es hormonal y tratable. El deseo espontáneo puede convertirse en reactivo — no es lo mismo que ausencia de deseo.',
    options: [
      { level: '1', label: 'Primero', title: 'Tratar la AVV', desc: 'Si el sexo duele, el cerebro lo asocia con dolor. Tratar la sequedad es el primer paso antes de trabajar el deseo.', tag: 'Paso previo clave' },
      { level: '2', label: 'Sistémico', title: 'THS (estrógenos)', desc: 'Mejoran la vascularización y sensibilidad genital, mejorando el deseo indirectamente.', tag: 'Con receta' },
      { level: '3', label: 'Hormonal', title: 'Testosterona tópica baja dosis', desc: 'Evidencia creciente de eficacia. Disponible como prescripción magistral en España. Habla con tu ginecóloga.', tag: 'Con receta · Magistral' },
      { level: '4', label: 'Psicológico', title: 'Sexología clínica', desc: 'Muy eficaz cuando hay componente relacional o de imagen corporal. Terapia sexual breve (6–8 sesiones) con resultados documentados.', tag: 'Sin receta · Altamente recomendado' },
    ],
  },
  suelo: {
    title: 'Suelo pélvico y continencia',
    intro: 'Sin estrógenos, el tejido del suelo pélvico se atrofia. Los ejercicios de Kegel, bien hechos, reducen la incontinencia, mejoran la sensibilidad sexual y previenen el prolapso.',
    options: [
      { level: '1', label: 'Base', title: 'Ejercicios de Kegel', desc: 'Contrae 5s, relaja 10s, repite 10 veces × 3 series/día. La relajación es tan importante como la contracción. Resultados en 6–12 semanas.', tag: 'Sin coste · Evidencia alta' },
      { level: '2', label: 'Guiado', title: 'Fisioterapia de suelo pélvico', desc: 'La fisioterapeuta enseña la técnica correcta (muchas mujeres contraen mal) y personaliza el protocolo. Especialmente indicada si hay incontinencia o prolapso.', tag: 'Con prescripción · Muy recomendado' },
      { level: '3', label: 'Dispositivo', title: 'Pesario vaginal', desc: 'Para prolapso moderado o incontinencia de esfuerzo. Lo prescribe y ajusta tu ginecóloga o uroginecóloga.', tag: 'Con prescripción' },
    ],
  },
  urinario: {
    title: 'Cistitis de repetición en menopausia',
    intro: 'Las infecciones urinarias recurrentes (≥2 al año) son directamente más frecuentes en postmenopausia porque el estrógeno mantiene defensas urinarias que desaparecen sin él. Hay protocolos muy eficaces.',
    options: [
      { level: '1', label: 'Hábitos', title: 'Hidratación + higiene post-relaciones', desc: 'Mínimo 2L de agua/día y orinar después del sexo. Son las medidas más simples y con mayor impacto preventivo.', tag: 'Sin coste · Inmediato' },
      { level: '2', label: 'Suplemento', title: 'Extracto de arándano rojo (36mg PAC/día)', desc: 'Las proantocianidinas (PAC) previenen la adherencia de E. coli a la pared urinaria. Solo el extracto concentrado — el zumo no tiene dosis terapéutica.', tag: 'Sin receta' },
      { level: '3', label: 'Microbiota', title: 'Probióticos de Lactobacillus', desc: 'Restablecen la flora protectora vaginal y urinaria. Disponibles en formato oral o vaginal.', tag: 'Sin receta' },
      { level: '4', label: 'Hormonal', title: 'Estriol vaginal local', desc: 'Reduce las infecciones recurrentes más que los antibióticos profilácticos en varios estudios. Habla con tu ginecóloga.', tag: 'Con receta · Primera línea médica' },
    ],
  },
}

function OptionStep({ opt }) {
  const [open, setOpen] = useState(false)
  return (
    <button onClick={() => setOpen(o => !o)} className="w-full text-left">
      <div className={`rounded-2xl border transition-all ${open ? 'border-[#b84289] bg-[#b84289]/3' : 'border-gray-100 bg-gray-50'} p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">{opt.level}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">{opt.label}</div>
            <div className="font-semibold text-sm text-[#1A1A1A]">{opt.title}</div>
          </div>
          {open ? <ChevronUp size={14} className="text-[#666666]" /> : <ChevronDown size={14} className="text-[#666666]" />}
        </div>
        {open && (
          <div className="mt-3 ml-10">
            <p className="text-xs text-[#444444] leading-relaxed mb-2">{opt.desc}</p>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[#b84289]/10 text-[#b84289]">{opt.tag}</span>
          </div>
        )}
      </div>
    </button>
  )
}

function ArticleCard({ art }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card p-4">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-[#b84289] uppercase tracking-wide mb-1">{art.category}</div>
            <div className="font-semibold text-sm text-[#1A1A1A] leading-snug mb-1">{art.title}</div>
            <div className="text-[10px] text-[#666666]">{art.readTime} de lectura</div>
          </div>
          {open ? <ChevronUp size={16} className="text-[#666666] mt-1 flex-shrink-0" /> : <ChevronDown size={16} className="text-[#666666] mt-1 flex-shrink-0" />}
        </div>
        {!open && <p className="text-xs text-[#444444] mt-2 leading-relaxed">{art.preview}</p>}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {art.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-xs text-[#1A1A1A] leading-relaxed mb-2">{para}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SaludIntima() {
  const navigate = useNavigate()
  const [activeTopic, setActiveTopic] = useState('sequedad')
  const topic = TOPIC_CONTENT[activeTopic]
  const topicArticles = INTIMATE_ARTICLES.filter(a => {
    if (activeTopic === 'sequedad') return a.id === 'avv'
    if (activeTopic === 'deseo') return a.id === 'deseo'
    if (activeTopic === 'suelo') return a.id === 'kegel'
    if (activeTopic === 'urinario') return a.id === 'cistitis'
    return false
  })

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Salud Íntima</h1>
        </div>
        {/* Privacy badge */}
        <div className="ml-11 flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1.5 w-fit">
          <Lock size={11} className="text-white" />
          <span className="text-white text-[10px] font-semibold">Privada · No visible en informes de empresa</span>
        </div>
      </div>

      {/* Topic tabs — horizontal scroll */}
      <div className="flex gap-2 px-4 pt-4 overflow-x-auto scrollbar-hide pb-1">
        {TOPICS.map(t => (
          <button key={t.key} onClick={() => setActiveTopic(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${activeTopic === t.key ? 'text-white shadow-sm' : 'bg-white text-[#444444] border border-gray-100'}`}
            style={activeTopic === t.key ? { background: `linear-gradient(135deg, ${t.color}cc, ${t.color})` } : {}}>
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">
        {/* Topic intro */}
        <div className="card p-5">
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-2">{topic.title}</h2>
          <p className="text-sm text-[#444444] leading-relaxed">{topic.intro}</p>
        </div>

        {/* Treatment ladder */}
        <div>
          <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">Opciones de tratamiento</h3>
          <div className="space-y-2">
            {topic.options.map(opt => <OptionStep key={opt.level} opt={opt} />)}
          </div>
        </div>

        {/* Private consultation card */}
        <div className="card p-5 border-l-4 border-[#b84289]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{DOCTOR_PROFILE.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-[#b84289] uppercase tracking-wide mb-0.5">Consulta privada</div>
              <div className="font-semibold text-sm text-[#1A1A1A] mb-1">{DOCTOR_PROFILE.name}</div>
              <p className="text-xs text-[#444444] mb-3">Puedes hablar de esto en tu próxima cita de forma confidencial. Esta información no aparece en los informes de empresa.</p>
              <button onClick={() => navigate('/user/citas')}
                className="flex items-center gap-1.5 text-xs text-[#b84289] font-semibold border border-[#b84289]/30 px-3 py-2 rounded-xl">
                <MessageSquare size={12} /> Escribir a la doctora
              </button>
            </div>
          </div>
        </div>

        {/* Article */}
        {topicArticles.length > 0 && (
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">Para saber más</h3>
            <div className="space-y-3">
              {topicArticles.map(a => <ArticleCard key={a.id} art={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
