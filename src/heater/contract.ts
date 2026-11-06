// 컨트랙트 저장소의 deployments/heater.ts 와 같은 내용 (주소 + ABI).
// 소스 검증: https://repo.sourcify.dev/97/0x989ba280Ab048a2E5EAf1A92552bdB5F6f63DF87
// 컨트랙트를 재배포하면 이 파일만 다시 복사하면 된다.
// ABI 끝의 `as const` 가 있어야 functionName / args / 반환값 타입이 추론된다.

export const HEATER_ADDRESS = '0x989ba280Ab048a2E5EAf1A92552bdB5F6f63DF87' as const
export const HEATER_CHAIN_ID = 97 as const
export const HEATER_DEPLOY_BLOCK = 140922270n

export const heaterAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "stokeAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "coolingRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "cooldown",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "overheatThreshold",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "overheatGrace",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "CooldownActive",
    "type": "error",
    "inputs": [
      {
        "name": "remaining",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "name": "FireOverheated",
    "type": "error",
    "inputs": [
      {
        "name": "temperature",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "name": "InvalidConfig",
    "type": "error",
    "inputs": []
  },
  {
    "name": "Extinguished",
    "type": "event",
    "inputs": [
      {
        "name": "fireId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "lifetime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "cause",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum Heater.Cause"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Ignited",
    "type": "event",
    "inputs": [
      {
        "name": "fireId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "igniter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Overheated",
    "type": "event",
    "inputs": [
      {
        "name": "fireId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "temperature",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "burnoutDeadline",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Stoked",
    "type": "event",
    "inputs": [
      {
        "name": "stoker",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "fireId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tempAfter",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "COOLDOWN",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "COOLING_RATE",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "OVERHEAT_GRACE",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "OVERHEAT_THRESHOLD",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "RECENT_LIMIT",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "STOKE_AMOUNT",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "TEMP_DECIMALS",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "bornAt",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "contributionOf",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "contributors",
    "type": "function",
    "inputs": [
      {
        "name": "offset",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "accounts",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "counts",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "cooldownOf",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "currentFireId",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "currentFireStokes",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "currentTemp",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "extinguishCount",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "extinguishesAt",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "at",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "cause",
        "type": "uint8",
        "internalType": "enum Heater.Cause"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "fireHistory",
    "type": "function",
    "inputs": [
      {
        "name": "offset",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "records",
        "type": "tuple[]",
        "components": [
          {
            "name": "fireId",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "bornAt",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "diedAt",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "stokes",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "cause",
            "type": "uint8",
            "internalType": "enum Heater.Cause"
          }
        ],
        "internalType": "struct Heater.FireRecord[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "fireHistoryLength",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "lastStokedAt",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "lastStokedBy",
    "type": "function",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "lastStoker",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "longestLifetime",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "overheatedSince",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "previewStoke",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "canStoke",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "tempAfter",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "willOverheat",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "willBurnout",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "recentStokes",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "records",
        "type": "tuple[]",
        "components": [
          {
            "name": "stoker",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "fireId",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "tempAfter",
            "type": "uint128",
            "internalType": "uint128"
          }
        ],
        "internalType": "struct Heater.StokeRecord[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "settle",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "settled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "snapshot",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "s",
        "type": "tuple",
        "components": [
          {
            "name": "temperature",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum Heater.Status"
          },
          {
            "name": "bornAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastStokedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastStoker",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "extinguishesAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "extinguishCause",
            "type": "uint8",
            "internalType": "enum Heater.Cause"
          },
          {
            "name": "overheatedSince",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "userCooldown",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "userContribution",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "internalType": "struct Heater.Snapshot"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "stats",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "s",
        "type": "tuple",
        "components": [
          {
            "name": "totalStokes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "extinguishCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "currentFireId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "bornAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "aliveFor",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "currentFireStokes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "longestLifetime",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "contributorCount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "internalType": "struct Heater.Stats"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "status",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum Heater.Status"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "stoke",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "tempAfter",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "stokeCount",
    "type": "function",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "temperature",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "totalStokes",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const
