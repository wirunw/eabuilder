# 🚀 Deployment Guide for EA Builder

## การ Deploy บน Netlify (แนะนำ)

### วิธีที่ 1: Drag & Drop (ง่ายที่สุด)
1. เปิด [netlify.com](https://netlify.com) และ Login
2. คลิก "Add new site" → "Deploy manually"
3. ลากโฟลเดอร์โปรเจคทั้งหมดไปวางในช่อง "Drag and drop your site output folder here"
4. รอประมาณ 1-2 นาที - เว็บไซต์จะพร้อมใช้งาน!

> ⚠️ **สำคัญ:** วิธี Drag & Drop จะ deploy เฉพาะไฟล์ Static ไม่รองรับ Netlify Functions ดังนั้น Login และ Typhoon API จะไม่ทำงาน หากต้องการใช้ฟีเจอร์เหล่านี้ให้ใช้ Git/CLI deploy เท่านั้น

### วิธีที่ 2: Git Integration
1. Push code ไป GitHub/GitLab/Bitbucket
2. บน Netlify: "Add new site" → "Import an existing project"
3. เลือก Git provider และ repository
4. ตั้งค่า Build settings:
   - **Build command**: `echo 'No build needed'`
   - **Publish directory**: `.`
5. คลิก "Deploy site"

## ✅ ไฟล์ที่ต้องการสำหรับ Deployment

```
your-project/
├── index.html          # ✅ หน้าหลัก (จำเป็น)
├── manifest.json       # ✅ PWA manifest (แนะนำ)
├── netlify.toml        # ✅ Netlify config (แนะนำ)
├── README.md          # 📖 Documentation
└── ea.html           # 📄 Original file (optional)
```

## 🔧 การตั้งค่าหลัง Deploy

### 1. Custom Domain (ถ้าต้องการ)
1. ไปที่ Site settings → Domain management
2. เพิ่ม custom domain
3. ตั้งค่า DNS ตามที่ Netlify แนะนำ

### 2. SSL Certificate
- Netlify จะจัดการ SSL certificate ให้อัตโนมัติ
- รองรับ HTTPS โดยค่าเริ่มต้น

### 3. Environment Variables (จำเป็นสำหรับ Production)

**🔴 ต้องตั้งค่าหลัง Deploy ทันที!**

1. **เข้าไปที่ Netlify Dashboard**
   - Site settings → Build & deploy → Environment
   - หรือ Deploys → Environment variables

2. **เพิ่ม Environment Variables ต่อไปนี้:**

   **สำหรับ Production:**
   - **Key**: `TYPHOON_API_KEY`
   - **Value**: [ใส่ Typhoon API key จริงของคุณ]
   - **Scope**: Production

   - **Key**: `JWT_SECRET`
   - **Value**: [สร้าง secret key ที่ซับซ้อน เช่น `ea-flow-builder-secret-2024-unique-key`]
   - **Scope**: Production
   
   - **Key**: `TYPHOON_MODEL`
   - **Value**: [ชื่อโมเดลที่บัญชีคุณใช้งานได้ เช่น `typhoon-1.5`]
   - **Scope**: Production

3. **Redeploy Site**
   - หลังจากเพิ่ม environment variables แล้ว
   - ไปที่ Deploys → Trigger deploy → Deploy site
   - เพื่อให้ Netlify Functions ใช้ค่าใหม่

**⚠️ คำเตือน:**
- อย่าเก็บ API key ในโค้ด ให้ใช้ environment variables เสมอ
- JWT Secret ควรซับซ้อนและไม่ซ้ำใคร
- ถ้าไม่ตั้งค่า `JWT_SECRET` จะใช้ค่า default ที่ไม่ปลอดภัย

## 🌐 การเชื่อมต่อกับ GitHub Pages หรือ Static Host อื่น
1. Push โค้ดไป GitHub และให้ Netlify deploy ผ่าน Git/CLI เพื่อให้ Functions ถูกรวม (อย่าใช้ Drag & Drop)
2. เมื่อเปิดหน้า `login.html` บน GitHub Pages ให้ตั้งค่า **API Endpoint** เป็น URL Netlify (เช่น `https://ea-builder.netlify.app`)
3. กด "บันทึกค่า API Base URL" ระบบจะจำค่าไว้ใน `localStorage` ของผู้ใช้
4. หากต้องการบังคับค่าแบบถาวรให้แก้ใน `config.js` โดยระบุ `hostOverrides` สำหรับ hostname นั้นๆ

> GitHub Pages ไม่มี server-side code ดังนั้นทุกครั้งที่รันบนโดเมนอื่นจำเป็นต้องชี้ API กลับมาที่ Netlify Functions เสมอ

### 4. การแก้ไขปัญหา Login ไม่ได้

ถ้า login ใช้ไม่ได้บน Netlify แต่ใช้ได้บน localhost:
1. ตรวจสอบว่าได้ตั้งค่า `JWT_SECRET` ใน environment variables แล้ว
2. ตรวจสอบว่าได้ deploy ใหม่หลังเพิ่ม environment variables
3. ตรวจสอบว่า API redirects ใน `netlify.toml` ถูกต้อง

## 📱 PWA Features

หลัง deploy แล้ว จะมีฟีเจอร์ PWA:
- ✅ สามารถติดตั้งบนมือถือ (Add to Home Screen)
- ✅ ทำงาน offline ได้บางส่วน
- ✅ Icon บน Home Screen
- ✅ Fullscreen mode

## 🔍 การทดสอบหลัง Deploy

1. **Basic Functionality**
   - เปิดเว็บไซต์ใน browser ต่างๆ
   - ทดสอบ responsive design (mobile, tablet, desktop)
   - ตรวจสอบ navigation และ animations

2. **API Integration**
   - ตั้งค่า Typhoon API Key
   - ทดสอบการเรียก AI ในแต่ละ phase
   - ตรวจสอบ error handling

3. **Export Features**
   - ทดสอบการส่งออก TXT file
   - ทดสอบการพิมพ์/Save as PDF
   - ตรวจสอบ auto-save functionality

4. **PWA Features**
   - ทดสอบการติดตั้งบนมือถือ
   - ทดสอบ offline functionality
   - ตรวจสอบ splash screen

## 🐛 ปัญหาที่อาจพบ

### 1. CORS Issues
ถ้าเจอ CORS error ตรวจสอบว่า:
- API endpoint ถูกต้อง: `https://api.opentyphoon.ai/v1/chat/completions`
- ไม่มี firewall บล็อค

### 2. API Key Not Working
- ตรวจสอบว่า API key ถูกต้องและยังไม่หมดอายุ
- ลอง test ด้วย curl หรือ Postman ก่อน

### 3. Mobile Issues
- ตรวจสอบ viewport settings
- ทดสอบบน iOS/Android จริง
- ตรวจสอบ touch interactions

### 4. Performance
- ตรวจสอบ loading time ด้วย Lighthouse
- ตรวจสอบ image optimization
- ตรวจสอบ caching headers

## 📊 Analytics (ถ้าต้องการ)

### Google Analytics
เพิ่มใน `<head>` ของ `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Netlify Analytics
เปิดใน Site settings → Analytics → Netlify Analytics

## 🔄 CI/CD (ถ้าต้องการ)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.1
        with:
          publish-dir: '.'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🎉 หลัง Deploy เสร็จ

1. **แชร์เว็บไซต์**: ใช้ URL ที่ Netlify ให้
2. **ทดสอบกับผู้ใช้จริง**: ขอให้ทีมหรือลูกค้าทดสอบ
3. **เก็บ feedback**: บันทึกปัญหาและข้อเสนอแนะ
4. **อัพเดทเรื่อยๆ**: ปรับปรุงตาม feedback

---

**🎯 Ready to Deploy!**  
เว็บแอปพลิเคชัน EA Builder ของคุณพร้อม deploy บน Netlify แล้ว!
