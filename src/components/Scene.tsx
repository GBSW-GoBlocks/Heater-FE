import roomBg from '../assets/figma/room-bg.jpg'
import stoveImg from '../assets/figma/stove.png'
import lunchbox from '../assets/figma/boxes.png'
import body from '../assets/figma/body.png'
import faceOff from '../assets/figma/face-extinguished.png'
import faceLow from '../assets/figma/face-low.png'
import faceNormal from '../assets/figma/face-normal.png'
import faceHot from '../assets/figma/face-overheat.png'

type Props = {
  state: string
  showPlus: boolean
  plusText: string
}

export default function Scene({ state, showPlus, plusText }: Props) {
  let face = faceNormal
  if (state === 'off') face = faceOff
  if (state === 'low') face = faceLow
  if (state === 'hot') face = faceHot

  return (
    <div className="scene">
      <img className="bg" src={roomBg} />
      <img className="stove" src={stoveImg} />
      {/* 난로 위 도시락 */}
      <img className="lunchbox" src={lunchbox} />

      <div className="kid">
        <img className="body" src={body} />
        <img className="face" src={face} key={state} />
      </div>

      {/* 불 꺼지면 화로 문 안 불꽃 가리기 */}
      {state === 'off' && <div className="fire-off"></div>}

      {state === 'off' && (
        <div className="smoke">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {state === 'hot' && <div className="warning">⚠ 과열</div>}
      {showPlus && <div className="plus">{plusText}</div>}
    </div>
  )
}
