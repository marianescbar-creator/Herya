// ─── Symptom definitions ─────────────────────────────────────────────────────
export const SYMPTOMS_LIST = [
  { id: 'sofocos', label: 'Sofocos o sudoración nocturna' },
  { id: 'palpitaciones', label: 'Palpitaciones u opresión en el pecho' },
  { id: 'dolorArticular', label: 'Dolor articular o muscular' },
  { id: 'insomnio', label: 'Insomnio o problemas de sueño' },
  { id: 'animoBajo', label: 'Ánimo bajo o tristeza' },
  { id: 'irritabilidad', label: 'Irritabilidad' },
  { id: 'ansiedad', label: 'Ansiedad' },
  { id: 'cansancio', label: 'Cansancio o niebla mental' },
  { id: 'problemasSexuales', label: 'Problemas sexuales (sequedad, dolor, falta de deseo)' },
  { id: 'problemasUrinarios', label: 'Problemas urinarios' },
]
export const RATING_LABELS = ['Nada', 'Leve', 'Moderado', 'Severo', 'Muy severo']

// ─── Demo profile (Carmen) ────────────────────────────────────────────────────
export const DEMO_PROFILE = {
  name: 'Carmen',
  age: '50-54',
  stage: 'Menopausia',
  work: 'Trabajo por cuenta ajena',
  symptoms: {
    sofocos: 2, palpitaciones: 1, dolorArticular: 2, insomnio: 3,
    animoBajo: 2, irritabilidad: 2, ansiedad: 2, cansancio: 3,
    problemasSexuales: 3, problemasUrinarios: 2,
  },
  totalScore: 22,
  management: ['Suplementos naturales', 'Cambios en dieta'],
  qualityOfLife: 6,
  hasSpokenToDoctor: 'No',
  completedAt: '2026-02-24T10:00:00.000Z',
}

// ─── Weekly tracking history ──────────────────────────────────────────────────
export const MOCK_WEEKLY_HISTORY = [
  { week: 'Sem 1', date: '2026-02-24', totalScore: 22, insomnio: 3, cansancio: 3, sofocos: 2, dolorArticular: 2, ansiedad: 2, problemasSexuales: 3 },
  { week: 'Sem 2', date: '2026-03-02', totalScore: 21, insomnio: 3, cansancio: 3, sofocos: 2, dolorArticular: 2, ansiedad: 2, problemasSexuales: 3 },
  { week: 'Sem 3', date: '2026-03-09', totalScore: 20, insomnio: 2, cansancio: 3, sofocos: 2, dolorArticular: 2, ansiedad: 2, problemasSexuales: 3 },
  { week: 'Sem 4', date: '2026-03-16', totalScore: 19, insomnio: 2, cansancio: 2, sofocos: 2, dolorArticular: 2, ansiedad: 2, problemasSexuales: 2 },
  { week: 'Sem 5', date: '2026-03-23', totalScore: 19, insomnio: 2, cansancio: 2, sofocos: 2, dolorArticular: 2, ansiedad: 1, problemasSexuales: 2 },
  { week: 'Sem 6', date: '2026-03-30', totalScore: 18, insomnio: 2, cansancio: 2, sofocos: 2, dolorArticular: 1, ansiedad: 1, problemasSexuales: 2 },
  { week: 'Sem 7', date: '2026-04-06', totalScore: 17, insomnio: 2, cansancio: 2, sofocos: 1, dolorArticular: 1, ansiedad: 1, problemasSexuales: 2 },
  { week: 'Sem 8', date: '2026-04-14', totalScore: 18, insomnio: 2, cansancio: 2, sofocos: 2, dolorArticular: 1, ansiedad: 1, problemasSexuales: 2 },
]

// ─── Company KPI data ─────────────────────────────────────────────────────────
export const COMPANY_KPI_HISTORY = [
  { week: 'Sem 1', symptoms: 18.2, quality: 6.4 },
  { week: 'Sem 2', symptoms: 17.8, quality: 6.5 },
  { week: 'Sem 3', symptoms: 17.2, quality: 6.6 },
  { week: 'Sem 4', symptoms: 16.8, quality: 6.7 },
  { week: 'Sem 5', symptoms: 16.1, quality: 6.8 },
  { week: 'Sem 6', symptoms: 15.4, quality: 6.9 },
  { week: 'Sem 7', symptoms: 14.8, quality: 7.0 },
  { week: 'Sem 8', symptoms: 14.1, quality: 7.1 },
]
export const SEVERITY_DISTRIBUTION = [
  { name: 'Severa (≥16)', value: 31, color: '#EF4444', baseline: 46 },
  { name: 'Moderada (9-15)', value: 38, color: '#F59E0B', baseline: 34 },
  { name: 'Leve (5-8)', value: 21, color: '#10B981', baseline: 14 },
  { name: 'Sin síntomas', value: 10, color: '#6B7280', baseline: 6 },
]
export const STAGE_DISTRIBUTION = [
  { name: 'Perimenopausia', value: 38, color: '#4A6CF7' },
  { name: 'Menopausia', value: 42, color: '#7B3FE4' },
  { name: 'Postmenopausia', value: 14, color: '#F59E0B' },
  { name: 'Sin síntomas / premenopáusica', value: 6, color: '#10B981' },
]
export const TOP_SYMPTOMS_COMPANY = [
  { name: 'Insomnio', baseline: 68, current: 51 },
  { name: 'Cansancio / niebla mental', baseline: 57, current: 42 },
  { name: 'Dolor articular', baseline: 57, current: 48 },
  { name: 'Problemas sexuales', baseline: 66, current: 54 },
  { name: 'Irritabilidad', baseline: 46, current: 35 },
]

// ─── Routines (day-specific) ──────────────────────────────────────────────────
// dayOfWeek: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const SLEEP_BY_DAY = {
  0: { text: 'Prepara la semana: decide tu hora fija de levantarte para los próximos 7 días y ponla en alarma', duration: '5 min' },
  1: { text: 'Prepara tu habitación a 18-20°C esta noche. Apaga todas las pantallas a las 21:30', duration: '5 min' },
  2: { text: 'Prueba la respiración 4-7-8: inhala 4s, aguanta 7s, exhala 8s. Repite 4 veces antes de dormir', duration: '5 min', session: 'breathing478' },
  3: { text: 'Sin cafeína después de las 13h. Esta noche toma infusión de valeriana o pasiflora en lugar de té', duration: '3 min' },
  4: { text: 'Levántate a la misma hora que ayer aunque hayas dormido mal. Esto regula tu ritmo circadiano', duration: '— min' },
  5: { text: 'Baño o ducha templada 1h antes de dormir para bajar la temperatura corporal y facilitar el sueño', duration: '15 min' },
  6: { text: 'Sin alcohol esta noche. El alcohol fragmenta el sueño en la segunda mitad de la noche', duration: '— min' },
}
export const MOVEMENT_DAYS = [1, 2, 4, 6] // Mon/Tue/Thu/Sat
export const MOVEMENT_BY_DAY = {
  1: { text: 'Fuerza tren inferior: 3 series de sentadillas ×12, puente de glúteos ×15, zancadas ×10 cada pierna', duration: '20 min' },
  2: { text: 'Caminar 30 min a ritmo moderado — suficiente para notar el corazón, sin que te impida hablar', duration: '30 min' },
  4: { text: 'Fuerza tren superior: 3 series de flexiones de pared ×10, remo con mochila ×12, press de hombros ×10', duration: '20 min' },
  6: { text: 'Yoga o movilidad articular 20 min. Enfócate en cadera, columna y hombros', duration: '20 min' },
}
const NUTRITION_WARNING = 'Guía basada en evidencia científica. Consúltala siempre con tu ginecóloga o nutricionista de Herya antes de modificar suplementación.'

export const NUTRITION_BY_DAY = {
  0: {
    text: 'Omega-3 y fitoestrógenos — carga semanal antiinflamatoria.',
    focus: 'Omega-3 · Fitoestrógenos',
    items: [
      { meal: 'Desayuno', food: '2 cdas. soperas de semillas de chía (28g) en 200ml de bebida vegetal de avena', reason: 'Los lignanos de la chía tienen actividad fitoestrogénica débil que puede modular la frecuencia de sofocos. La avena aporta triptófano, precursor de melatonina.', benefit: 'Sofocos · Inicio del sueño' },
      { meal: 'Almuerzo', food: '120g de salmón salvaje a la plancha + 80g de brócoli al vapor (no hervido)', reason: 'EPA y DHA reducen la PGE2 (prostaglandina inflamatoria) que agrava el dolor articular. El brócoli al vapor preserva el 85% del DIM vs el 40% al hervirlo — el DIM favorece el metabolismo estrogénico protector.', benefit: 'Dolor articular · Metabolismo hormonal', note: 'Si no hay salmón, 90g de sardinas en conserva al natural tienen perfil de omega-3 equivalente.' },
      { meal: 'Snack', food: '30g de nueces (~7 unidades)', reason: 'Magnesio biodisponible para relajación muscular nocturna y regulación del cortisol matutino.', benefit: 'Sueño · Cortisol' },
    ],
    supplement: { peri: 'Magnesio bisglicinato 300–400mg en cena (no óxido: absorción 4% vs 23%) + Vitamina D3 2000 UI con almuerzo + Omega-3 2g/día (EPA+DHA ratio 2:1)', meno: 'Lo anterior + Calcio citrato 500mg en cena (no carbonato si hay acidez gástrica)', post: 'Lo anterior + Proteína mínimo 25–30g por comida (prioridad anti-sarcopenia) + CoQ10 100mg si hay fatiga severa' },
    warning: NUTRITION_WARNING,
  },
  1: {
    text: 'Calcio biodisponible y proteína completa — base para hueso y músculo.',
    focus: 'Calcio · Proteína',
    items: [
      { meal: 'Desayuno', food: '125g de yogur griego natural (no 0%) + 1 kiwi mediano (80g)', reason: 'El yogur griego aporta 150mg de calcio + proteína completa. El kiwi contiene serotonina natural y vitamina C que mejora la absorción del hierro, crítico en perimenopausia con ciclos irregulares.', benefit: 'Densidad ósea · Estado de ánimo · Hierro' },
      { meal: 'Almuerzo', food: '150g de tofu firme salteado con ½ cdta. de cúrcuma y 1 pizca de pimienta negra', reason: 'Las isoflavonas del tofu tienen efecto fitoestrogénico. La curcumina con piperina (pimienta) es antiinflamatoria articular — sin piperina la absorción de curcumina es casi nula.', benefit: 'Sofocos · Inflamación articular', note: 'Si hay hipotiroidismo diagnosticado, limitar tofu a máximo 3 veces/semana.' },
      { meal: 'Cena', food: '200ml de leche entera o 125g de yogur griego', reason: '300mg de calcio biodisponible. En menopausia se necesitan 1200mg/día; este aporte cubre el 25% de la necesidad diaria.', benefit: 'Densidad ósea · Sueño' },
    ],
    supplement: { peri: 'Magnesio bisglicinato 300mg en cena', meno: 'Calcio citrato 500mg + Magnesio bisglicinato 300mg en cena', post: 'Calcio citrato 500mg + Magnesio 300mg + revisión de densidad ósea (DEXA) cada 2 años' },
    warning: NUTRITION_WARNING,
  },
  2: {
    text: 'Hidratación activa y colina para la función cognitiva.',
    focus: 'Hidratación · Función cognitiva',
    items: [
      { meal: 'Desayuno', food: '2 huevos enteros (revueltos o a la plancha)', reason: 'Cada huevo aporta ~125mg de colina. 2 huevos cubren el 50% de la necesidad diaria de colina, precursor directo de acetilcolina — el neurotransmisor más afectado por la caída de estrógenos en el córtex prefrontal.', benefit: 'Niebla mental · Memoria de trabajo' },
      { meal: 'Almuerzo', food: '80g de lentejas cocidas + 1 puñado de espinacas salteadas con ajo', reason: 'Las lentejas aportan fitoestrógenos, fibra soluble y hierro. Las espinacas suman magnesio y folato. La combinación legumbre + verde mejora la biodisponibilidad del hierro no hemo.', benefit: 'Sofocos · Energía · Hierro' },
      { meal: 'Hidratación', food: 'Objetivo: 2–2.5L de agua o infusiones sin cafeína repartidos durante el día', reason: 'Los sofocos generan pérdida de líquidos adicional. La deshidratación amplifica directamente la niebla mental, la fatiga y puede intensificar los sofocos.', benefit: 'Sofocos · Energía · Piel' },
    ],
    supplement: { peri: 'Omega-3 2g/día con el almuerzo + Vitamina D3 2000 UI', meno: 'Omega-3 2g + Vitamina D3 2000 UI + Vitamina K2 100mcg (cofactor para mineralización ósea)', post: 'Lo anterior + L-Carnitina 1g/día si hay fatiga muscular prominente' },
    warning: NUTRITION_WARNING,
  },
  3: {
    text: 'Fitoestrógenos de alta biodisponibilidad — día de lino y fermentados.',
    focus: 'Fitoestrógenos · Magnesio',
    items: [
      { meal: 'Desayuno', food: '1 cdta. de semillas de lino molido (10g) añadidas a yogur o batido', reason: 'El lino es la fuente más rica en lignanos (fitoestrógenos). Deben estar MOLIDAS para liberar los lignanos activos — enteras pasan sin absorberse.', benefit: 'Sofocos · Regulación hormonal', note: 'Conservar el lino molido en la nevera (se oxida rápido). Moler semanalmente.' },
      { meal: 'Almuerzo', food: '120g de sardinas en conserva al natural (escurridas, con espina) + ensalada de rúcula y naranja', reason: 'Las sardinas con espina aportan ~300mg de calcio + omega-3 en formato económico y práctico. La vitamina C de la naranja mejora la absorción del hierro no hemo de la rúcula.', benefit: 'Calcio · Omega-3 · Inflamación', note: 'Si tomas anticoagulantes (acenocumarol, warfarina), consulta la frecuencia de omega-3 con tu médica.' },
      { meal: 'Cena', food: '150g de tempeh salteado con verduras de temporada', reason: 'El tempeh es soja fermentada — la fermentación aumenta la biodisponibilidad de isoflavonas hasta un 35% respecto al tofu no fermentado.', benefit: 'Fitoestrógenos biodisponibles · Proteína completa' },
    ],
    supplement: { peri: 'Magnesio bisglicinato 300–400mg en cena', meno: 'Magnesio bisglicinato 300mg + Melatonina 0.5mg a las 22h si hay insomnio (dosis baja — más efectiva que 5mg)', post: 'Magnesio bisglicinato 300mg + CoQ10 100mg en desayuno si hay fatiga' },
    warning: NUTRITION_WARNING,
  },
  4: {
    text: 'Proteína completa y colágeno tipo II — protección articular y muscular.',
    focus: 'Proteína · Colágeno articular',
    items: [
      { meal: 'Desayuno', food: '200ml de batido con 20g de proteína (suero o guisante) + 1 plátano maduro', reason: 'El desayuno proteico estabiliza la glucosa matutina y evita el pico-valle que genera fatiga a media mañana. El plátano aporta triptófano y potasio.', benefit: 'Energía sostenida · Masa muscular' },
      { meal: 'Almuerzo', food: '150g de pechuga de pollo o pavo a la plancha + 200g de boniato al horno', reason: 'Proteína completa de alta digestibilidad para preservar masa muscular (la sarcopenia se acelera con la menopausia). El boniato aporta betacaroteno antioxidante sin pico de insulina brusco.', benefit: 'Masa muscular · Anti-sarcopenia · Antioxidante' },
      { meal: 'Suplemento en este día', food: 'Colágeno hidrolizado tipo II (10g) disuelto en zumo de naranja (200ml)', reason: 'El colágeno tipo II es específico del cartílago articular (distinto al tipo I que es para piel). La vitamina C del zumo es cofactor indispensable para la síntesis de colágeno endógeno.', benefit: 'Cartílago articular · Dolor articular', note: 'Resultados visibles a las 8–12 semanas de uso continuado. Tomar en ayunas o alejado de comidas para mejor absorción.' },
    ],
    supplement: { peri: 'Colágeno tipo II 10g + Vitamina C 200mg en ayunas', meno: 'Lo anterior + Vitamina D3 2000 UI con almuerzo', post: 'Lo anterior + objetivo proteína total: mínimo 1.2–1.5g/kg de peso corporal/día' },
    warning: NUTRITION_WARNING,
  },
  5: {
    text: 'Día antiinflamatorio — reducir azúcar y priorizar alimentos antioxidantes.',
    focus: 'Antiinflamatorio · Control glucémico',
    items: [
      { meal: 'Desayuno', food: 'Avena en copos tradicionales (50g) con ½ cdta. de canela y 15g de almendras', reason: 'La avena tiene beta-glucano que amortigua el pico de glucosa postprandial. La canela mejora la sensibilidad a la insulina. Las almendras aportan vitamina E antioxidante.', benefit: 'Control glucémico · Energía estable · Antioxidante', note: 'Usar copos tradicionales, no instántaneos — el procesado aumenta el índice glucémico.' },
      { meal: 'Almuerzo', food: '150g de caballa a la plancha + 100g de arroz integral + 1 cdta. de aceite de oliva virgen extra', reason: 'La caballa tiene el mayor contenido de omega-3 del pescado azul. El arroz integral tiene índice glucémico bajo y no provoca pico de insulina brusco. El AOVE es antiinflamatorio sistémico.', benefit: 'Omega-3 · Glucemia · Antiinflamatorio' },
      { meal: 'Evitar hoy', food: 'Sin alcohol, azúcar refinada ni ultraprocesados', reason: 'El alcohol es vasodilatador y fragmenta directamente la fase de sueño profundo en la segunda mitad de la noche. El azúcar amplifica los sofocos por su efecto vasodilatador y sobre el cortisol.', benefit: 'Sofocos · Calidad del sueño · Inflamación' },
    ],
    supplement: { peri: 'Vitamina D3 2000 UI con almuerzo + Omega-3 2g', meno: 'Lo anterior + Calcio citrato 500mg en cena', post: 'Vitamina D3 2000 UI + Vitamina K2 100mcg + Calcio citrato 500mg (tríada ósea)' },
    warning: NUTRITION_WARNING,
  },
  6: {
    text: 'Recuperación y minerales — semillas, legumbres y descanso digestivo.',
    focus: 'Recuperación · Minerales',
    items: [
      { meal: 'Desayuno', food: '2 huevos revueltos con espinacas + 1 rebanada de pan de centeno', reason: 'Proteína completa en el desayuno reduce el catabolismo muscular del ayuno nocturno. El pan de centeno tiene índice glucémico bajo (no genera pico de insulina).', benefit: 'Masa muscular · Energía sostenida' },
      { meal: 'Almuerzo', food: '200g de lentejas estofadas con zanahoria, apio y ½ cdta. de cúrcuma', reason: 'Las lentejas combinan fitoestrógenos + hierro + proteína vegetal. La cúrcuma añade efecto antiinflamatorio articular. El estofado es más digestivo que hervido al natural.', benefit: 'Fitoestrógenos · Hierro · Antiinflamatorio' },
      { meal: 'Snack', food: '30g de semillas de calabaza tostadas', reason: 'Ricas en zinc (cofactor de múltiples enzimas hormonales y de síntesis de progesterona) y triptófano. 30g cubren el 25% de la necesidad diaria de zinc.', benefit: 'Síntesis hormonal · Sueño · Inmunidad' },
    ],
    supplement: { peri: 'Magnesio bisglicinato 300mg en cena', meno: 'Magnesio bisglicinato 300mg + Calcio citrato 500mg en cena', post: 'Magnesio 300mg + Calcio citrato 500mg + revisión con nutricionista de Herya cada 3 meses' },
    warning: NUTRITION_WARNING,
  },
}
export const EMOTIONAL_DAYS = [1, 3, 5] // Mon/Wed/Fri
export const EMOTIONAL_BY_DAY = {
  1: { text: 'Escaneo corporal: 8 min de atención a las sensaciones físicas, sin juzgarlas', duration: '8 min', session: 'bodyscan' },
  3: { text: 'Respiración box: 4s inhala, 4s aguanta, 4s exhala, 4s aguanta. Reduce el cortisol', duration: '6 min', session: 'boxbreathing' },
  5: { text: 'Diario de 5 min: escribe 3 cosas que han ido bien esta semana y 1 cosa que quieres mejorar mañana', duration: '5 min' },
}

// Pre-populated demo routine completions for Carmen (last 7 days)
const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d) }

export const DEMO_ROUTINE_COMPLETIONS = {
  [daysAgo(1)]: { sleep: true, movement: true, nutrition: true, emotional: true },
  [daysAgo(2)]: { sleep: true, movement: false, nutrition: true, emotional: true },
  [daysAgo(3)]: { sleep: true, movement: true, nutrition: true, emotional: false },
  [daysAgo(4)]: { sleep: true, movement: true, nutrition: true, emotional: true },
  [daysAgo(5)]: { sleep: false, movement: false, nutrition: true, emotional: false },
  [daysAgo(6)]: { sleep: true, movement: true, nutrition: true, emotional: false },
}

// ─── Plan recommendations ─────────────────────────────────────────────────────
export const PLAN_RECOMMENDATIONS = {
  sleep: {
    title: 'Sueño y descanso', emoji: '🌙',
    items: [
      { title: 'Rutina de sueño consistente', description: 'Establece un horario fijo para acostarte y levantarte, incluso los fines de semana. La regularidad regula tu ritmo circadiano.', rationale: 'Los cambios hormonales del climaterio afectan directamente la arquitectura del sueño. Horarios regulares ayudan a estabilizar los ciclos de sueño-vigilia.', difficulty: 'Fácil' },
      { title: 'Temperatura fresca en el dormitorio', description: 'Mantén tu habitación entre 16-19°C. Usa ropa de cama transpirable y considera un ventilador de bajo nivel.', rationale: 'Los sofocos nocturnos elevan la temperatura corporal, interrumpiendo el sueño. Un ambiente fresco contrarresta este efecto fisiológico.', difficulty: 'Fácil' },
      { title: 'Corta la cafeína a las 14:00', description: 'La cafeína tiene una vida media de 5-7 horas. Eliminarla después del mediodía puede mejorar significativamente la calidad del sueño.', rationale: 'Las mujeres en menopausia metabolizan la cafeína más lentamente. Su efecto estimulante interfiere con los sofocos nocturnos.', difficulty: 'Moderado' },
      { title: 'Digital detox 1 hora antes de dormir', description: 'Evita pantallas 60 minutos antes de acostarte. Sustitúyelas por lectura tranquila, música relajante o stretching suave.', rationale: 'La luz azul suprime la melatonina, que ya tiende a reducirse con la menopausia. Proteger este proceso facilita conciliar el sueño.', difficulty: 'Moderado' },
    ],
  },
  movement: {
    title: 'Movimiento y cuerpo', emoji: '🏃‍♀️',
    items: [
      { title: 'Caminata diaria de 30 minutos', description: 'Sal a caminar a ritmo moderado cada día. El impacto leve fortalece los huesos y mejora el estado de ánimo.', rationale: 'El ejercicio aeróbico moderado reduce la frecuencia de sofocos, mejora el sueño y contrarresta la pérdida ósea acelerada post-menopausia.', difficulty: 'Fácil' },
      { title: 'Entrenamiento de fuerza 2x semana', description: 'Ejercicios con resistencia 2 veces por semana. Protege la masa muscular y la densidad ósea.', rationale: 'La bajada de estrógenos acelera la pérdida de masa muscular (sarcopenia). El entrenamiento de fuerza es la intervención más efectiva para prevenirla.', difficulty: 'Moderado' },
      { title: 'Yoga o stretching suave', description: 'Dedica 15-20 minutos al día a estiramientos o yoga suave. Reduce la rigidez articular y calma el sistema nervioso.', rationale: 'El yoga ha demostrado reducir la frecuencia e intensidad de sofocos y mejorar la calidad del sueño en estudios con mujeres en menopausia.', difficulty: 'Fácil' },
    ],
  },
  nutrition: {
    title: 'Nutrición y suplementación', emoji: '🥗',
    items: [
      { title: 'Aumenta el calcio y vitamina D', description: 'Incluye lácteos, sardinas, brócoli y almendras. Pide analítica de vitamina D a tu médica: el 80% tiene déficit en esta etapa.', rationale: 'La pérdida ósea se acelera en los primeros años post-menopausia. El calcio (1200mg/día) y vitamina D son esenciales.', difficulty: 'Fácil' },
      { title: 'Omega-3 para la inflamación', description: 'Consume pescado azul 3x semana (salmón, sardina, caballa) o considera un suplemento de omega-3 de calidad.', rationale: 'Los omega-3 tienen propiedades antiinflamatorias que pueden reducir el dolor articular y mejorar el estado de ánimo.', difficulty: 'Fácil' },
      { title: 'Fitoestrógenos en tu dieta', description: 'Incorpora soja, linaza, tofu y semillas de sésamo. Tienen una acción estrogénica leve que puede suavizar síntomas.', rationale: 'Las poblaciones asiáticas con alta ingesta de soja reportan significativamente menos sofocos. Los fitoestrógenos actúan sobre los mismos receptores que el estradiol.', difficulty: 'Moderado' },
      { title: 'Hidratación consciente', description: 'Bebe 2-2.5L de agua al día. La hidratación adecuada mejora la sequedad mucosa y reduce la intensidad de los sofocos.', rationale: 'Los sofocos causan pérdida adicional de líquidos. La deshidratación también puede intensificar la niebla mental y la fatiga.', difficulty: 'Fácil' },
    ],
  },
  emotional: {
    title: 'Salud emocional y mental', emoji: '🧠',
    items: [
      { title: 'Mindfulness: 10 minutos diarios', description: 'Practica meditación de atención plena o breathing exercises. Apps como Insight Timer tienen guías específicas para la menopausia.', rationale: 'El mindfulness reduce la reactividad del sistema nervioso autónomo, disminuyendo la frecuencia y percepción de los sofocos.', difficulty: 'Fácil' },
      { title: 'Comunidad y conexión social', description: 'Mantén o cultiva relaciones sociales de calidad. Hablar con otras mujeres en tu misma etapa reduce el aislamiento.', rationale: 'El aislamiento social amplifica los síntomas depresivos en la perimenopausia. La conexión social tiene efectos protectores.', difficulty: 'Moderado' },
      { title: 'Diario de síntomas y emociones', description: 'Dedica 5 minutos al día a escribir cómo te sientes. Te ayuda a identificar patrones y comunicar mejor con tu equipo de salud.', rationale: 'La escritura expresiva reduce el estrés percibido y ayuda a externalizar preocupaciones, mejorando la calidad del sueño.', difficulty: 'Fácil' },
    ],
  },
  pelvic: {
    title: 'Suelo pélvico e intimidad', emoji: '💜',
    items: [
      { title: 'Ejercicios de suelo pélvico', description: 'Practica los ejercicios de Kegel 3x día: 10 contracciones de 5-10 segundos. Mejora la continencia y la satisfacción sexual.', rationale: 'La bajada de estrógenos atrofia los tejidos del suelo pélvico. El ejercicio mantiene la musculatura, reduciendo incontinencia y dolor.', difficulty: 'Fácil' },
      { title: 'Lubricante vaginal de uso regular', description: 'Usa lubricante (base agua o silicona) de forma regular. Mantiene la hidratación del tejido vaginal.', rationale: 'La sequedad vaginal por atrofia vulvovaginal es uno de los síntomas más comunes y tratables. Los lubricantes regulares reducen la microinflamación.', difficulty: 'Fácil' },
    ],
  },
}

// ─── Specialists ──────────────────────────────────────────────────────────────
export const MOCK_SPECIALISTS = [
  { name: 'Dra. Ana Martínez', specialty: 'Ginecóloga especializada en climaterio', experience: '15 años de experiencia', avatar: 'AM' },
  { name: 'Dra. Laura García', specialty: 'Psicóloga clínica — Salud de la mujer', experience: 'Especialista en menopausia', avatar: 'LG' },
  { name: 'Dra. Elena Rodríguez', specialty: 'Nutricionista clínica', experience: 'Experta en menopausia y nutrición', avatar: 'ER' },
]

// ─── Education articles ───────────────────────────────────────────────────────
export const ARTICLES = [
  {
    id: 'sleep-hormonal',
    category: 'Sueño',
    categoryColor: '#4A6CF7',
    title: 'Por qué no puedes dormir: la conexión hormonal',
    preview: 'El 68% de las mujeres en perimenopausia reporta insomnio. No es ansiedad ni estrés. Es hormonal, y tiene solución.',
    readTime: '5 min',
    difficulty: 'Básico',
    isNew: true,
    symptoms: ['insomnio'],
    stage: 'all',
    content: `El insomnio es el síntoma que más impacta la calidad de vida en la transición menopáusica, y el que peor se comprende. El 68% de las mujeres en perimenopausia o menopausia lo reporta como su principal problema. Pero hay una razón fisiológica clara, y no es que estés más estresada ni que seas una mala dormidora.

¿Qué pasa en tu cerebro cuando bajan los estrógenos?

Los estrógenos tienen receptores en el hipotálamo, la región del cerebro que regula la temperatura corporal y el sueño. Cuando sus niveles fluctúan o bajan, el termostato corporal se vuelve inestable. El resultado: sofocos nocturnos que te despiertan, dificultad para conciliar el sueño y sueño fragmentado en la segunda mitad de la noche.

Además, el estrógeno potencia la acción de la serotonina, que a su vez regula la producción de melatonina (la hormona del sueño). Menos estrógeno = menos serotonina disponible = menos melatonina = más dificultad para iniciar y mantener el sueño.

Tres intervenciones con evidencia sólida:

1. Higiene del sueño estructurada: no es un consejo genérico. Implica fijar una hora de despertar fija (incluso si has dormido mal), mantener la habitación a 16-19°C, eliminar cafeína después de las 13h y crear una rutina de desconexión 45-60 minutos antes de dormir. Los estudios muestran una mejora del 30-50% en la calidad del sueño.

2. Magnesio glicinato (200-400mg) por la noche: tiene efecto relajante sobre el sistema nervioso y puede mejorar la profundidad del sueño. Es uno de los pocos suplementos con evidencia real para el insomnio en menopausia.

3. Terapia Cognitivo-Conductual para el Insomnio (CBTi): es más efectiva a largo plazo que los somníferos. Disponible en formato digital y presencial.

Si el insomnio es severo y persiste, habla con tu ginecóloga. La Terapia Hormonal Sustitutiva mejora el sueño de forma significativa en mujeres con síntomas vasomotores nocturnos.`,
  },
  {
    id: 'brain-fog',
    category: 'Salud emocional',
    categoryColor: '#7B3FE4',
    title: 'Niebla mental: no te estás volviendo loca',
    preview: 'La dificultad de concentración, los olvidos y la sensación de lentitud mental son efectos neurológicos reales del cambio hormonal. Tienen nombre y tienen solución.',
    readTime: '5 min',
    difficulty: 'Básico',
    isNew: true,
    symptoms: ['cansancio'],
    stage: 'all',
    content: `Si en los últimos meses te has olvidado cosas que antes recordabas con facilidad, te cuesta concentrarte en reuniones o sientes que tu mente va más lenta, no estás imaginándotelo ni estás "haciéndote mayor". Estás experimentando niebla mental (brain fog), un efecto neurológico directo de la fluctuación hormonal.

¿Por qué ocurre?

El estrógeno tiene efectos neuroprotectores. Estimula la producción de serotonina y dopamina, neurotransmisores que regulan no solo el humor sino también la memoria de trabajo, la velocidad de procesamiento y la capacidad de atención. Cuando el estrógeno fluctúa o baja, estos sistemas se desregulan.

Además, el insomnio —que afecta al 68% de las mujeres en esta etapa— deteriora la función cognitiva de forma directa. No dormir bien es suficiente por sí solo para causar niebla mental significativa.

Cuatro estrategias diarias que funcionan:

1. Prioriza el sueño sobre todo lo demás: el sueño es el único momento en que el cerebro consolida la memoria y se "limpia" de residuos metabólicos (sistema glinfático). Tratar el insomnio es tratar la niebla mental.

2. Ejercicio aeróbico moderado: aumenta el BDNF (factor neurotrófico derivado del cerebro), que estimula el crecimiento de nuevas conexiones neuronales. 30 minutos de caminata activa 5 días a la semana mejoran la función cognitiva en 8-12 semanas.

3. Omega-3 (EPA+DHA): los ácidos grasos omega-3 son componentes estructurales de las membranas neuronales. Su suplementación ha mostrado mejoras en la memoria de trabajo y la velocidad de procesamiento en mujeres en menopausia.

4. Gestión de la carga cognitiva: en períodos de niebla mental intensa, reducir la multitarea, usar listas y calendarios externalizados, y proteger bloques de trabajo de alta concentración (sin interrupciones, por la mañana) reduce el impacto funcional.

Lo más importante: saber que es temporal y tiene causa hace que sea menos angustiante. La mayoría de mujeres reportan mejoría significativa de la función cognitiva al estabilizarse el entorno hormonal, con o sin tratamiento.`,
  },
  {
    id: 'strength-training',
    category: 'Movimiento',
    categoryColor: '#10B981',
    title: 'Fuerza muscular después de los 45: por qué es urgente',
    preview: 'Pierdes músculo y hueso más rápido de lo que crees. El entrenamiento de fuerza es la intervención más importante que puedes hacer ahora mismo.',
    readTime: '5 min',
    difficulty: 'Básico',
    isNew: false,
    symptoms: ['dolorArticular', 'cansancio'],
    stage: 'all',
    content: `A partir de los 30 años perdemos entre un 3 y un 8% de masa muscular por década. Con la menopausia, este proceso se acelera drásticamente porque los estrógenos tienen un papel protector tanto del músculo como del hueso. Sin ellos, la sarcopenia (pérdida de masa muscular) y la osteoporosis avanzan más rápido.

Las cifras que importan:

En los primeros 5 años post-menopausia, las mujeres pueden perder hasta un 20% de su densidad ósea. Una de cada tres mujeres mayores de 50 años sufrirá una fractura osteoporótica en su vida. La sarcopenia no solo afecta la fuerza: está directamente relacionada con la fatiga crónica, el dolor articular y el riesgo de caídas.

¿Por qué el entrenamiento de fuerza específicamente?

El ejercicio aeróbico (caminar, bici, nadar) es beneficioso, pero no genera el estímulo mecánico necesario para mantener la densidad ósea ni frenar la sarcopenia. Solo el entrenamiento de resistencia —con pesas, bandas elásticas o peso corporal— produce el estrés óseo y muscular que activa los osteoblastos (células que forman hueso nuevo) y mantiene la síntesis proteica muscular.

El protocolo mínimo efectivo:

2-3 sesiones por semana, 20-30 minutos cada una. Incluir ejercicios de tren inferior (sentadillas, lunges, puente de glúteos) y tren superior (flexiones, remo, press). No es necesario ir al gimnasio: el peso corporal y una banda de resistencia son suficientes.

Los beneficios van más allá del músculo y el hueso: el entrenamiento de fuerza mejora la sensibilidad a la insulina, reduce los sofocos, mejora el sueño y tiene un efecto antidepresivo equivalente al ejercicio aeróbico.

Si no has entrenado fuerza antes, el mejor momento para empezar fue hace diez años. El segundo mejor momento es hoy.`,
  },
  {
    id: 'hrt-explained',
    category: 'Tratamientos',
    categoryColor: '#F59E0B',
    title: 'THS: lo que nadie te ha explicado bien',
    preview: 'Solo el 6% de las mujeres en España usa THS, a pesar de ser el tratamiento de primera línea para síntomas moderados-severos. Aquí está la información que necesitas para tomar una decisión informada.',
    readTime: '6 min',
    difficulty: 'Avanzado',
    isNew: false,
    symptoms: ['sofocos', 'insomnio', 'ansiedad'],
    stage: 'all',
    content: `La Terapia Hormonal Sustitutiva (THS) —también llamada Terapia Hormonal de la Menopausia (THM)— es el tratamiento más eficaz disponible para los síntomas vasomotores, el insomnio, la niebla mental y los síntomas genitourinarios de la menopausia. Y sin embargo, solo el 6% de las mujeres en España la usa.

¿Por qué esta brecha?

En 2002, el estudio Women's Health Initiative (WHI) publicó resultados que asociaban la THS con un mayor riesgo de cáncer de mama, enfermedad coronaria y trombosis. La noticia se difundió masivamente y muchas mujeres —y médicos— abandonaron el tratamiento.

Pero ese estudio tenía limitaciones importantes: usaba medroxiprogesterona sintética (no progesterona bioidéntica), en mujeres con una edad media de 63 años, muchas con factores de riesgo previos. Las conclusiones no son trasladables a mujeres jóvenes, sanas y en los primeros años de menopausia.

¿Qué dicen las guías actuales?

Las principales sociedades científicas internacionales —incluyendo la Sociedad Internacional de Menopausia y la Sociedad Española de Ginecología— son claras: para mujeres menores de 60 años y/o con menos de 10 años desde el inicio de la menopausia, sin contraindicaciones, los beneficios de la THS superan los riesgos.

¿Para quién puede ser adecuada?
- Sofocos y sudoración nocturna de intensidad moderada-severa
- Insomnio persistente ligado a síntomas vasomotores
- Síntomas genitourinarios (sequedad, dolor, cistitis de repetición)
- Menopausia precoz (antes de los 45 años)
- Riesgo de osteoporosis

¿Quién debe evitarla?
- Antecedentes personales de cáncer de mama hormonodependiente
- Trombosis venosa profunda o embolia pulmonar reciente
- Enfermedad hepática grave activa

Existen múltiples formulaciones: parches, geles, pastillas, anillos vaginales. La THS no es un tratamiento único —es personalizable. No hay una respuesta universal.

Este artículo es información para que puedas tener una conversación informada con tu ginecóloga. No sustituye la valoración médica individual.`,
  },
  {
    id: 'perimenopause-early',
    category: 'Perimenopausia',
    categoryColor: '#4A6CF7',
    title: 'Perimenopausia: la etapa que empieza antes de lo que crees',
    preview: 'La perimenopausia puede comenzar a los 40 años, o antes. Conocer sus primeras señales te da ventaja para actuar a tiempo.',
    readTime: '4 min',
    difficulty: 'Básico',
    isNew: false,
    symptoms: [],
    stage: 'early',
    content: `La perimenopausia es la transición hormonal que precede a la menopausia. Puede comenzar entre los 40 y los 51 años —con una media de 47— y durar entre 4 y 10 años. Durante este tiempo, los ovarios producen estrógeno de forma irregular, con fluctuaciones que causan síntomas variables e impredecibles.

El problema es que muchas mujeres no saben que están en perimenopausia hasta años después de haber empezado a notar los primeros cambios. Los síntomas se atribuyen al estrés, la "edad" o la "ansiedad", y se tarda en recibir la orientación adecuada.

Las primeras señales a las que prestar atención:

El primer síntoma suele ser la irregularidad menstrual: períodos más cortos, más largos, más abundantes o más espaciados. Pero muchas mujeres experimentan cambios de humor, insomnio o dificultad de concentración antes de notar cualquier cambio en su ciclo.

Otros síntomas tempranos frecuentes: irritabilidad aumentada (especialmente en la semana premenstrual), ansiedad nueva o empeorada, y sensibilidad a la cafeína y al alcohol que antes tolerabas bien.

¿Por qué actuar ahora marca la diferencia?

La perimenopausia no es solo "la antesala de la menopausia". Es el período de mayor fluctuación hormonal —y por tanto el de mayor impacto de los síntomas en algunas mujeres. Y es también el período donde las intervenciones preventivas tienen más impacto.

Las mujeres que llegan a la menopausia con hábitos consolidados de ejercicio de fuerza, buena higiene del sueño, gestión del estrés y nutrición adecuada reportan sistemáticamente menos síntomas y mejor calidad de vida en la transición.

Si sospechas que podrías estar en perimenopausia, lo primero es buscar una ginecóloga que trabaje en esta área. Un perfil hormonal (FSH, estradiol) y una conversación informada son el punto de partida.`,
  },
  {
    id: 'menopause-work',
    category: 'Trabajo',
    categoryColor: '#7B3FE4',
    title: 'Hablar de menopausia en el trabajo: cómo y cuándo',
    preview: 'El 50% de las mujeres dice que sus síntomas afectan su rendimiento laboral. Pero pedir ayuda en el trabajo no tiene que ser una conversación difícil.',
    readTime: '4 min',
    difficulty: 'Básico',
    isNew: true,
    symptoms: ['cansancio', 'insomnio'],
    stage: 'all',
    content: `El impacto laboral de la menopausia es real y está documentado: días de menor concentración, fatiga que dificulta las tareas de alta exigencia, dificultad para tolerar reuniones largas cuando no has dormido bien. Pero pocas mujeres hablan de esto en el trabajo, y muchas menos piden adaptaciones.

¿Por qué cuesta tanto hablar del tema?

El estigma es real. Hay un miedo legítimo a ser percibida como menos capaz, o a que la palabra "menopausia" active prejuicios sobre la edad o la "caducidad" profesional. Ese miedo lleva a muchas mujeres a asumir la carga en silencio, a veces reduciendo voluntariamente su exposición o sus responsabilidades.

Pero el silencio tiene un coste mayor: los síntomas sin gestionar impactan más que una conversación bien llevada.

Cómo pedir lo que necesitas sin revelar más de lo que quieras:

No tienes que mencionar la menopausia para pedir adaptaciones razonables. Puedes hablar de "una condición de salud que afecta mi sueño" o "síntomas físicos que gestiono mejor con cierta flexibilidad". No es mentira: es la información que decides compartir.

Adaptaciones concretas que marcan diferencia y son fáciles de pedir:
- Flexibilidad en la hora de entrada (los síntomas suelen ser peores por la mañana tras un mal sueño)
- Control de temperatura en tu espacio de trabajo o un ventilador de escritorio
- Reuniones importantes en horario de mañana, cuando la concentración suele ser mejor
- Posibilidad de teletrabajo en días difíciles

Si quieres hablar abiertamente:

Cada vez más empresas tienen políticas de apoyo explícitas para la menopausia. Si la tuya no las tiene, tú puedes ser la persona que empiece esa conversación. Los datos anónimos y agregados de un programa como Herya son exactamente el tipo de evidencia que RRHH necesita para justificar estas políticas.

Tienes derechos: en España, la Ley de Igualdad y los planes de igualdad empresariales ofrecen un marco para pedir adaptaciones razonables sin necesidad de divulgar diagnósticos específicos.`,
  },
  {
    id: 'conseguir-atencion-medica',
    category: 'Tratamientos',
    categoryColor: '#F59E0B',
    title: 'Cómo conseguir la atención médica que mereces',
    preview: 'El 60% de mujeres con síntomas severos tarda más de 2 años en recibir orientación adecuada. Estas estrategias funcionan.',
    readTime: '7 min',
    difficulty: 'Práctico',
    isNew: true,
    symptoms: [],
    stage: 'all',
    content: `El 60% de las mujeres con síntomas severos de menopausia tarda más de 2 años en recibir orientación adecuada. No porque el sistema no pueda ayudar, sino porque la menopausia sigue siendo un área donde la formación específica no está garantizada y donde las mujeres frecuentemente no saben cómo pedir lo que necesitan.

Esto es lo que funciona.

1. Documenta antes de ir a la consulta

Llevar un registro de síntomas durante 2–3 semanas antes de tu cita cambia radicalmente la conversación. No es para "justificar" lo que sientes — es para que el médico pueda cuantificar, comparar y actuar.

Qué registrar:
• Fecha y frecuencia de sofocos
• Calidad del sueño: horas reales y número de despertares
• Estado de ánimo puntuado del 1 al 10
• Síntomas físicos: articulaciones, fatiga, sequedad vaginal
• Ciclo menstrual si aún lo tienes

El tracker de síntomas de Herya genera este resumen de forma automática y lo puedes llevar impreso o en el móvil.

2. Sé directa sobre el impacto en tu vida

Los médicos responden mejor a "este síntoma me impide hacer X" que a "me siento mal". Cuantifica:

• "Me despierto 3–4 veces por noche. Llevo 6 meses así y estoy al límite."
• "Los sofocos me obligan a salir de las reuniones de trabajo."
• "La niebla mental está afectando mi rendimiento laboral de forma que ya no puedo ignorar."

3. ¿A quién acudir primero?

Tu médica de cabecera es el primer paso — puede solicitar un perfil hormonal básico (FSH, estradiol, TSH) y derivarte. Sin embargo, para manejo complejo o si quieres hablar de THS, busca directamente una ginecóloga especializada en climaterio.

Palabras clave que funcionan en la derivación:
• "Especialista en climaterio" — no solo "ginecóloga"
• "Síntomas vasomotores moderados-severos" — lenguaje clínico que agiliza la derivación
• "Calidad de vida severamente afectada" — activa protocolos de atención preferente en muchos centros

4. Sistema público vs. privada

Pública: el acceso es gratuito pero puede haber listas de espera de 3–6 meses para ginecología. La derivación desde el médico de cabecera es la vía principal. En algunas comunidades existen unidades especializadas de climaterio en hospitales de referencia.

Privada: acceso en días o semanas, pero el coste de la primera consulta puede ser 80–150€. Vale la inversión si los síntomas son severos y la espera en pública es larga.

Herya ofrece videoconsulta con ginecólogas especializadas en climaterio: acceso en días, sin espera, desde donde estés.

5. Si no te sientes escuchada

Tienes derecho a pedir una segunda opinión. Tienes derecho a que tus síntomas sean evaluados en su conjunto, no uno a uno como problemas aislados. Tienes derecho a preguntar qué opciones de tratamiento existen y por qué se recomienda o descarta cada una.

Una frase que funciona: "Quiero entender todas las opciones que tengo para manejar esto, incluyendo la THS. ¿Puede explicarme por qué o por qué no sería adecuada en mi caso?"

No tienes que aceptar "es la edad" como respuesta. Eso no es un diagnóstico.`,
  },
]

export const TOPIC_CHIPS = [
  { label: 'Sueño', symptomKey: 'insomnio' },
  { label: 'Nutrición', symptomKey: null },
  { label: 'Movimiento', symptomKey: 'dolorArticular' },
  { label: 'Salud sexual', symptomKey: 'problemasSexuales' },
  { label: 'Salud emocional', symptomKey: 'ansiedad' },
  { label: 'Tratamientos', symptomKey: null },
  { label: 'Trabajo', symptomKey: null },
  { label: 'Perimenopausia', symptomKey: null },
]

// ─── Education content (legacy, kept for compatibility) ───────────────────────
export const getEducationContent = (stage) => {
  const earlyStages = ['Aún no noto cambios', 'Perimenopausia']
  return earlyStages.includes(stage) ? 'early' : 'late'
}

// ─── Severity helpers ─────────────────────────────────────────────────────────
export const getSeverityInfo = (score) => {
  if (score >= 16) return { label: 'Severa', color: '#EF4444', bgColor: '#FEF2F2', textColor: '#991B1B', description: 'Tus síntomas están teniendo un impacto significativo en tu calidad de vida.' }
  if (score >= 9)  return { label: 'Moderada', color: '#F59E0B', bgColor: '#FFFBEB', textColor: '#92400E', description: 'Tus síntomas son notables y merecen atención y manejo activo.' }
  if (score >= 5)  return { label: 'Leve', color: '#10B981', bgColor: '#ECFDF5', textColor: '#065F46', description: 'Tus síntomas son manejables, aunque pueden afectar algunos aspectos de tu vida.' }
  return { label: 'Muy leve', color: '#6B7280', bgColor: '#F9FAFB', textColor: '#374151', description: 'Actualmente no experimentas síntomas significativos.' }
}
export const getTopSymptoms = (symptoms) => {
  return Object.entries(symptoms)
    .map(([id, value]) => { const info = SYMPTOMS_LIST.find(s => s.id === id); return { id, label: info?.label || id, value } })
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
}

// ─── Symptom-specific medical recommendations ─────────────────────────────────
export const SYMPTOM_RECOMMENDATIONS = {
  insomnio: {
    title: 'Insomnio hormonal',
    emoji: '🌙',
    cause: 'La caída de progesterona (que tiene efecto sedante natural) y los microdespertares por sofocos nocturnos fragmentan el sueño profundo. El resultado: te despiertas agotada aunque hayas "dormido" 7 horas.',
    protocol: [
      '18–19°C en el dormitorio — temperatura crítica para reducir sofocos nocturnos',
      'Cena máximo 3h antes de dormir — la digestión eleva la temperatura corporal central',
      'Calcetines de lana antes de acostarte: la vasodilatación periférica reduce la temperatura central y facilita el sueño (evidencia NEJM 2021)',
      'Sin pantallas 90 min antes — la luz azul suprime la melatonina hasta un 50%',
    ],
    escalate: 'Si llevas más de 3 semanas con insomnio severo, tu ginecóloga puede valorar progesterona micronizada oral (Utrogestan 100mg), que tiene efecto sedante directo. Es primera línea en guías europeas para insomnio menopáusico.',
    supplement: 'Magnesio bisglicinato 300mg en cena (no óxido). Si persiste: melatonina 0.5mg a las 22h — la dosis baja es más efectiva que 5mg.',
  },
  dolorArticular: {
    title: 'Dolor articular perimenopáusico',
    emoji: '🦴',
    cause: 'La caída de estrógenos reduce la producción de colágeno articular y aumenta la inflamación sistémica. No es "hacerse mayor" — es hormonal y tiene tratamiento específico.',
    protocol: [
      '10 min de movilidad articular en cadena (cadera → rodilla → tobillo) antes de la ducha: círculos lentos, 10 repeticiones por articulación. Reduce la rigidez matutina un 40% en 3 semanas (estudio SWAN 2022)',
      'Omega-3 2g/día (EPA+DHA) — reduce la PGE2, la prostaglandina inflamatoria articular',
      '120g de pescado azul (salmón/sardina) al menos 3 veces/semana',
      'Evitar posiciones estáticas prolongadas — levantarse y moverse cada 45 min en el trabajo',
    ],
    escalate: 'Si el dolor es simétrico en manos y muñecas o aparece con inflamación visible, comunícalo a tu ginecóloga. La artritis reumatoide se activa con frecuencia en la transición menopáusica.',
    supplement: 'Colágeno hidrolizado tipo II 10g/día + Vitamina C 200mg (cofactor indispensable). Resultados en 8–12 semanas. Nota: el tipo II es específico de cartílago articular, distinto al tipo I.',
  },
  cansancio: {
    title: 'Niebla mental y fatiga hormonal',
    emoji: '🧠',
    cause: 'Los estrógenos actúan como neuroprotectores: su caída reduce la acetilcolina y la serotonina prefrontal — los mismos que necesitas para concentración y memoria de trabajo. No te estás "haciendo mayor" ni "perdiendo facultades".',
    protocol: [
      'Técnica Pomodoro adaptada: 25 min de trabajo profundo + 10 min de descanso activo (paseo o respiración)',
      'Tu ventana de mayor concentración suele ser 2–3h después de levantarte — prioriza trabajo cognitivo complejo en ese bloque',
      '2 huevos enteros al día: aportan el 50% de la colina diaria, precursor directo de acetilcolina',
      'Movimiento suave en momentos de fatiga aguda (5–10 min de caminata) — más efectivo que cafeína a media tarde',
    ],
    escalate: 'Si la niebla mental no mejora en 6–8 semanas con el plan, solicita analítica de TSH. El hipotiroidismo subclínico se activa con frecuencia en la transición y sus síntomas son idénticos al brain fog hormonal.',
    supplement: 'CoQ10 100mg en desayuno si hay fatiga severa. Omega-3 2g/día para función neuronal.',
  },
  sofocos: {
    title: 'Sofocos: causa y protocolo',
    emoji: '🌡️',
    cause: 'Los sofocos son causados por una disfunción del centro termorregulador hipotalámico: la caída de estrógenos estrecha la "zona de confort térmico" del hipotálamo a casi 0°C. Tu cuerpo activa el mecanismo de sudoración con cambios mínimos de temperatura.',
    protocol: [
      'Técnica de enfriamiento rápido: agua fría en las muñecas 30 segundos — reduce la temperatura central percibida en 1–2°C',
      'Evitar hoy: café, alcohol, especias picantes, cambios bruscos de temperatura',
      'Ropa por capas de tejidos naturales (algodón, lino) — poder desvestirse en segundos marca diferencia',
      '18–19°C en el dormitorio — ventilador de bajo consumo es la adaptación más valorada por usuarias',
    ],
    escalate: 'Si tienes más de 7 sofocos/día o sofocos nocturnos que interrumpen el sueño 3+ noches/semana, la THS reduce la frecuencia un 75–90%. Es primera línea en mujeres sin contraindicaciones.',
    supplement: 'Isoflavonas de soja 80mg/día puede reducir frecuencia un 30–40% en algunas mujeres. Cimicifuga racemosa tiene evidencia moderada para sofocos leves-moderados.',
  },
  ansiedad: {
    title: 'Ansiedad hormonal',
    emoji: '💙',
    cause: 'La fluctuación de estrógenos afecta directamente los receptores GABA (el principal sistema inhibidor del cerebro) y la serotonina. La ansiedad en perimenopausia no es "estrés" — es una desregulación neuroquímica con causa identificable.',
    protocol: [
      'Respiración 4-7-8: inhala 4s, aguanta 7s, exhala 8s — activa el nervio vago y reduce la respuesta de lucha-huida en ~90 segundos',
      'Reducir cafeína después de las 12h — amplifica la actividad del sistema nervioso simpático',
      'Exposición solar matutina 15–20 min — regula el eje circadiano y la síntesis de serotonina',
      'Movimiento aeróbico 30 min — igual de efectivo que ansiolíticos leves en estudios de 8 semanas',
    ],
    escalate: 'Si la ansiedad interfiere con el trabajo o las relaciones de forma sostenida, considera TCC específica para transición menopáusica. La THS también reduce la ansiedad directamente.',
    supplement: 'Magnesio bisglicinato 400mg en cena — reduce la hiperexcitabilidad neuronal. L-Teanina 200mg para ansiedad situacional aguda.',
  },
  irritabilidad: {
    title: 'Irritabilidad perimenopáusica',
    emoji: '⚡',
    cause: 'La irritabilidad en perimenopausia tiene causa fisiológica directa: la fluctuación de estrógenos desregula la serotonina y la dopamina prefrontales, los mismos neurotransmisores que regulan la tolerancia emocional. No es de carácter.',
    protocol: [
      'Identifica tu patrón: ¿es peor en la semana premenstrual? Si sí, el problema es la fluctuación, no el nivel basal. Registra en el tracker.',
      'Priorizar el sueño: cada hora de sueño perdida reduce significativamente el umbral de irritabilidad',
      'Pausa táctica de 5 min antes de responder en situaciones de alta carga emocional',
      'Reducir o eliminar alcohol — afecta la regulación emocional al día siguiente aunque sea consumo moderado',
    ],
    escalate: 'Si la irritabilidad está afectando tus relaciones de forma mantenida (pareja, familia, trabajo), la THS tiene efecto directo sobre el estado de ánimo en perimenopausia.',
    supplement: 'Magnesio bisglicinato 300–400mg en cena. Omega-3 2g/día tiene evidencia de mejora del estado de ánimo en varios estudios.',
  },
  problemasSexuales: {
    title: 'Salud sexual en menopausia',
    emoji: '💜',
    cause: 'La sequedad y el dolor son consecuencia de la atrofia vulvovaginal (AVV): sin estrógenos, el tejido vaginal se adelgaza, pierde elasticidad y su pH cambia. Afecta al 50% de las mujeres en menopausia y no mejora sola sin tratamiento.',
    protocol: [
      'Lubricante vaginal base agua o silicona: de uso regular (no solo en las relaciones) para mantener la hidratación del tejido',
      'Hidratante vaginal sin hormonas (Replens, Gynatrof): aplicar 3 veces/semana de forma continua',
      'Ejercicios de suelo pélvico (Kegel): 3 series de 10 contracciones de 5–10 segundos/día — mejoran la vascularización y la sensibilidad',
      'Actividad sexual regular (con o sin pareja): mantiene la irrigación y elasticidad del tejido vaginal',
    ],
    escalate: 'El estrógeno local vaginal (óvulos o gel, no THS sistémica) es el tratamiento más eficaz y seguro para la AVV. Se puede usar incluso con contraindicaciones para THS sistémica — la absorción sistémica es mínima.',
    supplement: 'Vitamina E óvulos vaginales puede aliviar sequedad leve. Omega-3 para hidratación de mucosas en general.',
  },
  palpitaciones: {
    title: 'Palpitaciones hormonales',
    emoji: '❤️',
    cause: 'Las palpitaciones en perimenopausia frecuentemente tienen causa hormonal directa: los estrógenos regulan el sistema nervioso autónomo cardiaco. Su caída puede provocar taquicardias leves o extrasístoles sin patología cardiaca subyacente.',
    protocol: [
      'Registra la frecuencia y el contexto: ¿ocurren con sofocos? ¿con cafeína? ¿con estrés? El patrón ayuda a distinguir causa hormonal de otra.',
      'Reducir o eliminar cafeína — es el desencadenante más frecuente y modificable',
      'Técnica de Valsalva suave: exhala con la boca cerrada durante 5–10 segundos — puede interrumpir una taquicardia leve',
      'Hidratación adecuada: la deshidratación aumenta la frecuencia cardiaca de forma compensatoria',
    ],
    escalate: 'Si las palpitaciones duran más de 30 segundos, van acompañadas de mareo, dolor en el pecho o pérdida de conciencia: consulta urgente. Si son frecuentes sin estos síntomas, pide un holter 24h para descartar arritmia.',
    supplement: 'Magnesio bisglicinato 300mg — tiene efecto antiarrítmico leve documentado en varios estudios.',
  },
  animoBajo: {
    title: 'Ánimo bajo perimenopáusico',
    emoji: '🌱',
    cause: 'La depresión en la transición menopáusica tiene una causa neurobiológica real: los estrógenos regulan la síntesis de serotonina y dopamina. Las mujeres con historia de depresión premenstrual o postparto tienen mayor vulnerabilidad.',
    protocol: [
      'Movimiento aeróbico 30 min/día: tiene efecto antidepresivo equivalente a ISRS leves en estudios de 12 semanas',
      'Exposición solar matutina 15–20 min para síntesis de vitamina D y regulación del eje circadiano',
      'Conexión social de calidad: el aislamiento amplifica los síntomas depresivos en perimenopausia',
      'Diario de gratitud 5 min/noche: 3 cosas concretas que han ido bien hoy — cambia el sesgo atencional negativo',
    ],
    escalate: 'Si el ánimo bajo persiste más de 2 semanas e interfiere con tu vida diaria, la THS tiene efecto antidepresivo directo en mujeres en perimenopausia. No esperes — consulta a tu ginecóloga.',
    supplement: 'Omega-3 2g/día (EPA>DHA): el EPA tiene evidencia de efecto antidepresivo en menopausia. Vitamina D3 si hay déficit.',
  },
}

// ─── Doctor profile ───────────────────────────────────────────────────────────
export const DOCTOR_PROFILE = {
  name: 'Dra. Ana Martínez',
  specialty: 'Ginecóloga · Climaterio y Menopausia',
  experience: '15 años de experiencia',
  avatar: 'AM',
  nextAppointment: { date: '8 may 2026', time: '11:30h', type: 'Videoconsulta' },
  available: false,
  nextSlot: 'Mañana 10:00h',
  unreadMessages: 2,
  rating: 4.9,
  consultations: 12,
}

// ─── Energy timeline (for Mi Día planner) ────────────────────────────────────
// hourly energy level: 1=low, 2=medium, 3=high — based on Carmen's historical logs
export const ENERGY_TIMELINE = [
  { hour: 7,  label: '7h',  level: 2, note: null },
  { hour: 8,  label: '8h',  level: 3, note: 'Máxima concentración habitual' },
  { hour: 9,  label: '9h',  level: 3, note: null },
  { hour: 10, label: '10h', level: 3, note: null },
  { hour: 11, label: '11h', level: 2, note: null },
  { hour: 12, label: '12h', level: 2, note: null },
  { hour: 13, label: '13h', level: 1, note: 'Suele haber bajada post-almuerzo' },
  { hour: 14, label: '14h', level: 1, note: null },
  { hour: 15, label: '15h', level: 1, note: 'Franja de menor energía registrada' },
  { hour: 16, label: '16h', level: 2, note: null },
  { hour: 17, label: '17h', level: 2, note: null },
  { hour: 18, label: '18h', level: 1, note: null },
]

// ─── Mock meetings (for Mi Día planner) ──────────────────────────────────────
export const MOCK_MEETINGS = [
  { id: 1, title: 'Reunión de equipo semanal', hour: 9, duration: 60, type: 'meeting', energyHour: 9 },
  { id: 2, title: 'Revisión de presupuesto Q2', hour: 15, duration: 90, type: 'focus', energyHour: 15 },
  { id: 3, title: '1:1 con Sofía (manager)', hour: 16, duration: 30, type: 'meeting', energyHour: 16 },
]

// ─── Bienestar Activo ─────────────────────────────────────────────────────────
export const ACTIVITIES_CATALOG = [
  {
    id: 'yoga-suave', name: 'Yoga restaurativo · Climaterio', instructor: 'Sara Vidal', duration: 45, type: 'Yoga', level: 'Suave', spotsLeft: 3, nextSession: 'Grabado — acceso ilimitado', symptoms: ['dolorArticular', 'ansiedad', 'insomnio', 'sofocos'], physicalStates: ['bajo', 'medio', 'bien'], online: true, color: '#7B3FE4', emoji: '🧘',
    pricing: 'included', pricingLabel: 'Incluido en tu plan',
    whyItHelps: 'Las posturas de yoga mantenidas con soporte incrementan el flujo de líquido sinovial, aliviando la rigidez articular de la mañana. Un ensayo en Menopause Journal (2019) mostró reducción del 31% en la intensidad de sofocos tras 10 semanas de práctica regular.',
  },
  {
    id: 'respiracion-grupal', name: 'Meditación y respiración consciente', instructor: 'Álvaro Muñoz', duration: 30, type: 'Respiración', level: 'Suave', spotsLeft: 10, nextSession: 'Grabado — acceso ilimitado', symptoms: ['sofocos', 'ansiedad', 'insomnio', 'palpitaciones'], physicalStates: ['bajo', 'medio', 'bien'], online: true, color: '#7B3FE4', emoji: '🌬️',
    pricing: 'included', pricingLabel: 'Incluido en tu plan',
    whyItHelps: 'El programa MBSR (Mindfulness-Based Stress Reduction) reduce la severidad de los sofocos un 40% y mejora la calidad del sueño en un 58% de las participantes (Carmody et al., Menopause 2011). Efecto directo sobre el sistema nervioso autónomo, que regula la termorregulación hipotalámica.',
  },
  {
    id: 'fuerza-basica', name: 'Fuerza básica · Menopausia', instructor: 'Elena Torres', duration: 40, type: 'Fuerza', level: 'Moderado', spotsLeft: 5, nextSession: 'Clase en directo online · Lunes 10:00h', symptoms: ['dolorArticular', 'cansancio'], physicalStates: ['medio', 'bien'], online: true, color: '#F59E0B', emoji: '💪',
    pricing: 'included', pricingLabel: 'Incluido en tu plan',
    whyItHelps: 'Es la intervención con mayor evidencia para la menopausia: preserva masa ósea (previene osteoporosis), mejora la sensibilidad a la insulina, reduce sofocos un 29% según estudio SWAN, y mantiene la masa muscular que se pierde 1–2% por año sin entrenamiento tras los 50.',
  },
  {
    id: 'pilates-suelo', name: 'Pilates de suelo', instructor: 'Marta Sanz · Be Pilates Malasaña', duration: 45, type: 'Pilates', level: 'Moderado', spotsLeft: 2, nextSession: 'Viernes 9:30h', symptoms: ['dolorArticular', 'problemasUrinarios'], physicalStates: ['medio', 'bien'], online: false, color: '#EF4444', emoji: '🤸',
    pricing: 'discount', pricingLabel: 'Precio especial · Convenio empresa', normalPrice: '18€/clase', heryaPrice: '12€/clase',
    whyItHelps: 'El pilates de suelo fortalece la musculatura del suelo pélvico, debilitada por la caída de estrógenos. Estudios publicados en Maturitas (2021) muestran que 8 semanas de pilates reducen el dolor lumbar menopáusico un 38% y mejoran el equilibrio, clave para prevenir caídas en postmenopausia.',
  },
  {
    id: 'natacion', name: 'Aquagym terapéutico', instructor: 'Club Natación Chamartín', duration: 45, type: 'Aeróbico acuático', level: 'Suave', spotsLeft: 12, nextSession: 'Martes y Jueves 11:00h', symptoms: ['dolorArticular', 'sofocos', 'cansancio'], physicalStates: ['bajo', 'medio', 'bien'], online: false, color: '#0EA5E9', emoji: '🏊',
    pricing: 'discount', pricingLabel: 'Precio especial · Convenio empresa', normalPrice: '15€/sesión', heryaPrice: '10€/sesión',
    whyItHelps: 'El medio acuático reduce la carga articular hasta un 90%, permitiendo movimiento sin impacto. Particularmente eficaz para el dolor de rodillas y caderas relacionado con la pérdida de estrógenos. Además, el ejercicio aeróbico en agua mejora el perfil lipídico, cuyo riesgo aumenta tras la menopausia.',
  },
  {
    id: 'yoga-presencial-pack', name: 'Pack yoga presencial · 8 clases', instructor: 'Zen Flow Madrid', duration: 60, type: 'Yoga', level: 'Suave-Moderado', spotsLeft: 6, nextSession: 'Lunes, Miércoles y Viernes · Varios horarios', symptoms: ['dolorArticular', 'ansiedad', 'insomnio'], physicalStates: ['medio', 'bien'], online: false, color: '#7B3FE4', emoji: '🧘‍♀️',
    pricing: 'discount', pricingLabel: 'Precio especial · Convenio empresa', normalPrice: '95€/mes (8 clases)', heryaPrice: '65€/mes',
    whyItHelps: 'Las posturas de yoga mantenidas con soporte incrementan el flujo de líquido sinovial, aliviando la rigidez articular de la mañana. Un ensayo en Menopause Journal (2019) mostró reducción del 31% en la intensidad de sofocos tras 10 semanas de práctica regular.',
  },
  {
    id: 'caminata-grupal', name: 'Caminata grupal · Retiro', instructor: 'Espacio Mindful Retiro', duration: 60, type: 'Aeróbico', level: 'Moderado', spotsLeft: 8, nextSession: 'Miércoles 8:30h', symptoms: ['cansancio', 'animoBajo', 'dolorArticular'], physicalStates: ['medio', 'bien'], online: false, color: '#10B981', emoji: '🚶',
    pricing: 'market', marketPrice: 'Gratuita · Grupo abierto',
    whyItHelps: 'El ejercicio aeróbico grupal reduce el ánimo bajo un 38% en 8 semanas (SWAN, 2023). La conexión social añade efecto protector sobre la salud mental en la transición menopáusica.',
  },
  {
    id: 'tai-chi', name: 'Tai Chi', instructor: 'Studio Reforma', duration: 50, type: 'Mente-cuerpo', level: 'Suave', spotsLeft: 4, nextSession: 'Jueves 11:00h', symptoms: ['palpitaciones', 'ansiedad', 'insomnio'], physicalStates: ['bajo', 'medio'], online: false, color: '#4A6CF7', emoji: '☯️',
    pricing: 'market', marketPrice: 'Desde 12€/clase',
    whyItHelps: 'Reduce las palpitaciones y la ansiedad hormonal un 42% (Cochrane, 2021). El movimiento lento y la respiración consciente activhan el sistema nervioso parasimpático con efecto documentado sobre la termorregulación hipotalámica.',
  },
  {
    id: 'danza-terapia', name: 'Danza terapéutica', instructor: 'Nuria Castellanos · Estudio asociado', duration: 60, type: 'Movimiento expresivo', level: 'Moderado', spotsLeft: 6, nextSession: 'Sábado 11:00h', symptoms: ['animoBajo', 'irritabilidad', 'cansancio'], physicalStates: ['medio', 'bien'], online: false, color: '#F59E0B', emoji: '💃',
    pricing: 'market', marketPrice: 'Desde 15€/clase',
    whyItHelps: 'Reduce el ánimo bajo y la irritabilidad a través del movimiento grupal y la expresión corporal. El componente social y la música activan el sistema dopaminérgico, reduciendo la flat mood asociada a la caída de estrógenos.',
  },
  {
    id: 'fisioterapia-suelo', name: 'Fisioterapia · Suelo pélvico', instructor: 'Centro concertado Herya', duration: 60, type: 'Fisioterapia', level: 'Especializado', spotsLeft: 3, nextSession: 'Consultar disponibilidad', symptoms: ['problemasUrinarios', 'problemasSexuales', 'dolorArticular'], physicalStates: ['bajo', 'medio', 'bien'], online: false, color: '#7B3FE4', emoji: '🏋️',
    pricing: 'market', marketPrice: '60€/sesión',
    whyItHelps: 'El 40% de las mujeres en menopausia tienen algún grado de incontinencia urinaria de esfuerzo por el debilitamiento del suelo pélvico. 12 sesiones de fisioterapia especializada resuelven o mejoran significativamente el problema en el 70% de los casos — sin medicación ni cirugía.',
  },
  {
    id: 'entrenamiento-personal', name: 'Entrenamiento personal especializado', instructor: 'Centro concertado Herya', duration: 60, type: 'Fuerza personalizada', level: 'Todos los niveles', spotsLeft: 5, nextSession: 'Consultar disponibilidad', symptoms: ['dolorArticular', 'cansancio'], physicalStates: ['medio', 'bien'], online: false, color: '#10B981', emoji: '🏋️‍♀️',
    pricing: 'market', marketPrice: 'Desde 45€/sesión',
    whyItHelps: 'Es la intervención con mayor evidencia para la menopausia: preserva masa ósea, mejora la sensibilidad a la insulina, reduce sofocos un 29% según estudio SWAN. El entrenamiento personalizado garantiza progresión segura y adaptada a tus síntomas articulares.',
  },
]

export const MY_ACTIVITY_RESERVATIONS = [
  { activityId: 'yoga-suave', date: '2026-04-29', time: '9:00h', confirmed: true },
  { activityId: 'natacion', date: '2026-04-29', time: '11:00h', confirmed: true },
]

// ─── Company workshops ────────────────────────────────────────────────────────
export const WORKSHOP_FORMATS = [
  {
    id: 'comprende-ciclo', name: 'Comprende tu Ciclo Vital', emoji: '🧠', duration: '2h', format: 'Taller presencial u online',
    price: 450, maxAttendees: 20,
    includes: ['Guía imprimible por participante', 'Recursos digitales 30 días', 'Soporte post-taller'],
    impact: '87% de participantes aumentan su comprensión del climaterio',
    description: 'Taller introductorio sobre las etapas del ciclo vital femenino. Desmonta mitos, explica la fisiología y da herramientas de autogestión.',
    color: '#4A6CF7', category: 'Educación',
    priceNote: 'Hasta 20 personas · Presencial u online',
  },
  {
    id: 'productividad-bienestar', name: 'Productividad y bienestar en la menopausia', emoji: '⚡', duration: '60 min', format: 'Sesión online en directo',
    price: 250, maxAttendees: 50,
    includes: ['Grabación disponible 90 días', 'Guía de adaptaciones laborales', 'Q&A con ginecóloga'],
    impact: '72% reportan reducción del impacto laboral de los síntomas en 4 semanas',
    description: 'Sesión práctica sobre gestión de síntomas del climaterio en el entorno laboral: adaptaciones, energía y comunicación con RRHH.',
    color: '#10B981', category: 'Laboral',
    priceNote: 'Hasta 50 personas · Online en directo',
  },
  {
    id: 'taller-presencial-3h', name: 'Taller presencial con componente práctico', emoji: '🤝', duration: '3h', format: 'Taller presencial',
    price: 650, maxAttendees: 15,
    includes: ['Material práctico por participante', 'Ejercicios guiados', 'Seguimiento post-taller'],
    impact: '91% reportan aplicar las técnicas aprendidas en las 2 semanas siguientes',
    description: 'Taller presencial intensivo con ejercicios prácticos de gestión de síntomas, comunicación y herramientas de autogestión.',
    color: '#7B3FE4', category: 'Bienestar',
    priceNote: 'Hasta 15 personas · Solo presencial',
  },
  {
    id: 'mindfulness-menopausia', name: 'Mindfulness y Menopausia (MBSR)', emoji: '🧘', duration: 'Programa trimestral', format: 'Programa online grupal',
    price: 18, priceUnit: '€/empleada/mes', maxAttendees: 20,
    includes: ['Sesiones grupales en vivo', 'Prácticas de audio', 'Acceso a la app Herya'],
    impact: 'Reduce la severidad de sofocos un 40% y mejora el sueño en el 68% de participantes',
    description: 'Programa trimestral basado en MBSR adaptado a la transición menopáusica. Mínimo 20 empleadas.',
    color: '#7B3FE4', category: 'Bienestar',
    priceNote: 'Mínimo 20 empleadas',
  },
  {
    id: 'retiro-dia', name: 'Retiro de un día', emoji: '🌿', duration: '1 día', format: 'Presencial · Facilitación Herya',
    price: 1200, maxAttendees: 20,
    includes: ['Facilitación completa de Herya', 'Material para participantes', 'Seguimiento post-retiro'],
    impact: '96% de participantes describen el retiro como "transformador" o "muy valioso"',
    description: 'Retiro intensivo de un día (10-20 personas). El espacio, catering y transporte corren a cargo de la empresa.',
    color: '#EF4444', category: 'Liderazgo',
    priceNote: 'No incluye espacio ni catering',
  },
]

const PRICE_NOTE_COMMON = 'Los precios incluyen la preparación del contenido, la facilitación de Herya y el material para participantes. El espacio, los medios técnicos y el catering (si aplica) corren a cargo de la empresa.'

export const MANAGEMENT_WORKSHOPS = [
  {
    id: 'guia-managers', name: 'Menopausia en la empresa: guía para mánagers', emoji: '🧑‍💼', duration: '2h', format: 'Taller presencial u online',
    price: 380, maxAttendees: 25,
    includes: ['Manual práctico para mánagers', 'Protocolo de conversaciones difíciles', 'Checklist de adaptaciones razonables'],
    impact: '89% de mánagers se sienten más preparados para hablar del tema con su equipo',
    description: 'Formación para mánagers de línea, directores de equipo y RRHH. Aprenden a identificar señales, tener conversaciones de apoyo y gestionar adaptaciones sin invadir la privacidad.',
    color: '#1E3A8A', category: 'Para equipos',
    priceNote: 'Hasta 25 mánagers · Presencial u online',
  },
  {
    id: 'ventaja-competitiva', name: 'Bienestar femenino como ventaja competitiva', emoji: '📊', duration: '1.5h', format: 'Webinar online o keynote en evento',
    price: 290, maxAttendees: 47,
    includes: ['Informe de retorno de inversión', 'Datos sectoriales', 'Guía de política de empresa'],
    impact: 'Empresas con políticas activas de menopausia reducen la rotación de talento senior un 23%',
    description: 'Para C-suite, comités de dirección y responsables de People & Culture. Datos sobre el ROI real de los programas de salud femenina.',
    color: '#1E3A8A', category: 'Para equipos',
    priceNote: 'Sin límite de asistentes · Online',
  },
  {
    id: 'sensibilizacion-empresa', name: 'Sensibilización para toda la empresa', emoji: '🏢', duration: '1h', format: 'Webinar online · Grabable',
    price: 190, maxAttendees: 47,
    includes: ['Grabación con acceso ilimitado 30 días', 'Material divulgativo por departamento', 'Q&A con especialista Herya'],
    impact: '76% de empleadas y empleados reportan mayor empatía y comprensión del tema tras la sesión',
    description: 'Para toda la plantilla — hombres y mujeres. Normaliza la conversación, desmonta mitos y explica cómo ser un buen compañero/a de equipo.',
    color: '#1E3A8A', category: 'Para equipos',
    priceNote: 'Acceso ilimitado 30 días incluido',
  },
  {
    id: 'talento-senior', name: 'Talento sénior femenino: retención y edadismo', emoji: '⭐', duration: '2h', format: 'Taller presencial u online',
    price: 380, maxAttendees: 20,
    includes: [
      'Diagnóstico de edadismo organizacional',
      'Estrategias de retención de talento sénior femenino',
      'Marco legal: discriminación por edad en España',
      'Plan de acción RRHH a 90 días',
    ],
    impact: '81% de responsables de RRHH reportan mejora en sus procesos de retención de talento sénior tras la formación',
    description: 'Formación para RRHH y dirección sobre cómo retener el talento de mujeres de 45+. Aborda el edadismo laboral, los sesgos inconscientes en procesos de promoción y despido, y la gestión inclusiva del talento sénior femenino.',
    color: '#7B3FE4', category: 'Para equipos',
    priceNote: 'Hasta 20 personas · Presencial u online',
  },
]

export { PRICE_NOTE_COMMON }

export const COMPANY_EVENT_HISTORY = [
  { id: 1, workshopId: 'comprende-ciclo', date: '15 feb 2026', attendees: 22, maxAttendees: 25, rating: 4.8, feedback: 'Muy práctico y sin tabúes. Ojalá hubiera existido antes.' },
  { id: 2, workshopId: 'productividad-bienestar', date: '10 mar 2026', attendees: 42, maxAttendees: 47, rating: 4.6, feedback: 'Las adaptaciones laborales concretas fueron muy útiles.' },
]

// ─── Salud Íntima ─────────────────────────────────────────────────────────────
export const INTIMATE_ARTICLES = [
  { id: 'avv', title: 'Atrofia vulvovaginal: qué es y qué puedes hacer', readTime: '5 min', category: 'Sequedad vaginal', preview: 'Afecta al 50–70% de las mujeres en menopausia y empeora si no se trata. Tiene solución.', content: `La atrofia vulvovaginal (AVV), ahora llamada síndrome genitourinario de la menopausia (SGM), afecta al 50–70% de mujeres en menopausia. A diferencia de los sofocos, empeora progresivamente sin tratamiento.\n\nSin estrógenos, la mucosa vaginal se adelgaza, pierde elasticidad, la lubricación disminuye y el pH sube de 3.8 a >5, alterando la flora protectora. Resultado: sequedad, ardor, dolor con la penetración y mayor riesgo de infecciones urinarias.\n\nOpciones de tratamiento:\n1. Hidratante vaginal (sin hormonas): Replens, Gynatrof. Aplicar 3 veces/semana de forma continua — no es un lubricante, actúa sobre el tejido a largo plazo.\n2. Lubricante vaginal: para las relaciones. Base agua o silicona — nunca aceite con preservativos.\n3. Estrógeno local vaginal: óvulos o gel de estriol. El más eficaz. Absorción sistémica mínima. Habla con tu ginecóloga.\n4. Ospemifeno: tratamiento oral con prescripción médica para la dispareunia.\n\nNo mejora sola. Cuanto antes se trate, mejor responde el tejido.` },
  { id: 'deseo', title: 'Deseo sexual en menopausia: qué es normal y qué no', readTime: '6 min', category: 'Deseo sexual', preview: 'La libido baja afecta al 40–50% de mujeres en menopausia. No es "normal a esta edad". Es hormonal.', content: `La libido baja afecta al 40–50% de mujeres en menopausia y es uno de los síntomas que menos se menciona al médico.\n\nTres hormonas regulan el deseo: estrógeno (sensibilidad genital), progesterona (en exceso lo reduce) y testosterona (clave para el deseo espontáneo). Las tres bajan o se desequilibran en la menopausia.\n\nDeseo espontáneo vs reactivo: en menopausia muchas mujeres pasan del espontáneo al reactivo (surge con la estimulación). No es falta de deseo — es un cambio de patrón.\n\nOpciones:\n1. Tratar la AVV primero: si el sexo duele, el cerebro lo asocia con dolor.\n2. THS: mejora la vascularización y sensibilidad genital.\n3. Testosterona tópica baja dosis: evidencia creciente, disponible como prescripción magistral.\n4. Sexología clínica: muy eficaz cuando hay componente relacional.` },
  { id: 'kegel', title: 'Kegel bien hecho: técnica, frecuencia y para qué sirve', readTime: '4 min', category: 'Suelo pélvico', preview: 'La mayoría de mujeres los hace incorrectamente o con dosis insuficiente. Aquí, la técnica exacta.', content: `Los ejercicios de Kegel son la intervención más recomendada para el suelo pélvico en la menopausia, pero la mayoría los hace incorrectamente.\n\nPara qué sirven: reducir la incontinencia de esfuerzo, mejorar la vascularización vaginal, aumentar la sensibilidad y prevenir el prolapso.\n\nCómo localizarlo: imagina que intentas parar el flujo de orina a mitad — ese es el músculo pubococcígeo. No lo hagas realmente parando la orina, solo como referencia.\n\nProtocolo:\n- Contrae 5 segundos\n- Relaja 10 segundos (la relajación es tan importante como la contracción)\n- Repite 10 veces · 3 series al día\n\nErrores frecuentes: aguantar la respiración, contraer glúteos o abdomen, no relajar entre contracciones.\n\nResultados visibles: 6–12 semanas de práctica consistente.` },
  { id: 'cistitis', title: 'Cistitis de repetición en menopausia: por qué y cómo prevenirla', readTime: '4 min', category: 'Salud urinaria', preview: 'Las infecciones urinarias recurrentes son mucho más frecuentes post-menopausia. La causa es directamente hormonal.', content: `Las infecciones urinarias recurrentes (más de 2 al año) son mucho más frecuentes en postmenopausia. La razón es hormonal: el estrógeno mantiene el epitelio urinario resistente, un pH ácido y una flora de Lactobacillus protectora. Sin estrógenos, todas estas defensas se debilitan simultáneamente.\n\nEstrategias de prevención con evidencia:\n1. Estriol vaginal local: reduce las infecciones recurrentes más que los antibióticos profilácticos en muchos estudios.\n2. Probióticos de Lactobacillus: restablecen la flora protectora.\n3. Extracto de arándano rojo (proantocianidinas 36mg/día): previene la adherencia de E. coli. El zumo no tiene dosis terapéutica.\n4. Orinar después del sexo: reduce la incidencia significativamente.\n5. Hidratación: mínimo 2L/día.\n\nSi tienes más de 2 cistitis al año, hay protocolos médicos muy eficaces.` },
]

// ─── Mi Ciclo ─────────────────────────────────────────────────────────────────
export const DEMO_CYCLE_DATA = [
  { id: 1, startDate: '2025-09-15', endDate: '2025-09-20', durationDays: 5, intensity: [2, 3, 3, 2, 1], note: 'Normal', daysToNext: 42 },
  { id: 2, startDate: '2025-10-27', endDate: '2025-11-01', durationDays: 6, intensity: [1, 2, 3, 2, 2, 1], note: 'Manchado el día 6', daysToNext: 68 },
  { id: 3, startDate: '2026-01-08', endDate: '2026-01-11', durationDays: 4, intensity: [2, 3, 2, 1], note: 'Flujo escaso', daysToNext: 72 },
  { id: 4, startDate: '2026-03-21', endDate: '2026-03-23', durationDays: 3, intensity: [1, 2, 1], note: 'Muy escaso', daysToNext: null },
]

// ─── Nutrición de Precisión ───────────────────────────────────────────────────
export const MICRONUTRIENTS_BY_STAGE = {
  peri: [
    { id: 'hierro', name: 'Hierro', target: 18, unit: 'mg/día', foods: ['Lentejas (3.3mg/100g)', 'Espinacas (2.7mg/100g)', 'Sardinas (2.9mg/100g)', 'Carne roja magra (3.5mg/100g)'], importance: 'Los ciclos irregulares pueden generar déficit. Crítico para energía y función cognitiva.', color: '#EF4444', demo: 11 },
    { id: 'vitd3', name: 'Vitamina D3', target: 2000, unit: 'UI/día', foods: ['Salmón (600–1000 UI/100g)', 'Sardinas en lata (300 UI/100g)', 'Yema de huevo (40 UI)', 'Luz solar 15 min/día'], importance: 'Más del 80% de mujeres en España tienen déficit. Crítica para hueso, inmunidad y función neuromuscular.', color: '#F59E0B', demo: 800 },
    { id: 'magnesio', name: 'Magnesio', target: 310, unit: 'mg/día', foods: ['Semillas de calabaza (156mg/30g)', 'Almendras (80mg/30g)', 'Chocolate negro 85% (50mg/30g)', 'Aguacate (58mg/unidad)'], importance: 'Regula el sueño, reduce la irritabilidad y la ansiedad.', color: '#7B3FE4', demo: 220 },
    { id: 'omega3', name: 'Omega-3 (EPA+DHA)', target: 2000, unit: 'mg/día', foods: ['Salmón (2g/100g)', 'Sardinas (1.5g/100g)', 'Caballa (2.5g/100g)', 'Nueces (2.5g/30g — ALA)'], importance: 'Antiinflamatorio sistémico. Reduce dolor articular, mejora función cognitiva y ánimo.', color: '#0EA5E9', demo: 1200 },
    { id: 'calcio', name: 'Calcio', target: 1000, unit: 'mg/día', foods: ['Yogur griego (150mg/125g)', 'Sardinas con espina (300mg/100g)', 'Brócoli al vapor (60mg/80g)', 'Almendras (75mg/30g)'], importance: 'Base para la densidad ósea. La prevención empieza en perimenopausia.', color: '#10B981', demo: 680 },
  ],
  meno: [
    { id: 'calcio', name: 'Calcio', target: 1200, unit: 'mg/día', foods: ['Yogur griego (150mg/125g)', 'Sardinas con espina (300mg/100g)', 'Leche entera (300mg/250ml)', 'Tofu firme con calcio (250mg/100g)'], importance: 'La menopausia acelera la pérdida ósea. 1200mg/día es el objetivo — la mayoría no llega a 700mg solo con dieta.', color: '#10B981', demo: 780 },
    { id: 'vitd3', name: 'Vitamina D3', target: 2000, unit: 'UI/día', foods: ['Salmón (600–1000 UI/100g)', 'Atún en lata (150 UI/100g)', 'Huevo entero (40 UI)', 'Champiñones UV (100 UI/100g)'], importance: 'Indispensable para la absorción del calcio. Sin D3 adecuada, el calcio no llega al hueso.', color: '#F59E0B', demo: 900 },
    { id: 'vitk2', name: 'Vitamina K2 (MK-7)', target: 100, unit: 'mcg/día', foods: ['Natto (1000mcg/100g — fuente más rica)', 'Tempeh (24mcg/100g)', 'Yema de huevo (5mcg)', 'Queso gouda curado (20mcg/30g)'], importance: 'Dirige el calcio al hueso y evita que se deposite en las arterias. Cofactor indispensable con la D3.', color: '#4A6CF7', demo: 42 },
    { id: 'magnesio', name: 'Magnesio', target: 320, unit: 'mg/día', foods: ['Semillas de calabaza (156mg/30g)', 'Almendras (80mg/30g)', 'Espinacas cocidas (78mg/80g)', 'Chocolate negro 85% (50mg/30g)'], importance: 'Regula el sueño profundo, cofactor de la activación de vitamina D y reduce la ansiedad.', color: '#7B3FE4', demo: 210 },
    { id: 'proteina', name: 'Proteína', target: 1.2, unit: 'g/kg/día', foods: ['Pechuga de pollo (31g/100g)', 'Sardinas (25g/100g)', 'Huevo entero (13g/2 huevos)', 'Yogur griego (17g/200g)'], importance: 'La sarcopenia se acelera con la menopausia. La proteína adecuada es la intervención dietética más importante.', color: '#EF4444', demo: 0.8 },
  ],
  post: [
    { id: 'proteina', name: 'Proteína', target: 1.5, unit: 'g/kg/día', foods: ['Pechuga de pollo (31g/100g)', 'Huevo entero (6g/huevo)', 'Legumbres (9g/100g cocidas)', 'Pescado blanco (20g/100g)'], importance: 'En postmenopausia, la sarcopenia es la principal amenaza funcional. Primera herramienta preventiva.', color: '#EF4444', demo: 0.9 },
    { id: 'calcio', name: 'Calcio', target: 1200, unit: 'mg/día', foods: ['Leche (300mg/250ml)', 'Queso semicurado (800mg/100g)', 'Sardinas con espina (300mg/100g)', 'Almendras (75mg/30g)'], importance: 'Riesgo de fractura osteoporótica: 1 de cada 3 mujeres >50 años. El calcio lo frena significativamente.', color: '#10B981', demo: 750 },
    { id: 'vitd3', name: 'Vitamina D3', target: 2000, unit: 'UI/día', foods: ['Salmón (600–1000 UI/100g)', 'Sardinas (300 UI/100g)', 'Huevo entero (40 UI)', 'Luz solar en horas adecuadas'], importance: 'Regula el sistema inmune, función muscular y reduce el riesgo de caídas. Pide analítica anual.', color: '#F59E0B', demo: 800 },
    { id: 'colageno', name: 'Colágeno hidrolizado', target: 10, unit: 'g/día', foods: ['Caldo de huesos (2–4g/taza)', 'Gelatina sin azúcar (6g/sobre)', 'Suplemento hidrolizado (dosis en etiqueta)', 'Vitamina C (cofactor, necesaria)'], importance: 'Pérdida de colágeno articular y óseo acelerada en postmenopausia. Con vitamina C tiene evidencia en articulaciones.', color: '#0EA5E9', demo: 3 },
    { id: 'vitb12', name: 'Vitamina B12', target: 2.4, unit: 'mcg/día', foods: ['Sardinas (9mcg/100g)', 'Mejillones (20mcg/100g)', 'Huevo entero (1.1mcg/huevo)', 'Leche (0.9mcg/250ml)'], importance: 'La absorción baja con la edad. El déficit causa fatiga y deterioro cognitivo. Si tomas omeprazol, el riesgo se multiplica.', color: '#7B3FE4', demo: 1.6 },
  ],
}

export const DRUG_INTERACTIONS = [
  { drug: 'Omeprazol', category: 'Inhibidor de bomba de protones', icon: '💊', interactions: [
    { nutrient: 'Vitamina B12', effect: 'reduce', detail: 'El omeprazol reduce la absorción de B12 un 65% con uso prolongado (>3 meses).', action: 'Pide analítica de B12 si llevas >6 meses tomándolo.' },
    { nutrient: 'Magnesio', effect: 'reduce', detail: 'Uso prolongado puede causar hipomagnesemia. Síntomas: calambres, espasmos, fatiga.', action: 'Monitoriza niveles de magnesio sérico si llevas >1 año.' },
    { nutrient: 'Calcio', effect: 'reduce', detail: 'El calcio carbonato requiere ácido gástrico para absorberse. Con omeprazol, su absorción cae drásticamente.', action: 'Usa calcio citrato (no carbonato) — se absorbe sin ácido gástrico.' },
  ]},
  { drug: 'Metformina', category: 'Antidiabético oral', icon: '💊', interactions: [
    { nutrient: 'Vitamina B12', effect: 'reduce', detail: 'La metformina reduce la absorción de B12 hasta un 30%. El déficit puede manifestarse como neuropatía o fatiga severa.', action: 'Solicita analítica de B12 anualmente. Suplementar si hay déficit.' },
    { nutrient: 'Ácido fólico', effect: 'reduce', detail: 'Puede reducir los niveles de folato, importante para función cognitiva y cardiovascular.', action: 'Incluir espinacas, lentejas y aguacate diariamente.' },
  ]},
  { drug: 'Levotiroxina', category: 'Hormona tiroidea', icon: '💊', interactions: [
    { nutrient: 'Calcio', effect: 'interfiere', detail: 'El calcio interfiere con la absorción de levotiroxina si se toma simultáneamente. Reduce la biodisponibilidad hasta un 40%.', action: 'Tomar levotiroxina en ayunas 30–60 min antes del desayuno. Separar el calcio al menos 4 horas.' },
    { nutrient: 'Hierro', effect: 'interfiere', detail: 'El hierro forma quelatos con la levotiroxina, reduciendo la absorción de ambos.', action: 'Separar hierro y levotiroxina al menos 4 horas.' },
    { nutrient: 'Soja (tofu/tempeh)', effect: 'interfiere', detail: 'Las isoflavonas pueden interferir con la absorción de levotiroxina.', action: 'Evitar soja en la misma comida que la levotiroxina.' },
  ]},
  { drug: 'Anticoagulantes (acenocumarol/warfarina)', category: 'Anticoagulante oral', icon: '⚠️', interactions: [
    { nutrient: 'Vitamina K', effect: 'critico', detail: 'La vitamina K contrarresta directamente el efecto del acenocumarol. Cambios en su consumo pueden desestabilizar el INR.', action: 'Mantener un consumo CONSISTENTE de vitamina K. NO tomar suplementos K2 sin consultar a tu médica.' },
    { nutrient: 'Omega-3 (dosis alta)', effect: 'aumenta', detail: 'El omega-3 a dosis >3g/día tiene efecto anticoagulante adicional y puede aumentar el riesgo de sangrado.', action: 'Limitar omega-3 a ≤1g/día sin consultar a tu médica.' },
  ]},
  { drug: 'Estatinas (atorvastatina/simvastatina)', category: 'Hipolipemiante', icon: '💊', interactions: [
    { nutrient: 'CoQ10', effect: 'reduce', detail: 'Las estatinas inhiben la síntesis de CoQ10 hasta un 40%. El déficit causa fatiga muscular, calambres y miopatía — muchas mujeres lo atribuyen a la menopausia.', action: 'Suplementar CoQ10 100–200mg/día. Puede revertir la fatiga muscular en semanas.' },
    { nutrient: 'Vitamina D', effect: 'requiere', detail: 'Las estatinas pueden reducir la síntesis de vitamina D, agravando el riesgo cardiovascular y óseo.', action: 'Monitoriza la vitamina D con analítica anual si tomas estatinas.' },
  ]},
]

export const WEEKLY_SHOPPING_LIST = {
  peri: {
    proteinas: ['Salmón salvaje (300g)', 'Sardinas en lata al natural (4 latas)', 'Huevos camperos (12 unidades)', 'Yogur griego natural (4 × 125g)', 'Pechuga de pollo (400g)', 'Lentejas secas (250g)'],
    vegetales: ['Espinacas (300g)', 'Brócoli (1 unidad grande)', 'Rúcula (2 bolsas)', 'Aguacate (3 unidades)', 'Zanahoria (1 bolsa)'],
    semillas: ['Semillas de chía (100g)', 'Semillas de lino (100g)', 'Nueces (100g)', 'Almendras crudas (100g)', 'Semillas de calabaza (100g)'],
    otros: ['Aceite de oliva virgen extra', 'Cúrcuma en polvo', 'Infusiones valeriana/manzanilla', 'Chocolate negro 85% (100g)', 'Pan de centeno'],
  },
  meno: {
    proteinas: ['Salmón (300g)', 'Sardinas con espina en lata (4 latas)', 'Huevos camperos (12)', 'Tofu firme (400g)', 'Yogur griego (6 × 125g)', 'Caballa (200g)'],
    vegetales: ['Brócoli (2 unidades)', 'Espinacas (300g)', 'Kale (1 bolsa)', 'Champiñones (200g)', 'Zanahoria (500g)', 'Ajo (1 cabeza)'],
    semillas: ['Almendras (150g)', 'Semillas de sésamo (100g)', 'Semillas de calabaza (100g)', 'Nueces (100g)'],
    otros: ['Aceite de oliva virgen extra', 'Canela en rama', 'Bebida de avena sin azúcar (1L)', 'Arroz integral (500g)', 'Avena en copos tradicionales (500g)'],
  },
  post: {
    proteinas: ['Pechuga de pollo (500g)', 'Huevos camperos (12)', 'Sardinas (6 latas)', 'Mejillones en conserva (2 latas)', 'Yogur griego (6 × 200g)', 'Legumbres variadas (latas, 4 unidades)'],
    vegetales: ['Espinacas (400g)', 'Brócoli (2 unidades)', 'Pimiento rojo (3 unidades)', 'Kale (1 bolsa)', 'Champiñones (200g)'],
    semillas: ['Almendras (200g)', 'Nueces (100g)', 'Semillas de calabaza (100g)'],
    otros: ['Aceite de oliva virgen extra', 'Gelatina sin azúcar (4 sobres)', 'Caldo de huesos (1 brick)', 'Chocolate negro 85%', 'Pan de centeno'],
  },
}

// ─── Habla con los tuyos ──────────────────────────────────────────────────────
export const COMMUNICATION_GUIDES = [
  {
    id: 'pareja', title: 'Cómo explicarle a tu pareja lo que estás viviendo', readTime: '6 min', emoji: '💬',
    subtitle: 'Sin que se convierta en una discusión',
    preview: 'No tienes que justificarte ni minimizarte. Hay formas de explicar el climaterio que invitan a la comprensión en lugar de a la distancia.',
    content: `Hablar con tu pareja sobre el climaterio puede sentirse difícil, especialmente cuando no estás segura de cómo vas a ser recibida. Aquí tienes un marco que ayuda.

**Empieza por los hechos, no por los síntomas**
En lugar de "me siento muy mal últimamente", prueba: "Estoy en un proceso de cambio hormonal que mi médica llama climaterio. Puede durar entre 2 y 10 años. Durante este tiempo, mi cuerpo y mi estado de ánimo van a variar más de lo habitual."

**Nombra qué necesitas — no qué te falta**
No: "Es que nunca me escuchas cuando estoy mal."
Sí: "Cuando tengo una noche mala de sueño, lo que más me ayuda es que no me preguntes si estoy bien, sino que simplemente estés."

**Dile qué no es tuyo**
Hay síntomas que pueden parecer relacionados con la relación y no lo están. Decirlo explícitamente desactiva malentendidos: "La falta de deseo sexual que tengo ahora mismo tiene que ver con la caída de estrógenos, no contigo."

**Propón una forma de seguir aprendiendo juntos**
Algunas parejas responden muy bien a leer algo juntos o a tener una sola conversación con un profesional. Bajar el tema del "drama personal" al "contexto médico compartido" cambia completamente la dinámica.

**No necesitas que lo entienda todo**
Solo que esté dispuesta o dispuesto a aprender. Eso ya es suficiente para empezar.`,
  },
  {
    id: 'familia', title: 'Conversaciones con la familia: hijos, madres, hermanas', readTime: '7 min', emoji: '👨‍👩‍👧',
    subtitle: 'Cómo hablar sin que sea un tema pesado',
    preview: 'La familia puede ser un apoyo enorme — o una fuente de incomprensión. Depende mucho de cómo se introduce el tema.',
    content: `Cada miembro de la familia necesita una conversación distinta. Aquí, algunas guías para los casos más frecuentes.

**Con hijos adolescentes o jóvenes adultos**
La clave es normalizar sin dramatizar. "Mamá está en un proceso de cambio hormonal que se llama menopausia. Es algo que les pasa a todas las mujeres a partir de cierta edad. Puede que me veas más cansada o con el humor más variable — no es nada grave, pero me ayuda que lo sepáis."

Los hijos adolescentes que tienen madres que hablan abiertamente del climaterio desarrollan una mejor comprensión de la salud femenina. Estás modelando algo importante.

**Con tu madre o mujeres mayores en la familia**
La generación anterior vivió el climaterio en silencio, a menudo con vergüenza. Puede que tu madre minimice lo que te pasa ("eso lo pasa todas") o que, al contrario, te transmita sus propios miedos sin filtro.

Puedes decirle: "Quiero hablarte de esto porque creo que tú también lo viviste, aunque entonces no se hablara. Me gustaría saber cómo fue para ti, y también contarte cómo lo estoy llevando yo."

**Con hermanas**
Son las aliadas naturales — especialmente si son mayores y ya han pasado por ello, o si están en el mismo proceso. Hablar con una hermana puede romper el tabú familiar de un solo golpe.

**Lo que ayuda en todas las conversaciones**
- No usar el climaterio para explicar discusiones pasadas
- Pedir apoyo concreto, no comprensión abstracta
- Tener la conversación cuando estás relativamente bien, no en el peor momento`,
  },
  {
    id: 'trabajo', title: 'En el trabajo: cuándo y cómo decirlo (o no)', readTime: '5 min', emoji: '💼',
    subtitle: 'Gestionar el climaterio en el entorno laboral sin exponerte más de lo que quieres',
    preview: 'No tienes obligación de explicar nada. Pero hay situaciones donde decir algo puede cambiar mucho tu día a día.',
    content: `El climaterio en el trabajo es uno de los temas más invisibles — y uno de los que más impacto tiene en el rendimiento diario.

**Primero: decides tú cuánto compartes**
No tienes ninguna obligación de explicar tus síntomas a tu jefa, a RRHH o a tus compañeros. La privacidad médica es tuya. Dicho esto, hay situaciones en las que comunicar algo estratégico puede mejorar mucho tu experiencia.

**Con tu mánager directa (si confías)**
No tienes que dar diagnóstico ni detalles. Puedes decir: "Estoy pasando por un proceso de salud que está afectando mi energía y concentración en algunos momentos del día. ¿Podríamos revisar mi distribución de reuniones?"

Pedir adaptaciones específicas (reuniones matinales, temperatura en la sala, flexibilidad de horario) es mucho más eficaz que pedir comprensión genérica.

**Con RRHH**
Si tu empresa tiene política de menopausia o programa de bienestar, RRHH puede ser un aliado. Si no existe, puedes ser tú quien lo proponga — Herya tiene recursos para ello.

**Con compañeras de confianza**
El apoyo entre iguales es el más poderoso y el menos peligroso. Muchas mujeres descubren que cuando hablan con una compañera de confianza, esta también está pasando por ello en silencio.

**Qué evitar**
- Usar el climaterio como disculpa por errores laborales
- Hablar del tema en situaciones de conflicto
- Compartir más de lo que habrías compartido sobre cualquier otro tema de salud`,
  },
  {
    id: 'soledad', title: 'Cuando sientes que estás sola en esto', readTime: '8 min', emoji: '🌿',
    subtitle: 'Por qué aparece esa sensación — y qué hacer con ella',
    preview: 'La soledad en el climaterio es uno de los síntomas menos hablados. Tiene causas concretas y tiene salida.',
    content: `Una de las experiencias más frecuentes en el climaterio — y de las menos mencionadas — es la sensación de soledad. No la soledad de estar sola físicamente, sino la de sentir que nadie entiende realmente lo que estás viviendo.

**Por qué ocurre**
El climaterio coincide con muchas pérdidas simultáneas: el ciclo menstrual termina, la fertilidad se cierra, los hijos se van, a veces los padres enferman o fallecen, y a menudo las relaciones cambian. Todo esto, junto con la variabilidad hormonal que afecta directamente al estado de ánimo, puede crear una sensación de "estar entre dos aguas" — ya no en la etapa anterior, todavía sin anclaje en la siguiente.

Además, culturalmente, el climaterio sigue siendo tabú. No se habla en el trabajo, pocas veces en casa, casi nunca con amigas hasta que alguien se atreve primero. La invisibilidad del tema multiplica el aislamiento.

**Lo que no es soledad**
A veces lo que sentimos como soledad es en realidad ansiedad hormonal, fatiga severa o ánimo bajo — síntomas físicos que colorean nuestra percepción de las relaciones. Antes de concluir que "estoy sola", vale la pena preguntar: ¿cómo he dormido? ¿Cuántos sofocos he tenido esta semana?

**Lo que sí ayuda**
- Hablar con otra mujer que esté pasando por ello (o que ya lo pasó). Una sola conversación honesta puede deshacer meses de silencio.
- Grupos de apoyo presenciales u online — cada vez hay más, y el efecto de reconocimiento mutuo es muy potente.
- Profesional de salud mental que conozca el climaterio. No toda psicóloga tiene ese conocimiento específico; merece la pena buscarlo.

**Una cosa que puedes hacer hoy**
Escríbele a una amiga o familiar que ya haya pasado por el climaterio. No para contarle todo — solo para preguntarle cómo fue. Ese mensaje puede abrir más de lo que imaginas.`,
  },
]
