import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import Addnote from "./page";
import SyncUser from "@/components/syncuser";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

vi.mock("@/components/syncuser", () => ({
  default: vi.fn(),
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe(" intigration test of add new note", () => {
  const mockToken = vi.fn().mockResolvedValue("jwt-token");
  const mockPush = vi.fn();
  const mockinvalidateQueries = vi.fn();

  const mockuser = {
    id: "user-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useQueryClient as any).mockReturnValue({
      invalidateQueries: mockinvalidateQueries,
    });
    (SyncUser as any).mockReturnValue({
      token: mockToken,
      username: mockuser,
      isSignedIn: true,
      isLoaded: true,
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("should create new note", async () => {
    const user = userEvent.setup();
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ messsage: "Note created" }),
    });
    render(<Addnote />);
    const titleinp = await screen.findByPlaceholderText(/title/i);
    const continp = await screen.findByPlaceholderText(
      /here you can start|content/i,
    );
    const savebtn = screen.getByRole("button", { name: /save|submit|done/i });

    //fill the form
    await user.type(titleinp, "docker");
    await user.type(continp, "docker is hard to learn");
    await user.click(savebtn);

    //assertion
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:2017/notes/crnote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
          body: JSON.stringify({
            title: "docker",
            content: "docker is hard to learn",
            authorId: "user-123",
          }),
        },
      );
    });

    //invalid the query of tanstack
    expect(mockinvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["notes", "user-123"],
    });
    //assert the navigation
    expect(mockPush).toHaveBeenCalledWith("/userhome");
  });
});
