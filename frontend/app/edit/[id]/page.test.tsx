import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Editpage from "./page";
import { Suspense } from "react";
import Input from "@/components/inputcompo";
//mock input compo
vi.mock("@/components/inputcompo", () => ({
  default: function MockInput({
    onSubmitnote,
    initTitle,
    initContent,
    isLoading,
  }: {
    onSubmitnote: (title: string, content: string) => Promise<void>;
    initTitle: string;
    initContent: string;
    isLoading: boolean;
  }) {
    if (isLoading) {
      return <div data-testid="loading-state">Loading</div>;
    }
    return (
      <div>
        <span data-testid="title-prop">{initTitle}</span>
        <span data-testid="content-prop">{initContent}</span>
        <button
          data-testid="mock-submit-btn"
          onClick={() => onSubmitnote("updated title", "updated content")}
        >
          Save note
        </button>
      </div>
    );
  },
}));
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("edit page ", () => {
  const mockParams = Promise.resolve({ id: "123" });

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("fetch note and passes to input compo", async () => {
    const mockParams = Promise.resolve({ id: "123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "original title",
        content: "original content",
      }),
    });
    await act(async()=>{
 render(
      <Suspense fallback={<div>Loading...</div>}>
        <Editpage params={mockParams} />
      </Suspense>,
    );

    })
   
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:2017/notes/getnote/123",
      );
    });

    //wait for fetch the note and get the original title and contet

    await waitFor(() => {
      expect(screen.getByTestId("title-prop")).toHaveTextContent(
        "original title",
      );
      expect(screen.getByTestId("content-prop")).toHaveTextContent(
        "original content",
      );
    });
  });
  it("send put request ", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "original title",
        content: "original content",
      }),
    });
    await act(async()=>{
 render(
      <Suspense fallback={<div>Loading...</div>}>
        <Editpage params={mockParams} />
      </Suspense>,
    );
    })
   

    //wait for form to load

    const submitbtn = await screen.findByTestId("mock-submit-btn");
    //mock the response for put request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Note updated",
      }),
    });
    //act
    fireEvent.click(submitbtn);
    //assert wait for putm req for exec
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:2017/notes/editnote/123",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "updated title",
            content: "updated content",
          }),
        },
      );
    });
  });
});


//why used act,suspenses,findbytext 
//why double get request test