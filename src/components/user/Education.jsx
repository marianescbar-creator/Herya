import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Clock, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ARTICLES, TOPIC_CHIPS, COMMUNICATION_GUIDES } from '../../data/mockData'

// ── Personalization logic ─────────────────────────────────────────────────────
function getPersonalizedArticles(userProfile) {
  if (!userProfile) return ARTICLES.slice(0, 3)
  const { symptoms, stage } = userProfile
  const scored = ARTICLES.map(a => {
    let score = 0
    a.symptoms.forEach(symId => {
      const val = symptoms[symId] || 0
      if (val >= 3) score += 3
      else if (val >= 2) score += 1
    })
    if (a.stage === 'early' && ['Aún no noto cambios', 'Perimenopausia'].includes(stage)) score += 2
    if (a.stage === 'all') score += 0.5
    return { ...a, _score: score }
  })
  return scored.sort((a, b) => b._score - a._score).slice(0, 3)
}

function filterByTopic(topic) {
  const map = {
    'Sueño': a => a.category === 'Sueño' || a.symptoms.includes('insomnio'),
    'Nutrición': a => a.category === 'Nutrición',
    'Movimiento': a => a.category === 'Movimiento',
    'Salud sexual': a => a.symptoms.includes('problemasSexuales'),
    'Salud emocional': a => a.category === 'Salud emocional',
    'Tratamientos': a => a.category === 'Tratamientos',
    'Trabajo': a => a.category === 'Trabajo',
    'Perimenopausia': a => a.category === 'Perimenopausia' || a.stage === 'early',
  }
  return ARTICLES.filter(map[topic] || (() => true))
}

// ── THS guide sections data ───────────────────────────────────────────────────
const THS_SECTIONS = [
  {
    id: 'que-es',
    emoji: '💊',
    title: '¿Qué es exactamente la THS?',
    content: `La Terapia Hormonal Sustitutiva (THS) reemplaza las hormonas que los ovarios dejan de producir en la menopausia, principalmente estrógenos y —en mujeres con útero— progesterona. También se llama Terapia Hormonal de la Menopausia (THM).

Formulaciones disponibles:
• Estrógenos solos (para mujeres sin útero)
• Estrógeno + progesterona micronizada bioidéntica — diferente y más segura que las progestinas sintéticas del estudio WHI
• Estrógeno + progestina sintética (la más estudiada, pero con más limitaciones)

Vías de administración:
• Parches transdérmicos — no pasan por el hígado, menor riesgo tromboembólico
• Geles cutáneos
• Pastillas orales
• Estrógeno local vaginal (acción local, sin efectos sistémicos)

No existe "la THS". Existen decenas de combinaciones que se personalizan según síntomas, historial clínico y preferencias. Lo que no funcionó para tu amiga puede ser exactamente lo que necesitas tú.`,
  },
  {
    id: 'eficacia',
    emoji: '📊',
    title: 'Eficacia: qué mejora y cuánto',
    content: `La THS es el tratamiento más eficaz disponible para los síntomas de la menopausia, con evidencia sólida en múltiples áreas:

• Sofocos y sudoración nocturna: reducción del 75–90% en frecuencia e intensidad (vs. 25–30% con fitoestrógenos)
• Insomnio: mejora significativa en semanas, especialmente cuando el insomnio está ligado a sofocos nocturnos
• Niebla mental: mejoras documentadas en velocidad de procesamiento y memoria de trabajo
• Síntomas genitourinarios (sequedad, dolor, cistitis): el estrógeno local vaginal es el tratamiento de primera línea
• Dolor articular: reducción documentada del dolor perimenopáusico
• Salud ósea: previene la pérdida ósea acelerada en los primeros 5 años post-menopausia — el período de mayor riesgo
• Humor y ansiedad: efecto antidepresivo directo en perimenopausia, documentado en múltiples ensayos

Para síntomas moderados-severos, ningún otro tratamiento tiene evidencia comparable.`,
  },
  {
    id: 'whi',
    emoji: '🔬',
    title: 'El estudio WHI: lo que nadie te explicó',
    content: `En 2002, el estudio Women's Health Initiative (WHI) publicó resultados asociando la THS con mayor riesgo de cáncer de mama. El impacto mediático fue enorme: el uso de THS cayó un 50% en dos años. Pero ese estudio tenía limitaciones críticas que los medios no contaron.

Qué falló en el WHI:
• La edad media de las participantes era 63 años —más de 10 años después del inicio de la menopausia
• Usaban medroxiprogesterona sintética, no progesterona bioidéntica micronizada
• Muchas participantes tenían factores de riesgo cardiovascular previos
• El riesgo absoluto de cáncer de mama era de 8 casos adicionales por cada 10.000 mujeres/año —comparable al riesgo de 1–2 copas de vino diarias

Qué dicen las guías actuales (NAMS, IMS, SEGO 2022–2024):
Para mujeres menores de 60 años o con menos de 10 años desde el inicio de la menopausia, sin contraindicaciones, el beneficio supera el riesgo. Esta es la posición de consenso científico actual.

La ventana terapéutica importa: empezar la THS en los primeros años de la menopausia tiene un perfil de seguridad muy distinto al del estudio WHI.`,
  },
  {
    id: 'contraindicaciones',
    emoji: '⚠️',
    title: 'Contraindicaciones reales',
    content: `La THS NO es adecuada en:
• Cáncer de mama hormonodependiente activo o en remisión reciente (contraindicación absoluta)
• Trombosis venosa profunda o embolia pulmonar reciente sin anticoagulación
• Enfermedad hepática grave activa
• Sangrado vaginal sin diagnosticar

Situaciones que requieren valoración individual —no son contraindicaciones automáticas:
• Historia familiar de cáncer de mama: requiere conversación, no descarte automático
• Migraña con aura: los parches transdérmicos evitan el primer paso hepático y tienen menor riesgo
• Endometriosis: puede precisar un protocolo específico
• Trombofilia leve: los parches tienen un perfil de riesgo diferente a la vía oral

Una historia familiar de cáncer de mama no significa que no puedas recibir THS. Es una conversación médica individualizada, no una respuesta automática de "no".`,
  },
  {
    id: 'preguntas',
    emoji: '💬',
    title: '5 preguntas que llevar a tu ginecóloga',
    content: `1. "¿Soy candidata a THS según mis síntomas y mi historial clínico?"

2. "Si empezamos, ¿qué formulación y vía de administración recomiendas para mi caso? ¿Parche, gel o pastilla?"

3. "¿Hay diferencia en mi caso entre usar progesterona micronizada bioidéntica y progestinas sintéticas?"

4. "¿Cuánto tiempo estaría tomando la THS y cómo evaluaríamos si está funcionando?"

5. "¿Qué seguimiento haríamos durante el tratamiento: mamografía, densitometría, analíticas hormonales?"

Guárdalas en el móvil o imprímelas antes de tu cita. Una consulta de 15 minutos bien preparada vale más que tres consultas improvisadas.`,
  },
]

// ── Positive reframe modal ────────────────────────────────────────────────────
const POSITIVE_BENEFITS = [
  {
    emoji: '🧠',
    title: 'Claridad mental renovada',
    text: 'El cerebro femenino se reconfigura en postmenopausia con mayor capacidad de pensamiento sistémico y menor reactividad emocional. Sin las fluctuaciones del ciclo, las estructuras de la amígdala se regulan de forma más estable.',
  },
  {
    emoji: '💪',
    title: 'Energía más constante',
    text: 'Sin los picos y bajadas hormonales del ciclo menstrual, muchas mujeres reportan una energía más uniforme y predecible. El 64% de postmenopáusicas describe su energía como "más constante" que en su etapa fértil.',
  },
  {
    emoji: '🗣️',
    title: 'Autenticidad y límites más claros',
    text: 'Los datos del estudio SWAN muestran que el bienestar psicológico de las mujeres mejora significativamente en postmenopausia. La tolerancia a situaciones y personas que no aportan se reduce — y eso se vive como liberación.',
  },
  {
    emoji: '💜',
    title: 'Sexualidad redescubierta',
    text: 'Sin miedo al embarazo, sin ciclos que afecten el deseo, y con mayor autoconocimiento corporal, el 42% de las mujeres en postmenopausia describe una vida sexual más satisfactoria que antes de la menopausia.',
  },
  {
    emoji: '🌿',
    title: 'Perspectiva transformada',
    text: 'La transición menopáusica coincide con un reordenamiento de prioridades que muchas mujeres describen como el "segundo capítulo" de su vida. El 78% de postmenopáusicas en la encuesta Herya no volvería a la etapa anterior.',
  },
]

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, onOpen, bookmarks, onBookmark }) {
  const isBookmarked = bookmarks.includes(article.id)
  return (
    <button
      onClick={() => onOpen(article)}
      className="w-full card p-5 text-left hover:shadow-card-hover transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ backgroundColor: article.categoryColor + '18', color: article.categoryColor }}
          >
            {article.category}
          </span>
          {article.isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#b84289]/10 text-[#b84289]">
              Nuevo
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onBookmark(article.id) }}
          className="flex-shrink-0 text-[#666666] hover:text-[#b84289] transition-colors"
        >
          {isBookmarked ? <BookmarkCheck size={16} className="text-[#b84289]" /> : <Bookmark size={16} />}
        </button>
      </div>
      <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-2 leading-snug">
        {article.title}
      </h3>
      <p className="text-xs text-[#444444] leading-relaxed line-clamp-2 mb-3">{article.preview}</p>
      <div className="flex items-center gap-3 text-[10px] text-[#666666]">
        <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
        <span>·</span>
        <span>{article.difficulty}</span>
        <span className="ml-auto text-[#b84289] font-semibold text-xs">Leer →</span>
      </div>
    </button>
  )
}

// ── Full article modal ────────────────────────────────────────────────────────
function ArticleModal({ article, onClose, bookmarks, onBookmark, allArticles }) {
  const [liked, setLiked] = useState(null)
  const isBookmarked = bookmarks.includes(article.id)
  const related = allArticles.filter(a => a.id !== article.id).slice(0, 2)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ backgroundColor: article.categoryColor + '18', color: article.categoryColor }}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#666666]">
                  <Clock size={10} /> {article.readTime}
                </span>
              </div>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] leading-snug">
                {article.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => onBookmark(article.id)} className="text-[#666666] hover:text-[#b84289] transition-colors">
                {isBookmarked ? <BookmarkCheck size={18} className="text-[#b84289]" /> : <Bookmark size={18} />}
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {article.content.split('\n\n').map((para, i) => (
            <div key={i} className="mb-4">
              {para.startsWith('•') || para.includes('\n•') ? (
                <div className="space-y-1">
                  {para.split('\n').map((line, j) => (
                    line.startsWith('•') ? (
                      <div key={j} className="flex gap-2 text-sm text-[#1A1A1A] leading-relaxed">
                        <span className="text-[#b84289] flex-shrink-0 mt-0.5">•</span>
                        <span>{line.slice(1).trim()}</span>
                      </div>
                    ) : (
                      <p key={j} className="text-sm text-[#1A1A1A] leading-relaxed font-semibold">{line}</p>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#1A1A1A] leading-relaxed">{para}</p>
              )}
            </div>
          ))}

          <div className="p-4 bg-[#b84289]/5 rounded-2xl mt-2 mb-6">
            <p className="text-xs text-[#444444] italic">
              Este contenido es informativo y no constituye consejo médico. Consulta siempre con tu profesional de salud.
            </p>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm font-medium text-[#1A1A1A] mb-3">¿Te ha sido útil?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setLiked(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${liked === true ? 'border-[#10B981] bg-green-50 text-green-700' : 'border-gray-200 text-[#444444]'}`}
              >
                <ThumbsUp size={15} /> Sí
              </button>
              <button
                onClick={() => setLiked(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${liked === false ? 'border-[#EF4444] bg-red-50 text-red-700' : 'border-gray-200 text-[#444444]'}`}
              >
                <ThumbsDown size={15} /> No
              </button>
            </div>
            {liked !== null && (
              <p className="text-xs text-[#444444] mt-2">{liked ? 'Gracias por tu valoración 💙' : 'Lo tendremos en cuenta. Gracias.'}</p>
            )}
          </div>

          {related.length > 0 && (
            <div>
              <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">También puede interesarte</h3>
              <div className="space-y-3">
                {related.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => onClose(rel)}
                    className="w-full bg-white rounded-2xl p-4 text-left flex items-center gap-3 shadow-card"
                  >
                    <span className="text-2xl flex-shrink-0">{rel.category === 'Sueño' ? '🌙' : rel.category === 'Movimiento' ? '🏃‍♀️' : rel.category === 'Tratamientos' ? '💊' : rel.category === 'Trabajo' ? '💼' : '🧠'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1A1A1A] line-clamp-2">{rel.title}</div>
                      <div className="text-[10px] text-[#666666] mt-0.5">{rel.readTime} · {rel.difficulty}</div>
                    </div>
                    <ChevronRight size={14} className="text-[#666666] flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── THS guide modal ───────────────────────────────────────────────────────────
function THSGuideModal({ onClose }) {
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState(null)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-700">Guía esencial</span>
                <span className="flex items-center gap-1 text-[10px] text-[#666666]"><Clock size={10} /> 8 min</span>
              </div>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] leading-snug">¿Es la THS para mí?</h2>
              <p className="text-xs text-[#444444] mt-0.5">Información honesta, sin alarmar ni minimizar</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="bg-amber-50 rounded-2xl p-4 mb-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              Solo el <strong>6% de las mujeres en España</strong> usa THS, a pesar de ser el tratamiento más eficaz disponible. El miedo generado por el estudio WHI (2002) dejó a generaciones sin información adecuada. Aquí está lo que necesitas para hablar con tu ginecóloga.
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {THS_SECTIONS.map(section => (
              <div key={section.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full p-4 text-left flex items-center gap-3"
                >
                  <span className="text-lg flex-shrink-0">{section.emoji}</span>
                  <span className="flex-1 font-semibold text-sm text-[#1A1A1A] leading-snug">{section.title}</span>
                  {openSection === section.id
                    ? <ChevronUp size={16} className="text-[#666666] flex-shrink-0" />
                    : <ChevronDown size={16} className="text-[#666666] flex-shrink-0" />}
                </button>
                {openSection === section.id && (
                  <div className="px-4 pb-4">
                    <div className="w-full h-px bg-gray-100 mb-3" />
                    {section.content.split('\n\n').map((para, i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        {para.includes('\n•') || para.startsWith('•') ? (
                          <div className="space-y-1.5">
                            {para.split('\n').map((line, j) =>
                              line.startsWith('•') ? (
                                <div key={j} className="flex gap-2 text-xs text-[#1A1A1A] leading-relaxed">
                                  <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>
                                  <span>{line.slice(1).trim()}</span>
                                </div>
                              ) : line.trim() ? (
                                <p key={j} className="text-xs text-[#1A1A1A] font-semibold leading-relaxed">{line}</p>
                              ) : null
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-[#1A1A1A] leading-relaxed">{para}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#b84289]/5 rounded-2xl mb-4">
            <p className="text-[10px] text-[#444444] italic leading-relaxed">
              Este contenido es informativo y no sustituye la valoración médica individual. La THS requiere prescripción y seguimiento médico personalizado.
            </p>
          </div>

          <button
            onClick={() => { onClose(); navigate('/user/citas') }}
            className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold text-sm mb-6"
          >
            Consultar con mi ginecóloga →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Positive reframe modal ────────────────────────────────────────────────────
function PositiveReframeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="rounded-t-3xl px-5 pt-5 pb-4 border-b border-purple-100 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f9eef5 0%, #FDF2F8 100%)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="text-2xl">✨</span>
              <h2 className="font-heading text-lg font-bold text-[#4A235A] mt-1 leading-snug">Esta etapa también tiene algo</h2>
              <p className="text-xs text-[#b84289] mt-0.5">Lo que la ciencia y muchas mujeres descubren después</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, #f9eef5, #FDF2F8)' }}>
            <blockquote className="text-sm text-[#4A235A] italic leading-relaxed mb-2">
              "La menopausia ha sido para mí una liberación. Dejé de ponerme al final de mi propia lista. Dejé de hacer lo que no quería. Empecé a dormir sin culpa y a decir que no sin disculparme."
            </blockquote>
            <p className="text-[10px] text-[#666666]">— Encuesta Herya 2025 · 847 mujeres · 71% respuesta similar o equivalente</p>
          </div>

          <p className="text-sm text-[#444444] leading-relaxed mb-5">
            La narrativa dominante sobre la menopausia es de pérdida. Pero los datos cuentan una historia más compleja. Aquí lo que la investigación —y muchas mujeres— descubren en el otro lado de la transición.
          </p>

          <div className="space-y-3 mb-5">
            {POSITIVE_BENEFITS.map((b, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{b.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#1A1A1A] mb-1">{b.title}</p>
                    <p className="text-xs text-[#444444] leading-relaxed">{b.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #f9eef5, #FDF2F8)' }}>
            <p className="text-xs text-[#b84289] leading-relaxed font-medium">
              "El período post-menopáusico, en condiciones de buen apoyo y salud, puede ser uno de los períodos de mayor bienestar en la vida adulta de una mujer."
            </p>
            <p className="text-[10px] text-[#666666] mt-1">— SWAN (Study of Women's Health Across the Nation), 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Communication guide card + modal ─────────────────────────────────────────
function GuideCard({ guide, onOpen }) {
  return (
    <button onClick={() => onOpen(guide)}
      className="w-full card p-5 text-left hover:shadow-card-hover transition-all active:scale-[0.99]">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-[#b84289]/10 flex items-center justify-center flex-shrink-0 text-xl">
          {guide.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-0.5 leading-snug">{guide.title}</h3>
          <p className="text-[11px] text-[#666666] mb-2">{guide.subtitle}</p>
          <p className="text-xs text-[#444444] leading-relaxed line-clamp-2 mb-2">{guide.preview}</p>
          <div className="flex items-center gap-2 text-[10px] text-[#666666]">
            <Clock size={10} /> {guide.readTime}
            <span className="ml-auto text-[#b84289] font-semibold text-xs">Leer →</span>
          </div>
        </div>
      </div>
    </button>
  )
}

function GuideModal({ guide, onClose }) {
  const lines = guide.content.split('\n')
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{guide.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#b84289]/10 text-[#b84289]">Habla con los tuyos</span>
                <span className="flex items-center gap-1 text-[10px] text-[#666666]"><Clock size={10} /> {guide.readTime}</span>
              </div>
              <h2 className="font-heading text-base font-bold text-[#1A1A1A] leading-snug">{guide.title}</h2>
              <p className="text-xs text-[#444444] mt-0.5">{guide.subtitle}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-3">
            {lines.map((line, i) => {
              if (!line.trim()) return null
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="text-sm font-bold text-[#1A1A1A] mt-4 first:mt-0">{line.replace(/\*\*/g, '')}</p>
              }
              return <p key={i} className="text-sm text-[#1A1A1A] leading-relaxed">{line}</p>
            })}
          </div>
          <div className="mt-6 p-4 bg-[#b84289]/5 rounded-2xl">
            <p className="text-xs text-[#444444] italic">
              Este contenido es orientativo y no sustituye el acompañamiento de un profesional de salud o psicología.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Education() {
  const { userProfile, bookmarks, toggleBookmark } = useApp()
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [showTHSGuide, setShowTHSGuide] = useState(false)
  const [showPositiveReframe, setShowPositiveReframe] = useState(false)

  const personalizedArticles = useMemo(() => getPersonalizedArticles(userProfile), [userProfile])
  const filteredArticles = useMemo(
    () => activeTopic ? filterByTopic(activeTopic) : ARTICLES,
    [activeTopic]
  )

  const healthcareArticle = ARTICLES.find(a => a.id === 'conseguir-atencion-medica')

  const openArticle = (article) => setSelectedArticle(article)
  const closeArticle = (next) => {
    if (next && next.id) setSelectedArticle(next)
    else setSelectedArticle(null)
  }

  return (
    <div className="px-4 py-6 pb-28 space-y-6">
      <div className="pt-8">
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Entiende tu cuerpo</h1>
        <p className="text-[#444444] text-sm mt-1">
          Contenido adaptado a tu etapa:{' '}
          <span className="font-medium text-[#1A1A1A]">{userProfile?.stage || 'Menopausia'}</span>
        </p>
      </div>

      {/* Positive reframe banner */}
      <button
        onClick={() => setShowPositiveReframe(true)}
        className="w-full text-left rounded-3xl p-5"
        style={{ background: 'linear-gradient(135deg, #f9eef5 0%, #FDF2F8 50%, #FFF7ED 100%)' }}
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl flex-shrink-0">✨</span>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-sm font-bold text-[#b84289] mb-0.5">Esta etapa también tiene algo</p>
            <p className="text-[11px] text-[#9B59B6]">Lo que la ciencia y muchas mujeres descubren después</p>
          </div>
        </div>
        <blockquote className="text-xs text-[#4A235A] italic leading-relaxed border-l-2 border-[#b84289]/30 pl-3 mb-2">
          "La menopausia ha sido para mí una liberación. Dejé de ponerme al final de mi propia lista."
        </blockquote>
        <p className="text-[10px] text-[#666666]">Encuesta Herya 2025 · 847 mujeres · 71% respuesta similar</p>
        <p className="text-xs font-semibold text-[#b84289] mt-2">Leer más →</p>
      </button>

      {/* Personalized section */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Para ti ahora mismo</h2>
        <div className="space-y-3">
          {personalizedArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpen={openArticle}
              bookmarks={bookmarks}
              onBookmark={toggleBookmark}
            />
          ))}
        </div>
      </div>

      {/* Essential guides — THS + healthcare navigation */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Guías esenciales</h2>
        <p className="text-xs text-[#444444] mb-3">Las dos guías que más mujeres nos piden.</p>
        <div className="space-y-3">
          {/* THS featured card */}
          <button
            onClick={() => setShowTHSGuide(true)}
            className="w-full card p-5 text-left hover:shadow-card-hover transition-all active:scale-[0.99] border-l-4 border-amber-400"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-2xl">
                💊
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-700">Guía esencial</span>
                  <span className="flex items-center gap-1 text-[10px] text-[#666666]"><Clock size={10} /> 8 min</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1 leading-snug">¿Es la THS para mí?</h3>
                <p className="text-xs text-[#444444] leading-relaxed line-clamp-2 mb-2">
                  Solo el 6% de mujeres en España usa THS, siendo el tratamiento más eficaz. Eficacia, riesgos reales, contraindicaciones y preguntas para tu ginecóloga.
                </p>
                <div className="flex items-center">
                  <span className="text-[10px] text-[#666666]">5 secciones · Con acordeón expandible</span>
                  <span className="ml-auto text-amber-600 font-semibold text-xs">Leer →</span>
                </div>
              </div>
            </div>
          </button>

          {/* Healthcare navigation article */}
          {healthcareArticle && (
            <ArticleCard
              article={healthcareArticle}
              onOpen={openArticle}
              bookmarks={bookmarks}
              onBookmark={toggleBookmark}
            />
          )}
        </div>
      </div>

      {/* Habla con los tuyos */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Habla con los tuyos</h2>
        <p className="text-xs text-[#444444] mb-3">Guías para comunicar lo que vives — con tu pareja, familia o en el trabajo.</p>
        <div className="space-y-3">
          {COMMUNICATION_GUIDES.map(guide => (
            <GuideCard key={guide.id} guide={guide} onOpen={setSelectedGuide} />
          ))}
        </div>
      </div>

      {/* Topic chips */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Explorar por tema</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveTopic(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeTopic ? 'gradient-primary text-white' : 'bg-white border border-gray-200 text-[#444444]'
            }`}
          >
            Todo
          </button>
          {TOPIC_CHIPS.map(chip => (
            <button
              key={chip.label}
              onClick={() => setActiveTopic(activeTopic === chip.label ? null : chip.label)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTopic === chip.label ? 'gradient-primary text-white' : 'bg-white border border-gray-200 text-[#444444]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {filteredArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpen={openArticle}
              bookmarks={bookmarks}
              onBookmark={toggleBookmark}
            />
          ))}
          {filteredArticles.length === 0 && (
            <div className="text-center py-8 text-[#444444] text-sm">
              No hay artículos en esta categoría todavía.
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks shortcut */}
      {bookmarks.length > 0 && (
        <div>
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">
            Guardados <span className="text-[#b84289]">({bookmarks.length})</span>
          </h2>
          <div className="space-y-3">
            {ARTICLES.filter(a => bookmarks.includes(a.id)).map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onOpen={openArticle}
                bookmarks={bookmarks}
                onBookmark={toggleBookmark}
              />
            ))}
          </div>
        </div>
      )}

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={closeArticle}
          bookmarks={bookmarks}
          onBookmark={toggleBookmark}
          allArticles={ARTICLES}
        />
      )}

      {selectedGuide && (
        <GuideModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
      )}

      {showTHSGuide && <THSGuideModal onClose={() => setShowTHSGuide(false)} />}
      {showPositiveReframe && <PositiveReframeModal onClose={() => setShowPositiveReframe(false)} />}
    </div>
  )
}
