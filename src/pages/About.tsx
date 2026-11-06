import type { Heater } from '@/heater/types'
import { HEATER_ADDRESS } from '@/heater/contract'
import { formatDuration, shortAddr } from '@/lib/format'

export default function About({ heater }: { heater: Heater }) {
  const { rules } = heater

  return (
    <div className="about">
      <h2>혼자서는 지킬 수 없는 불</h2>
      <p>여럿이 번갈아 지펴야 유지되는 온체인 화로예요.</p>

      <div className="box">
        <h3>서비스 소개</h3>
        <p>
          누구나 연료를 넣어 온도를 올릴 수 있고, 시간이 지나면 불은 자연히 식어요. 아무도 넣지 않으면 꺼져요.
          그래서 불이 살아 있다는 건 지금 여러 사람이 함께 있다는 뜻이에요.
        </p>
      </div>

      <div className="box">
        <h3>📖 규칙</h3>
        <ol className="tutorial">
          <li>
            <span>지갑을 연결하고 연료를 넣으면 온도가 {rules.stokeAmount}° 올라가요</span>
          </li>
          <li>
            <span className="tut-icon">⏳</span>
            <span>시간이 지나면 한 시간에 {rules.coolingRate}°씩 내려가요</span>
          </li>
          <li>
            <span className="tut-icon">👥</span>
            <span>
              한 지갑은 {formatDuration(rules.cooldown)}에 한 번만 넣을 수 있어요 (혼자서는 못
              지켜요)
            </span>
          </li>
          <li>
            <span className="tut-icon">⚠</span>
            <span>
              {rules.overheatThreshold}° 이상이면 과열! 연료를 넣을 수 없고,{' '}
              {formatDuration(rules.overheatGrace)}이 지나도 안 식으면 타버려요
            </span>
          </li>
          <li>
            <span className="tut-icon">📜</span>
            <span>누가 언제 지폈는지 블록체인에 지워지지 않게 남아요</span>
          </li>
        </ol>
      </div>

      <div className="box">
        <h3>🧮 왜 혼자서는 못 지키나요?</h3>
        <p>
          쿨다운 {formatDuration(rules.cooldown)} 동안 온도는{' '}
          {rules.coolingRate * (rules.cooldown / 3600)}° 떨어지는데, 한 번에 올릴 수 있는 건{' '}
          {rules.stokeAmount}° 뿐이에요. 그래서 한 사람이 아무리 자주 와도 불은 결국 꺼져요.
        </p>
      </div>

      <div className="box">
        <h3>🔗 연결 정보</h3>
        <ul className="info-list">
          <li>
            <span>네트워크</span>
            <b>BNB Smart Chain Testnet (chainId 97)</b>
          </li>
          <li>
            <span>컨트랙트</span>
            <b>
              <a
                href={`https://testnet.bscscan.com/address/${HEATER_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                {shortAddr(HEATER_ADDRESS)} ↗
              </a>
            </b>
          </li>
          <li>
            <span>테스트 BNB</span>
            <b>
              <a href="https://www.bnbchain.org/en/testnet-faucet" target="_blank" rel="noreferrer">
                공식 Faucet ↗
              </a>
            </b>
          </li>
        </ul>
        <p className="small">
          서버도 DB 도 없어요. 상태는 전부 컨트랙트에 있고, 이 화면은 그걸 읽고 쓰기만 해요. 지갑이
          없어도 온도와 기록은 모두 볼 수 있어요.
        </p>
      </div>
    </div>
  )
}
