import { describe, it, expect } from "vitest";
import {
  formatResourceLevel,
  formatPercentage,
  formatDaysRemaining,
  getResourceIcon,
} from "../formatters";

describe("formatters", () => {
  describe("formatResourceLevel", () => {
    it("should format resource level with unit", () => {
      expect(formatResourceLevel(1000, "kg")).toBe("1,000 kg");
      expect(formatResourceLevel(500.5, "L")).toBe("500.5 L");
      expect(formatResourceLevel(0, "units")).toBe("0 units");
    });
  });

  describe("formatPercentage", () => {
    it("should calculate and format percentage correctly", () => {
      expect(formatPercentage(50, 100)).toBe("50.0%");
      expect(formatPercentage(75, 100)).toBe("75.0%");
      expect(formatPercentage(33, 100)).toBe("33.0%");
    });

    it("should handle edge cases", () => {
      expect(formatPercentage(0, 100)).toBe("0.0%");
      expect(formatPercentage(100, 100)).toBe("100.0%");
    });

    it("should round to one decimal place", () => {
      expect(formatPercentage(66.666, 100)).toBe("66.7%");
      expect(formatPercentage(33.333, 100)).toBe("33.3%");
    });
  });

  describe("formatDaysRemaining", () => {
    it("should format days correctly", () => {
      expect(formatDaysRemaining(5)).toBe("5 days");
      expect(formatDaysRemaining(1)).toBe("1 day");
      expect(formatDaysRemaining(10.7)).toBe("10 days");
    });

    it("should handle less than 1 day", () => {
      expect(formatDaysRemaining(0.5)).toBe("Less than 1 day");
      expect(formatDaysRemaining(0)).toBe("Less than 1 day");
    });

    it("should handle null or undefined", () => {
      expect(formatDaysRemaining(null)).toBe("N/A");
      expect(formatDaysRemaining(undefined)).toBe("N/A");
    });
  });

  describe("getResourceIcon", () => {
    it("should return correct icon for each resource type", () => {
      expect(getResourceIcon("oxygen")).toBe("Wind");
      expect(getResourceIcon("water")).toBe("Droplet");
      expect(getResourceIcon("food")).toBe("UtensilsCrossed");
      expect(getResourceIcon("spare_parts")).toBe("Wrench");
      expect(getResourceIcon("batteries")).toBe("BatteryCharging");
      expect(getResourceIcon("population")).toBe("Users");
    });
  });
});
