# api/ — API Layer

**Stack:** Axios + TypeScript

## STRUCTURE
```
api/
├── lis/
│   ├── chargeItem/index.ts + types.ts        # 诊疗项目 API
│   ├── commInstrument/index.ts + types.ts    # 仪器 API
│   ├── inspectionGroup/index.ts + types.ts   # 检验分组 API
│   └── testItem/index.ts + types.ts          # 检验项目 API
└── system/
    ├── dept/index.ts + types.ts              # 部门 API
    ├── dict/data/index.ts + types.ts         # 字典数据 API
    └── oss/index.ts + types.ts               # OSS API
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| API calls | `lis/{module}/index.ts` |
| TypeScript types | `lis/{module}/types.ts` |

## CONVENTIONS
- Each module: `index.ts` (5 CRUD functions) + `types.ts` (VO, Form, Query interfaces)
- API base URL from `useServiceStore().apiUrl.hisLis`
- Standard CRUD functions: `list*`, `get*`, `add*`, `update*`, `del*`
- Types: `*Vo` (response), `*Form` (create/update), `*Query` (search params)

## ANTI-PATTERNS
- All 4 `types.ts` files type PKs as `string` — backend returns `Long` (should be `number`)
