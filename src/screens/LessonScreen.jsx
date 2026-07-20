import { useState, useEffect, useRef } from 'react'
import { X, Check, GripVertical } from 'lucide-react'
import { C } from '../tokens'
import zappyFace from '../assets/zappy-face.png'
import Zappy from '../components/Zappy'
import { useZapfy } from '../context/ZapfyContext'
import { LESSONS } from '../data/lessons'
import Hearts from '../components/Hearts'
import { playCorrect, playWrong, playComboAccent } from '../lib/sound'
import { hapticSuccess, hapticError } from '../lib/haptic'
import { trackMission } from '../lib/missions'

function interpolate(text, company) {
  if (!text || !company) return text
  return text
    .replace(/\{companyName\}/g, company.name || 'sua empresa')
    .replace(/\{product\}/g, company.product || 'seu produto')
}

export default function LessonScreen({ onNav, lessonId }) {
  const { state, dispatch } = useZapfy()
  const lesson = LESSONS[lessonId] || LESSONS['m1-oportunidade']
  const exercises = lesson.exercises

  const [exIdx,      setExIdx]      = useState(0)
  const [feedback,   setFeedback]   = useState(null)
  const [selected,   setSelected]   = useState(null)
  const [shakeKey,   setShakeKey]   = useState(0)
  const [heartsLeft, setHeartsLeft] = useState(state.hearts)
  const [hasError,   setHasError]   = useState(false)

  // Sincroniza heartsLeft com state.hearts para capturar RESTORE_HEARTS comprado mid-lesson
  useEffect(() => { setHeartsLeft(state.hearts) }, [state.hearts])

  // match state
  const [ex2Left,    setEx2Left]    = useState(null)
  const [ex2Matched, setEx2Matched] = useState([])
  const [ex2Wrong,   setEx2Wrong]   = useState(null)

  // order state — arrastar e soltar (inserção, não troca)
  const [ex3Items,   setEx3Items]   = useState(null)
  const [ex3Drag,    setEx3Drag]    = useState(null) // { idx, startY, dy, insertAt, rects }
  const [ex3Ok,      setEx3Ok]      = useState(false)
  const ex3ListRef = useRef(null)

  // composite state
  const [ex6Step,    setEx6Step]    = useState(0)
  const [ex6Choices, setEx6Choices] = useState([])
  const [ex6Done,    setEx6Done]    = useState(false)

  // Combo — sequência de acertos seguidos (zera ao errar)
  const [combo, setCombo] = useState(0)
  useEffect(() => {
    if (feedback === 'correct') setCombo(c => c + 1)
    else if (feedback === 'wrong') setCombo(0)
  }, [feedback])
  useEffect(() => { if (combo >= 2) playComboAccent(combo) }, [combo])

  const cur = exercises[exIdx]
  const prog = (exIdx / exercises.length) * 100
  const canContinue = feedback !== null
  const company = state.company

  const interp = (text) => interpolate(text, company)

  const getOrderItems = () => {
    if (ex3Items) return ex3Items
    if (cur.type !== 'order') return []
    const items = cur.scrambled.map(i => cur.items[i])
    return items
  }
  const orderItems = getOrderItems()
  if (cur.type === 'order' && ex3Items === null && orderItems.length > 0) {
    setEx3Items(orderItems)
    return null
  }

  const wrong = () => {
    setHasError(true)
    setFeedback('wrong')
    setShakeKey(k => k + 1)
    setHeartsLeft(h => Math.max(0, h - 1))
    dispatch({ type: 'LOSE_HEART' })
    playWrong()
    hapticError()
  }

  const handleMCAnswer = (opt) => {
    if (feedback) return
    setSelected(opt)
    if (opt.ok) {
      setFeedback('correct')
      playCorrect()
      hapticSuccess()
      trackMission('correct', state.streak)
    } else {
      wrong()
    }
  }

  const handleEx2Left = (i) => {
    if (!ex2Matched.find(m => m.l === i)) setEx2Left(i)
  }
  const handleEx2Right = (i) => {
    if (ex2Left === null || ex2Matched.find(m => m.r === i)) return
    if (ex2Left === i) {
      const nm = [...ex2Matched, { l: ex2Left, r: i }]
      setEx2Matched(nm); setEx2Left(null); setEx2Wrong(null)
      if (nm.length === cur.pairs.length) { setFeedback('correct'); hapticSuccess(); trackMission('correct', state.streak) }
    } else {
      setEx2Wrong({ l: ex2Left, r: i }); setEx2Left(null)
      setTimeout(() => setEx2Wrong(null), 800)
    }
  }

  const handleEx3PointerDown = (e, idx) => {
    if (ex3Ok) return
    const list = ex3ListRef.current
    if (!list) return
    const rects = [...list.children].map(el => {
      const r = el.getBoundingClientRect()
      return { h: r.height, mid: r.top + r.height / 2 }
    })
    e.currentTarget.setPointerCapture(e.pointerId)
    setEx3Drag({ idx, startY: e.clientY, dy: 0, insertAt: idx, rects })
  }

  const handleEx3PointerMove = (e) => {
    if (!ex3Drag) return
    const dy = e.clientY - ex3Drag.startY
    const center = ex3Drag.rects[ex3Drag.idx].mid + dy
    let insertAt = 0
    ex3Drag.rects.forEach((r, j) => { if (j !== ex3Drag.idx && r.mid < center) insertAt++ })
    setEx3Drag(d => d ? { ...d, dy, insertAt } : d)
  }

  const handleEx3PointerUp = () => {
    if (!ex3Drag) return
    const { idx, insertAt, dy } = ex3Drag
    setEx3Drag(null)
    if (Math.abs(dy) < 6 || insertAt === idx) return
    const ni = [...ex3Items]
    const [moved] = ni.splice(idx, 1)
    ni.splice(insertAt, 0, moved)
    setEx3Items(ni)
    const correctOrder = cur.items.map(i => i.id)
    if (ni.map(i => i.id).join(',') === correctOrder.join(',')) {
      setEx3Ok(true); setFeedback('correct'); hapticSuccess(); trackMission('correct', state.streak)
    }
  }

  // Deslocamento visual dos itens não arrastados enquanto o drag abre espaço
  const ex3Shift = (idx) => {
    if (!ex3Drag || idx === ex3Drag.idx) return 0
    const { idx: di, insertAt, rects } = ex3Drag
    const slot = rects[di].h + 8 // altura do item + gap-2
    if (di < idx && insertAt >= idx) return -slot
    if (di > idx && insertAt <= idx) return slot
    return 0
  }

  const handleEx6Choice = (val) => {
    const nc = [...ex6Choices, val]
    setEx6Choices(nc)
    if (ex6Step < cur.steps.length - 2) { setEx6Step(s => s + 1) }
    else {
      setEx6Done(true)
      setFeedback('correct')
      hapticSuccess()
      trackMission('correct', state.streak)
      dispatch({ type: 'SAVE_LESSON_CHOICES', lessonId, choices: nc })
    }
  }

  const handleContinue = () => {
    setFeedback(null); setSelected(null)
    setEx2Left(null); setEx2Matched([]); setEx2Wrong(null)
    setEx3Items(null); setEx3Drag(null); setEx3Ok(false)
    setEx6Step(0); setEx6Choices([]); setEx6Done(false)
    if (exIdx < exercises.length - 1) {
      setExIdx(i => i + 1)
    } else {
      trackMission('lessons', state.streak)
      onNav('lessonResult', { perfect: !hasError })
    }
  }

  const fb = (type) => type === 'correct'
    ? { border: C.success, bg: '#F0FDF4', text: C.successDk }
    : { border: C.danger,  bg: '#FEF2F2', text: '#991B1B' }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      {/* Topbar */}
      <div className="flex items-center gap-3 px-4 pb-2" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <button onClick={() => onNav('pathway')} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100">
          <X size={22} color={C.inkSoft} />
        </button>
        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(5, prog)}%`, background: C.primary }} />
        </div>
        <Hearts count={heartsLeft} />
      </div>
      <div className="px-4 pt-1">
        <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: C.inkSoft }}>
          Exercício {exIdx + 1} de {exercises.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-3 pb-2 overflow-auto" key={exIdx}>
        {cur.hint && (
          <div className="flex items-start gap-3 mb-4 slide-up">
            <img src={zappyFace} alt="Zappy" width={36}
              className="flex-shrink-0 mt-0.5"
              style={{ filter: 'drop-shadow(0 0 6px rgba(77,127,255,.35))' }} />
            <div className="flex-1 rounded-2xl rounded-tl-sm px-3 py-2.5"
              style={{ background: `${C.primary}10`, border: `1.5px solid ${C.primary}25` }}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.primary }}>Zappy</p>
              <p className="text-sm font-semibold leading-snug" style={{ color: C.ink }}>{cur.hint}</p>
            </div>
          </div>
        )}
        <p className="text-xl font-extrabold mb-5 leading-snug" style={{ color: C.ink }}>{interp(cur.q)}</p>

        {/* Multiple choice */}
        {cur.type === 'mc' && (
          <div className={`flex flex-col gap-3 ${shakeKey > 0 && feedback === 'wrong' ? 'shake' : ''}`} key={shakeKey}>
            {cur.opts.map((opt, i) => {
              const isSel   = selected === opt
              const correct = feedback === 'correct' && isSel
              const isWrong = feedback === 'wrong'   && isSel
              return (
                <button key={i} onClick={() => handleMCAnswer(opt)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left ${correct ? 'correct-burst' : ''}`}
                  style={{
                    borderColor: correct ? C.success : isWrong ? C.danger : C.border,
                    background:  correct ? '#F0FDF4'  : isWrong ? '#FEF2F2' : C.card,
                    transition:  'border-color .15s, background .15s',
                    transform:   isSel && !feedback ? 'scale(.985)' : 'scale(1)',
                  }}>
                  <span className="text-2xl">{opt.e}</span>
                  <span className="font-bold text-sm flex-1 leading-tight" style={{ color: C.ink }}>{interp(opt.t)}</span>
                  {isSel && feedback && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 pop-in"
                      style={{ background: feedback === 'correct' ? C.success : C.danger }}>
                      {feedback === 'correct' ? <Check size={14} color="white" strokeWidth={3} /> : <X size={14} color="white" strokeWidth={3} />}
                    </div>
                  )}
                </button>
              )
            })}
            {feedback && (
              <div className="p-4 rounded-2xl border-2 slide-up flex items-start gap-3"
                style={{ borderColor: fb(feedback).border, background: fb(feedback).bg }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 pop-in"
                  style={{ background: feedback === 'correct' ? C.success : C.danger }}>
                  {feedback === 'correct'
                    ? <Check size={15} color="white" strokeWidth={3} />
                    : <X     size={15} color="white" strokeWidth={3} />}
                </div>
                <p className="text-sm font-bold pt-0.5" style={{ color: fb(feedback).text }}>
                  {feedback === 'correct' ? interp(cur.cf) : interp(cur.wf)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Matching */}
        {cur.type === 'match' && (
          <>
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: C.inkSoft }}>Problema</p>
                {cur.pairs.map((p, i) => {
                  const matched = ex2Matched.find(m => m.l === i)
                  const selLeft = ex2Left === i
                  const isWrng  = ex2Wrong?.l === i
                  return (
                    <button key={i} onClick={() => !matched && handleEx2Left(i)}
                      className="p-3 rounded-2xl border-2 text-left text-xs font-bold leading-tight transition-all"
                      style={{ color: C.ink, borderColor: matched ? C.success : selLeft ? C.primary : isWrng ? C.danger : C.border, background: matched ? `${C.success}24` : selLeft ? `${C.primary}1F` : isWrng ? `${C.danger}24` : C.card }}>
                      {p.left}
                    </button>
                  )
                })}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: C.inkSoft }}>Oportunidade</p>
                {cur.pairs.map((p, i) => {
                  const matched = ex2Matched.find(m => m.r === i)
                  const isWrng  = ex2Wrong?.r === i
                  return (
                    <button key={i} onClick={() => !matched && handleEx2Right(i)}
                      className="p-3 rounded-2xl border-2 text-left text-xs font-bold leading-tight transition-all"
                      style={{ color: C.ink, borderColor: matched ? C.success : isWrng ? C.danger : ex2Left !== null ? C.primary : C.border, background: matched ? `${C.success}24` : isWrng ? `${C.danger}24` : ex2Left !== null ? `${C.primary}14` : C.card }}>
                      {p.right}
                    </button>
                  )
                })}
              </div>
            </div>
            {feedback && (
              <div className="mt-4 p-4 rounded-2xl border-2 slide-up" style={{ borderColor: C.success, background: '#F0FDF4' }}>
                <p className="text-sm font-bold" style={{ color: C.successDk }}>{cur.cf}</p>
              </div>
            )}
          </>
        )}

        {/* Reorder — arrastar e soltar */}
        {cur.type === 'order' && ex3Items && (
          <>
            <p className="text-xs font-semibold mb-3" style={{ color: C.inkSoft }}>
              ✋ Arraste os itens para a ordem certa
            </p>
            <div ref={ex3ListRef} className="flex flex-col gap-2">
              {ex3Items.map((item, idx) => {
                const dragging = ex3Drag?.idx === idx
                return (
                  <div key={item.id}
                    onPointerDown={(e) => handleEx3PointerDown(e, idx)}
                    onPointerMove={handleEx3PointerMove}
                    onPointerUp={handleEx3PointerUp}
                    onPointerCancel={() => setEx3Drag(null)}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 text-left font-bold text-sm"
                    style={{
                      borderColor: ex3Ok ? C.success : dragging ? C.primary : C.border,
                      background: ex3Ok ? '#F0FDF4' : dragging ? `${C.primary}12` : C.card,
                      touchAction: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      cursor: ex3Ok ? 'default' : dragging ? 'grabbing' : 'grab',
                      transform: dragging
                        ? `translateY(${ex3Drag.dy}px) scale(1.03)`
                        : `translateY(${ex3Shift(idx)}px)`,
                      transition: dragging ? 'none' : 'transform 150ms ease',
                      zIndex: dragging ? 10 : 1,
                      position: 'relative',
                      boxShadow: dragging ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                    }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center font-extrabold flex-shrink-0"
                      style={{ background: dragging ? C.primary : C.bg, color: dragging ? 'white' : C.inkSoft }}>
                      {idx + 1}
                    </div>
                    <span className="flex-1" style={{ color: C.ink }}>{item.text}</span>
                    {!ex3Ok && <GripVertical size={18} style={{ color: C.inkSoft, flexShrink: 0 }} />}
                  </div>
                )
              })}
            </div>
            {feedback && (
              <div className="mt-4 p-4 rounded-2xl border-2 slide-up" style={{ borderColor: C.success, background: '#F0FDF4' }}>
                <p className="text-sm font-bold" style={{ color: C.successDk }}>{cur.cf}</p>
              </div>
            )}
          </>
        )}

        {/* Composite */}
        {cur.type === 'composite' && !ex6Done && (
          <>
            <div className="flex gap-2 mb-4">
              {cur.steps.map((_, i) => (
                <div key={i} className="flex-1">
                  <div className="h-1.5 rounded-full" style={{ background: i <= ex6Step ? C.primary : C.border }} />
                  <p className="text-[10px] font-bold mt-0.5 text-center" style={{ color: i === ex6Step ? C.primary : C.inkSoft }}>{i + 1}</p>
                </div>
              ))}
            </div>
            <p className="font-extrabold text-base mb-3" style={{ color: C.ink }}>{interp(cur.steps[ex6Step].q)}</p>
            <div className="flex flex-col gap-3">
              {cur.steps[ex6Step].opts.map((opt, i) => (
                <button key={i} onClick={() => handleEx6Choice(opt)}
                  className="p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all hover:border-blue-400"
                  style={{ borderColor: C.border, background: C.card, color: C.ink }}>
                  {interp(opt)}
                </button>
              ))}
            </div>
          </>
        )}

        {cur.type === 'composite' && ex6Done && (
          <div className="flex flex-col items-center gap-4 slide-up">
            <div className="w-full rounded-2xl border-2 p-4" style={{ borderColor: C.primary, background: `${C.primary}08` }}>
              <p className="font-extrabold text-sm mb-3" style={{ color: C.primary }}>🗺️ Suas escolhas</p>
              {cur.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-xs font-extrabold" style={{ color: C.inkSoft }}>{s.q.replace('?', ':')} </span>
                  <span className="text-xs font-bold" style={{ color: C.ink }}>{ex6Choices[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-center" style={{ color: C.inkSoft }}>{interp(cur.cf)}</p>
          </div>
        )}
      </div>

      {/* Heart refill offer */}
      {heartsLeft === 0 && !feedback && (
        <div className="mx-4 mb-2 p-3 rounded-2xl border-2 flex items-center justify-between gap-2" style={{ borderColor: C.danger, background: '#FEF2F2' }}>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0"><Zappy mood="ops" size={40} /></div>
            <div>
              <p className="text-sm font-extrabold" style={{ color: C.danger }}>Acabaram as vidas — sem stress.</p>
              <p className="text-xs" style={{ color: C.inkSoft }}>Modo prática: segue sem XP.</p>
            </div>
          </div>
          <button onClick={() => { if (state.zapcoins >= 50) dispatch({ type: 'RESTORE_HEARTS' }) }}
            className="px-3 py-2 rounded-xl text-sm font-extrabold text-white" style={{ background: C.accent }}>
            +5 vidas (50 🪙)
          </button>
        </div>
      )}

      {/* Zappy reage ao acerto/erro — escala com o combo */}
      {feedback && (
        <div className="flex flex-col items-center -mb-1 pop-in" key={`react-${feedback}-${exIdx}-${combo}`}>
          {feedback === 'correct' && combo >= 3 && (
            <span className="text-xs font-extrabold mb-0.5" style={{ color: C.accent }}>
              Combo x{combo}! 🔥
            </span>
          )}
          <Zappy
            mood={feedback === 'correct' ? (combo >= 3 ? 'comemoracao' : 'radiante') : 'ops'}
            size={feedback === 'correct' && combo >= 3 ? 72 : 58}
          />
        </div>
      )}

      {/* Continue — pop-in quando libera */}
      <div className="px-4 pb-6 pt-2">
        <button onClick={handleContinue} disabled={!canContinue}
          key={`continue-${feedback}`}
          className={`w-full h-14 rounded-2xl font-extrabold uppercase text-base tracking-wide text-white
            ${canContinue ? 'slide-up' : ''}
            ${canContinue ? (feedback === 'correct' ? 'btn-success' : 'btn-primary') : 'cursor-not-allowed'}`}
          style={{
            background:  !canContinue ? C.locked : undefined,
            opacity:     !canContinue ? 0.38 : 1,
          }}>
          {exIdx < exercises.length - 1 ? 'Continuar' : 'Missão concluída ✓'}
        </button>
      </div>
    </div>
  )
}
