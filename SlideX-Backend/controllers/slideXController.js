import SlideDeck from "../model/slideModel.js"
import User from "../model/userModel.js"


const createSlide = async (req, res) => {
    try {
        const { userId, sessionId } = req.body;
        if (userId === null) {
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

            const chekeUser = await User.findById({ _id: userId })
            if (!chekeUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $push: { slides: newSlide._id } }, // Adds to array
                { new: true }
              );

            return res.status(200).json({
                message: "Slide created with UserId",
                newSlideId: newSlide._id
            })
        }

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const updateSlide = async(req, res) => {
    const { slideDeckId, slideIndex, elements } = req.body;
    try {
        if (!slideDeckId || slideIndex === undefined || !elements) {
            return res.status(400).json({ message: "SlideDeck ID, slide index, and elements are required" }); 
        }

        const updateQuery = {
            $set: {
                [`slides.${slideIndex}.elements`]: elements
            }
        };

        const updatedSlideDeck = await SlideDeck.findByIdAndUpdate(
            slideDeckId,
            updateQuery,
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

const showSlides = async(req, res) => {
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
            // Get slides for guest session
            const slideDeck = await SlideDeck.findOne({ sessionId });
            if (!slideDeck) {
                return res.status(404).json({ message: "Session not found" });
            }
            slides = slideDeck.slides;
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

export { createSlide, showSlides, updateSlide, deleteSlide }
