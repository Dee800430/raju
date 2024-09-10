import { useMyPresence, useOthers } from "@/liveblocks.config"
import LiveCursor from "./cursor/LiveCursor"
import React, { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";



const Live = () => {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;
    const [cursorState ,setCursorState] = useState<CursorState>({
        mode:CursorMode.Hidden,
    })
    const [reaction,setReaction] = useState<Reaction[]>([])

    const handlePointerMove = useCallback((event:React.PointerEvent) => {
        event.preventDefault();
        if(cursor == null || cursorState.mode !== CursorMode.ReactionSelector){
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    
            updateMyPresence({ cursor: { x, y } }); // Corrected the syntax here
        }

        

    }, []);
    const handlePointerLeave = useCallback((event:React.PointerEvent) => {
        setCursorState({mode:CursorMode.Hidden})
        

        updateMyPresence({ cursor:null, message:null }); // Corrected the syntax here

    }, []);
    const handlePointerDown = useCallback((event:React.PointerEvent) => {
        event.preventDefault();

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } }); // Corrected the syntax here
        setCursorState((state:CursorState) =>
        cursorState.mode === CursorMode.Reaction ? {...state, isPressed:true} : state
        );

    }, [cursorState.mode ,setCursorState]);
    const handlePointerUp = useCallback((event:React.PointerEvent)=>{
        setCursorState((state:CursorState) =>
        cursorState.mode === CursorMode.Reaction ? {...state, isPressed:true} : state
        );

    },[cursorState.mode ,setCursorState])
    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if(e.key ==='/'){
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage:null,
                    message:'',
                })
            }else if(e.key === 'Escape'){
                updateMyPresence({message:''})
                setCursorState({mode:CursorMode.Hidden})
            }
        }
        const onKeyDown =(e: KeyboardEvent)=> {
            if(e.key == '/'){
                e.preventDefault();
            }else if(e.key ==='e'){
                setCursorState({
                  mode:CursorMode.ReactionSelector,  
                })
            }
        }
        window.removeEventListener('keydown',onKeyUp);
        window.removeEventListener('keydown',onKeyDown);


        return () => {
            window.removeEventListener('keydown',onKeyUp);
            window.removeEventListener('keydown',onKeyDown);
        }
    },[updateMyPresence]);
    const setReactions = useCallback((reaction:string) => {
        setCursorState({mode: CursorMode.Reaction,reaction,isPressed:false})
    },[]) 
  
  return (
    <div
       onPointerMove={handlePointerMove}
       onPointerLeave={handlePointerLeave}
       onPointerDown={handlePointerDown}
       onPointerUp={handlePointerUp}
       className="h-[100vh] w-full flex justify-center items-center text-center">
         <h1 className="font-2xl text-white">Liveblocks Figma Clone</h1>
            
          {cursor && (
            <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState ={setCursorState}
            updateMyPresence = {updateMyPresence}
            />
          )}  
          {cursorState.mode === CursorMode.ReactionSelector && (
            <ReactionSelector 
            setReaction={setReactions}
             />
          )}
   
        <LiveCursor others={others}/>
    </div>
  )
}

export default Live