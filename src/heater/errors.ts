import {
  BaseError,
  ContractFunctionRevertedError,
  InsufficientFundsError,
  UserRejectedRequestError,
} from 'viem'
import { formatDuration } from '@/lib/format'

/** 지갑·컨트랙트 오류를 사용자에게 보여줄 문장으로 바꾼다. */
export function describeError(error: unknown): string {
  if (!(error instanceof BaseError)) {
    if (error instanceof Error && error.message) return error.message
    return '알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'
  }

  if (error.walk((e) => e instanceof UserRejectedRequestError)) {
    return '지갑에서 요청을 취소했어요.'
  }
  // 지갑 자체가 없을 때 (wagmi ConnectorNotFoundError / viem ProviderNotFoundError)
  if (error.walk((e) => e instanceof Error && /Connector|Provider/.test(e.name) && /NotFound/.test(e.name))) {
    return 'EVM 지갑을 찾지 못했어요. MetaMask 를 설치한 뒤 새로고침해 주세요.'
  }
  if (error.walk((e) => e instanceof InsufficientFundsError)) {
    return '가스비로 쓸 tBNB 가 부족해요. 테스트넷 Faucet 에서 받아 주세요.'
  }

  const revert = error.walk((e) => e instanceof ContractFunctionRevertedError)
  if (revert instanceof ContractFunctionRevertedError) {
    switch (revert.data?.errorName) {
      case 'CooldownActive': {
        const [remaining] = revert.data.args as readonly [bigint]
        return `아직 쿨다운 중이에요. ${formatDuration(Number(remaining))} 뒤에 다시 넣을 수 있어요.`
      }
      case 'FireOverheated':
        return '불이 과열이라 지금은 연료를 넣을 수 없어요. 온도가 내려갈 때까지 기다려 주세요.'
    }
  }

  return error.shortMessage
}
