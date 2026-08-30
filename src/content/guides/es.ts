import type { GuideArticle } from "./types";

export const CATEGORY_BASICS_ES = "Conceptos Básicos de FIRE";
export const CATEGORY_SAVING_ES = "Estrategia de Ahorro e Inversión";
export const CATEGORY_COUNTRY_ES = "Consideraciones por País y Fiscalidad";
export const CATEGORY_RETIREMENT_ES = "Vida en el Retiro y Estrategia de Retiro de Fondos";

export const guidesEs: GuideArticle[] = [
  {
    slug: "what-is-fire",
    title: "¿Qué es FIRE? Guía para principiantes sobre la Independencia Financiera y el Retiro Anticipado",
    description: "Una introducción al movimiento FIRE — qué significa alcanzar la independencia financiera, cómo se calcula el número FIRE y cómo empezar.",
    category: CATEGORY_BASICS_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "FIRE son las siglas de Financial Independence, Retire Early (Independencia Financiera, Retiro Anticipado). Describe un enfoque de finanzas personales centrado en ahorrar e invertir de forma agresiva para que, en algún momento, tu cartera de inversión pueda cubrir tus gastos de vida indefinidamente, liberándote de la necesidad de trabajar por un ingreso.",
      "La idea central se basa en la regla del 4% (también llamada tasa de retiro segura): si retiras aproximadamente el 4% del valor de tu cartera cada año, los datos históricos del mercado sugieren que tu cartera tiene una alta probabilidad de durar 30 años o más, ajustada por inflación. Calculando hacia atrás, tu \"número FIRE\" suele ser unas 25 veces tus gastos anuales esperados en el retiro.",
      "Alcanzar FIRE normalmente combina tres palancas: aumentar tu tasa de ahorro (el porcentaje de tus ingresos que inviertes en lugar de gastar), reducir gastos recurrentes, y elegir una estrategia de inversión con una rentabilidad esperada razonable a largo plazo, comúnmente una cartera diversificada de fondos indexados de bajo costo.",
      "FIRE no es una talla única — variaciones como Lean FIRE, Fat FIRE y Coast FIRE permiten a cada persona adaptar el enfoque a sus propias metas y tolerancia al riesgo. Usa la Calculadora FIRE de arriba para introducir tus propios números y ver una estimación de tu número FIRE y cuántos años te quedan.",
    ],
  },
  {
    slug: "coast-lean-fat-fire-explained",
    title: "Coast FIRE vs Lean FIRE vs Fat FIRE: ¿Cuál es la Diferencia?",
    description: "Un desglose de las principales variantes de FIRE — Coast FIRE, Lean FIRE y Fat FIRE — y cómo saber en qué camino estás.",
    category: CATEGORY_BASICS_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "No todo camino hacia FIRE se ve igual. Una vez que entiendes las matemáticas básicas de la regla del 4%, ayuda conocer las variantes comunes que la gente usa para describir su situación específica.",
      "Lean FIRE describe alcanzar la independencia financiera con un presupuesto anual relativamente modesto. Requiere un número FIRE más pequeño, pero exige frugalidad sostenida, tanto antes como después de retirarse.",
      "Fat FIRE es el extremo opuesto: independencia financiera con un nivel de gasto más alto y cómodo. Requiere una cartera mucho mayor, pero ofrece más flexibilidad y margen.",
      "Coast FIRE describe un hito intermedio en lugar de un retiro completo: el punto en el que tu cartera invertida actual, dejada sola sin más aportes, se proyecta que crecerá hasta tu número FIRE completo para tu edad objetivo de retiro solo mediante el interés compuesto.",
      "Estas etiquetas son términos informales de la comunidad, no definiciones financieras estrictas. Lo que más importa es usar las matemáticas subyacentes — tus gastos, rentabilidad esperada y tasa de retiro — para definir tu propia versión de FIRE.",
    ],
  },
  {
    slug: "4-percent-rule-safe-withdrawal-rate",
    title: "La Regla del 4%: Cómo Funcionan Realmente las Tasas de Retiro Seguras",
    description: "De dónde viene la regla del 4%, qué supuestos maneja, y por qué algunas personas eligen una tasa de retiro más conservadora.",
    category: CATEGORY_BASICS_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "La \"regla del 4%\" se remonta a investigaciones de la década de 1990 (notablemente el Estudio Trinity) que probaron los rendimientos históricos del mercado estadounidense para ver qué tasa de retiro podía sostener una cartera de jubilación durante 30 años sin agotarse.",
      "Una tasa de retiro inicial del 4% se mantuvo en la gran mayoría de los períodos históricos de 30 años estudiados. En términos monetarios, esto equivale a decir que tu número FIRE es aproximadamente 25 veces tus gastos anuales (ya que 1 ÷ 0.04 = 25).",
      "La regla tiene limitaciones bien conocidas: asume una asignación específica de acciones/bonos, un horizonte de 30 años (que puede ser demasiado corto para alguien que se retira a los 40 en lugar de a los 65), y no tiene en cuenta impuestos, comisiones ni grandes gastos puntuales.",
      "Debido a estas limitaciones, muchas personas en la comunidad FIRE usan una tasa de retiro más conservadora (3% a 3.5%) para el retiro anticipado. Esta calculadora te permite ajustar el control deslizante de la tasa de retiro para ver cómo un supuesto más conservador cambia tu número FIRE y tu edad objetivo.",
    ],
  },
  {
    slug: "how-to-calculate-your-savings-rate",
    title: "Cómo Calcular tu Tasa de Ahorro (y Por Qué Importa Más que tu Salario)",
    description: "Tu tasa de ahorro — no tu ingreso — es la palanca más importante en qué tan rápido alcanzas FIRE. Aquí te explicamos cómo calcularla correctamente.",
    category: CATEGORY_SAVING_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Tu tasa de ahorro es el porcentaje de tu ingreso después de impuestos que inviertes en lugar de gastar. Se calcula como (ingreso − gastos) ÷ ingreso, expresado como porcentaje.",
      "La tasa de ahorro importa más que el salario porque afecta tu cronograma de dos maneras a la vez: una tasa de ahorro más alta significa que estás invirtiendo más cada mes, y significa que tus gastos objetivo (y por lo tanto tu número FIRE) son menores. Alguien que gana 60,000 y ahorra 50% a menudo puede alcanzar FIRE más rápido que alguien que gana 150,000 y ahorra 10%.",
      "Una forma simple de estimar la relación: con una rentabilidad real del 6%, una tasa de ahorro del 10% tarda aproximadamente 51 años en alcanzar FIRE, una tasa del 25% tarda unos 32 años, y una tasa del 50% tarda unos 17 años. El número exacto depende de tu cartera inicial y la rentabilidad esperada — usa la calculadora de arriba para ver tu propia trayectoria.",
      "La mayoría de las personas encuentran que la forma más rápida de aumentar su tasa de ahorro no es a través de la frugalidad extrema en todo, sino a través de un pequeño número de gastos grandes y recurrentes (vivienda, transporte y comida suelen ser los tres más grandes) en lugar de recortar muchas pequeñas compras discrecionales.",
    ],
  },
  {
    slug: "index-fund-investing-for-fire",
    title: "Invertir en Fondos Indexados para FIRE: Un Punto de Partida Simple",
    description: "Por qué la mayoría de las personas que persiguen FIRE optan por fondos indexados diversificados de bajo costo en lugar de elegir acciones individuales.",
    category: CATEGORY_SAVING_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Un fondo indexado es un fondo que contiene una amplia cesta de acciones (o bonos) diseñada para replicar un índice de mercado — como el S&P 500 — en lugar de intentar superarlo eligiendo ganadores individuales. Esto te da diversificación instantánea entre cientos o miles de empresas.",
      "Los fondos indexados son populares en la comunidad FIRE por dos razones principales: comisiones bajas (a menudo 0.03%–0.10% al año, frente al 1% o más de muchos fondos de gestión activa) y evidencia histórica de que la mayoría de los fondos de gestión activa no logran superar a su índice de referencia en períodos largos, después de comisiones.",
      "Un enfoque simple y común es una cartera de dos o tres fondos: un fondo indexado del mercado bursátil total, un fondo indexado de acciones internacionales y, a veces, un fondo indexado de bonos, con la mezcla de acciones/bonos ajustada según tu tolerancia al riesgo y horizonte temporal.",
      "Esto no es asesoramiento de inversión personalizado — tu asignación de activos ideal depende de tu propia tolerancia al riesgo, cronograma y panorama financiero completo. El control deslizante de \"Rentabilidad Real Esperada\" en la calculadora de arriba te permite modelar diferentes supuestos de rentabilidad a largo plazo para ver cómo afectan tu cronograma de FIRE.",
    ],
  },
  {
    slug: "build-emergency-fund-before-fire",
    title: "Crea un Fondo de Emergencia Antes de Empezar a Ahorrar Agresivamente para FIRE",
    description: "Por qué la mayoría de los planificadores de FIRE recomiendan crear primero un colchón de efectivo, y cómo protege tu plan de inversión a largo plazo de shocks a corto plazo.",
    category: CATEGORY_SAVING_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Un fondo de emergencia es efectivo reservado — generalmente en una cuenta de ahorro de alto rendimiento en lugar de invertido en el mercado — para cubrir gastos inesperados como la pérdida de un empleo, una factura médica o una reparación importante del auto, sin tener que vender inversiones en un mal momento.",
      "Un objetivo inicial común es de 3 a 6 meses de gastos de vida esenciales, aunque el número correcto depende de la estabilidad de tu empleo, tu salud, tus dependientes y otras fuentes de ingresos.",
      "La razón por la que esto importa específicamente para FIRE es el riesgo de secuencia de rendimientos a la inversa: si una caída del mercado coincide con una emergencia financiera personal y te ves obligado a vender inversiones mientras los precios están bajos, bloqueas una pérdida permanente que un colchón de efectivo habría evitado.",
      "Una vez que tu fondo de emergencia esté en su lugar, la parte más agresiva de tu plan FIRE — alta tasa de ahorro, inversión constante en fondos indexados — puede proceder con un riesgo menos de descarrilarse por sorpresas a corto plazo.",
    ],
  },
  {
    slug: "us-401k-vs-roth-ira-early-retirees",
    title: "Cuentas de Retiro en EE. UU. 101: 401(k) vs Roth IRA para Jubilados Anticipados",
    description: "Una visión general de cómo funcionan los 401(k) y las Roth IRA en Estados Unidos, y la pregunta del acceso antes de los 59½ años que más importa para los jubilados anticipados.",
    category: CATEGORY_COUNTRY_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Un 401(k) tradicional es una cuenta patrocinada por el empleador financiada con dólares antes de impuestos; las aportaciones reducen tu ingreso imponible ahora, y los retiros en la jubilación se gravan como ingreso ordinario. Una Roth IRA se financia con dólares después de impuestos; los retiros calificados en la jubilación están libres de impuestos.",
      "Para alguien que planea una jubilación tradicional alrededor de los 65 años, la elección entre tradicional y Roth es principalmente comparar tu tramo impositivo actual con tu tramo impositivo esperado en la jubilación. Para los jubilados anticipados, hay una complicación adicional: ambos tipos de cuenta generalmente restringen los retiros sin penalización hasta los 59½ años.",
      "Las estrategias comúnmente discutidas en la comunidad de retiro anticipado — como una escalera de conversión Roth, o el uso de la Regla 72(t) para Pagos Periódicos Sustancialmente Iguales — existen específicamente para acceder a los fondos de la cuenta de retiro antes de los 59½ años, pero cada una tiene reglas estrictas y compensaciones reales.",
      "Esta es información educativa general, no asesoramiento fiscal o legal — las reglas de las cuentas de retiro en EE. UU. son detalladas y cambian con el tiempo. Consulta a un profesional fiscal calificado o asesor financiero antes de tomar decisiones sobre qué cuentas usar y cómo acceder a ellas anticipadamente.",
    ],
  },
  {
    slug: "uk-isa-sipp-state-pension-fire",
    title: "FIRE en el Reino Unido: ISAs, SIPPs y la Brecha de Edad de la Pensión Estatal",
    description: "Cómo las cuentas específicas del Reino Unido (ISAs y SIPPs) y la edad de la Pensión Estatal interactúan con un plan de retiro anticipado.",
    category: CATEGORY_COUNTRY_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "En el Reino Unido, dos tipos de cuentas son fundamentales para la mayoría de los planes FIRE: la Stocks & Shares ISA, que protege el crecimiento de la inversión y los retiros de impuestos sin edad mínima de acceso, y el SIPP (Pensión Personal Autoinvertida), que ofrece desgravación fiscal en las aportaciones pero generalmente no se puede acceder hasta una edad mínima de pensión (57 años, aumentando hacia 58 en los próximos años).",
      "Debido a que los fondos del SIPP están bloqueados hasta esa edad mínima de pensión, muchas personas que planean jubilarse antes de esa edad construyen un \"puente\" usando los ahorros de la ISA para cubrir los gastos de vida en los años entre el retiro anticipado y cuando el SIPP (y más tarde, la Pensión Estatal) se vuelven accesibles.",
      "La Pensión Estatal del Reino Unido en sí es un flujo de ingresos separado, proporcionado por el gobierno, que comienza en la edad de la Pensión Estatal (actualmente 66 años, programada para aumentar más) y requiere un número mínimo de años calificados de Seguro Nacional — es un piso de ingresos útil para etapas posteriores de la vida, pero no está diseñado para financiar por sí solo una brecha de retiro anticipado.",
      "Esta es información educativa general, no asesoramiento financiero — las reglas de pensiones e ISA del Reino Unido y los umbrales de edad se actualizan periódicamente por el gobierno. Consulta a un asesor financiero regulado por la FCA para obtener orientación específica para tu situación.",
    ],
  },
  {
    slug: "sequence-of-returns-risk",
    title: "Riesgo de Secuencia de Rendimientos: Por Qué los Primeros Años de Retiro Importan Más",
    description: "Por qué el orden en que ocurren los rendimientos de inversión — no solo su promedio — puede determinar el éxito o fracaso de un plan de retiro anticipado.",
    category: CATEGORY_RETIREMENT_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Dos jubilados pueden experimentar exactamente el mismo rendimiento anual promedio durante 30 años y terminar con resultados muy diferentes, únicamente debido al orden en que ocurrieron esos rendimientos. Esto se llama riesgo de secuencia de rendimientos, y es más importante cuando estás retirando dinero de una cartera simultáneamente.",
      "Si ocurre una caída del mercado en los primeros años de la jubilación, te ves obligado a vender más acciones a precios deprimidos para cubrir la misma cantidad de retiro, reduciendo permanentemente el número de acciones que quedan para beneficiarse de la eventual recuperación.",
      "Este riesgo es una de las principales razones por las que algunos jubilados anticipados eligen una tasa de retiro inicial más baja, mantienen 1–2 años de gastos en efectivo para evitar vender durante una caída, o usan estrategias de retiro flexibles que reducen el gasto en los años posteriores a una caída del mercado.",
      "La proyección de esta calculadora usa una rentabilidad real constante asumida cada año, lo cual es una simplificación — los mercados reales no se mueven en línea recta. Usa los resultados como una estimación general de la trayectoria, no como una garantía, y considera poner a prueba tu plan frente a escenarios históricos de secuencias desfavorables.",
    ],
  },
  {
    slug: "barista-fire-part-time-work",
    title: "Barista FIRE: Usar Trabajo a Tiempo Parcial para Cubrir la Brecha hacia el Retiro Completo",
    description: "Cómo un trabajo a tiempo parcial o menos estresante después de dejar el trabajo a tiempo completo puede reducir tu número FIRE requerido y el riesgo de secuencia de rendimientos.",
    category: CATEGORY_RETIREMENT_ES,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Barista FIRE describe dejar una carrera a tiempo completo una vez que tienes una cartera significativa, pero continuar trabajando a tiempo parcial (el nombre viene de trabajos como el de barista que, en EE. UU., a veces vienen con beneficios de seguro médico) para cubrir parte o la totalidad de tus gastos de vida en lugar de retirar de tus ahorros.",
      "El atractivo es doble: puede permitirte dejar un trabajo exigente a tiempo completo años antes de lo que requeriría un número FIRE completo de \"nunca más trabajar\", y reduce cuánto necesitas retirar de tu cartera en los primeros años — reduciendo directamente el riesgo de secuencia de rendimientos durante el período más vulnerable.",
      "Una forma simple de modelar esto en la calculadora de arriba es bajar el control deslizante de \"Gastos Anuales en FIRE\" para reflejar solo la parte de los gastos que tu cartera necesita cubrir, tratando el ingreso a tiempo parcial como la cobertura del resto.",
      "Barista FIRE no es adecuado para todos — depende de poder y querer seguir trabajando de alguna manera, y de la disponibilidad de trabajo a tiempo parcial (y, en algunos países, cobertura de salud) que se ajuste a tu situación.",
    ],
  },
];
