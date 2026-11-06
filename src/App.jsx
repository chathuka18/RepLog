import React, { useMemo, useState } from 'react'
import { useCloud, useCloudStored } from './Cloud.jsx'
import { Activity, ArrowDownToLine, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp, Dumbbell, Flame, Plus, RotateCcw, Scale, Trash2, TrendingUp, X, Play, Database, ExternalLink, LogOut, Cloud } from 'lucide-react'

const workouts = [
  { name: 'Upper A', label: 'Chest & Back', exercises: [
    ['bench','Barbell bench press','7.5 kg / side',7.5,'per side','3 × 8–12'],
    ['lat','Lat pulldown','27 kg',27,'total','3 × 8–12'],
    ['chest','Chest press machine','25 kg',25,'total','2 × 10–12'],
    ['row','Seated cable row','New exercise',null,'total','3 × 10–12'],
    ['upright','Cable upright row (wide grip)','Start light',null,'total','2 × 12–15'],
    ['triceps','Triceps pushdown','New exercise',null,'total','2 × 10–15'],
    ['curl','Barbell curl','15 kg',15,'total','2 × 10–12']
  ] },
  { name: 'Lower A', label: 'Legs & Abs', exercises: [
    ['legpress','Leg press','20 kg / side',20,'per side','3 × 10–12'],
    ['legcurl','Leg curl','20 kg',20,'total','3 × 10–12'],
    ['rdl','Dumbbell Romanian deadlift','New exercise',null,'each dumbbell','2 × 10–12'],
    ['calf','Seated calf raise','15 kg',15,'total','3 × 12–15'],
    ['floorcrunch','Floor reverse crunch','Bodyweight',null,'bodyweight','3 × 12–15']
  ] },
  { name: 'Upper B', label: 'Shoulders & Arms', exercises: [
    ['shoulder','Shoulder press','15 kg',15,'total','3 × 8–12'],
    ['lat','Lat pulldown','27 kg',27,'total','3 × 10–12'],
    ['chest','Chest press machine','25 kg',25,'total','3 × 8–12'],
    ['row','Seated cable row','New exercise',null,'total','3 × 10–12'],
    ['upright','Cable upright row (wide grip)','Start light',null,'total','2 × 12–15'],
    ['reverse','Cable reverse curl','15 kg',15,'total','2 × 10–12'],
    ['triceps','Triceps pushdown','New exercise',null,'total','2 × 10–15'],
    ['facepull','Cable face pull','New exercise',null,'total','3 × 12–15']
  ] },
  { name: 'Lower B', label: 'Legs & Core', exercises: [
    ['legpress','Leg press','20 kg / side',20,'per side','3 × 10–12'],
    ['rdl','Dumbbell Romanian deadlift','New exercise',null,'each dumbbell','3 × 8–12'],
    ['legcurl','Leg curl','20 kg',20,'total','3 × 10–12'],
    ['calf','Seated calf raise','15 kg',15,'total','3 × 12–15'],
    ['deadbug','Dead bug','Bodyweight',null,'bodyweight','3 × 10–12 / side'],
    ['plank','Plank','Bodyweight',null,'bodyweight','3 × 30–45 sec']
  ] }
]
const exerciseLibrary = {
  bench: {
    primary: ['Chest', 'Triceps'],
    secondary: ['Front delts', 'Serratus anterior', 'Core stabilizers'],
    cues: [
      'Lie on a flat bench with feet flat, glutes tight, and shoulder blades pulled back.',
      'Grip the bar slightly wider than shoulder width and lower it under control toward the chest.',
      'Press the bar up by driving through the chest and triceps without flaring elbows excessively.'
    ],
    mistakes: ['Bouncing the bar', 'Elbows flared too wide', 'Losing upper-back tightness'],
    sourceLabel: 'NASM exercise library',
    sourceUrl: 'https://www.nasm.org/resource-center/exercise-library/barbell-bench-press',
    videoLabel: 'NASM technique video',
    videoUrl: 'https://www.youtube.com/watch?v=CayG6UYqL8g',
    embedUrl: 'https://www.youtube-nocookie.com/embed/CayG6UYqL8g?rel=0'
  },
  lat: {
    primary: ['Lats'],
    secondary: ['Biceps', 'Rhomboids', 'Lower traps', 'Rear delts'],
    cues: [
      'Sit tall with thighs secured and grip the bar just wider than shoulder width.',
      'Pull the bar to your upper chest by driving elbows down and toward your sides.',
      'Control the return to full stretch without shrugging up or swinging backward.'
    ],
    mistakes: ['Pulling behind the neck', 'Leaning back too much', 'Using momentum'],
    sourceLabel: 'NASM biomechanics article',
    sourceUrl: 'https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form',
    videoLabel: 'Exercise guide',
    videoUrl: 'https://hellomytrainer.com/exercises/lat-pulldowns',
    embedUrl: ''
  },
  chest: {
    primary: ['Chest'],
    secondary: ['Triceps', 'Front delts'],
    cues: [
      'Adjust the seat so the handles start around mid-chest height.',
      'Keep shoulder blades lightly retracted and press the handles forward in a smooth path.',
      'Return slowly until you feel a controlled chest stretch without shoulders rolling forward.'
    ],
    mistakes: ['Seat too high or low', 'Locking elbows harshly', 'Shoulders rounding at the bottom'],
    sourceLabel: 'Movement pattern reference',
    sourceUrl: 'https://www.nasm.org/resource-center/exercise-library/barbell-bench-press',
    videoLabel: 'NASM video',
    videoUrl: 'https://www.youtube.com/watch?v=lRo9zZ7EwpM',
    embedUrl: ''
  },
  row: {
    primary: ['Lats', 'Mid traps', 'Rhomboids'],
    secondary: ['Rear delts', 'Biceps', 'Core'],
    cues: [
      'Sit upright with feet braced and take a neutral grip handle.',
      'Pull the handle toward your lower ribs or stomach while keeping elbows close to your body.',
      'Squeeze your shoulder blades together, then reach forward under control.'
    ],
    mistakes: ['Leaning back excessively', 'Shrugging shoulders', 'Jerking the weight'],
    sourceLabel: 'Gravitus seated cable row guide',
    sourceUrl: 'https://gravitus.com/guides/exercises/seated-row/',
    videoLabel: 'Technique article',
    videoUrl: 'https://whitecoattrainer.com/blog/row',
    embedUrl: ''
  },
  lateral: {
    primary: ['Side delts'],
    secondary: ['Front delts', 'Upper traps'],
    cues: [
      'Hold light dumbbells at your sides with a soft elbow bend.',
      'Raise your arms out to the sides until about shoulder height, leading with the elbows.',
      'Lower slowly and keep your shoulders down away from your ears.'
    ],
    mistakes: ['Swinging the torso', 'Shrugging up', 'Lifting above shoulder height'],
    sourceLabel: 'StrengthLog lateral raise guide',
    sourceUrl: 'https://www.strengthlog.com/dumbbell-lateral-raise/',
    videoLabel: 'Demonstration page',
    videoUrl: 'https://fitbodygh.com/exercises/dumbbell-lateral-raise',
    embedUrl: ''
  },
  triceps: {
    primary: ['Triceps'],
    secondary: ['Forearms'],
    cues: [
      'Stand tall with elbows pinned close to your sides.',
      'Press the handle or rope down by straightening the elbows only.',
      'Pause at the bottom, then return until forearms are just above parallel.'
    ],
    mistakes: ['Shoulders drifting forward', 'Using body swing', 'Elbows moving away from your sides'],
    sourceLabel: 'Training reference',
    sourceUrl: 'https://www.z-physiquewelcome.com/01-ex-push/',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=triceps+pushdown+proper+form',
    embedUrl: ''
  },
  curl: {
    primary: ['Biceps'],
    secondary: ['Brachialis', 'Forearms'],
    cues: [
      'Stand tall and keep your upper arms close to your torso.',
      'Curl the bar up by bending the elbows without leaning back.',
      'Lower under control until elbows are nearly straight.'
    ],
    mistakes: ['Swinging the hips', 'Partial range of motion', 'Letting elbows drift far forward'],
    sourceLabel: 'General technique reference',
    sourceUrl: 'https://www.youtube.com/results?search_query=barbell+curl+proper+form',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=barbell+curl+proper+form',
    embedUrl: ''
  },
  legpress: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Hamstrings', 'Adductors', 'Core stabilizers'],
    cues: [
      'Sit with your back fully supported and feet hip-width apart on the platform.',
      'Lower until knees are around 90 degrees or as deep as you can control.',
      'Drive through the full foot to press the platform up without slamming the knees locked.'
    ],
    mistakes: ['Knees caving inward', 'Lowering so far that the pelvis rounds', 'Locking the knees hard'],
    sourceLabel: 'NASM exercise library',
    sourceUrl: 'https://www.nasm.org/resource-center/exercise-library/leg-press',
    videoLabel: 'NASM technique video',
    videoUrl: 'https://www.youtube.com/watch?v=cDGOn-yfKJA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/cDGOn-yfKJA?rel=0'
  },
  legcurl: {
    primary: ['Hamstrings'],
    secondary: ['Calves'],
    cues: [
      'Align the knees with the machine pivot and brace against the pad.',
      'Curl the pad down by bending the knees while keeping the hips stable.',
      'Return slowly to a stretch without letting the weight stack crash.'
    ],
    mistakes: ['Hips lifting from the pad', 'Rushing the return', 'Poor machine setup'],
    sourceLabel: 'NASM + WeightTrainingGuide',
    sourceUrl: 'https://weighttraining.guide/exercises/seated-leg-curl/',
    videoLabel: 'NASM technique video',
    videoUrl: 'https://www.youtube.com/watch?v=_2Kd0d-JEUM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/_2Kd0d-JEUM?rel=0'
  },
  rdl: {
    primary: ['Hamstrings'],
    secondary: ['Glutes', 'Lower back', 'Forearm grip'],
    cues: [
      'Hold the weights close to your thighs and keep a soft bend in the knees.',
      'Push the hips back while keeping a long neutral spine and the weights close to the legs.',
      'Stop when your hamstrings are stretched, then stand up by driving the hips forward.'
    ],
    mistakes: ['Rounding the back', 'Turning it into a squat', 'Letting the weights drift forward'],
    sourceLabel: 'Arnoldek / Monash RDL guide',
    sourceUrl: 'https://arnoldek.com/en/exercises/romanian_deadlift',
    videoLabel: 'Technique search',
    videoUrl: 'https://www.youtube.com/watch?v=QFbZevA7dps',
    embedUrl: ''
  },
  calf: {
    primary: ['Calves'],
    secondary: ['Foot and ankle stabilizers'],
    cues: [
      'Place the balls of your feet on the platform and secure the pads comfortably.',
      'Lower the heels into a stretch, then rise up onto the balls of the feet.',
      'Pause briefly at the top and avoid bouncing.'
    ],
    mistakes: ['Short range of motion', 'Bouncing through reps', 'Feet slipping on the platform'],
    sourceLabel: 'General technique reference',
    sourceUrl: 'https://www.youtube.com/results?search_query=seated+calf+raise+proper+form',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=seated+calf+raise+proper+form',
    embedUrl: ''
  },
  crunch: {
    primary: ['Rectus abdominis'],
    secondary: ['Obliques', 'Hip stabilizers'],
    cues: [
      'Kneel below a high pulley and hold the rope near the sides of your head.',
      'Keep hips fairly still and curl your ribcage down toward your pelvis.',
      'Return slowly by uncurling the spine under control.'
    ],
    mistakes: ['Hip hinging instead of spinal flexion', 'Pulling with the arms', 'Using momentum'],
    sourceLabel: 'Cable kneeling crunch reference',
    sourceUrl: 'https://musclesworked.com/exercises/cable-cable-kneeling-crunch',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=kneeling+cable+crunch+proper+form',
    embedUrl: ''
  },
  shoulder: {
    primary: ['Front delts', 'Side delts'],
    secondary: ['Triceps', 'Upper chest', 'Traps'],
    cues: [
      'Set the handles around shoulder level and brace your core.',
      'Press the load overhead in a smooth path without over-arching the lower back.',
      'Lower to just below chin or shoulder level with control.'
    ],
    mistakes: ['Arching the lower back', 'Shrugging shoulders', 'Cutting range short'],
    sourceLabel: 'General technique reference',
    sourceUrl: 'https://www.youtube.com/results?search_query=machine+shoulder+press+proper+form',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=machine+shoulder+press+proper+form',
    embedUrl: ''
  },
  reverse: {
    primary: ['Brachioradialis', 'Brachialis'],
    secondary: ['Biceps', 'Forearm extensors'],
    cues: [
      'Use an overhand grip and keep wrists neutral.',
      'Curl the bar by bending the elbows while keeping the upper arms still.',
      'Lower slowly to full controlled extension.'
    ],
    mistakes: ['Bent wrists', 'Body swinging', 'Elbows drifting forward'],
    sourceLabel: 'General technique reference',
    sourceUrl: 'https://www.youtube.com/results?search_query=reverse+curl+proper+form',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=reverse+curl+proper+form',
    embedUrl: ''
  },
  pecdeck: {
    primary: ['Rear delts'],
    secondary: ['Mid traps', 'Rhomboids', 'Infraspinatus'],
    cues: [
      'Sit facing the pad with the handles aligned roughly with shoulder height.',
      'Open the arms out and back in a wide arc while keeping a soft elbow bend.',
      'Pause briefly at the back, then return under control.'
    ],
    mistakes: ['Shrugging up', 'Turning it into a row', 'Lifting the chest off the pad'],
    sourceLabel: 'Reverse pec deck guide',
    sourceUrl: 'https://overachiever.eu/exercises/reverse-pec-deck/',
    videoLabel: 'Form article',
    videoUrl: 'https://www.setforset.com/blogs/news/reverse-pec-deck-fly',
    embedUrl: ''
  },
  plank: {
    primary: ['Rectus abdominis', 'Obliques'],
    secondary: ['Glutes', 'Shoulders', 'Lower back'],
    cues: [
      'Set the elbows under the shoulders and extend the legs behind you.',
      'Brace the abs and glutes to form a straight line from shoulders to heels.',
      'Keep breathing while maintaining the shape without hips sagging or piking up.'
    ],
    mistakes: ['Sagging hips', 'Piking the hips', 'Holding the breath'],
    sourceLabel: 'NASM video reference',
    sourceUrl: 'https://www.youtube.com/watch?v=MDxfAuBbHHA',
    videoLabel: 'NASM technique video',
    videoUrl: 'https://www.youtube.com/watch?v=MDxfAuBbHHA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/MDxfAuBbHHA?rel=0'
  },
  knee: {
    primary: ['Lower abs / hip flexors'],
    secondary: ['Grip', 'Lats', 'Obliques'],
    cues: [
      'Hang with shoulders engaged and body as still as possible.',
      'Lift the knees toward your chest by curling the pelvis upward.',
      'Lower slowly without letting the body swing.'
    ],
    mistakes: ['Kipping and swinging', 'Only lifting halfway', 'Relaxing the shoulders'],
    sourceLabel: 'General technique reference',
    sourceUrl: 'https://www.youtube.com/results?search_query=hanging+knee+raise+proper+form',
    videoLabel: 'YouTube technique search',
    videoUrl: 'https://www.youtube.com/results?search_query=hanging+knee+raise+proper+form',
    embedUrl: ''
  }
}

exerciseLibrary.upright = {
  primary:['Side delts','Upper traps'], secondary:['Front delts','Forearms'],
  cues:['Use a light weight, take a grip wider than shoulder width and stand tall.','Draw elbows outward and upward only to a comfortable level, not higher than your shoulders.','Lower slowly without shrugging or swinging; stop if your shoulder feels pinched.'],
  mistakes:['Pulling elbows excessively high','Using too much weight','Pushing through shoulder pain'],
  sourceLabel:'Upright row technique overview',sourceUrl:'https://www.youtube.com/results?search_query=wide+grip+cable+upright+row+proper+form',
  videoLabel:'Watch upright row demonstrations',videoUrl:'https://www.youtube.com/results?search_query=wide+grip+cable+upright+row+proper+form'
}
exerciseLibrary.facepull = {
  primary:['Rear delts','Rhomboids'],secondary:['Middle traps','Infraspinatus','Biceps'],
  cues:['Set a rope attachment around eye level and stand with your core braced.','Pull the rope toward your face while bringing elbows outward and back.','Return under control without shrugging or letting the weight jerk you forward.'],
  mistakes:['Using an excessively heavy stack','Shrugging shoulders','Pulling toward the chest instead of the face'],
  sourceLabel:'NASM face pull guide',sourceUrl:'https://www.nasm.org/resource-center/exercise-library/face-pull',
  videoLabel:'NASM filmed demonstration',videoUrl:'https://www.youtube.com/watch?v=eTCBSFlCJ_s'
}
exerciseLibrary.floorcrunch = {
  primary:['Rectus abdominis'],secondary:['Obliques','Hip flexors'],
  cues:['Lie on your back and bring bent knees above the hips.','Curl your pelvis up by drawing your knees toward your ribs; the lower back lifts slightly.','Slowly lower the hips and keep control without kicking the legs.'],
  mistakes:['Swinging the legs','Using hip momentum instead of curling the pelvis','Raising the hips too aggressively'],
  sourceLabel:'NASM reverse-crunch movement reference',sourceUrl:'https://www.nasm.org/resource-center/exercise-library/reverse-crunch-to-knee-up-with-rotation',
  videoLabel:'Find floor reverse crunch demonstration',videoUrl:'https://www.youtube.com/results?search_query=floor+reverse+crunch+proper+form'
}
exerciseLibrary.deadbug = {
  primary:['Rectus abdominis','Transverse abdominis'],secondary:['Obliques','Hip stabilizers'],
  cues:['Lie on your back with arms toward the ceiling and hips and knees bent at 90 degrees.','Slowly extend opposite arm and leg while keeping your ribs down and lower back stable.','Bring both back and repeat on the other side without arching your spine.'],
  mistakes:['Arching lower back','Rushing through the motion','Holding your breath'],
  sourceLabel:'NASM dead bug guide',sourceUrl:'https://www.nasm.org/resource-center/exercise-library/dead-bug',
  videoLabel:'NASM filmed demonstration',videoUrl:'https://www.youtube.com/watch?v=bxn9FBrt4-A'
}

const exerciseVideos = {"plank": {"id":"mwlp75MS6Rg", "label":"NASM · Forearm plank"}, "reverse": {"id":"YrCCQIPkSHo", "label":"OriGym · Cable reverse curl"}, "shoulder": {"id":"xDnOlHT950k", "label":"QMotion · Machine shoulder press"}, "triceps": {"id":"w_viR9hVi4A", "label":"MuscleWiki · Triceps pushdown"}, "bench": {"id": "CayG6UYqL8g", "label": "NASM · Barbell bench press"}, "lat": {"id": "D8b3OVbRfwE", "label": "QMotion · Lat pulldown"}, "chest": {"id": "lRo9zZ7EwpM", "label": "NASM · Machine chest press"}, "row": {"id": "JdjJC6eIk44", "label": "Seated cable row · technique"}, "lateral": {"id": "XPPfnSEATJA", "label": "NASM · Dumbbell lateral raise"}, "curl": {"id": "pQfJR-sSIvA", "label": "NASM · Barbell curl"}, "legpress": {"id": "cDGOn-yfKJA", "label": "NASM · Leg press"}, "legcurl": {"id": "_2Kd0d-JEUM", "label": "NASM · Seated leg curl"}, "rdl": {"id": "QFbZevA7dps", "label": "NASM · Dumbbell Romanian deadlift"}, "calf": {"id": "FEewFamWj4E", "label": "Seated calf raise · machine"}, "crunch": {"id": "2-qTH6z6j28", "label": "Kneeling cable crunch · technique"}, "pecdeck": {"id": "LzsSQzHFuLU", "label": "Reverse pec deck · technique"}, "knee": {"id": "l7OroezzX9k", "label": "Runna · Hanging knee raise"}}
Object.assign(exerciseVideos,{facepull:{id:'eTCBSFlCJ_s',label:'NASM · Cable face pull'},deadbug:{id:'bxn9FBrt4-A',label:'NASM · Dead bug'},floorcrunch:{id:'tuTC6pE2l9c',label:'Group HIIT · Floor reverse crunch'}})

const exerciseVideoPages = {"triceps": {"url": "https://hla.au/exercise-videos/tricep-push-down-tutorial", "label": "Exercise physiologist · triceps pushdown"}, "shoulder": {"url": "https://www.muscleandstrength.com/exercises/machine-shoulder-press", "label": "Machine shoulder press · demonstration"}, "reverse": {"url": "https://russhowepti.com/exercises/cable-reverse-curl/", "label": "Cable reverse curl · video guide"}, "plank": {"url": "https://www.nasm.org/resource-center/exercise-library/plank", "label": "NASM · Forearm plank demonstration"}}

function ExerciseMedia({id}) {
  const [open, setOpen] = React.useState(false)
  const video = exerciseVideos[id]
  const page = exerciseVideoPages[id]
  if (video) return <div className="exercise-video-shell">
    {open ? <div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`} title={video.label} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : <button className="video-poster" onClick={()=>setOpen(true)} aria-label={`Play ${video.label}`}><img alt="Video demonstration thumbnail" src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} loading="lazy"/><span className="video-play"><Play size={30} fill="currentColor"/></span><span className="video-credit">{video.label}</span></button>}
    <div className="video-meta"><span><Play size={13}/> Filmed technique demonstration</span><a target="_blank" rel="noreferrer" href={`https://www.youtube.com/watch?v=${video.id}`}><ExternalLink size={14}/> Open on YouTube</a></div>
  </div>
  return <div className="exercise-video-shell"><div className="fallback-media"><div className="fallback-icon"><Play size={26}/></div><div><strong>Watch a real exercise demonstration</strong><p>This movement has a dedicated external video guide. Open it for the filmed example—no generic placeholder animation.</p><a className="watch-external" target="_blank" rel="noreferrer" href={page?.url||exerciseLibrary[id]?.videoUrl}><Play size={16} fill="currentColor"/> {page?.label||'Watch video guide'} <ExternalLink size={14}/></a></div></div></div>
}

const exerciseMuscleRegions = {
  bench:{primary:['chest','triceps'],secondary:['frontDelts','core']},
  lat:{primary:['lats'],secondary:['biceps','traps','rearDelts']},
  chest:{primary:['chest'],secondary:['triceps','frontDelts']},
  row:{primary:['lats','traps'],secondary:['rearDelts','biceps']},
  lateral:{primary:['sideDelts'],secondary:['frontDelts','traps']},
  triceps:{primary:['triceps'],secondary:['forearms']},
  curl:{primary:['biceps'],secondary:['forearms']},
  legpress:{primary:['quads','glutes'],secondary:['hamstrings','core']},
  legcurl:{primary:['hamstrings'],secondary:['calves']},
  rdl:{primary:['hamstrings','glutes'],secondary:['lowerBack','forearms']},
  calf:{primary:['calves'],secondary:[]},
  crunch:{primary:['core'],secondary:['obliques']},
  shoulder:{primary:['frontDelts','sideDelts'],secondary:['triceps','traps']},
  reverse:{primary:['forearms','biceps'],secondary:[]},
  pecdeck:{primary:['rearDelts'],secondary:['traps']},
  plank:{primary:['core','obliques'],secondary:['glutes','frontDelts']},
  knee:{primary:['core','hipFlexors'],secondary:['obliques','forearms']}
}

Object.assign(exerciseMuscleRegions,{upright:{primary:['sideDelts','traps'],secondary:['frontDelts','forearms']},facepull:{primary:['rearDelts','traps'],secondary:['biceps']},floorcrunch:{primary:['core'],secondary:['obliques','hipFlexors']},deadbug:{primary:['core'],secondary:['obliques','hipFlexors']}})

const frontRegions = [
 ['frontDelts','M47 57 L64 63 L59 82 L45 79 Z M116 63 L133 57 L136 79 L122 82 Z'],
 ['sideDelts','M45 59 Q35 62 34 83 L48 91 L52 70 Z M135 59 Q145 62 146 83 L132 91 L128 70 Z'],
 ['chest','M62 66 Q76 64 89 71 L89 96 L61 92 Z M91 71 Q104 64 118 66 L119 92 L91 96 Z'],
 ['biceps','M37 89 L49 93 L45 116 L33 113 Z M131 93 L143 89 L147 113 L135 116 Z'],
 ['triceps','M32 93 L37 89 L33 113 L30 120 Z M143 89 L148 93 L150 120 L147 113 Z'],
 ['forearms','M30 118 L44 122 L38 147 L25 143 Z M136 122 L150 118 L155 143 L142 147 Z'],
 ['core','M63 101 L117 101 L111 137 L69 137 Z'],
 ['obliques','M59 98 L66 101 L69 137 L61 132 Z M114 101 L121 98 L119 132 L111 137 Z'],
 ['hipFlexors','M65 139 L90 137 L88 157 L72 158 Z M90 137 L115 139 L108 158 L92 157 Z'],
 ['quads','M70 160 L88 158 L84 224 L66 224 Z M92 158 L110 160 L114 224 L96 224 Z'],
 ['calves','M67 230 L83 230 L80 272 L64 272 Z M97 230 L113 230 L116 272 L100 272 Z'],
]
const backRegions = [
 ['rearDelts','M46 60 L64 66 L58 84 L43 81 Z M116 66 L134 60 L137 81 L122 84 Z'],
 ['traps','M67 59 L90 66 L113 59 L121 79 L90 94 L59 79 Z'],
 ['lats','M60 85 L90 96 L83 131 L65 135 Z M90 96 L120 85 L115 135 L97 131 Z'],
 ['triceps','M34 89 L47 95 L43 119 L31 114 Z M133 95 L146 89 L149 114 L137 119 Z'],
 ['forearms','M29 119 L43 124 L37 146 L23 143 Z M137 124 L151 119 L157 143 L143 146 Z'],
 ['lowerBack','M83 112 L97 112 L107 139 L73 139 Z'],
 ['glutes','M66 142 L90 140 L89 171 L67 173 Z M90 140 L114 142 L113 173 L91 171 Z'],
 ['hamstrings','M68 177 L87 176 L83 225 L65 225 Z M93 176 L112 177 L115 225 L97 225 Z'],
 ['calves','M65 233 L83 233 L80 273 L63 273 Z M97 233 L115 233 L117 273 L100 273 Z'],
]
function MuscleFigure({view, regions}) {
  const parts = view === 'front' ? frontRegions : backRegions
  const level = (name) => regions.primary.includes(name) ? 'muscle-hot' : regions.secondary.includes(name) ? 'muscle-warm' : 'muscle-muted'
  return <div className="muscle-body"><span className="muscle-view">{view === 'front' ? 'FRONT' : 'BACK'}</span><svg viewBox="0 0 180 300" role="img" aria-label={`${view} body with muscle areas highlighted`}>
    <circle cx="90" cy="25" r="19" className="body-base"/>
    <path className="body-base" d="M78 43 L102 43 L105 52 L132 59 Q148 63 151 84 L160 139 Q162 151 150 153 L143 147 L136 112 L125 91 L120 147 L115 173 L117 223 L116 279 Q110 291 99 281 L94 233 L90 181 L86 233 L81 281 Q70 291 64 279 L63 223 L65 173 L60 147 L55 91 L44 112 L37 147 L30 153 Q18 151 20 139 L29 84 Q32 63 48 59 L75 52 Z"/>
    {parts.map(([name,path])=><path key={name} d={path} className={`muscle-region ${level(name)}`}/>)}
    <path d="M90 66 L90 136" className="body-detail"/>
  </svg></div>
}
function MuscleMap({id}) {
  const regions = exerciseMuscleRegions[id] || {primary:[],secondary:[]}
  return <section className="muscle-map-section"><div className="muscle-section-title"><h3>Muscles worked</h3><span>Illustrative muscle map</span></div><div className="muscle-map"><MuscleFigure view="front" regions={regions}/><MuscleFigure view="back" regions={regions}/></div><div className="muscle-legend"><span><i className="legend-primary"/>Primary</span><span><i className="legend-secondary"/>Supporting</span><span><i className="legend-neutral"/>Other muscles</span></div></section>
}
const allExercises = Array.from(new Map(workouts.flatMap(w => w.exercises).map(e => [e[0], { id:e[0], name:e[1], initial:e[3], unit:e[4] }])).values())
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const parseDate = key => new Date(`${key}T12:00:00`)
const prettyDate = key => parseDate(key).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
const useStored = useCloudStored
const today = localDate()
const monthTitle = d => d.toLocaleDateString('en-US', { month:'long', year:'numeric' })
function App() {
  const cloud = useCloud()
  const [tab,setTab] = useState('dashboard')
  const [logs,setLogs] = useStored('replog_workouts_v1', {})
  const [history,setHistory] = useStored('replog_weights_v1', {})
  const [month,setMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selected,setSelected] = useState(today)
  const [type,setType] = useState('Upper A')
  const [weightId,setWeightId] = useState('bench')
  const [weight,setWeight] = useState('')
  const [weightDate,setWeightDate] = useState(today)
  const [note,setNote] = useState('')
  const [weightError,setWeightError] = useState('')
  const [confirmReset,setConfirmReset] = useState(false)
  const [bodyWeight,setBodyWeight] = useStored('replog_body_v1', [])
  const [bodyInput,setBodyInput] = useState('')
  const [bodyDate,setBodyDate] = useState(today)
  const [completed,setCompleted] = useStored('replog_completed_v1', {})
  const [demo,setDemo] = useState(null)

  const selectedLog = logs[selected] || null
  const selectedWorkout = workouts.find(w=>w.name===type) || workouts[0]
  const checkedForDate = completed[selected]?.[type] || {}
  const checkedCount = selectedWorkout.exercises.filter(ex=>checkedForDate[ex[0]]).length
  const toggleExercise = id => setCompleted(prev=>({...prev,[selected]:{...(prev[selected]||{}),[type]:{...(prev[selected]?.[type]||{}),[id]:!prev[selected]?.[type]?.[id]}}}))
  const openDemo = id => setDemo(id)
  const prepareWeight = id => {setWeightId(id);setWeightDate(selected);setDemo(null);setTab('weights');window.scrollTo({top:0,behavior:'smooth'})}
  const entries = Object.entries(logs).filter(([,v]) => v.status === 'workout').sort((a,b) => b[0].localeCompare(a[0]))
  const currentMonthSessions = entries.filter(([date]) => date.startsWith(today.slice(0,7))).length
  const sevenDays = Array.from({length:7},(_,i)=>{const d=parseDate(today);d.setDate(d.getDate()-i);return localDate(d)})
  const weekCount = sevenDays.filter(d=>logs[d]?.status==='workout').length
  const weightEntries = history[weightId] || []
  const activeExercise = allExercises.find(x=>x.id===weightId)
  const mostRecentWeight = weightEntries[0]?.kg ?? activeExercise?.initial
  const allRecords = Object.values(history).reduce((sum,arr)=>sum+arr.length,0)
  const gymDays = entries.length
  const dateGrid = useMemo(()=>{
    const year=month.getFullYear(),m=month.getMonth()
    const blank = (new Date(year,m,1).getDay()+6)%7
    const days = new Date(year,m+1,0).getDate()
    return [...Array(blank).fill(null), ...Array.from({length:days},(_,i)=>localDate(new Date(year,m,i+1)))]
  },[month])
  const lastBody = [...bodyWeight].sort((a,b)=>b.date.localeCompare(a.date))[0]

  function logDate(status) {
    if(status === 'clear') setLogs(previous => {const copy={...previous}; delete copy[selected]; return copy})
    else setLogs(previous=>({...previous,[selected]:{status,type: status==='workout'?type:null}}))
  }
  function saveWeight(e) {
    e.preventDefault()
    const value=Number(weight)
    if(!weight.trim() || !Number.isFinite(value) || value < 0 || value > 1000){setWeightError('Enter a valid weight between 0 and 1000 kg.');return}
    const item={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,date:weightDate,kg:value}
    setHistory(previous=>({...previous,[weightId]:[item,...(previous[weightId]||[])].sort((a,b)=>b.date.localeCompare(a.date))}))
    setWeight('');setWeightError('')
  }
  function removeWeight(id) {setHistory(previous=>({...previous,[weightId]:(previous[weightId]||[]).filter(e=>e.id!==id)}))}
  function exportData(){
    const content=JSON.stringify({version:1,exportedAt:new Date().toISOString(),workouts:logs,weights:history,bodyWeight,completed},null,2)
    const blob = new Blob([content],{type:'application/json'})
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`replog-backup-${today}.json`;a.click();URL.revokeObjectURL(url)
  }
  function importData(e){
    const file=e.target.files?.[0];if(!file)return
    const reader=new FileReader()
    reader.onload=()=>{try {const data=JSON.parse(reader.result);if(!data || typeof data.workouts!=='object' || Array.isArray(data.workouts) || typeof data.weights!=='object' || Array.isArray(data.weights) || !Array.isArray(data.bodyWeight||[]))throw Error('Invalid backup'); if(!window.confirm('Replace your current data with this backup?'))return;setLogs(data.workouts);setHistory(data.weights);setBodyWeight(data.bodyWeight||[]);setCompleted(data.completed||{});alert('Backup imported successfully.')}catch{alert('Could not import this file. Please choose a RepLog backup JSON.')}}
    reader.readAsText(file);e.target.value=''
  }
  function saveBody(e){e.preventDefault();const v=Number(bodyInput);if(!bodyInput.trim()||!Number.isFinite(v)||v<=0||v>500)return;setBodyWeight(prev=>[...prev.filter(x=>x.date!==bodyDate),{date:bodyDate,kg:v}].sort((a,b)=>b.date.localeCompare(a.date)));setBodyInput('')}
  function goToCalendar(date){setSelected(date);setMonth(new Date(parseDate(date).getFullYear(),parseDate(date).getMonth(),1));setTab('calendar')}
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Dumbbell size={23}/></div><div><b>RepLog</b><span>YOUR GYM JOURNEY</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>
        {[['dashboard','Dashboard',Activity],['calendar','Workout Calendar',CalendarDays],['weights','Weight Tracker',TrendingUp],['routine','My Routine',Dumbbell]].map(([id,label,Icon])=><button key={id} className={`nav-item ${tab===id?'active':''}`} onClick={()=>setTab(id)}><Icon size={19}/>{label}</button>)}
      </nav>
      <div className="side-bottom"><div className="profile-pulse"><Flame size={17}/> CONSISTENCY WINS</div><p>Track your lifts. Build your habit. See your progress.</p></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="mobile-brand"><Dumbbell size={19}/> RepLog</div><span>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric',year:'numeric'})}</span><div className="status"><Cloud size={15}/><span>Firebase · {cloud.user.email}</span><button className="logout-button" title="Sign out" onClick={cloud.signOut}><LogOut size={16}/><span>Sign out</span></button></div></header>
      <div className="content">{cloud.error&&<div className="cloud-alert" role="alert">{cloud.error}</div>}
        {tab==='dashboard'&&<>
          <div className="welcome"><div><div className="eyebrow">YOUR PERSONAL FITNESS SPACE</div><h1>Build stronger, <span>one rep at a time.</span></h1><p>A simple place to track every session and every new personal best.</p></div><div className="welcome-icon"><Dumbbell size={43}/></div></div>
          <div className="stats">
            <div className="stat"><div className="stat-top"><span>Total workouts</span><div className="stat-icon violet"><Dumbbell size={18}/></div></div><strong>{gymDays}</strong><small>Sessions logged so far</small></div>
            <div className="stat"><div className="stat-top"><span>Last 7 days</span><div className="stat-icon green"><CalendarDays size={18}/></div></div><strong>{weekCount}<span className="stat-tail"> / 7</span></strong><small>Workout days</small></div>
            <div className="stat"><div className="stat-top"><span>This month</span><div className="stat-icon amber"><Flame size={18}/></div></div><strong>{currentMonthSessions}</strong><small>Sessions this month</small></div>
            <div className="stat"><div className="stat-top"><span>Weight records</span><div className="stat-icon blue"><TrendingUp size={18}/></div></div><strong>{allRecords}</strong><small>Weights recorded</small></div>
          </div>
          <div className="columns"><section className="panel"><div className="panel-head"><div><h2>Quick check-in</h2><p>Log your workout or rest day</p></div><button className="text-btn" onClick={()=>goToCalendar(today)}>Calendar <ArrowRight size={16}/></button></div><div className="today-tag">TODAY · {prettyDate(today)}</div><div className="choice-row"><button className="primary" onClick={()=>goToCalendar(today)}><Plus size={17}/> Log workout</button><button className="secondary" onClick={()=>{setSelected(today);setMonth(new Date());setLogs(prev=>({...prev,[today]:{status:'rest',type:null}}));setTab('calendar')}}><Check size={17}/> Mark rest day</button></div><div className="checkin-foot">{logs[today]?.status==='workout'?`✓ Logged: ${logs[today].type}`:logs[today]?.status==='rest'?'✓ Rest day recorded':'Nothing logged today yet'}</div></section>
          <section className="panel"><div className="panel-head"><div><h2>Current plan</h2><p>4 workouts • alternating with rest</p></div><button className="text-btn" onClick={()=>setTab('routine')}>View plan <ArrowRight size={16}/></button></div><div className="routine-mini">{workouts.map((w,i)=><div className="mini-row" key={w.name}><div className="routine-number">0{i+1}</div><div><b>{w.name}</b><small>{w.label}</small></div><span>{w.exercises.length} moves</span></div>)}</div></section></div>
          <div className="columns"><section className="panel"><div className="panel-head"><div><h2>Recent workouts</h2><p>Your latest completed sessions</p></div></div>{entries.length===0?<div className="empty"><CalendarDays size={27}/><p>No workouts yet. Log your first workout!</p></div>:entries.slice(0,5).map(([date,log])=><button className="recent" key={date} onClick={()=>goToCalendar(date)}><div className="recent-icon"><Dumbbell size={17}/></div><div><b>{log.type||'Workout'}</b><small>{prettyDate(date)}</small></div><ChevronRight size={17}/></button>)}</section>
          <section className="panel"><div className="panel-head"><div><h2>Body weight</h2><p>Track your own weight over time</p></div><div className="stat-icon blue"><Scale size={18}/></div></div><div className="body-reading">{lastBody?.kg??'72'}<span> kg</span></div><small className="muted">{lastBody?`Last logged: ${lastBody.date}`:'Starting reference: 72 kg (not logged yet)'}</small><form className="body-form" onSubmit={saveBody}><input aria-label="Body weight" type="number" placeholder="Weight in kg" step="0.1" min="0.1" max="500" value={bodyInput} onChange={e=>setBodyInput(e.target.value)} required/><input aria-label="Body weight date" type="date" value={bodyDate} onChange={e=>setBodyDate(e.target.value)} required/><button className="primary" type="submit">Save</button></form>{bodyWeight.length>0&&<div className="body-history">{bodyWeight.slice(0,3).map(x=><div key={x.date}><span>{x.date}</span><b>{x.kg} kg</b></div>)}</div>}</section></div>
        </>}
        {tab==='calendar'&&<><div className="heading"><div><div className="eyebrow">STAY CONSISTENT</div><h1>Workout calendar</h1><p>Choose a date to mark a workout, a rest day, or remove an entry.</p></div></div><div className="calendar-layout"><section className="panel calendar-panel"><div className="calendar-head"><h2>{monthTitle(month)}</h2><div className="month-actions"><button aria-label="Previous month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeft size={19}/></button><button onClick={()=>{setMonth(new Date(new Date().getFullYear(),new Date().getMonth(),1));setSelected(today)}}>Today</button><button aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRight size={19}/></button></div></div><div className="calendar-grid">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div className="weekday" key={d}>{d}</div>)}{dateGrid.map((date,i)=>date?<button key={date} className={`day ${date===today?'today':''} ${selected===date?'selected':''} ${logs[date]?.status==='workout'?'worked':''} ${logs[date]?.status==='rest'?'rested':''}`} onClick={()=>{setSelected(date);if(logs[date]?.type)setType(logs[date].type)}}><span>{Number(date.slice(8))}</span>{logs[date]?.status==='workout'?<span className="day-dot worked-dot"/>:logs[date]?.status==='rest'?<span className="day-dot rest-dot"/>:null}</button>:<div key={`empty-${i}`} className="day blank"/>)}</div><div className="calendar-legend"><span><i className="legend-workout"/> Workout</span><span><i className="legend-rest"/> Rest</span><span><i className="legend-today"/> Today</span></div></section>
        <section className="panel log-panel"><div className="panel-head"><div><h2>Log a day</h2><p>{prettyDate(selected)}</p></div><CalendarDays size={19} className="muted"/></div><div className={`day-status ${selectedLog?.status||''}`}>{selectedLog?.status==='workout'?<><Check size={18}/> Workout recorded: {selectedLog.type}</>:selectedLog?.status==='rest'?<><Check size={18}/> Rest day recorded</>:<>No activity logged</>}</div><label className="field-label" htmlFor="workout-type">Workout type</label><select id="workout-type" value={type} onChange={e=>setType(e.target.value)}>{workouts.map(w=><option key={w.name}>{w.name}</option>)}</select><button className="primary block" onClick={()=>logDate('workout')}><Dumbbell size={18}/> Save workout</button><button className="secondary block" onClick={()=>logDate('rest')}><Check size={18}/> Mark as rest day</button>{selectedLog&&<button className="danger-text" onClick={()=>logDate('clear')}><Trash2 size={16}/> Clear this day</button>}<div className="hint"><CircleHelp size={17}/><span>Select a session to preview its exercises. Check off moves as you go, watch a proper technique demonstration, and record your weights.</span></div></section></div>
        <section className="panel session-panel"><div className="session-heading"><div><div className="eyebrow">YOUR SESSION · {selected===today?'TODAY':selected}</div><h2>{type} <span>· {selectedWorkout.label}</span></h2><p>Tap an exercise for a demonstration or verified form guide, muscle map and tips.</p></div><div className="session-progress">{checkedCount}/{selectedWorkout.exercises.length} done</div></div><div className="progress-track"><div style={{width:`${100*checkedCount/selectedWorkout.exercises.length}%`}}/></div><div className="session-exercises">{selectedWorkout.exercises.map((ex,i)=><div key={ex[0]} className={`session-exercise ${checkedForDate[ex[0]]?'is-complete':''}`}><button className="session-check" aria-label={`Mark ${ex[1]} ${checkedForDate[ex[0]]?'incomplete':'complete'}`} onClick={()=>toggleExercise(ex[0])}>{checkedForDate[ex[0]]?<Check size={17}/>:<span/>}</button><button className="session-exercise-name" onClick={()=>openDemo(ex[0])}><strong>{ex[1]}</strong><small>{ex[5]} · {history[ex[0]]?.[0]?.kg??ex[3]??'—'} {history[ex[0]]?.[0]?.kg!=null||ex[3]!=null?'kg':''} {ex[4]==='per side'?'per side':ex[4]==='each dumbbell'?'each':''}</small></button><button className="watch-button" onClick={()=>openDemo(ex[0])}><Play size={14} fill="currentColor"/> Demo</button><button className="edit-weight" onClick={()=>prepareWeight(ex[0])} aria-label={`Record weight for ${ex[1]}`}><Plus size={18}/></button></div>)}</div></section></>}
        {tab==='weights'&&<><div className="heading"><div><div className="eyebrow">PROGRESSIVE OVERLOAD</div><h1>Weight tracker</h1><p>Record the weights you lift and see how your strength changes.</p></div></div><div className="weight-layout"><section className="panel"><div className="panel-head"><div><h2>Add weight record</h2><p>Record the load used for an exercise</p></div><div className="stat-icon violet"><Plus size={18}/></div></div><form onSubmit={saveWeight} className="weight-form"><label className="field-label" htmlFor="exercise">Exercise</label><select id="exercise" value={weightId} onChange={e=>{setWeightId(e.target.value);setWeightError('')}}>{allExercises.map(e=><option value={e.id} key={e.id}>{e.name}</option>)}</select><div className="baseline">{mostRecentWeight==null?'No weight recorded yet':`Last/starting weight: ${mostRecentWeight} kg`} <span>• {activeExercise?.unit}</span></div><label className="field-label" htmlFor="lift-weight">Weight (kg)</label><input id="lift-weight" type="number" min="0" max="1000" step="0.25" placeholder="e.g. 30" value={weight} onChange={e=>setWeight(e.target.value)} required/><div className="field-note">{activeExercise?.unit==='per side'?'Enter plates on one side, not total barbell + plates.':activeExercise?.unit==='each dumbbell'?'Enter the weight of a single dumbbell.':activeExercise?.unit==='bodyweight'?'Enter 0 for bodyweight only, or the added weight.':'Enter the load shown by the machine or barbell total.'}</div><label className="field-label" htmlFor="lift-date">Date</label><input id="lift-date" type="date" value={weightDate} onChange={e=>setWeightDate(e.target.value)} required/>{weightError&&<p className="error">{weightError}</p>}<button className="primary block" type="submit"><Plus size={17}/> Save weight</button></form></section><section className="panel"><div className="panel-head"><div><h2>{activeExercise?.name}</h2><p>Weight history · {activeExercise?.unit}</p></div><div className="stat-icon green"><TrendingUp size={18}/></div></div>{weightEntries.length>0?<><div className="latest"><span>Latest recorded</span><strong>{weightEntries[0].kg} <small>kg</small></strong></div><div className="history-list">{weightEntries.map(item=><div className="history-item" key={item.id}><div className="history-circle"><Dumbbell size={16}/></div><div><b>{item.kg} kg</b><small>{prettyDate(item.date)}</small></div><button title="Delete record" aria-label={`Delete ${item.kg} kg on ${item.date}`} onClick={()=>removeWeight(item.id)}><Trash2 size={16}/></button></div>)}</div></>:<div className="empty"><TrendingUp size={29}/><p>No entries for this exercise yet.<br/>Add your first record to begin.</p></div>}</section></div><section className="panel below"><div className="panel-head"><div><h2>All exercise weights</h2><p>At-a-glance record of your current lifts</p></div></div><div className="exercise-list">{allExercises.map(ex=><button className="exercise-item" key={ex.id} onClick={()=>{setWeightId(ex.id);window.scrollTo({top:0,behavior:'smooth'})}}><div><b>{ex.name}</b><small>{ex.unit}</small></div><strong>{history[ex.id]?.[0]?.kg??ex.initial??'—'} <span>{history[ex.id]?.[0]?.kg!=null||ex.initial!=null?'kg':''}</span></strong><ChevronRight size={16}/></button>)}</div></section></>}
        {tab==='routine'&&<><div className="heading"><div><div className="eyebrow">YOUR 4-DAY SPLIT</div><h1>My workout routine</h1><p>Upper A Monday, Lower A Tuesday, Upper B Thursday and Lower B Friday; allow recovery on other days.</p></div></div><div className="routine-banner"><Check size={18}/> <span>Mon Upper A → Tue Lower A → Wed Rest → Thu Upper B → Fri Lower B → Weekend recovery</span></div><div className="routine-cards">{workouts.map((w,i)=><section className="panel routine-card" key={w.name}><div className="panel-head"><div><div className="eyebrow">WORKOUT 0{i+1}</div><h2>{w.name}</h2><p>{w.label}</p></div><div className="stat-icon violet"><Dumbbell size={18}/></div></div>{w.exercises.map(ex=><div className="exercise-line" key={ex[0]}><div><b>{ex[1]}</b><small>{ex[2]}</small></div><span>{ex[5]}</span><button className="routine-demo" onClick={()=>openDemo(ex[0])} aria-label={`Watch ${ex[1]} demonstration`}><Play size={13}/> Demo</button></div>)}</section>)}</div><div className="hint standalone"><CircleHelp size={18}/><span>Use controlled form and choose weights that leave about 1–3 good reps in reserve. Log new weights whenever you increase your load.</span></div></>}
        <footer><span>RepLog · Your progress, your pace.</span><div><button onClick={exportData}><ArrowDownToLine size={15}/> Export backup</button><label className="import-label">Import backup<input type="file" accept="application/json,.json" onChange={importData}/></label><button className="footer-reset" onClick={()=>setConfirmReset(true)}><RotateCcw size={15}/> Reset data</button></div></footer>
      </div>
      <nav className="mobile-nav">{[['dashboard','Home',Activity],['calendar','Calendar',CalendarDays],['weights','Weights',TrendingUp],['routine','Routine',Dumbbell]].map(([id,label,Icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={21}/><span>{label}</span></button>)}</nav>
      {demo&&<div className="overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDemo(null)}}><div className="modal demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title"><button className="modal-close" onClick={()=>setDemo(null)} aria-label="Close exercise demo"><X size={21}/></button><div className="eyebrow">MOVEMENT GUIDE</div><h2 id="demo-title">{allExercises.find(x=>x.id===demo)?.name}</h2><ExerciseMedia key={demo} id={demo}/><p className="demo-disclaimer">Film demonstrations and anatomy guides are provided for learning. Technique and equipment can differ; ask your trainer to check your form.</p><MuscleMap id={demo}/><div className="muscle-groups"><div><span className="muscle-label">Primary muscles</span><div className="chip-row">{(exerciseLibrary[demo]?.primary||[]).map(item=><span className="chip primary" key={item}>{item}</span>)}</div></div><div><span className="muscle-label">Secondary muscles</span><div className="chip-row">{(exerciseLibrary[demo]?.secondary||[]).map(item=><span className="chip" key={item}>{item}</span>)}</div></div></div><div className="demo-steps">{(exerciseLibrary[demo]?.cues||[]).map((tip,i)=><div key={tip}><span>{i+1}</span><p>{tip}</p></div>)}</div><div className="mistakes-box"><h3>Common mistakes</h3><div className="chip-row">{(exerciseLibrary[demo]?.mistakes||[]).map(item=><span className="chip warn" key={item}>{item}</span>)}</div></div><div className="source-box"><Database size={16}/><div><strong>Source:</strong> <a href={exerciseLibrary[demo]?.sourceUrl} target="_blank" rel="noreferrer">{exerciseLibrary[demo]?.sourceLabel}</a></div></div><div className="demo-actions"><a className="secondary link-button" href={exerciseVideos[demo] ? `https://www.youtube.com/watch?v=${exerciseVideos[demo].id}` : exerciseLibrary[demo]?.videoUrl || exerciseLibrary[demo]?.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={15}/> {exerciseVideos[demo] ? 'Watch on YouTube' : exerciseLibrary[demo]?.videoLabel || 'Open guide'}</a><button className="primary" onClick={()=>prepareWeight(demo)}><Plus size={16}/> Record weight</button></div></div></div>}
      {confirmReset&&<div className="overlay" role="dialog" aria-modal="true" aria-labelledby="reset-title"><div className="modal"><button className="modal-close" onClick={()=>setConfirmReset(false)} aria-label="Close"><X size={20}/></button><h2 id="reset-title">Reset all your data?</h2><p>This will permanently delete workouts, weight records, and body-weight entries from this browser. Export a backup first if you need one.</p><div className="modal-actions"><button className="secondary" onClick={()=>setConfirmReset(false)}>Cancel</button><button className="danger" onClick={()=>{setLogs({});setHistory({});setBodyWeight([]);setCompleted({});setConfirmReset(false)}}>Yes, delete all data</button></div></div></div>}
    </main>
  </div>
}
export default App
