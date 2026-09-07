import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import Addnote from "./page";
import SyncUser from "@/components/syncuser";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { describe, vi, it, expect } from "vitest";
import Button from "@/components/button";
import Input from "@/components/inputcompo";
vi.mock("@/components/syncuser", () => ({
  default: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(),
}));
vi.mock("@/components/inputcompo", () => ({
  default: function Mockinput({
    onSubmitnote,
  }: {
    onSubmitnote: (title: string, content: string) => Promise<void>;
  }) {
    return (
      <button
        data-testid="mock-submit-btn"
        onClick={() => onSubmitnote("test-title", "test-content")}
      >
        Submit note
      </button>
    );
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("add new note", () => {
  const mockPush = vi.fn();
  const mockInvalidQuery = vi.fn();
  const mockGetToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidQuery,
    } as any);

    vi.mocked(SyncUser).mockReturnValue({
      token: mockGetToken,
      username: { id: "author-999" },
      isSignedIn: true,
      isLoaded: true,
    } as any);
  });

  it("renders the add note compo", () => {
    render(<Addnote />);
    expect(screen.getByText("Submit note")).toBeInTheDocument();
  });

  it("sends post request for crwating note", async () => {
    //Arrange
    const mockJwttoken = "fake jwt";
    mockGetToken.mockResolvedValue(mockJwttoken);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "new noteid ",
      }),
    });
    render(<Addnote />);
    //act
    const submitbtn = screen.getByTestId("mock-submit-btn");
    fireEvent.click(submitbtn);
    //assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:2017/notes/crnote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockJwttoken}`,
          },
          body: JSON.stringify({
            title: "test-title",
            content: "test-content",
            authorId: "author-999",
          }),
        },
      );
    });

    //validate invalid cahce query
    //assert 2
    expect(mockInvalidQuery).toHaveBeenCalledWith({
      queryKey: ["notes", "author-999"],
    });
    //assert 3
    expect(mockPush).toHaveBeenCalledWith("/userhome");
  });
});
