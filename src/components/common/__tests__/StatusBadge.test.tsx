import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../StatusBadge";

describe("StatusBadge", () => {
  it("should render critical status correctly", () => {
    render(<StatusBadge status="critical" />);
    const badge = screen.getByText("CRITICAL");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("text-red-500");
  });

  it("should render warning status correctly", () => {
    render(<StatusBadge status="warning" />);
    const badge = screen.getByText("WARNING");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("text-yellow-500");
  });

  it("should render normal status correctly", () => {
    render(<StatusBadge status="normal" />);
    const badge = screen.getByText("NORMAL");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("text-blue-500");
  });

  it("should render optimal status correctly", () => {
    render(<StatusBadge status="optimal" />);
    const badge = screen.getByText("OPTIMAL");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("text-green-500");
  });

  it("should apply custom className when provided", () => {
    render(<StatusBadge status="normal" className="custom-class" />);
    const badge = screen.getByText("NORMAL");
    expect(badge.className).toContain("custom-class");
  });
});
