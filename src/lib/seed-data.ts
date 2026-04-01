import { Meal, MealCategory } from './types';

let counter = 0;
function seedId(): string {
  return `seed-${++counter}`;
}

function meal(
  name: string,
  category: MealCategory,
  calories: number,
  ingredients: string
): Meal {
  return { id: seedId(), name, category, calories, ingredients };
}

export function getSeedMeals(): Meal[] {
  counter = 0;
  return [
    // ═══════════════════════════════════
    // DESAYUNO - Opción 1 (Protein + Frutas)
    // ═══════════════════════════════════
    meal(
      'Yogurt Protein con plátano y granola',
      'desayuno',
      370,
      'Yogurt Protein, ½ plátano, granola (30g)'
    ),
    meal(
      'Leche Protein con berries y avena',
      'desayuno',
      350,
      'Leche Protein (200cc), arándanos, frambuesas, avena (40g)'
    ),
    meal(
      'Yogurt Protein con kiwi y manzana',
      'desayuno',
      330,
      'Yogurt Protein, 2 kiwis, 1 manzana'
    ),
    meal(
      'Leche Protein con naranja y granola',
      'desayuno',
      360,
      'Leche Protein (200cc), 1 naranja, granola (30g)'
    ),
    meal(
      'Yogurt Protein con piña y avena',
      'desayuno',
      340,
      'Yogurt Protein, 1 taza piña trozada, avena (40g)'
    ),

    // DESAYUNO - Opción 2 (Pan + Agregados)
    meal(
      'Tostadas con huevo revuelto + yogurt light',
      'desayuno',
      430,
      'Yogurt Light, pan molde (2 reb.), 2 huevos, fruta'
    ),
    meal(
      'Marraqueta con jamón de pavo + leche',
      'desayuno',
      400,
      'Leche desc. (200cc), 1 diente marraqueta, jamón pavo (60g), fruta'
    ),
    meal(
      'Pan con quesillo light + yogurt',
      'desayuno',
      390,
      'Yogurt Light, ½ hallulla, quesillo light (90g), granola (30g)'
    ),
    meal(
      'Tostadas con queso y jamón + leche',
      'desayuno',
      420,
      'Leche desc. (200cc), pan molde (2 reb.), 1 queso + 2 jamón, fruta'
    ),

    // ═══════════════════════════════════
    // ALMUERZO - Opción 1 (Proteína + Acompañamiento)
    // ═══════════════════════════════════
    meal(
      'Pollo a la plancha con arroz',
      'almuerzo',
      600,
      'Ensalada libre, pechuga pollo (200g), arroz (65g crudo)'
    ),
    meal(
      'Bistec de vacuno con puré de papas',
      'almuerzo',
      620,
      'Ensalada libre, posta negra (200g crudo), puré (300g)'
    ),
    meal(
      'Cerdo al horno con fideos',
      'almuerzo',
      610,
      'Ensalada libre, filete de cerdo (200g), fideos (100g crudo)'
    ),
    meal(
      'Pescado con quinoa',
      'almuerzo',
      560,
      'Ensalada libre, reineta/merluza (280g), quinoa (85g crudo)'
    ),
    meal(
      'Atún con arroz',
      'almuerzo',
      550,
      'Ensalada libre, 2 latas atún, arroz (65g crudo)'
    ),
    meal(
      'Pollo con papas al horno',
      'almuerzo',
      590,
      'Ensalada libre, pollo (200g crudo), 2 papas regulares (300g)'
    ),
    meal(
      'Carne con cuscús',
      'almuerzo',
      600,
      'Ensalada libre, posta rosada (200g), cuscús (85g crudo)'
    ),
    meal(
      'Camarones con arroz',
      'almuerzo',
      540,
      'Ensalada libre, camarones (300g pelados), arroz (65g crudo)'
    ),
    meal(
      'Pavo con fideos',
      'almuerzo',
      580,
      'Ensalada libre, pechuga pavo (200g), fideos (100g crudo)'
    ),
    meal(
      'Trutros de pollo con papas fritas al horno',
      'almuerzo',
      610,
      'Ensalada libre, 2 trutros largos, papas pre-frita horneadas (200g)'
    ),
    meal(
      'Fajitas de carne',
      'almuerzo',
      620,
      'Ensalada libre, carne (200g crudo), 2 masas fajita grandes, verduras'
    ),
    meal(
      'Pollo con choclo/arvejas',
      'almuerzo',
      570,
      'Ensalada libre, pollo (200g), choclo/arvejas (240g)'
    ),

    // ALMUERZO - Opción 2 (Legumbres)
    meal(
      'Lentejas con arroz y pollo',
      'almuerzo',
      520,
      'Ensalada libre, lentejas (150g secas), pollo (50g)'
    ),
    meal(
      'Porotos con riendas',
      'almuerzo',
      530,
      'Ensalada libre, porotos (150g secos), carne (50g)'
    ),
    meal(
      'Garbanzos guisados con carne',
      'almuerzo',
      510,
      'Ensalada libre, garbanzos (150g secos), carne (50g)'
    ),

    // ═══════════════════════════════════
    // CENA - Opción Once
    // ═══════════════════════════════════
    meal(
      'Once: Pan con huevo + Leche Protein',
      'cena',
      460,
      'Leche Protein (200cc), ½ hallulla, 3 huevos sin aceite, fruta'
    ),
    meal(
      'Once: Pan con jamón de pavo + Yogurt Protein',
      'cena',
      440,
      'Yogurt Protein, 1 diente marraqueta, jamón pavo (80g), granola (15g)'
    ),
    meal(
      'Once: Pan con quesillo + Leche Protein',
      'cena',
      420,
      'Leche Protein (200cc), ½ hallulla, quesillo light (90g), avena (20g)'
    ),
    meal(
      'Once: Tostadas con queso y jamón + Yogurt Protein',
      'cena',
      450,
      'Yogurt Protein, pan molde (2 reb.), 1 queso + 3 jamón, fruta'
    ),
    meal(
      'Once: Pan con pollo + Leche Protein',
      'cena',
      470,
      'Leche Protein (200cc), 1 diente marraqueta, pollo (100g), fruta'
    ),
    meal(
      'Once: Tostadas con atún + Yogurt Protein',
      'cena',
      440,
      'Yogurt Protein, pan molde (2 reb.), 1 lata atún al agua, granola (15g)'
    ),

    // CENA - Opción Cena
    meal(
      'Pechuga de pollo a la plancha con fideos',
      'cena',
      480,
      'Ensalada libre, pollo (200g), fideos (65g crudo)'
    ),
    meal(
      'Carne con arroz',
      'cena',
      500,
      'Ensalada libre, posta negra (200g), arroz (45g crudo)'
    ),
    meal(
      'Pescado al horno con papas',
      'cena',
      460,
      'Ensalada libre, reineta/merluza (280g crudo), 2 papas pequeñas (225g)'
    ),
    meal(
      'Cerdo con quinoa',
      'cena',
      490,
      'Ensalada libre, filete cerdo (200g), quinoa (55g crudo)'
    ),
    meal(
      'Atún con huevo y puré',
      'cena',
      470,
      'Ensalada libre, 1½ lata atún + 2 huevos, puré (225g)'
    ),
    meal(
      'Fajitas de pollo (cena)',
      'cena',
      480,
      'Ensalada libre, pollo (200g crudo), 2 masas fajita pequeñas, verduras'
    ),
    meal(
      'Pavo con choclo',
      'cena',
      450,
      'Ensalada libre, pavo (200g), choclo/arvejas (160g)'
    ),

    // ═══════════════════════════════════
    // SNACKS (Colaciones + Opción Lipídica)
    // ═══════════════════════════════════

    // Colación Opción 1
    meal(
      'Leche chocolate + manzana',
      'snack',
      150,
      'Leche desc. c/sabor (200cc), 1 manzana'
    ),
    meal(
      'Yogurt Light + granola',
      'snack',
      180,
      'Yogurt Batido Light, granola (30g)'
    ),
    meal(
      'Leche chocolate + barra de cereal',
      'snack',
      170,
      'Leche desc. c/sabor (200cc), barra de cereal'
    ),
    meal(
      'Yogurt Light + avena',
      'snack',
      170,
      'Yogurt Batido Light, avena (40g)'
    ),
    meal(
      'Yogurt Light + mandarinas',
      'snack',
      140,
      'Yogurt Batido Light, 2 mandarinas'
    ),

    // Colación Opción 2
    meal(
      'Barra de proteína',
      'snack',
      200,
      'Barra de proteína (1 unidad)'
    ),
    meal(
      'Yogurt Protein Plus Colun',
      'snack',
      180,
      'Yogurt Protein Plus Colun (1 sachet)'
    ),

    // Opción Lipídica
    meal(
      'Almendras (12 unidades)',
      'snack',
      170,
      'Almendras naturales'
    ),
    meal(
      'Palta (½ unidad)',
      'snack',
      160,
      '½ palta'
    ),
    meal(
      'Nueces (8 mitades)',
      'snack',
      180,
      'Nueces naturales'
    ),
    meal(
      'Maní (4 cucharadas)',
      'snack',
      170,
      'Maní natural'
    ),
    meal(
      'Aceitunas (10 unidades)',
      'snack',
      60,
      'Aceitunas'
    ),
    meal(
      'Mix semillas (4 cucharadas)',
      'snack',
      170,
      'Semillas calabaza / maravilla / chía / linaza'
    ),

    // Colación Nocturna
    meal(
      'Batido proteína + creatina',
      'snack',
      130,
      'Proteína (1 scoop), creatina (7g), 200-250cc agua'
    ),
    meal(
      'ZMA Night Time',
      'snack',
      0,
      '1 cápsula, 30 min antes de acostarse'
    ),
  ];
}
