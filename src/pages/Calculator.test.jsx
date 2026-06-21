import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { UserDataProvider } from '../context/UserDataContext';
import Calculator from '../pages/Calculator';

const renderCalculator = () =>
  render(
    <MemoryRouter>
      <UserDataProvider>
        <Calculator />
      </UserDataProvider>
    </MemoryRouter>
  );

describe('Calculator', () => {
  it('renders Step 1 (Transportation) on initial load', () => {
    renderCalculator();
    expect(screen.getByText('Transportation')).toBeTruthy();
  });

  it('shows vehicle mode select input on step 1', () => {
    renderCalculator();
    expect(screen.getByLabelText(/Primary Mode of Transport/i)).toBeTruthy();
  });

  it('shows daily distance input on step 1', () => {
    renderCalculator();
    expect(screen.getByLabelText(/Daily Distance/i)).toBeTruthy();
  });

  it('updates distance input value when user types', () => {
    renderCalculator();
    const input = screen.getByLabelText(/Daily Distance/i);
    fireEvent.change(input, { target: { value: '20' } });
    expect(input.value).toBe('20');
  });

  it('advances to Step 2 when Next is clicked', async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText(/Electricity Consumption/i)).toBeTruthy();
  });

  it('advances to Step 3 (Food) after step 2', async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.click(screen.getByRole('button', { name: /Next/i })); // → step 2
    await user.click(screen.getByRole('button', { name: /Next/i })); // → step 3
    expect(screen.getByText(/Food Habits/i)).toBeTruthy();
  });

  it('advances to Step 4 (Waste) after step 3', async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.click(screen.getByRole('button', { name: /Next/i })); // → 2
    await user.click(screen.getByRole('button', { name: /Next/i })); // → 3
    await user.click(screen.getByRole('button', { name: /Next/i })); // → 4
    expect(screen.getByText(/Waste Generation/i)).toBeTruthy();
  });

  it('shows progress dots below the form', () => {
    renderCalculator();
    // 4 step indicators
    const dots = document.querySelectorAll('.rounded-full.w-3.h-3');
    expect(dots.length).toBe(4);
  });

  it('Back button on step 2 returns to step 1', async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText(/Electricity Consumption/i)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText(/Transportation/i)).toBeTruthy();
  });
});

// ─── Carbon calculation logic (isolated) ──────────────────────────────────
const calculateFootprint = (data) => {
  const factors = {
    transport: { car: 0.21, bike: 0.1, bus: 0.08, train: 0.04, metro: 0.03, walking: 0, cycling: 0 },
    energy: { ac: 1.5, fan: 0.05, tv: 0.1, fridge: 0.1, washing: 0.5 },
    food: { vegetarian: 10, mixed: 20, 'non-vegetarian': 35 },
    waste: { plastic: 6, food: 2.5, recyclable: 0.5 },
  };

  const transportEmissions = data.distance * factors.transport[data.vehicle] * 7;
  const energyEmissions =
    (data.acHours * factors.energy.ac +
      data.fanHours * factors.energy.fan +
      data.tvHours * factors.energy.tv +
      data.fridgeHours * factors.energy.fridge +
      data.washingUsage * factors.energy.washing) *
    7;
  const foodEmissions = factors.food[data.diet];
  const wasteEmissions =
    data.plasticWaste * factors.waste.plastic +
    data.foodWaste * factors.waste.food +
    data.recyclableWaste * factors.waste.recyclable;
  const total = transportEmissions + energyEmissions + foodEmissions + wasteEmissions;

  let score = 'Critical';
  if (total < 30) score = 'Excellent';
  else if (total < 60) score = 'Good';
  else if (total < 100) score = 'Moderate';
  else if (total < 150) score = 'High';

  return { total: total.toFixed(2), score, breakdown: { transport: transportEmissions.toFixed(2), energy: energyEmissions.toFixed(2), food: foodEmissions.toFixed(2), waste: wasteEmissions.toFixed(2) } };
};

describe('calculateFootprint (logic)', () => {
  it('returns Excellent score for low emissions', () => {
    const data = { vehicle: 'cycling', distance: 0, acHours: 0, fanHours: 1, tvHours: 0, fridgeHours: 0, washingUsage: 0, diet: 'vegetarian', plasticWaste: 0, foodWaste: 0, recyclableWaste: 0 };
    const result = calculateFootprint(data);
    expect(result.score).toBe('Excellent');
  });

  it('returns Critical score for high emissions', () => {
    const data = { vehicle: 'car', distance: 50, acHours: 8, fanHours: 5, tvHours: 5, fridgeHours: 24, washingUsage: 3, diet: 'non-vegetarian', plasticWaste: 5, foodWaste: 5, recyclableWaste: 5 };
    const result = calculateFootprint(data);
    expect(result.score).toBe('Critical');
  });

  it('cycling produces zero transport emissions', () => {
    const data = { vehicle: 'cycling', distance: 20, acHours: 0, fanHours: 0, tvHours: 0, fridgeHours: 0, washingUsage: 0, diet: 'vegetarian', plasticWaste: 0, foodWaste: 0, recyclableWaste: 0 };
    const result = calculateFootprint(data);
    expect(Number(result.breakdown.transport)).toBe(0);
  });

  it('non-vegetarian diet produces 35 kg food emissions', () => {
    const data = { vehicle: 'cycling', distance: 0, acHours: 0, fanHours: 0, tvHours: 0, fridgeHours: 0, washingUsage: 0, diet: 'non-vegetarian', plasticWaste: 0, foodWaste: 0, recyclableWaste: 0 };
    const result = calculateFootprint(data);
    expect(Number(result.breakdown.food)).toBe(35);
  });

  it('breakdown values sum to total', () => {
    const data = { vehicle: 'car', distance: 10, acHours: 2, fanHours: 3, tvHours: 2, fridgeHours: 24, washingUsage: 1, diet: 'mixed', plasticWaste: 1, foodWaste: 2, recyclableWaste: 2 };
    const result = calculateFootprint(data);
    const sum = Object.values(result.breakdown).reduce((a, b) => a + Number(b), 0);
    expect(sum).toBeCloseTo(Number(result.total), 1);
  });

  it('result has correct shape', () => {
    const data = { vehicle: 'bus', distance: 10, acHours: 1, fanHours: 2, tvHours: 1, fridgeHours: 24, washingUsage: 1, diet: 'vegetarian', plasticWaste: 1, foodWaste: 1, recyclableWaste: 1 };
    const result = calculateFootprint(data);
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('breakdown.transport');
    expect(result).toHaveProperty('breakdown.energy');
    expect(result).toHaveProperty('breakdown.food');
    expect(result).toHaveProperty('breakdown.waste');
  });
});
