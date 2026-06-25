import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home Page", () => {
  it("should render the hero section", () => {
    render(<Home />);

    expect(screen.getByText("GitHub Portfolio")).toBeInTheDocument();
    expect(screen.getByText(/Visualize your GitHub journey/)).toBeInTheDocument();
  });

  it("should render the search form", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText("Enter GitHub username...");
    const button = screen.getByRole("button", { name: /Search/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should render all feature cards", () => {
    render(<Home />);

    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Contributions")).toBeInTheDocument();
    expect(screen.getByText("Top Projects")).toBeInTheDocument();
  });

  it("should render example user buttons", () => {
    render(<Home />);

    expect(screen.getByText("@torvalds")).toBeInTheDocument();
    expect(screen.getByText("@gvanrossum")).toBeInTheDocument();
    expect(screen.getByText("@antirez")).toBeInTheDocument();
    expect(screen.getByText("@elisealder")).toBeInTheDocument();
  });

  it("should disable search button when input is empty", () => {
    render(<Home />);

    const button = screen.getByRole("button", { name: /Search/i });
    expect(button).toBeDisabled();
  });

  it("should enable search button when input has text", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText("Enter GitHub username...") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Search/i });

    fireEvent.change(input, { target: { value: "torvalds" } });
    expect(button).not.toBeDisabled();
  });

  it("should disable search button when input is only whitespace", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText("Enter GitHub username...") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Search/i });

    fireEvent.change(input, { target: { value: "   " } });
    expect(button).toBeDisabled();
  });

  it("should render theme toggle button", () => {
    render(<Home />);

    const themeToggle = screen.getByRole("button");
    expect(themeToggle).toBeInTheDocument();
  });

  it("should have correct feature descriptions", () => {
    render(<Home />);

    expect(screen.getByText("View your followers, repos, and total stars")).toBeInTheDocument();
    expect(screen.getByText("Track your coding streak and activity")).toBeInTheDocument();
    expect(
      screen.getByText("Highlight your most popular repositories")
    ).toBeInTheDocument();
  });

  it("should accept text input", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText("Enter GitHub username...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "testuser" } });

    expect(input.value).toBe("testuser");
  });
});
