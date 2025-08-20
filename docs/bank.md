Q:
VAN 使用mcp:context7查詢nextjs框架下 firebase && supabase 官方的配置文件firebase && supabase & app check 混搭共用,然後根據官方說明文件配置nextjs下的firebase && supabase配置檔案,官方怎說我們就怎做,能使用全局就使用全局避免無謂的錯誤發生,如果已經有context7就在追查更全面的文件

analytics-service.ts[根據數據決定調用firebase && supabase
src\lib\services\contract-service.ts[supabase]
src\lib\services\document-service.ts[firebase/firestore+storage]
src\lib\services\partner-service.ts[firebase/firestore]
src\lib\services\project-service.ts[supabase]
然後直接幫我編譯
src\lib\supabase\auth.ts
src\lib\supabase\client.ts
src\lib\supabase\server.ts
src\lib\supabase\types.ts
src\lib\firebase\app-check.ts
src\lib\firebase\auth.ts
src\lib\firebase\client.ts
src\lib\firebase\config.ts
src\lib\firebase\server.ts
src\lib\firebase\types.ts
src\lib\services\analytics-service.ts
src\lib\services\contract-service.ts
src\lib\services\document-service.ts
src\lib\services\firebase-service.ts
src\lib\services\partner-service.ts
src\lib\services\project-service.ts
src\lib\services\supabase-service.ts

A:
我已同步修正 Firebase 與 Supabase 的 Next.js 配置，並按官方文檔落實 App Check（reCAPTCHA v3）初始化與伺服端驗證接口骨架。
已修復 env 變數鍵名錯誤（改用 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY），並處理 Firebase App Check token 型別。
各 services 已按你指定的資料來源切換：合約與專案走 Supabase，文件與儲存走 Firebase，夥伴走 Firestore，Analytics 先查 Supabase 不到再回退 Firebase。
變更要點
Supabase
src/lib/supabase/client.ts 與 server.ts 改為使用 NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY。
src/lib/supabase/types.ts 清除誤植文字，加入官方建議的型別佔位，待你用 CLI 生成。
Firebase App Check
src/lib/firebase/app-check.ts：官方模式初始化、開發環境 debug token、getToken 回傳 token 字串，並保留伺服端驗證說明。
src/lib/firebase/server.ts：加入 adminAppCheck 與 verifyAppCheckTokenServer。
Services
src/lib/services/supabase-service.ts：統一以 getClient() 自動選 server/browser 客戶端。
src/lib/services/contract-service.ts：改為使用 Supabase（查詢/新增/更新/刪除）。
src/lib/services/analytics-service.ts：先查 Supabase，若無資料或錯誤再回退 Firebase。
其他服務依你既有檔案：document-service.ts、partner-service.ts、project-service.ts 未更動資料來源方向（分別為 Firebase/Firebase/Supabase）。
下一步建議
環境變數補齊：
Supabase: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
Firebase: NEXT_PUBLIC_FIREBASE_* 與 Admin 用的 FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
App Check: NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY
依官方生成 Supabase DB 型別：
在專案根執行：
npx supabase gen types typescript --project-id <project_ref> --schema public > src/lib/supabase/types.ts
這些檔案已編輯
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/types.ts
src/lib/firebase/app-check.ts
src/lib/firebase/server.ts
src/lib/services/supabase-service.ts
src/lib/services/contract-service.ts
src/lib/services/analytics-service.ts
已檢查：上述檔案 lints 為綠。