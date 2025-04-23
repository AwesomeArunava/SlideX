import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as fabric from "fabric";
import { 
  setCurrentIndex, 
  updateHistory, 
  deleteSlide, 
  addSlideAsImage,
  reorderSlides 
} from "../redux/slideSlice";
import slidex from "../assets/slidex.png";
import { MdDelete } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Slide = () => {
  const slides = useSelector((state) => state.slides.slides);
  const editor = useSelector((state) => state.editor.editor);
  const selectedIndex = useSelector((state) => state.slides.currentIndex);
  const dispatch = useDispatch();

  const [thumbnails, setThumbnails] = useState([]);



  const { id: slideDeckId } = useParams();

  useEffect(() => {
    const updatePreviewImage = async (imageUrl) => {
      try {
        const response = await fetch('http://localhost:3000/api/slide/updatePreview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            slideId: slideDeckId, // Using ID from URL params
            previewImage: imageUrl
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
      } catch (error) {
        console.error('Failed to update preview image:', error);
      }
    };

    const generateThumbnails = async () => {
      const fullWidth = 1280;
      const fullHeight = 720;
    
      const thumbWidth = 200;
      const thumbHeight = (thumbWidth * 9) / 16;
    
      const imgs = await Promise.all(
        slides.map((slide) => {
          return new Promise((resolve) => {
            const fabricCanvas = new fabric.Canvas(document.createElement("canvas"), {
              width: fullWidth,
              height: fullHeight,
              backgroundColor: "#fff",
            });
    
            fabricCanvas.loadFromJSON(slide.elements, () => {
              fabricCanvas.renderAll();
    
              // Delay ensures render completes
              setTimeout(() => {
                // Render main canvas to image
                const fullImage = new Image();
                fullImage.onload = () => {
                  const thumbCanvas = document.createElement("canvas");
                  thumbCanvas.width = thumbWidth;
                  thumbCanvas.height = thumbHeight;
    
                  const ctx = thumbCanvas.getContext("2d");
                  ctx.clearRect(0, 0, thumbWidth, thumbHeight);
                  ctx.drawImage(
                    fullImage,
                    0, 0, fullWidth, fullHeight,
                    0, 0, thumbWidth, thumbHeight
                  );
    
                  resolve(thumbCanvas.toDataURL("image/png"));
                  fabricCanvas.dispose();
                };
    
                fullImage.src = fabricCanvas.toDataURL({
                  format: "png",
                  multiplier: 1,
                });
              }, 100);
            });
          });
          // dispatch(updateHistory({
          //   slideIndex: slide.id-1,
          //   canvasJson: editor.canvas,
          // }))
        })
      );
    
      setThumbnails(imgs);
      dispatch(addSlideAsImage(imgs));
      // Update preview image with first thumbnail if available
      if (imgs.length > 0) {
        console.log("image:",imgs[0])
        await updatePreviewImage(imgs[0]);
      }
    };
    
     
    
   
       
    
    
    generateThumbnails();

  }, [slides]);

  const handleSlideClick = (index) => {
    dispatch(setCurrentIndex(index));
    if (editor?.canvas && slides[index]) {
      editor.canvas.loadFromJSON(slides[index].elements, () => {
        editor.canvas.renderAll();
        editor.canvas.discardActiveObject();
          slides.map((_,index)=>{
                if(index === selectedIndex && slides[currentSlide].history !== editor.canvas.toJSON()){
                  // setHistory((prevHistory) => [...prevHistory, JSON.stringify(editor.canvas.toJSON())]);
                  dispatch(updateHistory({
                    slideIndex: currentSlide,
                    canvasJson: JSON.parse(JSON.stringify(editor.canvas.toJSON()))
                  }));
                  
                }
              })
      });
    }
  };

  const handleDelete = (index)=>{
    dispatch(deleteSlide({
      slideIndex: index
    }))
  } 

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    if (source.index === destination.index) return;

    dispatch(reorderSlides({
      fromIndex: source.index,
      toIndex: destination.index
    }));
  };

  return (
    <div className="p-2 overflow-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {thumbnails.map((src, index) => (
                <Draggable key={index} draggableId={`slide-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex mb-2 items-center space-x-2 cursor-pointer"
                    >
                      <div className="w-6 text-center">{index + 1}</div>

                      <div
                        className={`group relative w-[200px] h-[120px] border bg-white shadow overflow-hidden ${
                          index === selectedIndex
                            ? "border-blue-600 shadow-lg ring-2 ring-blue-300"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleSlideClick(index)}
                      >
        {/* Delete Icon - Visible on Hover */}
                        <button
                          className="absolute top-1 right-1 text-red-600 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                        >
                          <MdDelete size={18} className="cursor-pointer"/>
                        </button>

                        <img
                          src={src}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Slide;


