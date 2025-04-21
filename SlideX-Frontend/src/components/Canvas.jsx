// import React from "react";
// import { useEffect } from "react";
// import * as fabric from "fabric";
// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
// import { useDispatch } from "react-redux";
// import { setEditor } from "../redux/editorSlice";
// import {updateSlideJson} from "../redux/slideSlice"
// import { useSelector} from "react-redux";

// const Canvas = () => {
//  const slides = useSelector((state) => state.slides.slides);
//  const currentIndex = useSelector((state) => state.slides.currentIndex);
//   const dispatch = useDispatch();
//   const { editor, onReady } = useFabricJSEditor(); // Get editor instance
 


//   useEffect(() => {
//     if (!editor || !slides[currentIndex]) return;
  
//     dispatch(setEditor(editor));
  
//     const canvas = editor.canvas;
//     canvas.selection = true;
//     canvas.skipTargetFind = false;
//     canvas.defaultCursor = "default";
  
//     let lastJSON = "";
  
//     canvas.loadFromJSON(slides[currentIndex].elements, () => {
//       console.log("Frm canvas",currentIndex)
//       canvas.discardActiveObject();
//       canvas.requestRenderAll();
//       lastJSON = JSON.stringify(canvas.toJSON()); // baseline after loading
//       console.log("Loaded currentSlide");
//     });
  
//     const interval = setInterval(() => {
//       const currentJSON = JSON.stringify(canvas.toJSON());
//       if (currentJSON !== lastJSON) {
//         lastJSON = currentJSON;
//         dispatch(updateSlideJson({
//           slideIndex: currentIndex,
//           canvasJson: JSON.parse(currentJSON),
//         }));
//         console.log("Slide updated", slides[currentIndex]);
//       }
//       console.log("Slide updated", slides[currentIndex]);
//     }, 1000);
  
//     return () => clearInterval(interval);
//   }, [editor, dispatch, currentIndex]);
  
//   return (
//     <div className="w-full max-w-[90%] aspect-[16/9] flex justify-center items-center">
//     <div style={{ width: "1280px", height: "720px" }}>
//       <FabricJSCanvas
//         id="slideCanvas"
//         className="w-full h-full border-2"
//         onReady={onReady}
//       />
//     </div>
//   </div>
  


//   );
// };

// export default Canvas;


import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useDispatch, useSelector } from "react-redux";
import { setEditor } from "../redux/editorSlice";
import { updateSlideJson } from "../redux/slideSlice";

const Canvas = () => {
  const slides = useSelector((state) => state.slides.slides);
  const currentIndex = useSelector((state) => state.slides.currentIndex);
  const dispatch = useDispatch();
  const { editor, onReady } = useFabricJSEditor();

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;

  // 🔁 Rescale based on window/container size
  useEffect(() => {
    const resizeCanvas = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.offsetWidth;
      const parentHeight = containerRef.current.offsetHeight;

      const scaleX = parentWidth / CANVAS_WIDTH;
      const scaleY = parentHeight / CANVAS_HEIGHT;

      const newScale = Math.min(scaleX, scaleY, 1); // max 1 (never upscale)
      setScale(newScale);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // 🔁 Load and sync canvas content
  useEffect(() => {
    if (!editor || !slides[currentIndex]) return;

    const canvas = editor.canvas;
    dispatch(setEditor(editor));

    canvas.selection = true;
    canvas.skipTargetFind = false;
    canvas.defaultCursor = "default";

    let lastJSON = "";

    canvas.loadFromJSON(slides[currentIndex].elements, () => {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      lastJSON = JSON.stringify(canvas.toJSON());
    });

    const interval = setInterval(() => {
      const currentJSON = JSON.stringify(canvas.toJSON());
      if (currentJSON !== lastJSON) {
        lastJSON = currentJSON;
        dispatch(
          updateSlideJson({
            slideIndex: currentIndex,
            canvasJson: JSON.parse(currentJSON),
          })
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [editor, slides, currentIndex, dispatch]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[90%] flex justify-center items-center bg-gray-100 overflow-hidden"
    >
      <div className="border"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `scale(${scale})`,
          // transformOrigin: "top left",
        }}
      >
        <FabricJSCanvas
          id="slideCanvas"
          className="w-full h-full bg-white border shadow-md"
          onReady={onReady}
        />
      </div>
    </div>
  );
};

export default Canvas;
