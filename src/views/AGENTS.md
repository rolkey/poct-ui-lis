# views/ — Page Views

**Stack:** Vue 3 + Element Plus + UnoCSS

## STRUCTURE
```
views/
├── config/
│   ├── chargeItem/index.vue        # 诊疗项目管理 CRUD
│   ├── inspectionGroup/index.vue   # 检验分组管理 CRUD
│   ├── instrument/index.vue        # 仪器管理 CRUD
│   └── testItem/index.vue          # 检验项目管理 CRUD
├── home.vue                        # Home page
├── his/interface/index.vue         # HIS interface view
└── patient/index.vue               # Patient view
```

## WHERE TO LOOK
| Task | File |
|------|------|
| Charge item CRUD | `config/chargeItem/index.vue` |
| Inspection group CRUD | `config/inspectionGroup/index.vue` |
| Instrument CRUD | `config/instrument/index.vue` |
| Test item CRUD | `config/testItem/index.vue` |

## CONVENTIONS
- Standard CRUD pattern: search form → table + pagination → add/edit dialog → delete/export
- `updateHeight()` for dynamic table height calculation
- `handleQuery()` / `resetQuery()` for search
- `handleAdd()` / `handleUpdate()` / `handleDelete()` for CRUD
- `initFormData` for form defaults
- `resetFormData()` / `setFormData()` for form lifecycle

## ANTI-PATTERNS
- **InspectionGroup**: `updateHeight()` missing `editButtonsRef`, no `setTimeout`, wrong `clientHeight` access
- **Instrument**: Commented-out search fields (`instrumentCommport`, `instrumentKey`) and table column
- **TestItem**: `v-if="false"` on `testItemId` column (dead code)
- **ChargeItem**: Redundant `v-if="true"` on `chargeItemId` column
