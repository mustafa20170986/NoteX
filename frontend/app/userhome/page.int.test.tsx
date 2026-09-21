import { screen, render, waitFor } from "@testing-library/react";
import UserHome from "./page";
import SyncUser from "@/components/syncuser";
import { useRouter } from "next/navigation";
import { vi, expect, describe, it, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/components/syncuser", () => ({
  default: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="mock-user-button">UserButton</div>,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: () => ({ isSignedIn: true, userId: "user-123" }),
}));

const createIntegrationQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

function renderIntegration(ui: React.ReactElement) {
  const queryClient = createIntegrationQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("integration test of userhome", () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockToken = vi.fn().mockResolvedValue("mock-token");
  const API_URL = "http://notex-backend-service:2017";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    (useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it("should render complete ui and fetch form api", async () => {
    (SyncUser as any).mockReturnValue({
      token: mockToken,
      isSignedIn: true,
      isLoaded: true,
      username: { id: "user-123", fullName: "rayan" },
    });

    const mocknote = [
      { id: "note-1", title: "k8s", content: "done" },
      { id: "note-123", title: "nest", content: "learning" },
    ];

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mocknote,
    });

    renderIntegration(<UserHome />);

    await waitFor(() => {
      expect(screen.getByText("rayan's Notes")).toBeInTheDocument();

      const k8sElements = screen.getAllByText("k8s");
      expect(k8sElements.length).toBeGreaterThan(0);

      const nestElements = screen.getAllByText("nest");
      expect(nestElements.length).toBeGreaterThan(0);
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_URL}/notes/findnote/user-123`,
    );
  });

  it("handles empty state of the notes", async () => {
    (SyncUser as any).mockReturnValue({
      token: mockToken,
      isSignedIn: true,
      isLoaded: true,
      username: { id: "user-123", fullName: "rayan" },
    });

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    renderIntegration(<UserHome />);

    await waitFor(() => {
      expect(screen.getByText(/no notes found yet\./i)).toBeInTheDocument();
    });
  });

  it("handles onclick new note button", async () => {
    const user = userEvent.setup();

    (SyncUser as any).mockReturnValue({
      token: mockToken,
      isSignedIn: true,
      isLoaded: true,
      username: { id: "user-123", fullName: "rayan" },
    });

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    renderIntegration(<UserHome />);

    const addbutton = screen.getByRole("button", { name: /add new note/i });
    await user.click(addbutton);

    expect(mockPush).toHaveBeenCalledWith("/newnote");
  });
});