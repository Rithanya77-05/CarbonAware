# 🌍 CarbonAware

An intelligent carbon footprint awareness platform that helps users understand, track, and reduce their environmental impact through personalized insights, sustainability recommendations, gamification, and data-driven decision making.

✅ 53 Automated Tests Passing  
✅ Build Verification Passed  
✅ Lint Verification Passed

## 🚀 Live Demo

https://carbon-aware-rho.vercel.app

---

## 🎯 Challenge Chosen

**Carbon Footprint Awareness Platform**

CarbonAware was developed as a solution to help individuals understand, track, and reduce their carbon footprint through simple actions, personalized insights, and engaging sustainability features.

---

## 📝 Problem Statement

As climate change continues to impact communities worldwide, many individuals want to adopt sustainable habits but often lack awareness of how their daily activities contribute to carbon emissions.

Most existing solutions either present complex environmental data or fail to provide actionable guidance. Users need an accessible platform that can help them understand their environmental impact and motivate them to make better lifestyle choices.

---

## 💡 Solution Overview

CarbonAware transforms complex carbon footprint calculations into an interactive and engaging experience.

The platform analyzes user habits across transportation, energy consumption, food choices, and waste generation to calculate carbon emissions and generate a Carbon Score.

Based on these results, CarbonAware provides:

* Personalized sustainability recommendations
* Eco personality classification
* Sustainability roadmaps
* Interactive sustainability simulations
* Eco challenges and rewards
* Progress tracking and analytics

The goal is to convert environmental awareness into measurable action.

---

## ✨ Features

### 🧮 Carbon Footprint Calculator

Interactive multi-step calculator covering:

* Transportation habits
* Electricity consumption
* Food habits
* Waste generation

Generates a personalized Carbon Score based on lifestyle choices.

### 📊 Analytics Dashboard

* Emissions breakdown visualization
* Historical footprint tracking
* Carbon saved calculations
* Trees equivalent metrics
* Weekly trend analysis

### 🌍 Eco Personality Engine

Automatically classifies users into eco-personality categories based on their sustainability behavior and carbon footprint patterns.

### 🗺️ Sustainability Roadmap

Generates a personalized 4-week improvement plan with practical sustainability actions and progress tracking.

### 🏙️ Green City Simulator

Visualizes sustainability progress through a city that evolves across multiple stages:

* Polluted City
* Improving City
* Green Community
* Smart Eco City
* Future Sustainable City

### 🌎 Future Earth Simulator

Displays future environmental outcomes based on current habits versus sustainable alternatives.

### 📈 Compare vs Average

Allows users to compare their carbon footprint against a global average benchmark.

### 🤖 EcoBot Assistant

Rule-based AI-style assistant that provides:

* Sustainability tips
* Carbon reduction suggestions
* Environmental awareness guidance

### 🏆 Challenges & Gamification

Includes:

* Daily eco challenges
* Eco points
* Achievement badges
* User levels
* Leaderboard system

### 🌙 Dark Mode

Fully responsive light and dark themes with localStorage persistence.

---

## ⚙️ Approach & Logic

CarbonAware collects user inputs from four key lifestyle categories:

1. Transportation
2. Electricity Consumption
3. Food Habits
4. Waste Generation

The application uses predefined emission factors to estimate the user's carbon footprint and calculate a Carbon Score.

Based on the calculated emissions, CarbonAware dynamically generates:

* Sustainability recommendations
* Eco personality classification
* Sustainability roadmap
* Green city evolution
* Future Earth simulations

This approach converts environmental data into actionable and easy-to-understand insights.

---

## 🔄 How It Works

1. User completes the Carbon Footprint Calculator.
2. Carbon emissions are calculated using weighted emission factors.
3. A Carbon Score is generated.
4. Dashboard analytics visualize the results.
5. Eco Personality is determined.
6. Sustainability recommendations are generated.
7. A personalized roadmap is created.
8. EcoBot provides contextual sustainability guidance.
9. Progress is tracked using challenges, badges, and Eco Points.

---

## 📌 Assumptions

* Transportation emissions are estimated using average emission factors.
* Electricity usage calculations are based on common appliance consumption patterns.
* Food habits are categorized into Vegetarian, Mixed, and Non-Vegetarian lifestyles.
* Waste generation uses simplified environmental impact estimates.
* Global comparison values are used for awareness purposes and may not represent exact real-world averages.
* Tree-equivalent calculations use generalized carbon absorption estimates.
* All user data is stored locally using browser localStorage.
* No personal data is transmitted to external servers.

---

## 🛠️ Tech Stack

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React + Vite    | Frontend framework and build tool |
| Tailwind CSS v4 | Responsive styling                |
| Framer Motion   | Animations and transitions        |
| Recharts        | Data visualization                |
| React Router v7 | Navigation and routing            |
| Lucide React    | Icons                             |
| localStorage    | Data persistence                  |

---

## 📂 Installation

Clone the repository:

```bash
git clone https://github.com/Rithanya77-05/CarbonAware.git
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🏗️ Build

```bash
npm run build
```

---

## 🧪 Testing

Run automated tests:

```bash
npm run test
```

Current Test Status:

* ✔ Dashboard Tests
* ✔ Calculator Tests
* ✔ EcoBot Tests
* ✔ Utility Function Tests

### Test Summary

* 4 Test Files
* 53 Passing Tests
* Build Verification Passed
* Lint Verification Passed

---

## 🚀 Deployment

### Deploy to Vercel

1. Push the repository to GitHub.
2. Log in to Vercel.
3. Click **Add New → Project**.
4. Import the GitHub repository.
5. Vercel automatically detects the Vite framework.
6. Click **Deploy**.

The application will be live within minutes.

---

## 🌱 Future Enhancements

* Real-world carbon emission APIs
* User authentication
* Community sustainability groups
* Carbon offset marketplace integration
* AI-powered recommendation engine
* Mobile application support

---

## 📄 License

MIT License

© 2026 CarbonAware
