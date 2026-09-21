import { screen, render } from "@testing-library/react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import NotePage from "./page";

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

describe("note page [id] integration test", () => {
  const API_URL = "http://notex-backend-service:2017";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    process.env.API_URL = API_URL;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.API_URL;
  });

  it("should redirect the unauth user to signin page", async () => {
    (auth as any).mockResolvedValue({
      userId: null,
    });

    const pageParams = Promise.resolve({ id: "note-123" });
    const pageJsx = await NotePage({ params: pageParams });
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

    const pageParams = Promise.resolve({ id: "note-123" });
    const pageJsx = await NotePage({ params: pageParams });
    render(pageJsx);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_URL}/notes/getnote/note-123`,
      { cache: "no-store" },
    );

    expect(screen.getByText("k8s")).toBeInTheDocument();
    expect(screen.getByText("done")).toBeInTheDocument();
    expect(screen.getByText("Ai action button note-123")).toBeInTheDocument();
  });

  it("return no note found or deleted", async () => {
    (auth as any).mockResolvedValue({
      userId: "user-123",
    });

    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
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
