# 히터 프론트엔드

혼자서는 지킬 수 없는 불. 여럿이 번갈아 지펴야 유지되는 온체인 화로.

BNB Smart Chain Testnet에 배포된 `Heater` 컨트랙트에 직접 붙어 돌아간다.
백엔드 서버와 데이터베이스는 없다. 상태는 전부 컨트랙트에 있고, 이 화면은 그걸 읽고 쓰기만 한다.

## 실행

```
npm install
npm run dev
```

RPC를 바꾸려면 `.env` 에 `VITE_BSC_TESTNET_RPC_URLS` 를 넣는다 (쉼표로 여러 개 = fallback).
비워두면 `https://bsc-testnet-rpc.publicnode.com` 을 쓴다.

```
npm run build    # dist/ 생성
```

`react-router` 의 `BrowserRouter` 를 쓴다 (`/`, `/records`, `/about`).
정적 호스팅에는 **SPA 리라이트 설정이 필요하다** — 없으면 `/records` 에서 새로고침할 때 404가 난다.
`vercel.json` 과 `firebase.json` 에 넣어두었다.

## 연결 정보

| 항목 | 값 |
| --- | --- |
| 네트워크 | BNB Smart Chain Testnet (chainId 97) |
| 컨트랙트 | `0x989ba280Ab048a2E5EAf1A92552bdB5F6f63DF87` |
| 탐색기 | https://testnet.bscscan.com/address/0x989ba280Ab048a2E5EAf1A92552bdB5F6f63DF87 |
| 테스트 BNB | https://www.bnbchain.org/en/testnet-faucet |

## 폴더 구조

```
src/
├─ app/wagmi.ts          # 체인·RPC·커넥터 설정
├─ heater/               # 도메인 — 컨트랙트에 관한 건 전부 여기
│  ├─ contract.ts        #   주소 + ABI (컨트랙트 저장소에서 복사)
│  ├─ types.ts           #   화면이 보는 데이터 모양 (Heater)
│  ├─ temperature.ts     #   온도 계산 (컨트랙트와 같은 식)
│  ├─ queries.ts         #   읽기 훅 + 갱신 주기
│  ├─ useWallet.ts       #   지갑 연결 / 네트워크 전환
│  ├─ useStoke.ts        #   투입 트랜잭션
│  ├─ useHeater.ts       #   위를 합친 단 하나의 훅 ← 화면은 이것만 쓴다
│  └─ errors.ts          #   오류 → 사용자 문장
├─ lib/                  # 도메인과 무관한 유틸 (포맷터, 타이머)
├─ components/           # Header, WalletButton, TempGauge, StokeButton, Scene
├─ pages/                # Main(화로), Records(기록), About(소개)
└─ styles/               # index.css 가 불러오는 순서 = 캐스케이드 순서
```

`@/` 는 `src/` 를 가리킨다 (`@/heater/types`).

### 화면은 `useHeater()` 하나만 보면 된다

```tsx
const heater = useHeater()          // 화로 화면
const heater = useHeater({ records: true })  // 기록 화면 (무거운 조회를 켠다)
```

돌려주는 모양은 `heater/types.ts` 의 `Heater`. 온도는 전부 °C, 시간은 전부 초다
(컨트랙트의 °C × 100 과 bigint 는 훅 안에서 변환한다).

## 동작 원칙

1. **읽기는 `snapshot()` 한 번 + 로컬 계산.** 온도는 시간의 함수라서 15초마다 스냅샷을 읽고,
   그 사이 1초마다는 브라우저가 같은 식으로 계산한다. 매초 RPC를 부르지 않는다.
2. **기준 시각은 PC 시계가 아니라 블록 시각.** `snapshot.timestamp` 에 경과 시간을 더해 쓰므로
   사용자 시계가 틀려도 온도와 쿨다운이 어긋나지 않는다.
3. **쓰기는 `stoke()` 하나.** 시뮬레이션으로 실패할 트랜잭션을 서명 전에 걸러낸다
   (쿨다운·과열이면 가스비를 내기 전에 막는다).
4. **기록은 컨트랙트 조회 함수로.** 이벤트 로그를 처음부터 훑지 않는다 — 공개 RPC는
   `eth_getLogs` 를 50,000블록까지만 받아주는데 BSC 테스트넷은 블록이 0.45초마다 생긴다.
   이벤트는 실시간 알림 용도로만 쓴다 (`useLiveRefresh`).

## 화로 규칙 (배포 시 고정, 변경 불가)

| 규칙 | 값 |
| --- | --- |
| 1회 투입 | +15°C |
| 자연 냉각 | 시간당 −5°C |
| 재투입 쿨다운 | 6시간 |
| 과열 | 80°C 이상 |
| 과열 유예 | 2시간 (넘기면 불이 타버림) |

쿨다운 6시간 동안 30°C가 떨어지는데 한 번에 15°C만 올릴 수 있다. **그래서 혼자서는 불을 지킬 수 없다.**
75°C 이상에서 넣으면 과열 유예를 넘겨 결국 꺼지므로, 투입 전 `previewStoke` 경고를 보여준다.

값은 하드코딩하지 않고 컨트랙트에서 읽는다 (`useRules`). 재배포로 규칙이 바뀌어도 화면은 그대로다.

## 컨트랙트를 재배포했다면

컨트랙트 저장소의 `deployments/heater.ts` 를 `src/heater/contract.ts` 로 덮어쓰면 끝이다.
ABI 끝의 `as const` 가 있어야 `functionName` / `args` / 반환값 타입이 추론된다.
