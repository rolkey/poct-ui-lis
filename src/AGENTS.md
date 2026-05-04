# src/ — Frontend Source

**Stack:** Vue 3 + TypeScript + Vite + Element Plus + Pinia + qiankun

## STRUCTURE
```
src/
├── main.ts              # Entry: qiankun bootstrap/mount/unmount
├── App.vue              # Root: <router-view />
├── api/lis/             # 4 CRUD API modules (chargeItem, commInstrument, inspectionGroup, testItem)
├── views/config/        # 4 CRUD views
├── views/home.vue       # Home page
├── views/his/interface/ # HIS interface view
├── views/patient/       # Patient view
├── router/              # Static + dynamic route loading
├── store/modules/       # Pinia: dict, services
├── utils/               # request.ts (Axios), auth, crypto, dict, ruoyi
├── plugins/             # $modal, $download, svgicon, cache
├── components/          # DictTag, Pagination, FileUpload, RightToolbar
├── directive/           # permission, common directives
├── lang/                # i18n (zh_CN, en_US)
├── types/               # TS type declarations
└── assets/styles/       # SCSS styles
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Entry | `main.ts` |
| CRUD views | `views/config/{module}/index.vue` |
| API calls | `api/lis/{module}/index.ts` |
| API types | `api/lis/{module}/types.ts` |
| Axios config | `utils/request.ts` |
| Dynamic routes | `router/routerLoader.ts` |

## CONVENTIONS
- Auto-imports: Vue, VueUse, Pinia, Element Plus — no manual imports
- `<script setup lang="ts">` only
- `useServiceStore().apiUrl.hisLis` for dynamic API base URL
- `v-hasPermi` for permission checks
- `@/` path alias for `src/`

## ANTI-PATTERNS
- All 4 `api/lis/*/types.ts` type PKs as `string` (backend returns `Long` → should be `number`)
- InspectionGroup view: 3 bugs in `updateHeight()` (missing `editButtonsRef`, no `setTimeout`, wrong `clientHeight`)
- Dead code: commented-out fields in instrument/inspectionGroup/testItem views
