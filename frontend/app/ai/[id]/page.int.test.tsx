import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import Airesponse from "./page";

describe("ai response intigration test", () => {
  const noteId = "note-123";

  const mocknote = {
    id: noteId,
    title: "k8s",
    content: "hard to learn",
  };
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("should fetch note details and send for ai", async () => {
    const pageParams = Promise.resolve({ id: noteId });
    const user = userEvent.setup();
    //first fetch the note
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mocknote,
    });
    await act(async () => {
      render(<Airesponse params={pageParams} />);
      await pageParams;
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `http://localhost:2017/notes/getnote/${noteId}`,
    );
    expect(
      screen.getByText(/Ask Anything Or Make a Summary of Your Note/i),
    ).toBeInTheDocument();

    //second part send the ai response

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ text: "here is your summary" }),
    });
    const txtarea = screen.getByPlaceholderText(/Ask something/i);
    const btn = screen.getByRole("button");
    await user.type(txtarea, "summarize the note");
    await user.click(btn);

    //assert
    expect(screen.getByText("summarize the note"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:2017/ai/summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: noteId,
            prompt: "summarize the note",
            content: mocknote.content,
          }),
        },
      );
    });
    //verify ai response
    expect(await screen.findByText("here is your summary")).toBeInTheDocument();
  });
  it("should prevent when prompt is empty", async () => {
    const pageParams = Promise.resolve({ id: "note-123" });

    (globalThis.fetch as any).mockResolvedValue(new Promise(() => {}));
    await act(async () => {
      render(<Airesponse params={pageParams} />);
      await pageParams;
    });
    const sbtn = screen.getByRole("button");

    expect(sbtn).toBeDisabled();
  });
});
