/* =============================================================================
 *  WORKOUT ASSISTANT — YOUR PERSONAL CONFIG FILE
 * =============================================================================
 *  This is the ONLY file you edit to change your plan. No coding needed.
 *  Everything between the first "{" and the final "}" is plain data.
 *
 *  ── HOW TO EDIT AN EXERCISE ────────────────────────────────────────────────
 *  Find the day (mon, tue, ...) → find the exercise in its "exercises" list →
 *  change any value. Keep the quotes and commas exactly as shown.
 *
 *  ── HOW TO ADD A NEW EXERCISE ──────────────────────────────────────────────
 *  Copy one whole { ... } block inside a day's "exercises: [ ]" list, paste it,
 *  and edit the values. The bare minimum for a useful card is:
 *      id, name, sets, reps, and a "form" block with at least "steps".
 *  Optional: image (a URL or a file in assets/), video, tutorial, difficulty.
 *
 *  ── HOW TO ADD WEEKEND WORKOUTS (later) ────────────────────────────────────
 *  Find "sat" or "sun" below. Change  type: "rest"  to  type: "workout",
 *  add a "focus", "muscles", "note", "vibe" and an "exercises: [ ]" list just
 *  like the weekday blocks. Nothing else needs to change.
 *
 *  ── THE "form" BLOCK (the most important part) ──────────────────────────────
 *  steps    : ordered how-to, one instruction per line.
 *  cues     : short reminders to nail the posture.
 *  mistakes : common errors to avoid.
 *  breathing: when to inhale / exhale.
 *  safety   : anything to protect (neck, back, knees...).
 *
 *  ── IMAGES ─────────────────────────────────────────────────────────────────
 *  image can be either an online link ("https://...jpg/.gif") OR a local file
 *  you drop in the assets folder ("assets/my-exercise.jpg"). Leave it out and
 *  the app shows a clean illustrated placeholder for the muscle group.
 * ===========================================================================*/

window.WORKOUT_DATA = {
  profile: {
    name: "Mahesh",
    defaultTheme: "dark", // "dark" or "light"
    quotes: [
      "Discipline is choosing what you want most over what you want now.",
      "You don't have to be extreme, just consistent.",
      "The workout is the reward. Everything after is a bonus.",
      "Small reps today build the strong you of tomorrow.",
      "Show up for yourself — one set at a time.",
      "Form first. Ego last. Progress always.",
      "The body achieves what the mind believes.",
      "Rest when you're done, not when you're tired.",
      "A little progress each day adds up to big results.",
      "Sweat now, shine later."
    ]
  },

  // Global safety reminder carried into every exercise unless overridden.
  globalSafety: "Keep your neck neutral and brace your core. Stop immediately if neck or back pain increases.",

  days: {
    /* ===================== MONDAY — CHEST • TRICEPS • CORE ================== */
    mon: {
      type: "workout",
      focus: "Chest • Triceps • Core",
      muscles: ["Chest", "Triceps", "Core"],
      note: "Push day. Control the weight down, drive it up. Quality over load.",
      vibe: { label: "Power gym mix", link: "https://www.youtube.com/results?search_query=gym+workout+power+mix+playlist" },
      exercises: [
        {
          id: "db-bench-press",
          name: "Dumbbell Bench Press",
          image: "assets/exercises/db-bench-press.jpg",
          sets: "3 × 10",
          difficulty: "Medium",
          muscles: ["Chest", "Front delts", "Triceps"],
          tutorial: "https://www.youtube.com/results?search_query=dumbbell+bench+press+proper+form",
          form: {
            steps: [
              "Sit on the bench with a dumbbell resting on each thigh.",
              "Lie back, using your thighs to help kick the dumbbells up to shoulder level.",
              "Plant your feet flat, squeeze your shoulder blades back and down into the bench.",
              "Start with dumbbells at chest width, palms facing forward, elbows about 45° from your body.",
              "Press both dumbbells up until arms are nearly straight (don't lock hard) and they meet over your chest.",
              "Lower under control until your elbows are just below chest level, feeling a stretch across the chest.",
              "Repeat for all reps, then bring dumbbells to your chest and sit up to set them down safely."
            ],
            cues: [
              "Shoulder blades pinned back and down the whole set.",
              "Wrists stacked straight over elbows.",
              "Press in a slight arc so the dumbbells meet at the top.",
              "Feet driving into the floor for a stable base."
            ],
            mistakes: [
              "Flaring elbows straight out to the sides (stresses the shoulder).",
              "Bouncing the weights or letting them drift toward your face.",
              "Arching the lower back off the bench to force the weight up."
            ],
            breathing: "Inhale as you lower, exhale as you press up.",
            safety: "Keep your neck relaxed on the bench and ribs down. Stop if you feel shoulder pinching or back strain."
          }
        },
        {
          id: "incline-db-press",
          name: "Incline Dumbbell Press",
          image: "assets/exercises/incline-db-press.jpg",
          sets: "3 × 10",
          difficulty: "Medium",
          muscles: ["Upper chest", "Front delts", "Triceps"],
          tutorial: "https://www.youtube.com/results?search_query=incline+dumbbell+press+proper+form",
          form: {
            steps: [
              "Set an adjustable bench to a low incline (about 30°).",
              "Sit back with a dumbbell on each thigh, then kick them up to shoulder level as you lie back.",
              "Set your shoulder blades back and down; feet flat on the floor.",
              "Start with dumbbells at the top of your chest, elbows slightly tucked.",
              "Press up and slightly inward until arms are almost straight.",
              "Lower slowly until you feel a stretch in the upper chest, elbows just below shoulder height.",
              "Complete your reps, then lower the dumbbells to your thighs and sit up."
            ],
            cues: [
              "Only a low incline — too steep turns it into a shoulder press.",
              "Drive up and in, not straight back over your face.",
              "Keep a proud chest and tight upper back."
            ],
            mistakes: [
              "Setting the bench too upright.",
              "Letting elbows sink far below the body and overstretching the shoulder.",
              "Clanging the dumbbells together at the top and losing tension."
            ],
            breathing: "Inhale on the way down, exhale as you press up.",
            safety: "If your shoulders round forward or your neck strains, lower the incline or the weight."
          }
        },
        {
          id: "push-ups",
          name: "Push-ups",
          image: "assets/exercises/push-ups.jpg",
          sets: "2 sets",
          reps: "to a strong rep",
          difficulty: "Easy",
          muscles: ["Chest", "Triceps", "Core"],
          tutorial: "https://www.youtube.com/results?search_query=push+up+proper+form",
          form: {
            steps: [
              "Start in a high plank: hands slightly wider than shoulders, fingers spread.",
              "Set your body in one straight line from head to heels; squeeze glutes and brace core.",
              "Lower your chest toward the floor by bending the elbows to about 45° from your body.",
              "Go down until your chest is an inch or two from the floor.",
              "Push the floor away and press back up to the start without letting your hips sag or pike.",
              "Repeat with the same straight-line body position each rep."
            ],
            cues: [
              "Body is one plank — no sagging hips, no raised butt.",
              "Elbows point back at ~45°, not straight out.",
              "Push the floor away and spread the shoulder blades at the top."
            ],
            mistakes: [
              "Hips sagging or piking up.",
              "Only doing half the range (not lowering the chest enough).",
              "Head craning forward instead of staying neutral."
            ],
            breathing: "Inhale as you lower, exhale as you push up.",
            safety: "Keep the neck long and in line with the spine. Drop to your knees if form breaks down — that still counts."
          }
        },
        {
          id: "overhead-tricep-extension",
          name: "Overhead Triceps Extension",
          image: "assets/exercises/overhead-tricep-extension.jpg",
          sets: "3 × 12",
          difficulty: "Easy",
          muscles: ["Triceps"],
          tutorial: "https://www.youtube.com/results?search_query=dumbbell+overhead+tricep+extension",
          form: {
            steps: [
              "Hold one dumbbell with both hands, cupping the top end under your thumbs.",
              "Stand or sit tall, core braced, and press the dumbbell straight overhead.",
              "Keep your upper arms close to your ears and pointing at the ceiling.",
              "Bend only at the elbows to lower the dumbbell behind your head.",
              "Lower until you feel a stretch in the triceps, forearms roughly parallel to the floor.",
              "Straighten the elbows to press the weight back overhead, keeping upper arms still.",
              "Repeat, moving only from the elbow down."
            ],
            cues: [
              "Elbows stay pointing up and tucked near your head.",
              "Only the forearms move.",
              "Ribs down — don't let your back arch as the weight goes back."
            ],
            mistakes: [
              "Elbows flaring wide and drifting forward.",
              "Arching the lower back to swing the weight.",
              "Going so heavy you can't control the lowering phase."
            ],
            breathing: "Inhale as you lower behind your head, exhale as you extend up.",
            safety: "Keep the neck neutral and don't let the back arch. Use a light weight until the groove feels solid."
          }
        },
        {
          id: "bench-dips",
          name: "Bench Dips",
          sets: "2 × 10",
          difficulty: "Medium",
          muscles: ["Triceps", "Front delts", "Chest"],
          tutorial: "https://www.youtube.com/results?search_query=bench+dips+proper+form",
          form: {
            steps: [
              "Sit on the edge of a bench and place your hands next to your hips, fingers over the edge.",
              "Slide your hips off the bench, supporting your weight on your hands.",
              "Keep legs out in front — bent knees for easier, straighter legs for harder.",
              "Lower your body by bending the elbows straight back until they reach about 90°.",
              "Keep your back close to the bench as you descend.",
              "Press through your palms to straighten the arms back to the start.",
              "Repeat, keeping the shoulders down away from your ears."
            ],
            cues: [
              "Elbows track straight back, not out to the sides.",
              "Chest up and shoulders pulled down.",
              "Hips stay close to the bench."
            ],
            mistakes: [
              "Dropping too low and over-stretching the shoulders.",
              "Shrugging the shoulders up toward the ears.",
              "Letting hips drift too far forward from the bench."
            ],
            breathing: "Inhale as you lower, exhale as you press up.",
            safety: "If you feel any shoulder pinch, reduce the depth. Stop if the front of the shoulder hurts."
          }
        },
        {
          id: "plank",
          name: "Plank",
          image: "assets/exercises/plank.jpg",
          sets: "3 × 30s",
          difficulty: "Easy",
          muscles: ["Core", "Shoulders", "Glutes"],
          tutorial: "https://www.youtube.com/results?search_query=plank+proper+form",
          form: {
            steps: [
              "Set your forearms on the floor, elbows directly under your shoulders.",
              "Extend your legs back and rise onto your toes.",
              "Form one straight line from head to heels.",
              "Brace your abs as if about to be poked in the stomach, and squeeze your glutes.",
              "Hold the position, breathing steadily, for the target time.",
              "Lower your knees gently to finish."
            ],
            cues: [
              "Hips level with shoulders — not sagging, not piked.",
              "Squeeze glutes and pull belly button in.",
              "Gaze at the floor to keep the neck long."
            ],
            mistakes: [
              "Hips sagging toward the floor (strains the lower back).",
              "Butt lifting up into a pike.",
              "Holding your breath the whole time."
            ],
            breathing: "Breathe slow and steady — never hold your breath.",
            safety: "The moment your hips sag or your lower back aches, stop and reset. A shorter clean plank beats a long sloppy one."
          }
        }
      ]
    },

    /* ===================== TUESDAY — BACK • BICEPS • CORE =================== */
    tue: {
      type: "workout",
      focus: "Back • Biceps • Core",
      muscles: ["Back", "Biceps", "Core"],
      note: "Pull day. Lead every pull with your elbow and squeeze the back.",
      vibe: { label: "Focused pull energy", link: "https://www.youtube.com/results?search_query=focus+workout+playlist" },
      exercises: [
        {
          id: "one-arm-db-row",
          name: "One-arm Dumbbell Row",
          image: "assets/exercises/one-arm-db-row.jpg",
          sets: "3 × 10",
          reps: "per side",
          difficulty: "Medium",
          muscles: ["Lats", "Upper back", "Biceps"],
          tutorial: "https://www.youtube.com/results?search_query=one+arm+dumbbell+row",
          form: {
            steps: [
              "Place your right knee and right hand on a bench, left foot on the floor.",
              "Let a dumbbell hang from your left hand, arm straight, back flat and roughly parallel to the floor.",
              "Brace your core and keep your spine neutral (flat back, not rounded).",
              "Pull the dumbbell up toward your hip, leading with the elbow.",
              "Squeeze your shoulder blade at the top; keep the elbow close to your body.",
              "Lower the dumbbell slowly until the arm is straight again.",
              "Finish all reps, then switch sides."
            ],
            cues: [
              "Flat back like a tabletop.",
              "Pull to the hip, not the shoulder.",
              "Lead with the elbow and squeeze the back, not the arm."
            ],
            mistakes: [
              "Rounding or twisting the back.",
              "Yanking with the biceps instead of the back.",
              "Rotating the torso to heave the weight up."
            ],
            breathing: "Exhale as you row up, inhale as you lower.",
            safety: "Keep the neck in line with your spine (don't look up). Support your weight on the bench to protect the lower back."
          }
        },
        {
          id: "cable-band-row",
          name: "Cable / Band Row",
          image: "assets/exercises/cable-band-row.jpg",
          sets: "3 × 12",
          difficulty: "Easy",
          muscles: ["Mid-back", "Lats", "Biceps"],
          tutorial: "https://www.youtube.com/results?search_query=seated+cable+row+proper+form",
          form: {
            steps: [
              "Sit tall (or anchor a band at chest height and hold an end in each hand).",
              "Sit with a slight bend in the knees, chest up, arms extended forward.",
              "Brace your core and keep your torso still — no big lean back and forth.",
              "Pull the handle/band toward your belly, driving your elbows back past your ribs.",
              "Squeeze your shoulder blades together at the end of the pull.",
              "Slowly return your arms forward, feeling a stretch without slouching.",
              "Repeat with a smooth, controlled tempo."
            ],
            cues: [
              "Chest proud, shoulders down.",
              "Elbows drive back and stay close to the body.",
              "Squeeze the shoulder blades, then control the return."
            ],
            mistakes: [
              "Rocking the torso back to yank the weight.",
              "Shrugging the shoulders up toward the ears.",
              "Letting the shoulders round forward on the return."
            ],
            breathing: "Exhale as you pull, inhale as you return.",
            safety: "Keep a tall spine — avoid rounding your lower back at the front of the movement."
          }
        },
        {
          id: "reverse-fly",
          name: "Reverse Fly",
          image: "assets/exercises/reverse-fly.jpg",
          sets: "3 × 12",
          difficulty: "Medium",
          muscles: ["Rear delts", "Upper back"],
          tutorial: "https://www.youtube.com/results?search_query=reverse+dumbbell+fly",
          form: {
            steps: [
              "Hold a light dumbbell in each hand and hinge forward at the hips to about 45°.",
              "Let the dumbbells hang under your chest, palms facing each other, slight elbow bend.",
              "Keep your back flat and core braced.",
              "Raise both dumbbells out to the sides like opening wings, leading with the elbows.",
              "Lift until your arms are roughly level with your shoulders and squeeze the upper back.",
              "Lower slowly back to the start with control.",
              "Repeat, keeping the movement smooth and the weight light."
            ],
            cues: [
              "Think 'open the wings' — lead with the pinkies/elbows.",
              "Squeeze the shoulder blades at the top.",
              "Keep a soft, fixed elbow bend throughout."
            ],
            mistakes: [
              "Using momentum or swinging the torso.",
              "Going too heavy and turning it into a row.",
              "Shrugging the shoulders up at the top."
            ],
            breathing: "Exhale as you raise, inhale as you lower.",
            safety: "Keep your back flat and neck neutral in the hinge. Light weight here is the right weight."
          }
        },
        {
          id: "db-curl",
          name: "Dumbbell Curl",
          image: "assets/exercises/db-curl.jpg",
          sets: "3 × 12",
          difficulty: "Easy",
          muscles: ["Biceps"],
          tutorial: "https://www.youtube.com/results?search_query=dumbbell+bicep+curl",
          form: {
            steps: [
              "Stand tall with a dumbbell in each hand, arms at your sides, palms facing forward.",
              "Keep your elbows pinned to your sides and your chest up.",
              "Curl the dumbbells up toward your shoulders by bending the elbows.",
              "Squeeze the biceps at the top without swinging.",
              "Lower slowly until your arms are fully straight.",
              "Repeat with control, keeping the upper arms still."
            ],
            cues: [
              "Elbows glued to your sides.",
              "Curl with the arms, not by swinging the back.",
              "Full stretch at the bottom, full squeeze at the top."
            ],
            mistakes: [
              "Swinging the torso to heave the weight.",
              "Elbows drifting forward.",
              "Only doing half reps at the top."
            ],
            breathing: "Exhale as you curl up, inhale as you lower.",
            safety: "Don't lean back to lift heavier — keep the core braced and the spine tall."
          }
        },
        {
          id: "hammer-curl",
          name: "Hammer Curl",
          image: "assets/exercises/hammer-curl.jpg",
          sets: "3 × 12",
          difficulty: "Easy",
          muscles: ["Biceps", "Forearms"],
          tutorial: "https://www.youtube.com/results?search_query=hammer+curl",
          form: {
            steps: [
              "Stand tall holding a dumbbell in each hand with palms facing your thighs (neutral grip).",
              "Keep elbows tucked at your sides and shoulders relaxed.",
              "Curl the dumbbells up while keeping the palms facing inward the whole time.",
              "Squeeze at the top, keeping the wrists straight like holding a hammer.",
              "Lower under control to a full stretch.",
              "Repeat, keeping the neutral grip and still upper arms."
            ],
            cues: [
              "Palms stay facing each other throughout.",
              "Wrists firm and neutral — like swinging a hammer.",
              "Elbows fixed at your sides."
            ],
            mistakes: [
              "Rotating the wrists during the curl.",
              "Swinging the weights up with momentum.",
              "Letting the elbows travel forward."
            ],
            breathing: "Exhale as you curl up, inhale as you lower.",
            safety: "Keep a tall, braced posture; avoid leaning back to cheat the weight up."
          }
        },
        {
          id: "bird-dog",
          name: "Bird Dog",
          image: "assets/exercises/bird-dog.jpg",
          sets: "3 × 10",
          reps: "per side",
          difficulty: "Easy",
          muscles: ["Core", "Lower back", "Glutes"],
          tutorial: "https://www.youtube.com/results?search_query=bird+dog+exercise",
          form: {
            steps: [
              "Start on all fours: hands under shoulders, knees under hips.",
              "Set a flat back and brace your core; keep your neck long.",
              "Slowly extend your right arm forward and left leg back at the same time.",
              "Reach until both are in line with your body — no arching or twisting.",
              "Pause and hold briefly, keeping hips level.",
              "Return to the start with control and switch to the opposite arm/leg.",
              "Alternate sides for all reps."
            ],
            cues: [
              "Keep hips square to the floor — don't rotate.",
              "Reach long, don't lift high.",
              "Move slow and controlled, not fast."
            ],
            mistakes: [
              "Arching the lower back as the leg lifts.",
              "Rotating the hips or shoulders.",
              "Rushing and losing balance."
            ],
            breathing: "Exhale as you extend, inhale as you return.",
            safety: "This protects the spine — keep the back flat and the neck neutral. Balance a broomstick on your back to test if you stay level."
          }
        }
      ]
    },

    /* ========================= WEDNESDAY — LEGS • CORE ===================== */
    wed: {
      type: "workout",
      focus: "Legs • Core",
      muscles: ["Quads", "Hamstrings", "Glutes", "Calves", "Core"],
      note: "Leg day. Sit back into your hips, drive through your whole foot.",
      vibe: { label: "High-drive beats", link: "https://www.youtube.com/results?search_query=leg+day+workout+playlist" },
      exercises: [
        {
          id: "goblet-squat",
          name: "Goblet Squat",
          image: "assets/exercises/goblet-squat.jpg",
          sets: "3 × 12",
          difficulty: "Medium",
          muscles: ["Quads", "Glutes", "Core"],
          tutorial: "https://www.youtube.com/results?search_query=goblet+squat",
          form: {
            steps: [
              "Hold one dumbbell vertically against your chest, cupping the top end with both hands.",
              "Stand with feet shoulder-width apart, toes turned slightly out.",
              "Brace your core and keep your chest up and elbows pointing down.",
              "Sit back and down by bending the hips and knees together.",
              "Descend until your thighs are about parallel to the floor, knees tracking over your toes.",
              "Drive through your whole foot to stand back up, squeezing your glutes at the top.",
              "Repeat, keeping the dumbbell close to your chest throughout."
            ],
            cues: [
              "Chest tall, elbows inside the knees at the bottom.",
              "Knees track in line with your toes.",
              "Push the floor away through your heels and mid-foot."
            ],
            mistakes: [
              "Knees caving inward.",
              "Heels lifting or weight shifting onto the toes.",
              "Rounding the lower back at the bottom."
            ],
            breathing: "Inhale as you sit down, exhale as you drive up.",
            safety: "Keep your spine tall and core braced. Only go as deep as you can without your lower back rounding."
          }
        },
        {
          id: "walking-lunges",
          name: "Walking Lunges",
          image: "assets/exercises/walking-lunges.jpg",
          sets: "2 × 10",
          reps: "per leg",
          difficulty: "Medium",
          muscles: ["Quads", "Glutes", "Hamstrings"],
          tutorial: "https://www.youtube.com/results?search_query=walking+lunges",
          form: {
            steps: [
              "Stand tall, optionally holding a dumbbell in each hand at your sides.",
              "Step forward with one leg into a long stride.",
              "Lower straight down until both knees are bent about 90°; back knee hovers near the floor.",
              "Keep your torso upright and front knee over your ankle.",
              "Drive through your front heel to step the back foot forward into the next lunge.",
              "Continue walking forward, alternating legs, for all reps."
            ],
            cues: [
              "Torso stays upright and tall.",
              "Drop straight down, don't lunge the knee way past the toes.",
              "Push through the front heel to move forward."
            ],
            mistakes: [
              "Short steps that push the knee far past the toes.",
              "Leaning the torso forward.",
              "Letting the front knee cave inward."
            ],
            breathing: "Inhale as you step and lower, exhale as you drive up.",
            safety: "If balance is shaky, do them next to a wall. Keep the core braced to protect the lower back."
          }
        },
        {
          id: "step-ups",
          name: "Step-ups",
          image: "assets/exercises/step-ups.jpg",
          sets: "3 × 10",
          reps: "per leg",
          difficulty: "Easy",
          muscles: ["Quads", "Glutes"],
          tutorial: "https://www.youtube.com/results?search_query=step+ups+exercise",
          form: {
            steps: [
              "Stand facing a sturdy bench or step, dumbbells optional at your sides.",
              "Place your whole right foot flat on the step.",
              "Drive through the right heel to stand up tall on top of the step.",
              "Bring the left foot up to meet it, staying balanced.",
              "Step the left foot back down with control, followed by the right.",
              "Complete all reps leading with one leg, then switch."
            ],
            cues: [
              "Push through the heel of the top foot.",
              "Stand up tall — fully extend the hip at the top.",
              "Control the way down, don't drop."
            ],
            mistakes: [
              "Pushing off the bottom foot instead of the top leg.",
              "Letting the knee cave inward.",
              "Using a step so high your knee comes above your hip."
            ],
            breathing: "Exhale as you step up, inhale as you step down.",
            safety: "Use a stable surface and a height where your knee stays at or below hip level."
          }
        },
        {
          id: "romanian-db-deadlift",
          name: "Romanian Dumbbell Deadlift (Light)",
          image: "assets/exercises/romanian-db-deadlift.jpg",
          sets: "3 × 12",
          difficulty: "Medium",
          muscles: ["Hamstrings", "Glutes", "Lower back"],
          tutorial: "https://www.youtube.com/results?search_query=romanian+dumbbell+deadlift",
          form: {
            steps: [
              "Stand tall holding a light dumbbell in each hand in front of your thighs.",
              "Set a soft bend in the knees and keep them fixed there.",
              "Brace your core and set your shoulder blades back.",
              "Hinge at the hips, pushing your butt straight back as the dumbbells slide down your thighs.",
              "Lower until you feel a stretch in your hamstrings (usually around shin level), back flat.",
              "Drive your hips forward to stand tall, squeezing your glutes at the top.",
              "Repeat, keeping the dumbbells close to your legs the whole way."
            ],
            cues: [
              "Push the hips back, don't squat down.",
              "Keep a flat back — chest points at the floor as you hinge.",
              "Dumbbells stay close, almost brushing the legs."
            ],
            mistakes: [
              "Rounding the lower back (the biggest risk here).",
              "Turning it into a squat by bending the knees more.",
              "Going too heavy and losing the flat-back position."
            ],
            breathing: "Inhale as you hinge down, exhale as you stand up.",
            safety: "This one is all about a FLAT back. Keep the weight light, neck neutral, and stop the moment your back wants to round."
          }
        },
        {
          id: "calf-raise",
          name: "Calf Raise",
          image: "assets/exercises/calf-raise.jpg",
          sets: "3 × 15",
          difficulty: "Easy",
          muscles: ["Calves"],
          tutorial: "https://www.youtube.com/results?search_query=standing+calf+raise",
          form: {
            steps: [
              "Stand tall, optionally holding dumbbells, with the balls of your feet on a step and heels hanging off (or flat on the floor).",
              "Keep your legs straight but knees soft, core braced.",
              "Rise up onto your toes as high as you can, squeezing the calves.",
              "Pause briefly at the top.",
              "Lower your heels slowly, feeling a stretch at the bottom.",
              "Repeat with a smooth, full range of motion."
            ],
            cues: [
              "Full range — all the way up, all the way down.",
              "Pause and squeeze at the top.",
              "Keep your balance by standing near a wall if needed."
            ],
            mistakes: [
              "Bouncing quickly with a tiny range.",
              "Rolling onto the outer edges of the feet.",
              "Rushing the lowering phase."
            ],
            breathing: "Exhale as you rise, inhale as you lower.",
            safety: "Hold a wall or rack for balance. Control the stretch at the bottom — no sudden drops."
          }
        }
      ]
    },

    /* ====================== THURSDAY — SHOULDERS • ARMS ==================== */
    thu: {
      type: "workout",
      focus: "Shoulders • Arms",
      muscles: ["Shoulders", "Biceps", "Triceps"],
      note: "Keep shoulders down away from your ears. Light and clean on the raises.",
      vibe: { label: "Uplift & press", link: "https://www.youtube.com/results?search_query=shoulder+workout+playlist" },
      exercises: [
        {
          id: "seated-db-shoulder-press",
          name: "Seated Dumbbell Shoulder Press",
          image: "assets/exercises/seated-db-shoulder-press.jpg",
          sets: "3 × 10",
          difficulty: "Medium",
          muscles: ["Shoulders", "Triceps"],
          tutorial: "https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press",
          form: {
            steps: [
              "Sit on a bench with back support, a dumbbell in each hand.",
              "Bring the dumbbells to shoulder height, palms facing forward, elbows under the wrists.",
              "Brace your core and keep your back against the pad, ribs down.",
              "Press both dumbbells up and slightly together until arms are nearly straight.",
              "Lower under control back to shoulder height.",
              "Repeat, keeping the wrists stacked over the elbows."
            ],
            cues: [
              "Ribs down — don't arch the back to press.",
              "Wrists stacked straight over the elbows.",
              "Press up and slightly in, not flaring wide."
            ],
            mistakes: [
              "Arching the lower back off the pad.",
              "Letting elbows drift far forward or flare too wide.",
              "Clanging the dumbbells hard at the top."
            ],
            breathing: "Exhale as you press up, inhale as you lower.",
            safety: "Keep your back supported and neck neutral. If your back arches, lower the weight."
          }
        },
        {
          id: "lateral-raise",
          name: "Lateral Raise",
          image: "assets/exercises/lateral-raise.jpg",
          sets: "3 × 12",
          difficulty: "Easy",
          muscles: ["Side delts"],
          tutorial: "https://www.youtube.com/results?search_query=lateral+raise",
          form: {
            steps: [
              "Stand tall with a light dumbbell in each hand at your sides, slight elbow bend.",
              "Brace your core and keep your shoulders down.",
              "Raise both dumbbells out to the sides, leading with the elbows.",
              "Lift until your arms are about level with your shoulders — like pouring water from a jug.",
              "Pause briefly, then lower slowly back to your sides.",
              "Repeat with control; keep the weight light."
            ],
            cues: [
              "Lead with the elbows, not the hands.",
              "Stop at shoulder height, no higher.",
              "Shoulders stay down, away from the ears."
            ],
            mistakes: [
              "Swinging the weights up with momentum.",
              "Shrugging the traps to lift.",
              "Going too heavy and losing control."
            ],
            breathing: "Exhale as you raise, inhale as you lower.",
            safety: "Light weight only. If you feel it in your neck/traps instead of the side shoulder, lighten up and slow down."
          }
        },
        {
          id: "front-raise",
          name: "Front Raise",
          image: "assets/exercises/front-raise.jpg",
          sets: "2 × 12",
          difficulty: "Easy",
          muscles: ["Front delts"],
          tutorial: "https://www.youtube.com/results?search_query=front+raise",
          form: {
            steps: [
              "Stand tall holding a dumbbell in each hand in front of your thighs, palms facing you.",
              "Brace your core and keep a slight bend in the elbows.",
              "Raise one (or both) dumbbells straight out in front of you.",
              "Lift to about shoulder height, no higher.",
              "Lower slowly back to the thighs with control.",
              "Repeat, avoiding any swinging of the torso."
            ],
            cues: [
              "Stop at shoulder height.",
              "Keep the core tight — no leaning back.",
              "Smooth up, smooth down."
            ],
            mistakes: [
              "Leaning back to swing the weight up.",
              "Raising above shoulder height.",
              "Using momentum instead of control."
            ],
            breathing: "Exhale as you raise, inhale as you lower.",
            safety: "Don't arch your back to lift — brace the core and keep it strict with a light weight."
          }
        },
        {
          id: "rear-delt-fly",
          name: "Rear Delt Fly",
          image: "assets/exercises/rear-delt-fly.jpg",
          sets: "3 × 12",
          difficulty: "Medium",
          muscles: ["Rear delts", "Upper back"],
          tutorial: "https://www.youtube.com/results?search_query=rear+delt+fly",
          form: {
            steps: [
              "Hold a light dumbbell in each hand and hinge forward at the hips to about 45°.",
              "Let the dumbbells hang below your chest, palms facing each other, slight elbow bend.",
              "Keep your back flat and core braced.",
              "Raise the dumbbells out to the sides, leading with the elbows.",
              "Lift to about shoulder level and squeeze the rear shoulders and upper back.",
              "Lower slowly with control and repeat."
            ],
            cues: [
              "Open like wings — lead with the elbows.",
              "Squeeze the shoulder blades at the top.",
              "Flat back, neck neutral in the hinge."
            ],
            mistakes: [
              "Using momentum or standing up as you lift.",
              "Going too heavy and rowing the weight.",
              "Rounding the back in the hinge."
            ],
            breathing: "Exhale as you raise, inhale as you lower.",
            safety: "Keep the spine flat and the neck in line. This is a light, controlled movement."
          }
        },
        {
          id: "tricep-kickback",
          name: "Triceps Kickback",
          sets: "2 × 12",
          difficulty: "Easy",
          muscles: ["Triceps"],
          tutorial: "https://www.youtube.com/results?search_query=tricep+kickback",
          form: {
            steps: [
              "Hold a dumbbell in each hand and hinge forward at the hips to about 45°, back flat.",
              "Bring your upper arms up so they're parallel to your torso, elbows bent at 90°.",
              "Keep the upper arms pinned in place throughout.",
              "Straighten the elbows to press the dumbbells back behind you.",
              "Squeeze the triceps at full extension.",
              "Bend the elbows back to 90° with control and repeat."
            ],
            cues: [
              "Upper arms stay glued to your sides and still.",
              "Only the forearms move.",
              "Squeeze the triceps at the back of the movement."
            ],
            mistakes: [
              "Dropping the upper arm so the elbow swings.",
              "Using momentum instead of a clean extension.",
              "Rounding the back in the hinge."
            ],
            breathing: "Exhale as you extend back, inhale as you return.",
            safety: "Keep the back flat and neck neutral. Support your position and keep the weight light for a clean squeeze."
          }
        }
      ]
    },

    /* =========================== FRIDAY — FULL BODY ======================== */
    fri: {
      type: "workout",
      focus: "Full Body",
      muscles: ["Full body"],
      note: "Full-body finisher. Move well, keep rests short, finish strong.",
      vibe: { label: "Full-send finale", link: "https://www.youtube.com/results?search_query=full+body+workout+playlist" },
      exercises: [
        {
          id: "goblet-squat-fb",
          name: "Goblet Squat",
          sets: "12 reps",
          difficulty: "Medium",
          muscles: ["Quads", "Glutes", "Core"],
          tutorial: "https://www.youtube.com/results?search_query=goblet+squat",
          form: {
            steps: [
              "Hold one dumbbell vertically against your chest with both hands.",
              "Feet shoulder-width, toes slightly out, chest up.",
              "Sit back and down until thighs are about parallel, knees tracking over toes.",
              "Drive through your whole foot to stand and squeeze the glutes at the top.",
              "Repeat, keeping the dumbbell close to your chest."
            ],
            cues: [
              "Chest tall, elbows inside the knees at the bottom.",
              "Knees track over toes.",
              "Push through heels and mid-foot."
            ],
            mistakes: [
              "Knees caving in.",
              "Heels lifting.",
              "Lower back rounding at the bottom."
            ],
            breathing: "Inhale down, exhale up.",
            safety: "Brace the core and keep the spine tall; go only as deep as your back stays flat."
          }
        },
        {
          id: "push-up-fb",
          name: "Push-up",
          sets: "10 reps",
          difficulty: "Easy",
          muscles: ["Chest", "Triceps", "Core"],
          tutorial: "https://www.youtube.com/results?search_query=push+up+proper+form",
          form: {
            steps: [
              "High plank position: hands slightly wider than shoulders, body in a straight line.",
              "Brace the core and squeeze the glutes.",
              "Lower your chest toward the floor, elbows about 45° from the body.",
              "Press the floor away back to the top without sagging the hips.",
              "Repeat with a straight-line body each rep."
            ],
            cues: [
              "One straight plank from head to heels.",
              "Elbows back at ~45°.",
              "Full range — chest close to the floor."
            ],
            mistakes: [
              "Sagging or piking hips.",
              "Half reps.",
              "Head craning forward."
            ],
            breathing: "Inhale down, exhale up.",
            safety: "Neck long and neutral. Drop to knees if form slips."
          }
        },
        {
          id: "db-row-fb",
          name: "Dumbbell Row",
          sets: "12 reps",
          reps: "per side",
          difficulty: "Medium",
          muscles: ["Lats", "Upper back", "Biceps"],
          tutorial: "https://www.youtube.com/results?search_query=one+arm+dumbbell+row",
          form: {
            steps: [
              "Knee and hand on a bench, opposite foot on the floor, back flat and parallel to the ground.",
              "Let the dumbbell hang, arm straight, core braced.",
              "Pull the dumbbell to your hip, leading with the elbow.",
              "Squeeze the shoulder blade, then lower with control.",
              "Finish all reps, then switch sides."
            ],
            cues: [
              "Flat, tabletop back.",
              "Pull to the hip, elbow close.",
              "Squeeze the back, don't yank with the arm."
            ],
            mistakes: [
              "Rounding or twisting the back.",
              "Using momentum.",
              "Rotating the torso to lift."
            ],
            breathing: "Exhale as you row, inhale as you lower.",
            safety: "Support your weight on the bench and keep the neck in line with your spine."
          }
        },
        {
          id: "shoulder-press-fb",
          name: "Shoulder Press",
          sets: "10 reps",
          difficulty: "Medium",
          muscles: ["Shoulders", "Triceps"],
          tutorial: "https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press",
          form: {
            steps: [
              "Stand or sit tall with a dumbbell in each hand at shoulder height, palms forward.",
              "Brace the core and keep the ribs down.",
              "Press the dumbbells up and slightly together until arms are nearly straight.",
              "Lower with control back to shoulder height.",
              "Repeat, keeping wrists stacked over elbows."
            ],
            cues: [
              "Ribs down, core tight.",
              "Wrists over elbows.",
              "Press up and slightly in."
            ],
            mistakes: [
              "Arching the lower back.",
              "Flaring the elbows too wide.",
              "Bouncing at the top."
            ],
            breathing: "Exhale as you press, inhale as you lower.",
            safety: "If standing, don't lean back — brace hard and keep the spine tall. Lower the weight if the back arches."
          }
        },
        {
          id: "farmer-walk",
          name: "Farmer Walk",
          sets: "30s",
          difficulty: "Easy",
          muscles: ["Grip", "Core", "Traps", "Legs"],
          tutorial: "https://www.youtube.com/results?search_query=farmer+walk",
          form: {
            steps: [
              "Hold a heavy-ish dumbbell in each hand at your sides.",
              "Stand tall: chest up, shoulders back and down, core braced.",
              "Walk forward with controlled, steady steps.",
              "Keep the dumbbells from swinging and your torso upright.",
              "Walk for the target time, then set the weights down under control."
            ],
            cues: [
              "Walk tall and proud, shoulders back.",
              "Brace the core like a corset.",
              "Steady steps, minimal swaying."
            ],
            mistakes: [
              "Leaning to one side.",
              "Letting the shoulders round forward.",
              "Rushing with sloppy steps."
            ],
            breathing: "Breathe steadily throughout — don't hold your breath.",
            safety: "Keep a tall spine and neutral neck. Pick a weight you can carry with good posture the whole time."
          }
        },
        {
          id: "bicycle-crunch",
          name: "Bicycle Crunch",
          sets: "20 reps",
          difficulty: "Medium",
          muscles: ["Abs", "Obliques"],
          tutorial: "https://www.youtube.com/results?search_query=bicycle+crunch",
          form: {
            steps: [
              "Lie on your back, hands lightly behind your head, knees bent and lifted.",
              "Brace your core and press your lower back gently into the floor.",
              "Bring one knee toward your chest while rotating the opposite elbow toward it.",
              "Extend the other leg out straight without letting it drop to the floor.",
              "Switch sides in a smooth pedaling motion, rotating from the torso.",
              "Continue alternating for all reps."
            ],
            cues: [
              "Rotate from the ribs/torso, not by yanking the neck.",
              "Lower back stays pressed into the floor.",
              "Slow and controlled beats fast and sloppy."
            ],
            mistakes: [
              "Pulling on the head/neck with the hands.",
              "Letting the lower back arch off the floor.",
              "Rushing so the torso barely rotates."
            ],
            breathing: "Exhale as you crunch and rotate, inhale as you switch.",
            safety: "Hands only cradle the head — never pull the neck. If your lower back lifts, keep the legs higher."
          }
        }
      ]
    },

    /* ============================ WEEKENDS ================================= */
    // To add weekend workouts later: change type to "workout" and add
    // focus, muscles, note, vibe and an "exercises: [ ]" list (copy a weekday).
    sat: {
      type: "rest",
      title: "Rest & Recovery",
      message: "Muscles grow while you rest. Take it easy today — you've earned it.",
      suggestions: [
        "Gentle 20–30 min walk to stay active",
        "Light full-body stretching or mobility",
        "Hydrate well and aim for good sleep",
        "Foam roll any tight spots"
      ]
    },
    sun: {
      type: "rest",
      title: "Rest & Recovery",
      message: "Recharge for the week ahead. Recovery is part of the plan, not a break from it.",
      suggestions: [
        "Easy walk or leisure activity you enjoy",
        "Stretch tight areas from the week",
        "Prep meals and plan the week's sessions",
        "Prioritise rest and hydration"
      ]
    }
  },

  // Reserved for a future diet plan — the app shows a polished "coming soon".
  nutrition: {
    enabled: false,
    comingSoon: true,
    title: "Nutrition",
    message: "Your personalised diet plan is coming here soon."
  }
};
