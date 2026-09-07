import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import Editpage from "./page";
import { act } from "@testing-library/react";
describe("intigration test of edit page", () => {
  const noteId = "note-123";
  const pageParams = Promise.resolve({ id: noteId });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should  fetch the note and pass this on the form", async () => {
    const noteId = "note-123";
    const pageParams = Promise.resolve({ id: noteId });
    const mocknote = {
      id: noteId,
      title: "k8s",
      content: "done",
    };
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mocknote,
    });
    await act(async () => {
      render(<Editpage params={pageParams} />);
      await pageParams;
    });
    await waitFor(() => {
      //asssert
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:2017/notes/getnote/${noteId}`,
      );
      expect(screen.getByDisplayValue("k8s")).toBeInTheDocument();
      expect(screen.getByDisplayValue("done")).toBeInTheDocument();
    });
  });
  it("should send put request for updated data", async () => {
    const user = userEvent.setup();

    //first perform the get request

    const mocknote = {
      id: noteId,
      title: "k8s",
      content: "done",
    };
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mocknote,
    });
    await act(async () => {
      render(<Editpage params={pageParams} />);
      await pageParams;
    });
    const oldtitle = await screen.findByDisplayValue("k8s");
    const oldcont = await screen.findByDisplayValue("done");
    // perfrom  put request
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messgae: "updates nest js " }),
    });
    
    //clear input and update values
    await user.clear(oldtitle);
    await user.type(oldtitle, "nest");
    await user.clear(oldcont);
    await user.type(oldcont, "learning");

    const savebutton = screen.getByRole("button", {
      name: /done|save|submit/i,
    });
    await user.click(savebutton);

    //assert
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `http://localhost:2017/notes/editnote/${noteId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "nest",
          content: "learning",
        }),
      },
    );
  });
});
