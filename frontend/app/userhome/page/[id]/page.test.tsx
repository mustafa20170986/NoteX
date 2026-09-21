import { screen, render } from "@testing-library/react";
import NotePage from "./page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  })),
}));

vi.mock("@/components/aibutton", () => ({
  default: function MockAiButton() {
    return <div data-testid="ai-button">AI Button</div>;
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("NotePage (Vitest)", () => {
  const mockParams = Promise.resolve({ id: "note123" });
  const API_URL = "http://notex-backend-service:2017";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_URL = API_URL;
  });

  afterEach(() => {
    delete process.env.API_URL;
  });

  it("should return the user to the signup page when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    await NotePage({ params: mockParams });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("should display 'No Notes Found' message when note does not exist", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-69" } as any);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => null,
    });

    const compo = await NotePage({ params: mockParams });
    render(compo);

    expect(
      screen.getByText(/No Notes Found Or maybe deleted/i),
    ).toBeInTheDocument();
  });

  it("should render note details when notes exist", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-999" } as any);
    const mockNote = {
      id: "note123",
      title: "test title",
      content: "test content",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNote,
    });

    const compo = await NotePage({ params: mockParams });
    render(compo);

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/notes/getnote/note123`,
      { cache: "no-store" },
    );

    expect(screen.getByText("test title")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
    expect(screen.getByTestId("ai-button")).toBeInTheDocument();
  });
});





