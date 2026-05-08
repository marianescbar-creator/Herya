import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, CheckCircle2, Circle, Home, Info, Zap, AlertTriangle, GripVertical, RefreshCw, Calendar, ChevronDown, ChevronUp, CalendarCheck } from 'lucide-react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ENERGY_TIMELINE, MOCK_MEETINGS } from '../../data/mockData'

const ENERGY_COLORS = { 1: '#F59E0B', 2: '#b84289', 3: '#10B981' }
const ENERGY_LABELS = { 1: 'Baja', 2: 'Media', 3: 'Alta' }
const ENERGY_BG = { 1: '#FFFBEB', 2: '#f9eef5', 3: '#ECFDF5' }

const INITIAL_TASKS = [
  { id: 1, text: 'Preparar informe mensual', priority: 'high', done: false, suggestedHour: 9 },
  { id: 2, text: 'Revisar correos pendientes', priority: 'medium', done: false, suggestedHour: 11 },
  { id: 3, text: 'Llamada con proveedor', priority: 'medium', done: false, suggestedHour: 10 },
  { id: 4, text: 'Actualizar presentación Q2', priority: 'high', done: true, suggestedHour: 8 },
  { id: 5, text: 'Revisar facturas pendientes', priority: 'low', done: false, suggestedHour: 16 },
]

const PRIORITY_CONFIG = {
  high:   { label: 'Prioritaria', color: '#EF4444', bg: '#FEF2F2', dot: 'bg-red-400' },
  medium: { label: 'Normal',      color: '#F59E0B', bg: '#FFFBEB', dot: 'bg-amber-400' },
  low:    { label: 'Ligera',      color: '#10B981', bg: '#ECFDF5', dot: 'bg-green-400' },
}

const ENERGY_TECHNIQUES = [
  {
    id: 'pre-reunion',
    title: 'Respiración pre-reunión',
    time: '2 min antes',
    emoji: '🌬️',
    steps: [
      'Cierra los ojos un momento o baja la mirada.',
      'Inhala 4 segundos por la nariz, lento.',
      'Aguanta 7 segundos sin tensión.',
      'Exhala por la boca durante 8 segundos con un suave sonido.',
      'Repite 3 veces. Notarás el sistema nervioso calmarse — ideal para entrar centrada.',
    ],
  },
  {
    id: 'anclaje-cognitivo',
    title: 'Anclaje cognitivo',
    time: 'En cualquier momento',
    emoji: '⚓',
    steps: [
      'Identifica un objeto en tu campo visual. Descríbelo mentalmente: color, textura, forma.',
      'Nombra 3 cosas que oyes ahora mismo.',
      'Siente el suelo bajo tus pies durante 5 segundos.',
      'Este anclaje redirige la mente de la niebla hormonal al momento presente en menos de 60 segundos.',
    ],
  },
  {
    id: 'sofoco-reunion',
    title: 'Sofoco en reunión',
    time: 'En el momento',
    emoji: '🌡️',
    steps: [
      'Si puedes, abre una ventana o activa el ventilador antes de que empiece.',
      'Afloja discretamente ropa cerca del cuello o muñecas — la piel de las muñecas disipa calor eficazmente.',
      'Respira lento: 5 segundos de inhalación, 5 de exhalación. Activa el sistema parasimpático.',
      'Si tienes un abanico o ventilador portátil, úsalo sin disculpas — es una herramienta médica, no un accesorio.',
      'Recuerda: el sofoco dura de 1 a 4 minutos. Va a pasar.',
    ],
  },
  {
    id: 'recuperacion-post',
    title: 'Recuperación post-reunión',
    time: '5 min después',
    emoji: '🔋',
    steps: [
      'Reserva 5 minutos antes de la siguiente tarea.',
      'Estira el cuello suavemente de lado a lado — 30 segundos cada lado.',
      'Bebe agua fría. La deshidratación amplifica la niebla mental postmenopáusica.',
      'Escribe una sola cosa que salió bien en la reunión — activa el circuito de recompensa.',
      'Si tienes tiempo, sal 2 minutos al exterior o a una ventana. La luz natural regula el ritmo circadiano.',
    ],
  },
]

const CALENDAR_SYNC_STATES = ['Google Calendar', 'Apple Calendar', 'Outlook', null]

function EnergyBar({ level }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-2 h-3 rounded-sm"
          style={{ backgroundColor: i <= level ? ENERGY_COLORS[level] : '#D1D5DB', opacity: i <= level ? 1 : 0.3 }} />
      ))}
    </div>
  )
}

function EnergyTechniquesModal({ onClose }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-[#1A1A1A]">Técnicas de manejo de energía</h2>
              <p className="text-xs text-[#444444] mt-0.5">Adaptadas para reuniones con síntomas</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {ENERGY_TECHNIQUES.map(tech => (
            <div key={tech.id} className="card p-4">
              <button onClick={() => setExpanded(e => e === tech.id ? null : tech.id)} className="w-full text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{tech.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#1A1A1A]">{tech.title}</div>
                    <div className="text-[10px] text-[#666666]">{tech.time}</div>
                  </div>
                  {expanded === tech.id ? <ChevronUp size={16} className="text-[#666666] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#666666] flex-shrink-0" />}
                </div>
              </button>
              {expanded === tech.id && (
                <div className="mt-3 space-y-2">
                  {tech.steps.map((step, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-5 h-5 rounded-full bg-[#b84289]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-[#b84289]">{i + 1}</span>
                      </div>
                      <p className="text-xs text-[#444444] leading-relaxed flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WeekCalendar({ selectedDate, onSelect, meetings }) {
  const today = new Date()
  const days = useMemo(() => {
    const start = new Date(today)
    const dow = today.getDay()
    start.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [])

  const DAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const todayStr = today.toISOString().split('T')[0]
  const hasMeetings = (d) => {
    const ds = d.toISOString().split('T')[0]
    return ds === todayStr && meetings.length > 0
  }

  return (
    <div className="flex items-center gap-1">
      {days.map((d, i) => {
        const ds = d.toISOString().split('T')[0]
        const isToday = ds === todayStr
        const isSelected = ds === selectedDate
        return (
          <button key={ds} onClick={() => onSelect(isSelected ? null : ds)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${isSelected ? 'gradient-primary' : isToday ? 'bg-[#b84289]/10' : 'bg-transparent'}`}>
            <span className={`text-[9px] font-semibold ${isSelected ? 'text-white/70' : 'text-[#666666]'}`}>
              {DAY_INITIALS[i]}
            </span>
            <span className={`text-sm font-bold ${isSelected ? 'text-white' : isToday ? 'text-[#b84289]' : 'text-[#1A1A1A]'}`}>
              {d.getDate()}
            </span>
            {hasMeetings(d) && (
              <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-[#b84289]'}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function SortableTask({ task, onToggle, onRemove }) {
  const cfg = PRIORITY_CONFIG[task.priority]
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const energyAtSuggested = ENERGY_TIMELINE.find(e => e.hour === task.suggestedHour)

  return (
    <div ref={setNodeRef} style={style}
      className="flex items-start gap-2 p-3 rounded-2xl" style2={{ backgroundColor: cfg.bg }}>
      <div {...attributes} {...listeners} className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 py-0.5">
        <GripVertical size={16} />
      </div>
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0 mt-0.5">
        <Circle size={20} className="text-gray-300" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#1A1A1A] leading-snug">{task.text}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: cfg.color }}>{cfg.label}</span>
          {energyAtSuggested && (
            <span className="text-[9px] text-[#666666]">· Sugerida para las {task.suggestedHour}h</span>
          )}
        </div>
      </div>
      <button onClick={() => onRemove(task.id)} className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
        <X size={14} />
      </button>
    </div>
  )
}

export default function MiDia() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [isCustomOrder, setIsCustomOrder] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [showAddTask, setShowAddTask] = useState(false)
  const [wfh, setWfh] = useState(false)
  const [wfhSent, setWfhSent] = useState(false)
  const [selectedHour, setSelectedHour] = useState(null)
  const [showTechniques, setShowTechniques] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [calendarSync] = useState('Google Calendar')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const now = new Date()
  const currentHour = now.getHours()
  const todayStr = now.toISOString().split('T')[0]
  const dateLabel = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const addTask = () => {
    if (!newTask.trim()) return
    const energyHour = selectedHour ?? 10
    const suggestedHour = newPriority === 'high'
      ? (ENERGY_TIMELINE.find(e => e.level === 3)?.hour ?? 9)
      : energyHour
    setTasks(t => [...t, { id: Date.now(), text: newTask.trim(), priority: newPriority, done: false, suggestedHour }])
    setNewTask('')
    setShowAddTask(false)
  }

  const toggleTask = (id) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task))
  const removeTask = (id) => setTasks(t => t.filter(task => task.id !== id))

  const handleWfhToggle = () => {
    const next = !wfh
    setWfh(next)
    if (next) setWfhSent(true)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTasks(items => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      setIsCustomOrder(true)
    }
  }

  const restoreDefaultOrder = () => {
    setTasks(t => [...t].sort((a, b) => a.suggestedHour - b.suggestedHour))
    setIsCustomOrder(false)
  }

  const meetingsWithEnergy = MOCK_MEETINGS.map(m => ({
    ...m,
    energyLevel: ENERGY_TIMELINE.find(e => e.hour === m.energyHour)?.level ?? 2,
  }))

  const filteredMeetings = selectedDate && selectedDate !== todayStr ? [] : meetingsWithEnergy
  const pending = tasks.filter(t => !t.done)
  const completed = tasks.filter(t => t.done)

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-bold text-white">Mi Día</h1>
            <p className="text-white/70 text-xs capitalize">{dateLabel}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-28 space-y-5">

        {/* Weekly calendar */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-semibold text-[#1A1A1A]">Esta semana</h2>
            <div className="flex items-center gap-1.5">
              {calendarSync ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                  <CalendarCheck size={10} className="text-green-600" />
                  <span className="text-[9px] text-green-700 font-semibold">{calendarSync}</span>
                </div>
              ) : (
                <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                  <Calendar size={10} className="text-[#444444]" />
                  <span className="text-[9px] text-[#444444]">Sincronizar</span>
                </button>
              )}
            </div>
          </div>
          <WeekCalendar selectedDate={selectedDate} onSelect={setSelectedDate} meetings={MOCK_MEETINGS} />
          {selectedDate && selectedDate !== todayStr && (
            <p className="text-[10px] text-[#666666] text-center mt-2">
              Sin reuniones registradas para este día.
            </p>
          )}
        </div>

        {/* WFH toggle */}
        <div className={`card p-4 transition-all ${wfh ? 'border-2 border-[#10B981]/40' : ''}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${wfh ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Home size={18} className={wfh ? 'text-green-600' : 'text-[#666666]'} />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#1A1A1A]">Hoy trabajo desde casa</div>
                <div className="text-xs text-[#444444]">Gestiona mejor tu bienestar hoy</div>
              </div>
            </div>
            <button onClick={handleWfhToggle}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${wfh ? 'bg-[#10B981]' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${wfh ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          {wfhSent && wfh && (
            <div className="mt-3 p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-green-700 leading-relaxed">
                Herya lo ha registrado en tu historial de bienestar. Tu empresa puede recibir una notificación anónima si tienes la integración de RRHH activada — sin revelar el motivo médico.
              </p>
            </div>
          )}
        </div>

        {/* Energy timeline */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">Tu energía hoy</h2>
            <div className="flex items-center gap-1 text-[10px] text-[#666666]">
              <Info size={10} />
              <span>Basado en tus registros</span>
            </div>
          </div>
          <p className="text-xs text-[#666666] mb-4 leading-relaxed">
            Basándonos en tus registros de las últimas 3 semanas, esta es tu tendencia de energía. No es una predicción — úsala como referencia para organizar tus tareas.
          </p>
          <div className="flex items-end gap-1 h-16 mb-2">
            {ENERGY_TIMELINE.map(slot => {
              const isNow = slot.hour === currentHour
              const height = slot.level === 3 ? '100%' : slot.level === 2 ? '65%' : '35%'
              return (
                <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm transition-all" style={{
                    height,
                    backgroundColor: ENERGY_COLORS[slot.level] + (isNow ? 'FF' : '80'),
                    outline: isNow ? `2px solid ${ENERGY_COLORS[slot.level]}` : 'none',
                  }} />
                </div>
              )
            })}
          </div>
          <div className="flex gap-1">
            {ENERGY_TIMELINE.map(slot => (
              <div key={slot.hour} className="flex-1 text-center text-[8px] text-[#666666]">{slot.label}</div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-[#444444]">
            {[3, 2, 1].map(l => (
              <span key={l} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: ENERGY_COLORS[l] }} />
                {ENERGY_LABELS[l]}
              </span>
            ))}
          </div>
        </div>

        {/* Today's meetings */}
        <div className="card p-5">
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">
            Reuniones {selectedDate && selectedDate !== todayStr ? `del ${new Date(selectedDate + 'T12:00:00').getDate()} de ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { month: 'long' })}` : 'de hoy'}
          </h2>
          {filteredMeetings.length === 0 ? (
            <p className="text-sm text-[#666666] text-center py-4">Sin reuniones este día.</p>
          ) : (
            <div className="space-y-3">
              {filteredMeetings.map(m => (
                <div key={m.id} className="rounded-2xl p-3 flex items-start gap-3" style={{ backgroundColor: ENERGY_BG[m.energyLevel] }}>
                  <div className="text-center flex-shrink-0">
                    <div className="font-heading text-lg font-bold text-[#1A1A1A]">{m.hour}h</div>
                    <div className="text-[9px] text-[#666666]">{m.duration}min</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1A1A1A] mb-1">{m.title}</div>
                    <div className="flex items-center gap-2">
                      <EnergyBar level={m.energyLevel} />
                      <span className="text-[10px] text-[#444444]">Energía {ENERGY_LABELS[m.energyLevel].toLowerCase()} a esta hora</span>
                    </div>
                  </div>
                  {m.energyLevel === 1 && (
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredMeetings.some(m => m.energyLevel === 1) && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl flex gap-2">
              <AlertTriangle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Tienes reuniones en franjas donde históricamente tienes menos energía. ¿Quieres preparar algo específico antes?{' '}
                <button onClick={() => setShowTechniques(true)} className="font-semibold underline">
                  Ver técnicas de manejo de energía
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">Tareas del día</h2>
              {isCustomOrder && (
                <span className="px-2 py-0.5 rounded-lg bg-[#b84289]/10 text-[9px] font-bold text-[#b84289]">
                  Orden personalizado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isCustomOrder && (
                <button onClick={restoreDefaultOrder}
                  className="flex items-center gap-1 text-[10px] text-[#444444] hover:text-[#b84289]">
                  <RefreshCw size={11} /> Restaurar
                </button>
              )}
              <button onClick={() => setShowAddTask(s => !s)}
                className="w-8 h-8 rounded-xl bg-[#b84289]/10 flex items-center justify-center">
                <Plus size={16} className="text-[#b84289]" />
              </button>
            </div>
          </div>

          {showAddTask && (
            <div className="bg-gray-50 rounded-2xl p-3 mb-4 space-y-2">
              <input
                type="text" value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Nombre de la tarea..."
                className="w-full bg-white rounded-xl px-3 py-2 text-sm border border-gray-100 focus:outline-none focus:border-[#b84289]"
                autoFocus
              />
              <div className="flex gap-2">
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => setNewPriority(key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${newPriority === key ? 'text-white border-transparent' : 'border-gray-200 text-[#444444]'}`}
                    style={newPriority === key ? { backgroundColor: cfg.color } : {}}>
                    {cfg.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={addTask} className="flex-1 py-2 rounded-xl gradient-primary text-white text-xs font-semibold">Añadir</button>
                <button onClick={() => setShowAddTask(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-[#444444] text-xs font-semibold">Cancelar</button>
              </div>
            </div>
          )}

          <div className="bg-[#b84289]/5 rounded-xl p-3 mb-4 flex gap-2">
            <Zap size={12} className="text-[#b84289] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#444444] leading-relaxed">
              Arrastra las tareas con el icono ⠿ para reorganizarlas. Las tareas prioritarias están sugeridas para tu franja de mayor energía (8–10h).
            </p>
          </div>

          {pending.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={pending.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 mb-4">
                  {pending.map(task => {
                    const cfg = PRIORITY_CONFIG[task.priority]
                    return (
                      <div key={task.id}
                        style={{ backgroundColor: cfg.bg }}
                        className="rounded-2xl overflow-hidden">
                        <SortableTask task={task} onToggle={toggleTask} onRemove={removeTask} />
                      </div>
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {pending.length === 0 && completed.length === 0 && (
            <p className="text-center text-sm text-[#666666] py-4">No hay tareas hoy. Añade una con el botón +</p>
          )}

          {completed.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#666666] mb-2 uppercase tracking-wide">Completadas ({completed.length})</p>
              <div className="space-y-2">
                {completed.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                      <CheckCircle2 size={20} className="text-[#10B981]" />
                    </button>
                    <p className="flex-1 text-sm text-[#666666] line-through">{task.text}</p>
                    <button onClick={() => removeTask(task.id)} className="text-gray-200 hover:text-gray-400 flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#b84289]/5 rounded-2xl flex gap-2">
          <Info size={12} className="text-[#b84289] flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#444444] leading-relaxed">
            Las sugerencias de energía se basan en tus registros de síntomas de las últimas 3 semanas. Herya nunca dice cuándo tendrás energía — solo te muestra tendencias pasadas para que tú decidas. Tú tienes el control.
          </p>
        </div>
      </div>

      {showTechniques && <EnergyTechniquesModal onClose={() => setShowTechniques(false)} />}
    </div>
  )
}
