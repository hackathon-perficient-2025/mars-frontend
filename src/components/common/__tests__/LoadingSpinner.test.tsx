import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render loading spinner", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should display custom text when provided", () => {
    render(<LoadingSpinner text="Loading resources..." />);
    expect(screen.getByText("Loading resources...")).toBeInTheDocument();
  });

  it("should apply custom size", () => {
    const { container } = render(<LoadingSpinner size={32} />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<LoadingSpinner className="text-blue-500" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner?.className).toContain("text-blue-500");
  });
});
