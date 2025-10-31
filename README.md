# 🏋️ Gym Customer Portal

Beautiful customer-facing portal for gym members to manage their fitness journey.

## 🚀 Features

### ✅ **Registration with Invite Code**

- 3-step registration process
- Invite code validation
- Beautiful gradient UI
- Progress indicators

### ✅ **Secure Login**

- Email & password authentication
- JWT token-based auth
- Auto-redirect for logged-in users
- Password visibility toggle

### ✅ **Customer Dashboard**

- View enrolled programs
- Track current stats (weight, height)
- Quick overview cards
- Modern gradient design

### 🔜 **Coming Soon**

- Weekly workout schedule viewer
- Progress tracking & charts
- Diet plan viewer
- Membership details

---

## 🎨 **Design Highlights**

- **Beautiful Gradients**: Blue → Purple → Pink
- **Glass Morphism**: Frosted glass effects
- **Animated Background**: Pulsing blur elements
- **Modern Cards**: Rounded corners, shadows
- **Responsive**: Mobile, tablet, desktop
- **Dark Mode Ready**: Full dark mode support

---

## 📦 **Installation**

```bash
npm install
```

---

## 🏃 **Development**

```bash
npm run dev
```

Runs on: **http://localhost:5174**

---

## 🏗️ **Build**

```bash
npm run build
```

---

## 🔑 **Test Registration**

1. Get an invite code from admin panel:

   - Go to http://localhost:5173/invites
   - Click "Generate Invite"
   - Copy the code

2. Register:

   - Go to http://localhost:5174/register
   - Enter invite code
   - Fill registration form
   - Create account

3. Login:
   - Email: your registered email
   - Password: your password
   - Access dashboard!

---

## 📁 **Project Structure**

```
src/
├── pages/
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # 3-step registration
│   └── Dashboard.jsx      # Customer dashboard
├── lib/
│   └── axios.js          # API client with interceptors
├── App.jsx               # Routes & auth guards
├── main.jsx              # App entry
└── index.css             # Tailwind + custom styles
```

---

## 🎯 **Features Breakdown**

### **Registration (3 Steps)**

1. **Step 1**: Invite Code Verification
2. **Step 2**: Personal Information (name, phone, measurements)
3. **Step 3**: Account Setup (email, password, emergency contact)

### **Protected Routes**

- `/login` - Public (redirects if logged in)
- `/register` - Public (redirects if logged in)
- `/dashboard` - Protected (CLIENT role only)

### **API Integration**

- `POST /api/invites/verify` - Verify invite code
- `POST /api/auth/register` - Register new client
- `POST /api/auth/login` - Login
- `GET /api/clients/me` - Get logged-in client profile

---

## 🇱🇰 **Sri Lanka Localized**

- Currency: **LKR** (Sri Lankan Rupees)
- Phone format: **+94 77 XXX XXXX**
- Local timezone support

---

## 🎨 **Color Scheme**

- **Primary Gradient**: Purple (#667eea) to Pink (#764ba2)
- **Success**: Green
- **Info**: Blue
- **Background**: Blue → Purple → Pink gradient

---

## 🔐 **Security**

- ✅ JWT authentication
- ✅ Token stored in localStorage
- ✅ Auto-logout on 401
- ✅ Role-based access (CLIENT only)
- ✅ Protected routes

---

## 📱 **Responsive Design**

- ✅ Mobile-first approach
- ✅ Tablet optimized
- ✅ Desktop layouts
- ✅ Touch-friendly buttons

---

## ✨ **Next Steps**

Add more features:

- Workout schedule viewer
- Progress tracker with charts
- Diet plan viewer
- Payment history
- Profile editing
- Notifications

---

**Built with**: React + Vite + Tailwind CSS + Lucide Icons
**Theme**: Modern gradient with glass morphism
**Status**: ✅ Ready for development
# gym-management-customer-portal
