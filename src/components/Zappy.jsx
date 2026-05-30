import { C } from '../tokens'

const SKIN_COLORS = {
  default:    C.primary,
  golden:     '#D97706',
  astronaut:  '#7C3AED',
}

export default function Zappy({ mood = 'happy', size = 80, skin = 'default' }) {
  const bodyColor = SKIN_COLORS[skin] || C.primary
  const eyeDefs = {
    happy: {
      le: [[37,47,12,'white'],[39,49,7,'#0F172A'],[42,45,3.5,'white',.9]],
      re: [[63,47,12,'white'],[65,49,7,'#0F172A'],[68,45,3.5,'white',.9]],
      mouth:'M 38 64 Q 50 76 62 64', lb:'M 28 39 Q 37 35 46 38', rb:'M 54 38 Q 63 35 72 39',
    },
    sad: {
      le: [[37,49,12,'white'],[37,51,7,'#0F172A'],[40,47,3.5,'white',.9]],
      re: [[63,49,12,'white'],[63,51,7,'#0F172A'],[66,47,3.5,'white',.9]],
      mouth:'M 38 72 Q 50 63 62 72', lb:'M 28 41 Q 37 45 46 41', rb:'M 54 41 Q 63 45 72 41',
    },
    cheer: {
      le: [[37,43,14,'white'],[39,45,9,'#0F172A'],[42,40,5,'white',.9]],
      re: [[63,43,14,'white'],[65,45,9,'#0F172A'],[68,40,5,'white',.9]],
      mouth:'M 33 63 Q 50 82 67 63', lb:'M 24 34 Q 37 29 48 34', rb:'M 52 34 Q 63 29 76 34',
    },
    think: {
      le: [[37,47,12,'white'],[39,49,7,'#0F172A'],[42,45,3.5,'white',.9]],
      re: null,
      mouth:'M 38 66 Q 52 70 60 63', lb:'M 28 39 Q 37 35 46 38', rb:'M 54 36 Q 63 39 72 36',
    },
    sleep: {
      le: null, re: null, mouth:'M 40 65 Q 50 68 60 65', lb: null, rb: null, zzz: true,
    },
  }
  const m = eyeDefs[mood] || eyeDefs.happy
  const cheer = mood === 'cheer'
  const sleep = mood === 'sleep'
  const eye = (arr) => arr ? arr.map(([cx,cy,r,fill,op=1],i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={op}/>) : null

  return (
    <svg viewBox="0 0 100 126" width={size} height={size*1.25} style={{overflow:'visible',display:'block'}}>
      <ellipse cx="50" cy="123" rx="28" ry="4" fill="#1E3A8A" opacity=".14"/>
      <path d="M 50 115 C 18 115 8 88 8 68 C 8 35 25 12 50 12 C 75 12 92 35 92 68 C 92 88 82 115 50 115Z" fill={bodyColor}/>
      <path d="M 34 16 C 25 25 19 40 19 56 C 19 56 15 37 27 23Z" fill="white" opacity=".12"/>
      <circle cx="20" cy="74" r="9" fill="#F97316" opacity=".3"/>
      <circle cx="80" cy="74" r="9" fill="#F97316" opacity=".3"/>
      {cheer ? (
        <>
          <path d="M 14 62 Q 3 40 9 22" stroke={C.primary} strokeWidth="11" strokeLinecap="round" fill="none"/>
          <circle cx="9" cy="19" r="8" fill={bodyColor}/>
          <path d="M 86 62 Q 97 40 91 22" stroke={C.primary} strokeWidth="11" strokeLinecap="round" fill="none"/>
          <circle cx="91" cy="19" r="8" fill={bodyColor}/>
        </>
      ) : (
        <>
          <path d="M 13 80 Q 2 86 6 96"  stroke={C.primary} strokeWidth="9" strokeLinecap="round" fill="none"/>
          <path d="M 87 80 Q 98 86 94 96" stroke={C.primary} strokeWidth="9" strokeLinecap="round" fill="none"/>
        </>
      )}
      {sleep ? (
        <>
          <ellipse cx="37" cy="47" rx="12" ry="7" fill="white"/>
          <path d="M 25 47 Q 37 43 49 47" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <ellipse cx="63" cy="47" rx="12" ry="7" fill="white"/>
          <path d="M 51 47 Q 63 43 75 47" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </>
      ) : mood === 'think' ? (
        <>
          {eye(m.le)}
          <ellipse cx="63" cy="49" rx="12" ry="8" fill="white"/>
          <circle cx="63" cy="50" r="5" fill="#0F172A"/>
        </>
      ) : (
        <>{eye(m.le)}{eye(m.re)}</>
      )}
      {m.lb && <path d={m.lb} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {m.rb && <path d={m.rb} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      <path d={m.mouth} stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {m.zzz && <>
        <text x="82" y="46" fontSize="10" fill={C.inkSoft} fontWeight="800">z</text>
        <text x="90" y="32" fontSize="15" fill={C.inkSoft} fontWeight="800">z</text>
      </>}
    </svg>
  )
}
