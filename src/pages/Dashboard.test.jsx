import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserDataProvider } from '../context/UserDataContext';
import Dashboard from '../pages/Dashboard';

// Seed localStorage with sample data before rendering
const seedData = {
  onboarded: true,
  name: 'Test User',
  history: [
    {
      id: '1',
      date: new Date().toISOString(),
      footprint: '57.50',
      breakdown: { transport: '22.05', energy: '15.40', food: '15.00', waste: '5.05' },
    },
  ],
  completedChallenges: ['ch-1', 'ch-2'],
  ecoPoints: 80,
  badges: [],
  personality: {
    type: 'consciousConsumer',
    name: 'Conscious Consumer',
    emoji: '♻️',
    tagline: 'Test tagline',
    description: 'Test description',
    strengths: ['Strength 1'],
    improvements: ['Improvement 1'],
    color: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  roadmap: [
    { id: 'roadmap-1', week: 1, category: 'transport', action: 'Test action', estimatedReduction: '5.5', completed: false },
  ],
  chatHistory: [],
};

const renderDashboard = (data = seedData) => {
  localStorage.setItem('carbonAwareUserData', JSON.stringify(data));
  return render(
    <MemoryRouter>
      <UserDataProvider>
        <Dashboard />
      </UserDataProvider>
    </MemoryRouter>
  );
};

describe('Dashboard', () => {
  it('renders without crashing when history exists', () => {
    const { container } = renderDashboard();
    expect(container).toBeTruthy();
  });

  it('shows Latest Footprint summary card', () => {
    renderDashboard();
    expect(screen.getByText(/Latest Footprint/i)).toBeTruthy();
  });

  it('shows correct footprint value in summary card', () => {
    renderDashboard();
    const elements = screen.getAllByText(/57.50 kg/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('shows Carbon Saved summary card', () => {
    renderDashboard();
    expect(screen.getByText(/Carbon Saved/i)).toBeTruthy();
  });

  it('shows Trees Equivalent summary card', () => {
    renderDashboard();
    expect(screen.getByText(/Trees Equivalent/i)).toBeTruthy();
  });

  it('shows Eco Points summary card', () => {
    renderDashboard();
    expect(screen.getByText(/Eco Points/i)).toBeTruthy();
  });

  it('shows correct eco points value', () => {
    renderDashboard();
    expect(screen.getByText('80')).toBeTruthy();
  });

  it('renders Emissions Breakdown chart section', () => {
    renderDashboard();
    expect(screen.getByText(/Emissions Breakdown/i)).toBeTruthy();
  });

  it('renders Footprint Trend chart section', () => {
    renderDashboard();
    expect(screen.getByText(/Footprint Trend/i)).toBeTruthy();
  });

  it('renders Eco Personality card when personality exists', () => {
    renderDashboard();
    expect(screen.getByText(/Eco Personality/i)).toBeTruthy();
    expect(screen.getByText(/Conscious Consumer/i)).toBeTruthy();
  });

  it('renders Sustainability Roadmap when roadmap exists', () => {
    renderDashboard();
    expect(screen.getByText(/Sustainability Roadmap/i)).toBeTruthy();
  });

  it('renders Compare vs. Average section', () => {
    renderDashboard();
    expect(screen.getByText(/Compare vs. Average/i)).toBeTruthy();
  });

  it('renders Green City Simulator section', () => {
    renderDashboard();
    expect(screen.getByText(/Your Sustainable City/i)).toBeTruthy();
  });

  it('renders Future Earth Simulator section', () => {
    renderDashboard();
    expect(screen.getByText(/Future Earth Simulator/i)).toBeTruthy();
  });

  it('renders Calculation History section', () => {
    renderDashboard();
    expect(screen.getByText(/Calculation History/i)).toBeTruthy();
  });

  it('shows empty state with CTA when no history', () => {
    const emptyData = { ...seedData, history: [] };
    renderDashboard(emptyData);
    expect(screen.getByText(/Calculate My Footprint/i)).toBeTruthy();
  });
});
