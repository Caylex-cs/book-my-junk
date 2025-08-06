# BookMyJunk - Static Frontend UI

A clean, responsive UI design for a CRUD-based web application called BookMyJunk, with separate customer and admin interfaces.

## 🎯 What This Is

This is a **static frontend-only version** of BookMyJunk with:
- ✅ Clean, modern UI design
- ✅ Responsive layouts for all devices
- ✅ Working buttons and form interactions
- ✅ No backend complexity or authentication
- ✅ Perfect for UI/UX demonstration

## 📁 File Structure

```
├── index.html              # Landing page
├── preview.html            # Preview index (this page)
├── styles/
│   ├── main.css           # Main styles
│   └── components.css     # Component styles
├── customer/
│   ├── login.html         # Customer login
│   ├── signup.html        # Customer signup
│   ├── dashboard.html     # Customer dashboard
│   ├── book-pickup.html   # Book pickup form
│   ├── bookings.html      # View/manage bookings
│   └── profile.html       # Customer profile
└── admin/
    ├── login.html         # Admin login
    ├── dashboard.html     # Admin dashboard
    └── bookings.html      # Admin bookings management
```

## 🚀 How to Use

### Option 1: Open Directly in Browser
Simply open `preview.html` in your web browser to see all pages.

### Option 2: Simple Local Server
If you want to serve the files locally:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have it)
npx serve .
```

Then visit: `http://localhost:8000/preview.html`

## 📱 Pages Overview

### Customer Pages
- **Login/Signup** - Clean authentication forms
- **Dashboard** - Overview with quick actions
- **Book Pickup** - Form to schedule junk removal
- **Bookings** - View and manage existing bookings
- **Profile** - User profile and settings

### Admin Pages
- **Login** - Admin authentication
- **Dashboard** - Admin overview with statistics
- **Bookings Management** - Manage all customer bookings

## 🎨 Design Features

- **Modern UI** - Clean, professional design
- **Responsive** - Works on desktop, tablet, and mobile
- **Accessible** - Good contrast and readable fonts
- **Interactive** - Hover effects and smooth transitions
- **Consistent** - Unified design language across all pages

## 🔧 Customization

All styles are in the `styles/` directory:
- `main.css` - Global styles and layout
- `components.css` - Reusable component styles

## 📝 Note

This is a **static frontend demonstration**. All forms and buttons work for UI purposes, but no data is actually saved or processed. Perfect for:
- UI/UX demonstrations
- Design reviews
- Frontend development practice
- Portfolio projects

## 🎯 Next Steps

If you want to add backend functionality later, you can:
1. Add form submission handlers
2. Integrate with a backend API
3. Add authentication
4. Connect to a database

But for now, enjoy the clean, working frontend! 🎉 