# poct-ui-lis — Frontend

**Stack:** Vue 3.5 + TypeScript 5.9 + Vite 6.4 + Element Plus 2.11 + Pinia 3 + qiankun

## STRUCTURE
```
poct-ui-lis/
├── index.html              # HTML shell
├── vite.config.ts          # Vite config (port 10302, CORS *)
├── src/
│   ├── main.ts             # qiankun bootstrap/mount/unmount
│   ├── App.vue             # Root component (<router-view />)
│   ├── api/lis/            # 4 CRUD API modules (chargeItem, commInstrument, inspectionGroup, testItem)
│   ├── views/config/       # 4 CRUD views
│   ├── router/             # Static + dynamic route loading
│   ├── store/modules/      # Pinia stores (dict, services)
│   ├── utils/              # request.ts (Axios), auth, crypto, dict
│   ├── plugins/            # $modal, $download, svgicon
│   └── components/         # DictTag, Pagination, FileUpload, RightToolbar
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Entry point | `src/main.ts` |
| CRUD views | `src/views/config/{chargeItem,inspectionGroup,instrument,testItem}/index.vue` |
| API calls + types | `src/api/lis/{module}/index.ts` + `types.ts` |
| Router | `src/router/index.ts` + `routerLoader.ts` |
| Utils | `src/utils/request.ts` (Axios), `src/utils/ruoyi.ts` |

## CONVENTIONS
- **No manual imports** for Vue/VueUse/Pinia/Element Plus — all auto-imported
- **Composition API**: `<script setup lang="ts">` only
- **API calls**: `useServiceStore().apiUrl.hisLis` for dynamic base URL
- **Styling**: UnoCSS utility classes + SCSS (`api: "modern-compiler"`)
- **Package manager**: pnpm
- **Micro-frontend**: qiankun sub-app at `/lis`, cannot run standalone

## ANTI-PATTERNS
- All 4 `types.ts` files type PKs as `string` but backend returns `Long` (should be `number`)
- Dead code: commented-out fields in instrument/inspectionGroup/testItem views
- InspectionGroup view has 3 bugs in `updateHeight()` (missing `editButtonsRef`, no `setTimeout`, wrong `clientHeight`)
