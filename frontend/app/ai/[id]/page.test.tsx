import { ArrowUp, Loader2, ScrollText } from "lucide-react";
import { act, Suspense } from "react";
import {vi,expect,it,describe, beforeEach} from 'vitest'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import Airesponse from "./page";
//mock lucid compo 
vi.mock("lucide-react",()=>({
    ArrowUp: ()=> <span data-testid='arrowup'/>,
    Loader2: ()=> <span data-testid='loader2'/>,
    ScrollText: ()=> <span data-testid='scroll-test'/>
}))
//mock the fetch 
const mockfetch=vi.fn()
global.fetch=mockfetch

describe("airesponse",()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })
    //render compo 
    const rendercompo= async (noteId='note-123')=>{
        const mockParams=Promise.resolve({id:noteId})
        await act( async()=> {
            render(
<Suspense fallback={<div> Loading...</div>}>
<Airesponse params={mockParams}/>
</Suspense>
            )
        }


        )
    }
    //fetch note first 
    it("fetches initial note",async()=>{
        mockfetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>({
                title:'init title',
                content: 'init content'
            })
        })
        rendercompo('note-123')
         await waitFor(()=>{
            expect(mockfetch).toHaveBeenCalledWith("http://localhost:2017/notes/getnote/note-123")
         })
    })
    //sneds user note and ai response 
    it(" sends user pormpt and note",async()=>{
        mockfetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>({
                title:'init title',
                content: 'init content'
            })
        })
        rendercompo("note-123")

        await waitFor(()=>{
            expect(mockfetch).toHaveBeenCalledWith(
                "http://localhost:2017/notes/getnote/note-123"
            )
        })
        //mock ai response 
        mockfetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>({
                text: "this is ai response"
            })
        })
        const textarea=screen.getByPlaceholderText('Ask something')
        const submitbtn=screen.getByRole("button")
        //type prompt 
        fireEvent.change(textarea,{target:{value:"summarize the note"}})
        expect(textarea).toHaveValue("summarize the note")
        //submit prompt 
        fireEvent.click(submitbtn)

        //assert post call for summary 
        //wait for the ai reposne api got triggered 
        await waitFor(()=>{
            expect(mockfetch).toHaveBeenCalledWith(
                "http://localhost:2017/ai/summary",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
sessionId:'note-123',
prompt: 'summarize the note',
content: 'init content'
                    })
                }
            )
        })
        //verify the message in the scrren 
        await waitFor(()=>{
const usermsg=screen.getAllByText('summarize the note')
expect(usermsg.length).toBeGreaterThan(0)
            expect(screen.getByText("this is ai response")).toBeInTheDocument()
        })
    })
    it("should disabled when prommpt input is empty",async()=>{
        mockfetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>({
                title: "title",
                content: "content"
            })
        })
rendercompo()
 const submitbtn=await screen.findByRole('button')
    expect(submitbtn).toBeDisabled()
    })
   
})
