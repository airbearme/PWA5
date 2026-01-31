import React from "react";
import { render, act } from "@testing-library/react";
import BookRidePage from "../../app/book/page";
import { getSupabaseClient } from "../../lib/supabase/client";

// Mock supabase
const mockSelect = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
const mockFrom = jest.fn().mockReturnValue({
  select: mockSelect,
  eq: mockEq,
  order: mockOrder,
});

jest.mock("../../lib/supabase/client", () => ({
  getSupabaseClient: () => ({
    from: mockFrom,
  }),
}));

// Mock next/navigation
let currentSearchParams = new URLSearchParams();
const mockUseSearchParams = jest.fn(() => currentSearchParams);

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock auth context
jest.mock("../../components/auth-provider", () => ({
  useAuthContext: () => ({ user: { id: "1" }, loading: false }),
}));

// Mock toast
jest.mock("../../hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe("BookRidePage Performance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentSearchParams = new URLSearchParams();
  });

  it("should NOT refetch spots when search params change (Bottleneck Fixed)", async () => {
    const { rerender } = render(<BookRidePage />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const countAfterInitial = mockFrom.mock.calls.filter(call => call[0] === "spots").length;

    // Simulate search params change
    currentSearchParams = new URLSearchParams("foo=bar");

    await act(async () => {
      rerender(<BookRidePage />);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const countAfterRerender = mockFrom.mock.calls.filter(call => call[0] === "spots").length;

    // Expect it to NOT have refetched (count remains the same)
    expect(countAfterRerender).toBe(countAfterInitial);
  });
});
