# GitHub Update Commands

## Step 1: Navigate to Your Repository
```bash
cd /path/to/your/tsiemasilo-portfolio
```

## Step 2: Initialize Git (if needed)
```bash
git init
git remote add origin https://github.com/tsiemasilo/tsiemasilo.git
```

## Step 3: Configure Git
```bash
git config user.email "tsiemasilo@gmail.com"
git config user.name "Tsie Masilo"
```

## Step 4: Add and Commit Changes
```bash
git add .
git commit -m "Add ERP System Demo to web applications portfolio

✨ New Project Added:
- ERP System Demo (https://erpsystemdemo.netlify.app/)
- Positioned after No Shedding card
- Professional ERP dashboard with business operations
- Inventory management and sales tracking features
- Real-time analytics and customer management

🎯 Project Features:
- Enterprise Resource Planning interface
- Dashboard analytics and reporting
- Business operations management
- Modern React-based architecture

📸 Screenshot:
- Added professional ERP dashboard screenshot
- Shows orders, revenue, products, and customers overview
- Clean, modern business interface design"
```

## Step 5: Push to GitHub
```bash
git push origin main --force
```

## Files Updated in This Package:
- client/src/pages/home.tsx (ERP System Demo added)
- client/public/erp-system-screenshot.png (ERP dashboard screenshot)
- README.md (updated professional documentation)
- netlify/functions/ (working email functions)

## Result:
After pushing, your portfolio will show the ERP System Demo as the 3rd project in web applications section, and Netlify will automatically deploy the updates.