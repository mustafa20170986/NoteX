import { screen, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserHome from "../../page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Aibutton from "@/components/aibutton";
import NotePage from "./page";
//mock the boundaries
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
vi.mock("@/components/aibutton", () => ({
  default: ({ noteId }: { noteId: string }) => (
    <button data-testid="mock-ai-button">Ai action button {noteId}</button>
  ),
}));

describe("note page [id] intigration test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("should redirect the unauth user to signin page", async () => {
    (auth as any).mockResolvedValue({
      userId: null,
    });
    const pagePrams = Promise.resolve({ id: "note-123" });
    const pageJsx = await NotePage({ params: pagePrams });
    render(pageJsx);
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
  it("should render note for authenticated users", async () => {
    (auth as any).mockResolvedValue({
      userId: "user-123",
    });
    const mocknote = { id: "note-123", title: "k8s", content: "done" };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mocknote,
    });
    const pagePrams = Promise.resolve({ id: "note-123" });
    //reder page
    const pageJsx = await NotePage({ params: pagePrams });
    render(pageJsx);
    //assert
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:2017/notes/getnote/note-123",
      { cache: "no-store" },
    );
    //assert ui rendering
    expect(screen.getByText("k8s")).toBeInTheDocument();
    expect(screen.getByText("done")).toBeInTheDocument();
    expect(screen.getByText("Ai action button note-123")).toBeInTheDocument();
  });
  it("return no note found or delted", async () => {
    (auth as any).mockResolvedValue({
      userId: "user-123",
    });
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => null,
    });
    const pageParams = Promise.resolve({ id: "note-123" });
    const pageJsx = await NotePage({ params: pageParams });
    render(pageJsx);
    expect(
      screen.getByText(/no notes found or maybe deleted/i),
    ).toBeInTheDocument();
  });
});
