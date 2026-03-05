# Setup Guide for User Management System

## Things You Need to Configure After Downloading

### 1. Cloudinary Setup (for Image Uploads)

The project uses Cloudinary to store profile images. You need to create your own account:

1. Go to [https://cloudinary.com](https://cloudinary.com) and sign up for a free account
2. After logging in, go to your Dashboard
3. You'll see:
   - **Cloud Name** (e.g., `dlgrbt3t2`)
   - **Upload Preset** (you need to create one)

#### Creating an Upload Preset:
1. In Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set:
   - **Preset name**: `userManagement` (or any name you want)
   - **Signing Mode**: `Unsigned` (important!)
5. Save it

#### Update the Code:
Open `client/src/components/Editprofile/UploadImage.jsx` and change line 32:

```javascript
// Replace 'dlgrbt3t2' with YOUR cloud name
// Replace 'userManagement' with YOUR upload preset name
const res = await fetch(
  "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
  {
    method: "POST",
    body: formData,
  }
);
```

And line 24:
```javascript
formData.append("upload_preset", "YOUR_UPLOAD_PRESET_NAME");
```

---

### 2. MongoDB Setup

The project needs a MongoDB database. You have two options:

#### Option A: Local MongoDB
1. Install MongoDB on your computer: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. The current `.env` file is already configured for local: `mongodb://localhost:27017/userdb`

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `server/.env`:

```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/userdb?retryWrites=true&w=majority
```

---

### 3. Environment Variables

Your `server/.env` file should look like this:

```env
ACCESS_TOKEN_SECRET="VX2GPtnRaq8rDyWb/dj1l4MnXywJz7ALZ9gMziQYcXM="
REFRESH_TOKEN_SECRET="5mEkaROpVYIii9EKOaz6kdGp/WvutzcvXAh06KtrvCI="
PORT=3000
DB_URL=mongodb://localhost:27017/userdb
```

**Optional but Recommended**: Generate new secrets for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 5. Run the Application

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The app should now be running:
- Frontend: http://localhost:5173 (or the port Vite shows)
- Backend: http://localhost:3000

---

## Summary of Required Changes

✅ **Fixed**: Missing `/update-profile` route (already fixed)
⚠️ **Required**: Update Cloudinary credentials in `UploadImage.jsx`
⚠️ **Required**: Setup MongoDB (local or Atlas)
⚠️ **Optional**: Generate new JWT secrets for security

---

## Common Issues

**Profile edit not working?**
- Make sure backend is running on port 3000
- Check browser console for errors
- Verify you're logged in

**Image upload failing?**
- Check Cloudinary credentials
- Make sure upload preset is "Unsigned"
- Check network tab in browser dev tools

**Can't connect to database?**
- Make sure MongoDB is running (if local)
- Check connection string in `.env`
- Look at server console for connection errors
