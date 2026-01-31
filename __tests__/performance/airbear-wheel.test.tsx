import React, { useState, useEffect, Profiler } from "react";
import { render, act } from "@testing-library/react";
import AirbearWheel from "../../components/airbear-wheel";

describe("AirbearWheel Performance", () => {
  it("should NOT re-render when parent re-renders if memoized", async () => {
    const onRender = jest.fn();

    function Parent() {
      const [count, setCount] = useState(0);

      // We'll trigger the update manually to be sure
      (window as any).triggerUpdate = () => setCount(c => c + 1);

      return (
        <Profiler id="AirbearWheel" onRender={onRender}>
          <AirbearWheel size="md" />
        </Profiler>
      );
    }

    render(<Parent />);

    // Initial render
    expect(onRender).toHaveBeenCalledTimes(1);

    // Trigger update
    await act(async () => {
      (window as any).triggerUpdate();
    });

    // If memoized, it should still be 1!
    expect(onRender).toHaveBeenCalledTimes(1);
  });
});
