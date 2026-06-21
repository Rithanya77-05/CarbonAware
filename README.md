# CarbonAware

## Challenge Chosen

Carbon Footprint Awareness Platform

## Problem Statement

As global climate change accelerates, individuals often feel disconnected from the environmental impact of their daily routines. Many people want to reduce their carbon footprint but lack the accessible tools, data-driven insights, and actionable guidance needed to make sustainable choices in transportation, energy usage, diet, and waste generation.

## Solution Overview

CarbonAware is an interactive, gamified platform that helps users calculate, understand, and reduce their carbon footprint. By breaking down complex emissions data into intuitive visualizations and offering a personalized 4-week roadmap, CarbonAware transforms the overwhelming task of living sustainably into an engaging, achievable journey.

## Features

- **Carbon Footprint Calculator**: A multi-step form to assess transport, energy, food, and waste emissions.
- **Analytics Dashboard**: Real-time charts, global average comparisons, and tracking over time.
- **Eco Personality Engine**: Automatically classifies users into profiles based on emission categories.
- **Sustainability Roadmap**: A personalized, actionable 4-week plan to reduce carbon output.
- **Green City Simulator**: A visual, evolving city that grows greener as the user's score improves.
- **Future Earth Simulator**: Side-by-side projection of current vs sustainable lifestyle impacts.
- **EcoBot**: An intelligent AI-style assistant providing immediate sustainability tips and guidance.
- **Gamification Hub**: Daily challenges, eco points, badges, and a competitive leaderboard.
- **Dark Mode & Local Storage**: Full UI themes and seamless browser data persistence.

  ## Challenge Chosen

**Carbon Footprint Awareness Platform**

CarbonAware was developed to help individuals understand, track, and reduce their environmental impact through data-driven insights, sustainability recommendations, and interactive engagement features.

---

## Approach & Logic

CarbonAware collects user inputs across four major lifestyle categories:

* Transportation
* Electricity Consumption
* Food Habits
* Waste Generation

Using predefined emission factors, the platform estimates the user's carbon footprint and generates a Carbon Score.

Based on the calculated score and emission breakdown, CarbonAware provides:

* Personalized sustainability recommendations
* Eco Personality classification
* Sustainability Roadmap generation
* Sustainable City evolution
* Future Earth projections

The objective is to transform environmental data into actionable insights that encourage long-term sustainable behavior.

---

## How It Works

1. The user completes the Carbon Footprint Calculator.
2. Carbon emissions are calculated using weighted emission factors.
3. A Carbon Score is generated.
4. Dashboard analytics visualize the results.
5. The Eco Personality Engine classifies the user.
6. Personalized sustainability recommendations are generated.
7. A Sustainability Roadmap is created.
8. EcoBot provides contextual guidance and suggestions.
9. Progress is tracked through Eco Points, badges, challenges, and historical records.

---

## Assumptions

* Transportation emissions are estimated using average emission factors.
* Electricity calculations are based on typical appliance consumption patterns.
* Food impact is categorized into Vegetarian, Mixed, and Non-Vegetarian lifestyles.
* Waste generation is estimated using simplified waste metrics.
* Global comparison values are used for awareness purposes and may not represent exact real-world averages.
* All user data is stored locally using browser localStorage.


## Tech Stack

* React + Vite
* Tailwind CSS
* Recharts
* Framer Motion
* LocalStorage

## How It Works

- **Carbon calculation**: The engine uses standard emission factors (e.g., kg CO₂ per km for vehicles, dietary impacts) to calculate weekly footprints based on user inputs.
- **Dashboard analytics**: Stores historical calculations in `localStorage` to chart trends and calculate total carbon saved vs. the global average.
- **EcoBot**: Offers rule-based chat assistance directly integrated into the UI.
- **Sustainability roadmap**: Analyzes the highest emission categories and generates actionable weekly steps with estimated reduction values.
- **Sustainable city evolution**: Translates the user's carbon score and completed challenges into a visual 5-stage city ranging from "Polluted" to "Future Sustainable City".

## Assumptions

- Calculations are based on generalized global averages (e.g., standard vehicle emissions per km, standard household appliance wattage).
- The "Global Average" for comparison is assumed to be 150 kg CO₂ per week.
- One tree is assumed to absorb approximately 22 kg of CO₂ per year for "Trees Equivalent" metrics.

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

```bash
npm run test
```

## Deployment

**Vercel deployment instructions:**
1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect the Vite framework and apply the correct build settings (`npm run build`).
5. Click **Deploy**. Your application will be live in minutes.
