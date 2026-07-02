# food-delivery-app

Viewed \_layout.tsx:1-66
Viewed index.tsx:1-25

Bhai, Expo Router (React Native) mein [\_layout.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/_layout.tsx:0:0-0:0) aur [index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0) ka kaam bilkul alag-alag hota hai. In simple words: **[\_layout.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/_layout.tsx:0:0-0:0) aapke app ka "haddiyo ka dhancha" (skeleton ya wrapper) hai, aur [index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0) aapke app ka pehla "darwaza" (entry page) hai.**

Aapke project ka code dekhne ke baad, inka difference aur flow main aapko asaan shabdo me samjhata hu:

### 1. [\_layout.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/_layout.tsx:0:0-0:0) (The Wrapper / Shell)

- **Kaam:** Ye app ka global wrapper hai. Jab bhi app open hota hai, app sabse pehle isi file ko dhundhta hai aur run karta hai.
- **Aapke code me kya ho raha hai:** Aap yahan par apne saare **Providers** (`QueryClientProvider`, `AuthProvider`) ko initialize kar rahe ho. Iske saath hi aap yahan define kar rahe ho ki kaunsa user (Customer, Admin, Deliveryman) kis screen/stack tak pohoch sakta hai (yahan pe security/blocking lagayi hui hai).
- **Kyu zaroori hai:** Agar koi seedha URL bhi type karke kisi page pe jana chahe, toh ye layout block kardega agar uske paas permission nahi hogi.

### 2. [index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0) (The Entry Screen - `/` route)

- **Kaam:** Ye app ka default "Home" page ya pehla route hota hai (is file ka URL path `/` banta hai).
- **Aapke code me kya ho raha hai:** Aapne is file me koi UI (design) banaya hi nahi hai. Aap ise sirf ek **Traffic Police** ki tarah use kar rahe ho. Ye check karta hai ki user logged in hai ya nahi. Agar `user.role === "ADMIN"` hai toh use seedha `/admin` bhej deta hai, agar customer hai toh `/customer` wali screen pe `Redirect` (forward) kar deta hai.

---

### 🚀 App Open Hone Par Inka Flow (Work Karne Ka Tareeka)

Jab aap app open karte ho, toh ye events line-by-line hote hain:

1. **App Launch (First Hit [\_layout.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/_layout.tsx:0:0-0:0)):** Expo Router sabse pehle [\_layout.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/_layout.tsx:0:0-0:0) ko bulata hai.
2. **Context Setup:** Yahan par `AuthProvider` load hota hai jo check karta hai ki session localStorage/AsyncStorage me hai ya nahi (kuch milliseconds lagte hain `isLoading` state par).
3. **Stack Creation:** [\_layout.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/_layout.tsx:0:0-0:0) decide karta hai ki user ko Auth Stack (Login/Register wale UI) dikhana hai, ya Main App Stack (Protected screens).
4. **First Route Load ([index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0)):** Jab app ka dhancha ban gaya aur by default URL `/` hai, tab Expo Router root ke andar maujood screen yani [index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0) ko render karta hai.
5. **Redirection (Act of index.tsx):** [index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0) immediately `useAuth()` se user ka status mangta hai. User ko dekhte hi wo usse instantly redirect kar deta hai uske specific dashboard (`/customer`, `/admin`, etc.) pe ya phir `/login` pe bina koi UI dikhaye.

**Short Summary:**
👉 **`_layout`** app ka malik (manager) hai jo rules banata hai, screens ka rasta banata hai, aur context provide karta hai.
👉 **[index.tsx](cci:7://file:///media/harivansh/D/Food%20Delivery%20App%20Nest&R-Native/apps/mobile/src/app/index.tsx:0:0-0:0)** ek pehla step (entry point) hai jo decide karta hai ki aane wale user ko kis kamre (role-based path) mein bhejni chahiye.
