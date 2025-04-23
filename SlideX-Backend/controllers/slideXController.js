import SlideDeck from "../model/slideModel.js"
import User from "../model/userModel.js"


const createSlide = async (req, res) => {
    try {
        const { userId, sessionId } = req.body;
        if (!userId) {
            const newSlide = await SlideDeck.create({
                sessionId: sessionId,
                slides: []
            });

            return res.status(200).json({
                message: "Slide created with sessionId",
                newSlideId: newSlide._id
            })
        } else {
            const newSlide = await SlideDeck.create({
                owner: userId,
                slides: []
            });

            // Try to find user but don't fail if not found
            const chekeUser = await User.findById({ _id: userId });
            if (chekeUser) {
              await User.findByIdAndUpdate(
                userId,
                { $push: { slides: newSlide._id } }, // Adds to array
                { new: true }
              );

            return res.status(200).json({
                message: "Slide created with UserId",
                newSlideId: newSlide._id
            });
          }
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const updateSlide = async(req, res) => {
    const { slideDeckId, slides } = req.body;
    try {
        if (!slideDeckId || !slides) {
            return res.status(400).json({ message: "SlideDeck ID and slides array are required" }); 
        }

        const updatedSlideDeck = await SlideDeck.findByIdAndUpdate(
            slideDeckId,
            { $set: { slides: slides } },
            { new: true }
        );

        if (!updatedSlideDeck) {
            return res.status(404).json({ message: "Slide deck not found" });
        }

        return res.status(200).json({
            message: "Slide updated"
        });
    } catch (error) {
        console.error("Error updating slide:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getSlideDeck = async (req, res) => {
    try {
        const { id: slideDeckId } = req.params;
        
        const slideDeck = await SlideDeck.findById(slideDeckId);
        if (!slideDeck) {
            return res.status(404).json({ message: "Slide deck not found" });
        }

        return res.status(200).json(slideDeck);
    } catch (error) {
        console.error("Error getting slide deck:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteSlide = async (req, res) => {
    const { userId, slideId } = req.body;
  
    try {
      if (!userId || !slideId) {
        return res.status(400).json({ message: "User Id and Slide Id are required" });
      }
  
      // 1. Delete the slide from the Slide collection
      const deletedSlide = await SlideDeck.findByIdAndDelete(slideId);
      if (!deletedSlide) {
        return res.status(404).json({ message: "Slide not found" });
      }
  
      // 2. Remove the slide reference from the user's slides array
      await User.findByIdAndUpdate(userId, {
        $pull: { slides: slideId },
      });
  
      return res.status(200).json({ message: "Slide deleted successfully" });
    } catch (error) {
      console.error("Delete slide error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

const showSlides = async (req, res) => {
    try {
        const { userId, sessionId } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        let slides;
        if (userId) {
            // Get slides for logged-in user
            const user = await User.findById(userId).populate('slides');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            slides = user.slides;
        } else {
            // Get all slide decks for guest session
            const slideDecks = await SlideDeck.find({ sessionId });
            if (!slideDecks || slideDecks.length === 0) {
                return res.status(200).json({
                    message: "No slides found for this session",
                    slides: []
                });
            }
            // Combine all slides from all decks for this session
            slides = slideDecks.map(deck => ({
                _id: deck._id,
                title: deck.title,
                previewImage: deck.previewImage,
                createdAt: deck.createdAt,
                updatedAt: deck.updatedAt
            }));
        }

        return res.status(200).json({
            message: "Slides retrieved successfully",
            slides: slides
        });

    } catch (error) {
        console.error("Error retrieving slides:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}




// listUserSlideDecks(userId || sessionId)

const updatePreview = async (req, res) => {
  try {
    const { slideId, previewImage } = req.body;
    console.log("image: ", previewImage)
    if (!slideId || !previewImage) {
      return res.status(400).json({ message: "Slide ID and preview image are required" });
    }

    const updatedSlide = await SlideDeck.findByIdAndUpdate(
      slideId,
      { $set: { previewImage } },
      { new: true }
    );

    if (!updatedSlide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    return res.status(200).json({ message: "Preview image updated" });
  } catch (error) {
    console.error("Error updating preview image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTitle = async (req, res) => {
  try {
    const { slideId, title } = req.body;
    
    if (!slideId || !title) {
      return res.status(400).json({ message: "Slide ID and title are required" });
    }

    const updatedSlide = await SlideDeck.findByIdAndUpdate(
      slideId,
      { $set: { title } },
      { new: true }
    );

    if (!updatedSlide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    return res.status(200).json({ message: "Title updated successfully" });
  } catch (error) {
    console.error("Error updating title:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createSlide, showSlides, updateSlide, deleteSlide, getSlideDeck, updatePreview, updateTitle }
