import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SyncUser from "@/components/syncuser";
import UserHome from "./page";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import Drawer from "@/components/drawer";
import Usernavbar from "@/components/usernavbar";
import Card from "@/components/card";
//mock compo and core functions
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

//mock syncuser
vi.mock("@/components/syncuser", () => ({
  default: vi.fn(),
}));
//mock drawer compo
vi.mock("@/components/drawer", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-drawer">{children}</div>
  ),
}));
//mock user navbar
vi.mock("@/components/usernavbar", () => ({
  default: () => <div data-testid="mock-navbar">Navbar</div>,
}));
//mock card compo
vi.mock("@/components/card", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="mock-title">{title}</div>
  ),
}));
// Test helper to wrap components requiring TanStack Query
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Prevents infinite retry loops on failure cases
      },
    },
  });

//i didnt understand this
function renderWithClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("userhome unit test", () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockToken = vi.fn().mockResolvedValue("mock-token");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    (useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("render loading state while user is verifyig", async () => {
    (SyncUser as any).mockReturnValue({
      token: mockToken,
      isSignedIn: false,
      isLoaded: false,
      username: null,
    });
    renderWithClient(<UserHome />);
    expect(
      screen.getByText(/syncing user credentials\.\.\./i),
    ).toBeInTheDocument();
  });
  it("fetches data for authenticated users", async () => {
    (SyncUser as any).mockReturnValue({
      token: mockToken,
      isSignedIn: true,
      isLoaded: true,
      username: { id: "user-123", fullName: "rayan" },
    });
    const mocknote = [
      { id: "n-123", title: "k8s", content: " done" },
      { id: "n-23", title: "nest", content: "still learning" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mocknote,
    });
    renderWithClient(<UserHome />);

    //wait untill the notes are arrived
    await waitFor(() => {
      expect(screen.getByText("rayan's Notes")).toBeInTheDocument();
      expect(screen.getByText("k8s")).toBeInTheDocument();
      expect(screen.getByText("nest")).toBeInTheDocument();
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:2017/notes/findnote/user-123",
    );
  });
  it("handles when there is no note for a user", async () => {
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
    renderWithClient(<UserHome />);
    await waitFor(() => {
      expect(screen.getByText(/no notes found yet\./i)).toBeInTheDocument();
    });
  });
  it("should naviagte to new note whne got cliekd", async () => {
    const user = userEvent.setup();
    (SyncUser as any).mockReturnValue({
      token: mockToken,
      isSignedIn: true,
      isLoaded: true,
      username: { id: "suer-123", fullName: "rayan" },
    });
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    renderWithClient(<UserHome />);
    const adbutton = screen.getByRole("button", { name: /add new note/i });
    await user.click(adbutton);

    expect(mockPush).toHaveBeenCalledWith("/newnote");
  });
});

//why i tested this in a different way ?
////mock user navbar
//vi.mock("@/components/usernavbar", () => ({
//default: () => <div data-testid="mock-navbar">Navbar</div>,
//}));
