import { describe, it, expect } from 'vitest';
import { classifyPersonality, generateRoadmap, PERSONALITIES } from '../utils/ecoEngine';

// ─── classifyPersonality ────────────────────────────────────────────────────

describe('classifyPersonality', () => {
  it('returns greenExplorer when breakdown is null', () => {
    const result = classifyPersonality(null, 0);
    expect(result.type).toBe('greenExplorer');
  });

  it('returns greenExplorer when total is 0', () => {
    const result = classifyPersonality({ transport: 0, energy: 0, food: 0, waste: 0 }, 0);
    expect(result.type).toBe('greenExplorer');
  });

  it('returns ecoWarrior when total footprint is below 35 kg', () => {
    const breakdown = { transport: 5, energy: 5, food: 10, waste: 5 };
    const result = classifyPersonality(breakdown, 25);
    expect(result.type).toBe('ecoWarrior');
  });

  it('returns dailyCommuter when transport > 50% of total', () => {
    const breakdown = { transport: 60, energy: 10, food: 15, waste: 5 };
    const result = classifyPersonality(breakdown, 90);
    expect(result.type).toBe('dailyCommuter');
  });

  it('returns energyHeavyUser when energy > 50% of total', () => {
    const breakdown = { transport: 10, energy: 70, food: 15, waste: 5 };
    const result = classifyPersonality(breakdown, 100);
    expect(result.type).toBe('energyHeavyUser');
  });

  it('returns wasteCreator when waste > 30% of total', () => {
    const breakdown = { transport: 10, energy: 10, food: 10, waste: 40 };
    const result = classifyPersonality(breakdown, 70);
    expect(result.type).toBe('wasteCreator');
  });

  it('returns consciousConsumer for moderate balanced footprint', () => {
    const breakdown = { transport: 15, energy: 15, food: 20, waste: 10 };
    const result = classifyPersonality(breakdown, 60);
    expect(result.type).toBe('consciousConsumer');
  });

  it('returned personality has required fields', () => {
    const breakdown = { transport: 15, energy: 15, food: 20, waste: 10 };
    const result = classifyPersonality(breakdown, 60);
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('emoji');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('strengths');
    expect(result).toHaveProperty('improvements');
    expect(Array.isArray(result.strengths)).toBe(true);
    expect(Array.isArray(result.improvements)).toBe(true);
  });

  it('all PERSONALITIES entries have required fields', () => {
    Object.values(PERSONALITIES).forEach((p) => {
      expect(p).toHaveProperty('type');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('strengths');
      expect(p).toHaveProperty('improvements');
    });
  });
});

// ─── generateRoadmap ────────────────────────────────────────────────────────

describe('generateRoadmap', () => {
  it('returns empty array when breakdown is null', () => {
    expect(generateRoadmap(null, 0)).toEqual([]);
  });

  it('returns exactly 4 steps for a normal footprint', () => {
    const breakdown = { transport: 25, energy: 20, food: 20, waste: 10 };
    const result = generateRoadmap(breakdown, 75);
    expect(result).toHaveLength(4);
  });

  it('each step has required fields', () => {
    const breakdown = { transport: 25, energy: 20, food: 20, waste: 10 };
    const steps = generateRoadmap(breakdown, 75);
    steps.forEach((step) => {
      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('week');
      expect(step).toHaveProperty('category');
      expect(step).toHaveProperty('action');
      expect(step).toHaveProperty('estimatedReduction');
      expect(step).toHaveProperty('completed');
      expect(step.completed).toBe(false);
    });
  });

  it('week numbers are sequential starting from 1', () => {
    const breakdown = { transport: 25, energy: 20, food: 20, waste: 10 };
    const steps = generateRoadmap(breakdown, 75);
    steps.forEach((step, i) => {
      expect(step.week).toBe(i + 1);
    });
  });

  it('prioritises highest emission category first', () => {
    const breakdown = { transport: 60, energy: 10, food: 10, waste: 5 };
    const steps = generateRoadmap(breakdown, 85);
    // First step should address transport (highest emitter)
    expect(steps[0].category).toBe('transport');
  });

  it('estimated reductions are positive numbers', () => {
    const breakdown = { transport: 25, energy: 20, food: 20, waste: 10 };
    const steps = generateRoadmap(breakdown, 75);
    steps.forEach((step) => {
      expect(Number(step.estimatedReduction)).toBeGreaterThan(0);
    });
  });
});
