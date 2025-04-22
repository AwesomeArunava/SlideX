import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Tooltip, Dropdown, Button } from "antd";
import slidex from "../assets/slidex.png";
import { FaCircle, FaPencilAlt, FaShapes } from "react-icons/fa";
import { MdFormatShapes } from "react-icons/md";
import { FaRegImage } from "react-icons/fa";
import { MdFormatColorText } from "react-icons/md";
import { GrUndo, GrRedo } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { CiExport } from "react-icons/ci";
// import ColorPicker from "./ColorPicker";
import {ColorPicker} from "antd";
import { jsPDF } from "jspdf";
import PptxGenJS from "pptxgenjs";
import { useSelector, useDispatch } from "react-redux";
import * as fabric from "fabric";
import { addSlide, updateHistory, undoHistory, redoHistory } from "../redux/slideSlice";
const { Header } = Layout;

const Navbar = () => {
  const editor = useSelector((state) => state.editor.editor);
  const slides = useSelector((state) => state.slides.slides);
  const currentSlide = useSelector((state) => state.slides.currentSlide);
  const currentIndex = useSelector((state) => state.slides.currentIndex);
  const slidesAsImg = useSelector((state)=> state.slides.slidesAsImg);
  // const historyState = useSelector((state)=> state.slides.slides.history)
  // const [history, setHistory] = useState([]);
  // const [redoStack, setRedoStack] = useState([]);
  // Default export is a4 paper, portrait, using millimeters for units

// const exportSlide = () =>{
//   const doc = new jsPDF();

// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");
// }
  const dispatch = useDispatch();

  useEffect(() => {
    
    const handleKeyDown = (event) => {
      if (!editor || !editor.canvas) return;
  
      const activeObject = editor.canvas.getActiveObject();
  
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      } else if (
        event.key === "Backspace" &&
        !(activeObject?.isEditing || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")
      ) {
        event.preventDefault(); // prevent default browser action
        deleteSelected();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slides]);
  
  useEffect(() => {
    if (editor) {
      // Save initial blank state once
      // setHistory([JSON.stringify(editor.canvas.toJSON())]);
      slides.map((_,index)=>{
        if(index === currentIndex){
          // setHistory((prevHistory) => [...prevHistory, JSON.stringify(editor.canvas.toJSON())]);
          dispatch(updateHistory({
            slideIndex: currentIndex,
            canvasJson: JSON.parse(JSON.stringify(editor.canvas.toJSON()))
          }));
          
        }
      })
    }
  }, [editor]);

  const saveState = () => {
    setTimeout(()=>{
      if (!editor || !editor.canvas) return;
    
      // slides.map((_,index)=>{
      //   if(index === currentIndex){
      //     console.log("enter into saveState()");
          // setHistory((prevHistory) => [...prevHistory, JSON.stringify(editor.canvas.toJSON())]);
          dispatch(updateHistory({
            slideIndex: currentIndex,
            canvasJson: editor.canvas.toJSON()
          }));
          // setRedoStack([]); // Clear redo stack on new change
          
      //   }
      // })
    },1000)
   
   
  };



  const undo = () => {
    console.log(slides[currentIndex].history);
    
    if (slides[currentIndex].history.length > 0 && editor) {
      const canvas = editor.canvas;
  
      const currentState = JSON.stringify(canvas.toJSON());
  
      // Get the previous state (second last one)
      const prevState = slides[currentIndex].history[slides[currentIndex].history.length - 1];
      console.log("Previous State: ", prevState);
      
    
      slides.map((_,index)=>{
        if(index === currentIndex){
          // setHistory((prevHistory) => [...prevHistory, JSON.stringify(editor.canvas.toJSON())]);
          dispatch(undoHistory({
            slideIndex: currentIndex,
          }));
          console.log("delete state");
          
          setRedoStack([]); // Clear redo stack on new change
        }
      })
      
      
    }
  };
  
  

  const redo = () => {


  dispatch(redoHistory({
    slideIndex: currentIndex
  }))
  };
  

  const addText = () => {
    if (editor) {
      const text = new fabric.IText("Add text here!", {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: "black",
        selectable: true,
        editable: true,
      });
      editor.canvas.add(text);
      console.log("|slides as image", slidesAsImg)
     
      saveState();
    }
  };


  // muliple shape add
  const addShape = (type, options = {}) => {
    if (!editor || !editor.canvas) return;
  
    let shape;
    const defaultOptions = {
      left: options.left || 100,
      top: options.top || 100,
      fill: options.fill || "",
      stroke: options.stroke || "black",
      strokeWidth: options.strokeWidth || 2,
      selectable: true
    };
  
    switch (type) {
      case "rectangle":
        shape = new fabric.Rect({
          ...defaultOptions,
          width: options.width || 100,
          height: options.height || 50
        });
        break;
  
      case "circle":
        shape = new fabric.Circle({
          ...defaultOptions,
          radius: options.radius || 50
        });
        break;
  
      case "line":
        shape = new fabric.Line(
          [options.x1 || 50, options.y1 || 50, options.x2 || 200, options.y2 || 50],
          {
            ...defaultOptions
          }
        );
        break;
  
        case "triangle":
          shape = new fabric.Triangle({
              width: options.width || 100,
              height: options.height || 100,
              left: options.left || 100,
              top: options.top || 100,
              ...defaultOptions,
          });
          break;
      default:
        console.warn("Invalid shape type");
        return;
    }
  
    if (shape) {
      editor.canvas.add(shape);
      // saveState();
      // setTimeout(() => {
        saveState();
      // }, 1000); 
      // requestAnimationFrame(() => {
      //   saveState();
      // });
    }
  };
  



 

  const addImage = () => {
    if (!editor || !editor.canvas) return;
  
    // Create file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
  
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
  
        // Create image element
        const imgElement = new Image();
        imgElement.src = imageDataUrl;
  
        imgElement.onload = () => {
          const fabricImg = new fabric.FabricImage(imgElement, {
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
          });
  
          editor.canvas.add(fabricImg);
          editor.canvas.setActiveObject(fabricImg);
          editor.canvas.requestRenderAll();
          saveState(); // if you're using undo/redo
        };
      };
  
      reader.readAsDataURL(file);
    };
  
    input.click(); // Trigger file picker
    saveState();
  };
  
  
  


  
  const enablePencil = (color = "black", width = 1) => {
    if (!editor || !editor.canvas) {
        console.log("Editor is not initialized yet");
        return;
    }

    const canvas = editor.canvas;

    if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }

    // Correct property names
    canvas.freeDrawingBrush.color = color; // This should work in some versions
    canvas.freeDrawingBrush.stroke = color; // Use 'stroke' for proper color application
    canvas.freeDrawingBrush.width = width;

    // Toggle drawing mode
    canvas.isDrawingMode = !canvas.isDrawingMode;

    // Force a re-render
    canvas.requestRenderAll();

    console.log("Drawing Mode:", canvas.isDrawingMode, "Color:", color, "Width:", width);
    saveState();
};



  // const changeTextColor = (color="red") => {
  //   if (editor) {
  //     const activeObject = editor.canvas.getActiveObject();
  //     if (activeObject && activeObject.type === "i-text") {
  //       activeObject.set("fill", color);
  //       editor.canvas.renderAll();
  //       saveState();
  //     }
  //   }
  // };

  const changeTextColor = (color = "#111111") => {
    if (!editor || !editor.canvas) {
        console.log("Editor or Canvas is not ready");
        return;
    }

    const activeObject = editor.canvas.getActiveObject();

    if (!activeObject) {
        console.log("No object selected");
        return;
    }

    if (activeObject.type === "i-text" || activeObject.type === "text") {
        console.log("Before change:", activeObject.fill); // Debugging log
        console.log("Changing color to:", color); // Debugging log

        activeObject.set("fill", String(color)); // Ensure it's a string
        editor.canvas.renderAll();
        saveState();

        console.log("After change:", activeObject.fill); // Debugging log
    } else {
        console.log("Selected object is not a text element");
    }
};


  
  const handleChange = (color) => {
    const hex = color.toHexString();
    console.log("Selected Color:", hex);
    changeTextColor(hex);
  };

  const deleteSelected = () => {
    if (!editor || !editor.canvas) return;
  
    const canvas = editor.canvas;
    const activeObject = canvas.getActiveObject();
  
    if (activeObject) {
      if (activeObject.type === 'activeSelection') {
        activeObject.forEachObject((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
      } else {
        canvas.remove(activeObject);
      }
  
      canvas.requestRenderAll();
      saveState(); // Call your state tracking function
    }
  };
  
 
  const addNewSlide = () => {
    console.log("add new slide")
  
  
    // Create blank slide JSON (empty canvas)
    const blankSlide = {
      version: "5.2.4",
      objects: [{
        type: "i-text",
        left: 50,
        top: 50,
        text: "Add Text Here",
        fontSize: 60,
        fill: "#333",
        fontFamily: "Arial",
        fontWeight: "normal",
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        originX: "left",
        originY: "top",
      },],
    };

    dispatch(addSlide(blankSlide));
  };

  const generateHighQualityImages = async (slides) => {
    const exportWidth = 1280;  // Full HD (16:9)
    const exportHeight = 720;
  
    const images = await Promise.all(
      slides.map((slide) => {
        return new Promise((resolve) => {
          const fabricCanvas = new fabric.Canvas(document.createElement("canvas"), {
            width: exportWidth,
            height: exportHeight,
            backgroundColor: "#fff",
          });
  
          fabricCanvas.loadFromJSON(slide.elements, () => {
            fabricCanvas.renderAll();
  
            setTimeout(() => {
              const dataURL = fabricCanvas.toDataURL({
                format: "png",
                multiplier: 2, // Boosts resolution (2x = 3840x2160 virtual res)
              });
  
              fabricCanvas.dispose();
              resolve(dataURL);
            }, 100); // Give rendering a moment to finish
          });
        });
      })
    );
  
    return images; // high-res base64 images
  };
  

  const generatePdfFromImages = async () => {
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in
    
    if (!isLoggedIn) {
      alert('Please register or login to download PDF');
      window.location.href = '/register'; // Redirect to register page
      return;
    }

    const images = await generateHighQualityImages(slides);
    console.log(images)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1920, 1080], // HD 16:9 in px
    });
    

  
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
  
      // Add the image (type, X, Y, width, height)
      doc.addImage(img, 'PNG', 0, 0, 1920, 1080); // adjust size as needed
  
      // Add a new page if not the last image
      if (i < images.length - 1) {
        doc.addPage();
      }
    }
  
    doc.save("slides.pdf");
  };

  const generatePPTXFromImages = async() => {
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in
    
    if (!isLoggedIn) {
      alert('Please register or login to download PPTX');
      window.location.href = '/register'; // Redirect to register page
      return;
    }

    const imageDataArray = await generateHighQualityImages(slides);
    const pptx = new PptxGenJS();
    
    // Define a 16:9 layout
    pptx.defineLayout({ name: "WIDE", width: 10, height: 5.625 });
    pptx.layout = "WIDE";
    
    imageDataArray.forEach((img) => {
      const slide = pptx.addSlide();
      slide.addImage({
        data: img,
        x: 0,
        y: 0,
        w: 10,
        h: 5.625,
      });
    });
  
    pptx.writeFile("slides.pptx");
  };

// addShape("rectangle", { width: 120, height: 60, fill: "green" });
// addShape("circle", { radius: 40, fill: "red" });
// addShape("line", { x1: 100, y1: 100, x2: 300, y2: 100, stroke: "blue" });
// addShape("arrow", { x1: 50, y1: 150, x2: 200, y2: 150, stroke: "purple" });

const shapeItems = [
  { key: "rect", label: "Rectangle", onClick: () => addShape("rectangle") },
  { key: "circle", label: "Circle", onClick: () => addShape("circle") },
  { key: "line", label: "Line", onClick: () => addShape("line") },
  { key: "triangle", label: "Triangle", onClick: () => addShape("triangle") },
];
const colorPick = [{key:"color_picker", label:( <div><ColorPicker defaultValue="#000000" onChange={handleChange}/></div>)}]

  const menuList = [
    { name: "Add New Slide", logo: FaPlus, action: ()=> addNewSlide() , items: null},
    { name: "Pencil", logo: FaPencilAlt, action: ()=>enablePencil(), items: null},
    { name: "Shape", logo: FaShapes, action: null, items: shapeItems },
    { name: "Text-Box", logo: MdFormatShapes, action: addText, items: null },
    { name: "Image", logo: FaRegImage, action: ()=> addImage(), items: null },
    { name: "Text-Color", logo: MdFormatColorText, action: null, items: colorPick },
    { name: "Undo", logo: GrUndo, action: undo, items: null },
    { name: "Redo", logo: GrRedo, action: redo, items: null},
    { name: "Delete", logo: MdDelete, action: deleteSelected, items: null},
  ];

  const exportItems = [
    { key: "pdf", label: "PDF", onClick: () => generatePdfFromImages() },
    { key: "pptx", label: "PPTX", onClick: () => generatePPTXFromImages() }
  ];

  const rightSideMenuList = [
    { name: "Export as", logo: CiExport, action: null , items: exportItems},
  ]

 

  const items = menuList.map((menu, index) => ({
    key: index + 1,
    label: (
      <Dropdown
        menu={{
          items: menu.items || [], // Ensure it's an array
        }}
        placement="bottomLeft"
      >
        <Button onClick={menu.action}>
          <menu.logo className="text-md cursor-pointer" />
        </Button>
      </Dropdown>
    ),  
  }));

  const rightSideMenuItems = rightSideMenuList.map((menu, index) => ({
    key: index + 1,
    label: (
      <Dropdown
        menu={{
          items: menu.items || [], // Ensure it's an array
        }}
        placement="bottomLeft"
      >
        <Button onClick={menu.action}>
         Export As <menu.logo className="text-md cursor-pointer text-black" />
        </Button>
      </Dropdown>
    ),  
  }));
  

  return (
    <Header style={{ background: "#001529", padding: "0" }}>
  <div style={{ 
    display: "flex", 
    justifyContent: "space-evenly", 
    alignItems: "center", 
    width: "100%" 
  }}>

      <img src={slidex} alt="slidex-logo" width={100} className="ml-4"/>
   
   
    

    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[""]}
      items={items}
      style={{ flex: 1, justifyContent: "center", display: "flex" }}
      selectedKeys={[]}
    />

<Menu
  theme="dark"
  mode="horizontal"
  defaultSelectedKeys={[""]}
  items={rightSideMenuItems}
  className="justify-end mr-8 flex"
  // no need for inline styles if using Tailwind
  selectedKeys={[]}
/>
  </div>
</Header>
  );
};

export default Navbar;
