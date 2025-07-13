# Add ERP System Demo - Step by Step

## Current Status:
- ERP System Demo is NOT in your local file
- You need to add it manually to client\src\pages\home.tsx

## Steps:

### 1. Open the file
Open `client\src\pages\home.tsx` in your text editor (Notepad, VS Code, etc.)

### 2. Find the "No Shedding" project
Look for this section around line 240-250:
```javascript
    {
      title: "No Shedding - Load Shedding Solutions",
      description: "A comprehensive e-commerce platform for electrical equipment and UPS systems with product categories, cart functionality, and payment integration.",
      image: "/noshedding-screenshot.png",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Ozow", "JWT"],
      category: "WEB APPLICATION",
      liveUrl: "https://noshedding.co.za",
      codeUrl: "#"
    },
```

### 3. Add ERP System Demo AFTER the No Shedding project
Right after the No Shedding closing brace and comma, add:
```javascript
    {
      title: "ERP System Demo",
      description: "Enterprise Resource Planning system with comprehensive dashboard for business operations, inventory management, sales tracking, and customer relationship management with real-time analytics.",
      image: "/erp-system-screenshot.png",
      technologies: ["React", "ERP Integration", "Business Operations", "Dashboard Analytics"],
      category: "WEB APPLICATION",
      liveUrl: "https://erpsystemdemo.netlify.app/",
      codeUrl: "#"
    },
```

### 4. Save the file

### 5. Push to GitHub
```cmd
git add .
git commit -m "Add ERP System Demo to portfolio"
git push origin main
```

The ERP System Demo will appear as the 3rd project in your web applications section.