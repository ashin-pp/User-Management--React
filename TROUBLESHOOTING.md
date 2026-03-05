# Troubleshooting Guide

## Registration Not Working?

### Step 1: Check if MongoDB is Running

The most common reason for registration failure is MongoDB not being connected.

**Check the server console** when you start the server. You should see:
```
MongoDB connected
Server running on port 3000
```

If you see `MongoDB connection error`, then:

#### For Local MongoDB:
1. Make sure MongoDB is installed
2. Start MongoDB service:
   - Windows: Open Services and start "MongoDB Server"
   - Or run: `mongod` in a terminal

#### For MongoDB Atlas:
1. Make sure your connection string in `server/.env` is correct
2. Check that your IP address is whitelisted in Atlas
3. Verify username/password are correct

---

### Step 2: Check Server is Running

1. Make sure the server is running on port 3000
2. Open browser and go to: `http://localhost:3000`
3. You should see something (even if it's an error page)

---

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to register
4. Look for error messages

Common errors:
- **Network Error**: Server is not running
- **CORS Error**: Server CORS settings issue
- **400/500 Error**: Check the error message for details

---

### Step 4: Check Server Console

When you try to register, the server console should show:
```
Received registration: name=YourName, email=your@email.com
✅ User saved: { ... }
🔑 JWT accessToken generated: ...
```

If you see errors here, they will tell you what's wrong.

---

## Quick Test Commands

### Test if server is reachable:
Open a new terminal and run:
```bash
curl http://localhost:3000/user/register
```

### Check MongoDB connection:
Look at the server console when it starts. Should say "MongoDB connected"

---

## Common Issues & Solutions

### "User already exists"
- This email is already registered
- Try a different email or check the database

### "Registration failed" (generic)
- Check server console for the actual error
- Usually means MongoDB is not connected

### "Network Error"
- Server is not running on port 3000
- Check if another app is using port 3000

### CORS Error
- Make sure client is running on `http://localhost:5173`
- Check server CORS settings in `server/index.js`

---

## Validation Rules Added

Frontend & Backend now validate:
- ✅ Name: minimum 2 characters
- ✅ Email: valid email format
- ✅ Password: minimum 6 characters
- ✅ Passwords must match
- ✅ No duplicate emails

---

## Still Not Working?

1. Stop both servers (Ctrl+C)
2. Make sure MongoDB is running
3. Restart server: `cd server && node index.js`
4. Restart client: `cd client && npm run dev`
5. Try registering with a new email
6. Check both server and browser consoles for errors
