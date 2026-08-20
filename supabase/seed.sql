-- Seed data for muscle_groups and exercises
-- Idempotent: re-running clears and re-inserts.

-- ============================================================================
-- Muscle groups
-- ============================================================================
insert into public.muscle_groups (slug, name_sv, name_en, region) values
  ('chest',      'Bröst',             'Chest',      'front'),
  ('shoulders',  'Axlar',             'Shoulders',  'front'),
  ('biceps',     'Biceps',            'Biceps',     'front'),
  ('forearms',   'Underarmar',        'Forearms',   'front'),
  ('abs',        'Magmuskler',        'Abs',        'front'),
  ('obliques',   'Sneda magmuskler',  'Obliques',   'front'),
  ('quads',      'Lårmuskler (fram)', 'Quadriceps', 'front'),
  ('traps',      'Kappmuskler',       'Trapezius',  'back'),
  ('lats',       'Breda ryggmuskeln', 'Lats',       'back'),
  ('triceps',    'Triceps',           'Triceps',    'back'),
  ('lower_back', 'Nedre rygg',        'Lower Back', 'back'),
  ('glutes',     'Sätesmuskler',      'Glutes',     'back'),
  ('hamstrings', 'Lårmuskler (bak)',  'Hamstrings', 'back'),
  ('calves',     'Vadmuskler',        'Calves',     'back')
on conflict (slug) do update set
  name_sv = excluded.name_sv,
  name_en = excluded.name_en,
  region = excluded.region;

-- ============================================================================
-- Exercises (clears and re-inserts to keep idempotent)
-- ============================================================================
delete from public.exercises;

insert into public.exercises
  (name, description, form_tips, equipment, difficulty, primary_muscles, secondary_muscles)
values
  -- ===== CHEST =====
  ('Bench Press',
   'Klassisk skivstångspress på bänk. Bygger massa i hela bröstet, axlar och triceps.',
   ARRAY['Dra ihop skulderbladen och håll dem mot bänken', 'Stången rör vid bröstet (inte halsen)', 'Tryck upp i en lätt båge mot axlarna', 'Håll fötterna stadigt i golvet'],
   'barbell', 'intermediate', ARRAY['chest'], ARRAY['shoulders','triceps']),

  ('Incline Bench Press',
   'Skivstångspress på lutande bänk. Träffar övre delen av bröstet.',
   ARRAY['30-45° lutning är optimalt — högre vinkel = mer axel', 'Stången rör vid övre delen av bröstet', 'Spänn ryggen och bibehåll bankrätt skuldra'],
   'barbell', 'intermediate', ARRAY['chest'], ARRAY['shoulders','triceps']),

  ('Dumbbell Bench Press',
   'Bänkpress med hantlar. Större rörelseomfång och mer axelstabilitet än med skivstång.',
   ARRAY['Sänk hantlarna till axelhöjd', 'Tryck upp och in mot mitten utan att klanga ihop dem', 'Kontrollera nedfasen — räkna 2 sekunder ner'],
   'dumbbell', 'beginner', ARRAY['chest'], ARRAY['shoulders','triceps']),

  ('Dumbbell Fly',
   'Isolering för bröstet. Sträcker ut bröstmuskeln med stort rörelseomfång.',
   ARRAY['Lätt böjda armbågar genom hela rörelsen', 'Sänk hantlarna åt sidorna tills du känner sträck', 'Kläm ihop bröstet i toppen', 'Kör med lättare vikter än vid press'],
   'dumbbell', 'beginner', ARRAY['chest'], ARRAY[]::text[]),

  ('Push-up',
   'Kroppsviktsövning för bröst. Kan progressivt ökas med deficit, fötterna höjda eller vikt på ryggen.',
   ARRAY['Kropp i rak linje från huvud till hälar', 'Armbågarna i 45° vinkel mot kroppen', 'Bröstet rör vid eller nära golvet'],
   'bodyweight', 'beginner', ARRAY['chest'], ARRAY['triceps','shoulders','abs']),

  ('Cable Fly',
   'Bröstisolering i kabelmaskin. Konstant motstånd genom hela rörelsen.',
   ARRAY['Stå mellan kablarna med ett ben fram', 'Lätt framåtlut för bättre vinkel', 'Möts framför kroppen i höjd med bröstet'],
   'cable', 'beginner', ARRAY['chest'], ARRAY[]::text[]),

  -- ===== SHOULDERS =====
  ('Overhead Press',
   'Stående skivstångspress över huvudet. Bygger axelstyrka och core-stabilitet.',
   ARRAY['Spänn rumpan och magen för att skydda ländryggen', 'Stången startar vid övre bröstet', 'Pressa rakt upp och dra in huvudet under stången i toppen'],
   'barbell', 'intermediate', ARRAY['shoulders'], ARRAY['triceps','abs']),

  ('Dumbbell Shoulder Press',
   'Axelpress med hantlar, sittande eller stående. Mer rörelseomfång än med skivstång.',
   ARRAY['Hantlar startar i axelhöjd', 'Pressa upp tills armbågarna nästan är raka', 'Undvik att luta dig bakåt — använd ryggstöd om sittande'],
   'dumbbell', 'beginner', ARRAY['shoulders'], ARRAY['triceps']),

  ('Lateral Raise',
   'Sidolyft för mellersta delen av deltoideus. Den viktigaste isolationsövningen för axelbredd.',
   ARRAY['Lätt böjda armbågar', 'Lyft till axelhöjd, inte högre', 'Lillfingret leder rörelsen', 'Använd lättare vikter än du tror'],
   'dumbbell', 'beginner', ARRAY['shoulders'], ARRAY[]::text[]),

  ('Front Raise',
   'Framåtlyft för främre delen av axeln.',
   ARRAY['Håll armarna raka eller lätt böjda', 'Lyft till axelhöjd', 'Undvik att svänga med kroppen'],
   'dumbbell', 'beginner', ARRAY['shoulders'], ARRAY[]::text[]),

  ('Rear Delt Fly',
   'Sidolyft framåtlutad — tränar bakre delen av axeln. Ofta försummad muskel.',
   ARRAY['Luta överkroppen ~45° framåt', 'Lyft hantlarna åt sidorna med raka armar', 'Kläm ihop skulderbladen i toppen'],
   'dumbbell', 'beginner', ARRAY['shoulders'], ARRAY['traps']),

  ('Face Pull',
   'Drag mot ansiktet i kabel. Bra för bakre axel och axelhälsa.',
   ARRAY['Använd repset', 'Dra mot pannan med armbågarna högt', 'Externt rotera överarmarna i toppen'],
   'cable', 'beginner', ARRAY['shoulders'], ARRAY['traps']),

  -- ===== BICEPS =====
  ('Barbell Curl',
   'Klassisk biceps-övning med skivstång.',
   ARRAY['Armbågarna kvar vid sidorna', 'Undvik att svänga — om du måste fuska, sänk vikten', 'Spänn biceps i toppen, kontrollera nedfasen'],
   'barbell', 'beginner', ARRAY['biceps'], ARRAY['forearms']),

  ('Dumbbell Curl',
   'Bicepscurl med hantlar. Tillåter neutral grepp och alternerande utförande.',
   ARRAY['Vrid handleden så att handflatan är uppåt i toppen (supinering)', 'En hand i taget eller båda samtidigt', 'Full sträckning i botten'],
   'dumbbell', 'beginner', ARRAY['biceps'], ARRAY['forearms']),

  ('Hammer Curl',
   'Curl med neutralt grepp (handflatorna mot varandra). Tränar brachialis och underarmarna mer.',
   ARRAY['Håll greppet neutralt genom hela rörelsen', 'Armbågarna stilla', 'Långsam negativ fas'],
   'dumbbell', 'beginner', ARRAY['biceps'], ARRAY['forearms']),

  ('Preacher Curl',
   'Curl mot lutad bänk. Isolerar biceps utan möjlighet att fuska med kroppen.',
   ARRAY['Armarna helt stödda mot dynan', 'Pausa lätt i toppen', 'Sträck inte ut helt i botten — håll spänning'],
   'barbell', 'intermediate', ARRAY['biceps'], ARRAY[]::text[]),

  ('Cable Curl',
   'Bicepscurl i kabel. Konstant motstånd, bra för pump.',
   ARRAY['Stå rakt med kabeln framför dig', 'Armbågarna stilla vid sidorna', 'Långsam excentrisk fas'],
   'cable', 'beginner', ARRAY['biceps'], ARRAY['forearms']),

  -- ===== FOREARMS =====
  ('Wrist Curl',
   'Handledscurl med skivstång eller hantlar. Tränar underarmens böjmuskler.',
   ARRAY['Underarmar vilar på lår eller bänk', 'Låt vikten rulla ner mot fingrarna', 'Spänn upp i toppen'],
   'barbell', 'beginner', ARRAY['forearms'], ARRAY[]::text[]),

  ('Reverse Wrist Curl',
   'Omvänd handledscurl. Tränar underarmens sträckmuskler — viktigt för balans.',
   ARRAY['Använd lättare vikt än vanlig wrist curl', 'Kontrollera hela rörelsen', 'Långsamt och med spänning'],
   'dumbbell', 'beginner', ARRAY['forearms'], ARRAY[]::text[]),

  ('Farmers Walk',
   'Bär tunga hantlar/kettlebells så långt du kan. Greppstyrka och kropps-stabilitet.',
   ARRAY['Stå rakt, axlarna nedpressade och bakåt', 'Spänn magen', 'Gå i rak linje, små steg'],
   'dumbbell', 'beginner', ARRAY['forearms'], ARRAY['traps','abs']),

  ('Dead Hang',
   'Häng från en stång så länge du orkar. Bygger greppstyrka.',
   ARRAY['Aktivera lats lätt — slappna inte av helt', 'Andas normalt', 'Bygg upp tid över veckor'],
   'bodyweight', 'beginner', ARRAY['forearms'], ARRAY['lats']),

  -- ===== ABS =====
  ('Plank',
   'Statisk core-övning. Stabiliserar hela bålen.',
   ARRAY['Kropp i rak linje', 'Spänn rumpan och magen', 'Andas normalt — håll inte andan'],
   'bodyweight', 'beginner', ARRAY['abs'], ARRAY['obliques','lower_back']),

  ('Crunch',
   'Klassisk situp utan att sätta sig hela vägen upp.',
   ARRAY['Lyft bara skulderbladen från golvet', 'Krama magmusklerna i toppen', 'Stoppa innan ländryggen lyfter'],
   'bodyweight', 'beginner', ARRAY['abs'], ARRAY[]::text[]),

  ('Hanging Leg Raise',
   'Hängande benlyft från stång. Tränar nedre del av magen kraftigt.',
   ARRAY['Lyft benen till höft- eller bröstnivå', 'Undvik att svänga', 'Kontrollerad nedfas'],
   'bodyweight', 'advanced', ARRAY['abs'], ARRAY['forearms']),

  ('Cable Crunch',
   'Stående/knäende crunch med kabel. Tillåter progressiv belastning.',
   ARRAY['Knästående framför kabelstationen', 'Krama ihop bröstet mot låren', 'Dra med magen, inte armarna'],
   'cable', 'intermediate', ARRAY['abs'], ARRAY[]::text[]),

  -- ===== OBLIQUES =====
  ('Russian Twist',
   'Sittande rotation med vikt. Tränar sneda magmuskler.',
   ARRAY['Luta överkroppen bakåt ~45°', 'Rotera långsamt sida till sida', 'Vikten rör vid golvet på varje sida'],
   'dumbbell', 'beginner', ARRAY['obliques'], ARRAY['abs']),

  ('Side Plank',
   'Sidoplanka. Statisk övning för sneda magmuskler och stabilitet.',
   ARRAY['Kropp i rak linje', 'Höften lyft, dyker inte', 'Håll 30-60 sek per sida'],
   'bodyweight', 'beginner', ARRAY['obliques'], ARRAY['abs']),

  ('Bicycle Crunch',
   'Cykelrörelser från ryggläge. Träffar både rectus abdominis och obliques.',
   ARRAY['Armbåge möter motsatt knä', 'Långsamt och kontrollerat — inte snabbt', 'Håll nedre ryggen mot golvet'],
   'bodyweight', 'beginner', ARRAY['obliques'], ARRAY['abs']),

  -- ===== QUADS =====
  ('Barbell Squat',
   'Kungsövningen för underkropp. Knäböj med skivstång på axlarna.',
   ARRAY['Fötterna axelbrett, lätt utåtvridna', 'Sänk till parallel eller djupare', 'Knäna följer tårnas riktning', 'Bröstet upp, ländryggen neutral'],
   'barbell', 'intermediate', ARRAY['quads'], ARRAY['glutes','hamstrings','lower_back']),

  ('Front Squat',
   'Knäböj med stången på främre axlarna. Mer fokus på quads och bål.',
   ARRAY['Stång ligger på främre delten + axel', 'Armbågarna högt under hela rörelsen', 'Mer upprätt överkropp än bakåt-squat'],
   'barbell', 'advanced', ARRAY['quads'], ARRAY['glutes','abs']),

  ('Leg Press',
   'Maskinpress med benen. Säkert sätt att lasta tungt på underkroppen.',
   ARRAY['Sänk till 90° i knäna eller djupare', 'Tryck genom hela foten', 'Lås inte ut knäna helt i toppen'],
   'machine', 'beginner', ARRAY['quads'], ARRAY['glutes','hamstrings']),

  ('Lunge',
   'Utfallssteg. Unilateral övning — varje ben för sig.',
   ARRAY['Stort steg fram', 'Bakre knät nästan rör golvet', 'Främre knät över foten, inte över tårna'],
   'dumbbell', 'beginner', ARRAY['quads'], ARRAY['glutes','hamstrings']),

  ('Bulgarian Split Squat',
   'Utfallssteg med bakre foten höjd på bänk. Tuff unilateral övning.',
   ARRAY['Bakre foten på bänk eller låg pall', 'Främre foten ~en stor stegs avstånd', 'Sänk rakt ner, inte framåt'],
   'dumbbell', 'intermediate', ARRAY['quads'], ARRAY['glutes','hamstrings']),

  ('Leg Extension',
   'Maskinövning som isolerar quads.',
   ARRAY['Sänk vikten kontrollerat', 'Spänn quads i toppen', 'Stoppa innan smärta i knäna'],
   'machine', 'beginner', ARRAY['quads'], ARRAY[]::text[]),

  ('Goblet Squat',
   'Knäböj med en hantel/kettlebell hållen vid bröstet. Bra för nybörjare.',
   ARRAY['Hantel hålls under hakan', 'Armbågarna inuti knäna i botten', 'Fungerar bra som uppvärmning'],
   'dumbbell', 'beginner', ARRAY['quads'], ARRAY['glutes','abs']),

  -- ===== TRAPS =====
  ('Barbell Shrug',
   'Axelryckning med skivstång. Bygger övre traps direkt.',
   ARRAY['Lyft axlarna rakt upp mot öronen', 'Ingen rotation framåt eller bakåt', 'Pausa i toppen 1 sek'],
   'barbell', 'beginner', ARRAY['traps'], ARRAY[]::text[]),

  ('Dumbbell Shrug',
   'Axelryckning med hantlar. Tillåter större rörelseomfång.',
   ARRAY['Hantlar vid sidorna', 'Lyft rakt upp', 'Undvik att rulla axlarna'],
   'dumbbell', 'beginner', ARRAY['traps'], ARRAY[]::text[]),

  ('Upright Row',
   'Upprätt rodd. Tränar traps och axlar.',
   ARRAY['Greppet axelbrett', 'Dra till bröstkorgsnivå', 'Armbågarna leder uppåt'],
   'barbell', 'intermediate', ARRAY['traps'], ARRAY['shoulders']),

  -- ===== LATS =====
  ('Pull-up',
   'Klassisk dragövning på stång med övergrepp. En av de bästa övningarna för bredd i ryggen.',
   ARRAY['Övergrepp, något bredare än axelbrett', 'Dra hakan över stången', 'Sträck ut helt i botten — undvik halva reps'],
   'bodyweight', 'intermediate', ARRAY['lats'], ARRAY['biceps','traps','forearms']),

  ('Lat Pulldown',
   'Latsdrag i maskin. Bra om pull-up är för tungt.',
   ARRAY['Bröstet upp, lätt bakåtlutad', 'Dra till övre bröstet, inte bakom nacken', 'Spänn lats i bottenposition'],
   'cable', 'beginner', ARRAY['lats'], ARRAY['biceps']),

  ('Barbell Row',
   'Skivstångsrodd framåtlutad. Bygger tjocklek i ryggen.',
   ARRAY['Höfter böjda till ~45°, ryggen rak', 'Dra till nedre bröstet/övre magen', 'Kläm ihop skulderbladen i toppen'],
   'barbell', 'intermediate', ARRAY['lats'], ARRAY['biceps','traps','lower_back']),

  ('Cable Row',
   'Sittande rodd i kabel. Säker och kontrollerad ryggövning.',
   ARRAY['Sitt rakt, lätt framåtlutad', 'Dra till naveln', 'Kläm ihop skulderbladen — undvik att rulla axlarna framåt'],
   'cable', 'beginner', ARRAY['lats'], ARRAY['biceps','traps']),

  ('Dumbbell Row',
   'En-hands-rodd med hantel. Unilateral, bra för att fixa obalanser.',
   ARRAY['Stöd andra handen och knäet på bänk', 'Dra hanteln till höften', 'Spänn lats i toppen'],
   'dumbbell', 'beginner', ARRAY['lats'], ARRAY['biceps','traps']),

  ('Chin-up',
   'Pull-up men med undergrepp (handflator mot dig). Mer biceps-aktivering.',
   ARRAY['Undergrepp, axelbrett', 'Dra hakan över stången', 'Kontrollerad nedfas'],
   'bodyweight', 'intermediate', ARRAY['lats'], ARRAY['biceps','forearms']),

  -- ===== TRICEPS =====
  ('Close-Grip Bench Press',
   'Bänkpress med smalt grepp. Triceps-fokuserad pressövning.',
   ARRAY['Greppet axelbrett (inte trängre — det belastar handlederna)', 'Armbågarna nära kroppen', 'Stången rör vid nedre bröstet'],
   'barbell', 'intermediate', ARRAY['triceps'], ARRAY['chest','shoulders']),

  ('Tricep Pushdown',
   'Pushdown i kabel. Klassisk triceps-isolation.',
   ARRAY['Armbågarna stilla vid sidorna', 'Pressa ner till raka armar', 'Spänn triceps i bottenposition'],
   'cable', 'beginner', ARRAY['triceps'], ARRAY[]::text[]),

  ('Skull Crusher',
   'Triceps extension liggande. Stort rörelseomfång.',
   ARRAY['Sänk stången mot pannan eller bakom huvudet', 'Överarmarna stilla — bara armbågarna rör sig', 'Lås inte ut helt i toppen'],
   'barbell', 'intermediate', ARRAY['triceps'], ARRAY[]::text[]),

  ('Overhead Tricep Extension',
   'Triceps-pull över huvudet. Sträcker ut långa huvudet av triceps.',
   ARRAY['Sittande eller stående', 'Hanteln går bakom huvudet', 'Armbågarna pekar uppåt, inte utåt'],
   'dumbbell', 'beginner', ARRAY['triceps'], ARRAY[]::text[]),

  ('Tricep Dip',
   'Dip mellan parallel-stänger. Stort lyft för triceps.',
   ARRAY['Upprätt position för triceps-fokus (lutad framåt = mer bröst)', 'Sänk tills överarmarna är parallella med golvet', 'Tryck upp explosivt'],
   'bodyweight', 'intermediate', ARRAY['triceps'], ARRAY['chest','shoulders']),

  -- ===== LOWER BACK =====
  ('Deadlift',
   'Marklyft. Tränar hela bakkedjan — ryggens kung.',
   ARRAY['Stången över mitten av foten', 'Skuldror över stången, ryggen rak', 'Tryck golvet bort med fötterna', 'Höft och knän sträcker ut samtidigt'],
   'barbell', 'advanced', ARRAY['lower_back'], ARRAY['glutes','hamstrings','traps','lats','forearms']),

  ('Romanian Deadlift',
   'Marklyft med raka(re) ben. Mer hamstrings och nedre rygg.',
   ARRAY['Lätt böjda knän, fasta genom hela rörelsen', 'Tippa höften bakåt, känn sträck i hamstrings', 'Sänk så långt rörligheten tillåter, inte längre'],
   'barbell', 'intermediate', ARRAY['lower_back'], ARRAY['hamstrings','glutes']),

  ('Hyperextension',
   'Ryggsträckare i hyperextension-bänk. Bra för att stärka nedre rygg.',
   ARRAY['Höften på dynan', 'Sänk överkroppen kontrollerat', 'Stoppa när du är i linje — överextenderar inte'],
   'bodyweight', 'beginner', ARRAY['lower_back'], ARRAY['glutes','hamstrings']),

  ('Good Morning',
   'Stående framåtböjning med skivstång på ryggen.',
   ARRAY['Lätt böjda knän', 'Tippa höften bakåt med rak rygg', 'Lättare vikt än du tror — fokusera på form'],
   'barbell', 'advanced', ARRAY['lower_back'], ARRAY['hamstrings','glutes']),

  -- ===== GLUTES =====
  ('Hip Thrust',
   'Höftlyft med skivstång över höften, axlarna mot bänk. Den bästa rena glute-övningen.',
   ARRAY['Bänken under skulderbladen', 'Stången på höftbenet (använd dyna)', 'Pressa upp tills kropp är rak', 'Spänn rumpan i toppen'],
   'barbell', 'intermediate', ARRAY['glutes'], ARRAY['hamstrings']),

  ('Glute Bridge',
   'Höftlyft från golv. Som hip thrust men utan bänk.',
   ARRAY['Plant fötter, axelbrett isär', 'Pressa upp genom hälarna', 'Pausa 1 sek i toppen'],
   'bodyweight', 'beginner', ARRAY['glutes'], ARRAY['hamstrings']),

  ('Cable Kickback',
   'Bakåtspark i kabel. Isoleringsövning för glutes.',
   ARRAY['Lutad framåt, en hand stöd', 'Spark bakåt med rakt ben', 'Spänn rumpan i toppen'],
   'cable', 'beginner', ARRAY['glutes'], ARRAY['hamstrings']),

  ('Sumo Deadlift',
   'Marklyft med bred fotställning. Mer fokus på glutes och inner-quad.',
   ARRAY['Fötter ~2x axelbrett, tårna vinklade utåt', 'Greppet inom benen', 'Mer upprätt överkropp än conventional'],
   'barbell', 'advanced', ARRAY['glutes'], ARRAY['hamstrings','quads','lower_back']),

  -- ===== HAMSTRINGS =====
  ('Leg Curl',
   'Maskinövning som isolerar hamstrings.',
   ARRAY['Liggande eller sittande maskin', 'Kontrollerad excentrisk fas (sänkning)', 'Spänn i toppen'],
   'machine', 'beginner', ARRAY['hamstrings'], ARRAY[]::text[]),

  ('Stiff-Leg Deadlift',
   'Marklyft med raka ben. Liknar Romanian deadlift men med raka(re) ben.',
   ARRAY['Knäna nästan raka', 'Tippa höften bakåt', 'Sänk så långt flexibilitet tillåter'],
   'barbell', 'intermediate', ARRAY['hamstrings'], ARRAY['glutes','lower_back']),

  ('Nordic Curl',
   'Knäende framåtlutning med fixerade fötter. Hamstring-killer.',
   ARRAY['Knän på matta, fötter under något stadigt', 'Sänk dig framåt med rak kropp', 'Använd händerna för att stötta nedfas i början'],
   'bodyweight', 'advanced', ARRAY['hamstrings'], ARRAY['glutes']),

  -- ===== CALVES =====
  ('Standing Calf Raise',
   'Stående tåhävningar. Den primära calves-övningen.',
   ARRAY['Tårna på en upphöjd kant så hälarna kan sänkas under', 'Helt sträck och full kontraktion', 'Pausa 1 sek i toppen'],
   'machine', 'beginner', ARRAY['calves'], ARRAY[]::text[]),

  ('Seated Calf Raise',
   'Sittande tåhävningar. Träffar soleus mer (under gastrocnemius).',
   ARRAY['Knäna i 90°', 'Vikten på låren', 'Långsam kontroll, full ROM'],
   'machine', 'beginner', ARRAY['calves'], ARRAY[]::text[]),

  ('Single-Leg Calf Raise',
   'Tåhävningar på ett ben i taget. Bra unilateralt och kräver bara kroppsvikt.',
   ARRAY['Stå på ett ben på en kant', 'Sänk hälen under kanten', 'Lyft till topp, pausa 1 sek'],
   'bodyweight', 'beginner', ARRAY['calves'], ARRAY[]::text[]);
