import React from 'react';
import { 
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated"
const { width } = Dimensions.get("screen")

const ITEM_WIDTH = width * 0.8 //80% of the screen width
const ITEM_HEIGHT = ITEM_WIDTH * 1.7
const VISIBLE_ITEMS = 3 //we want to make a particular set of items visible in the screen

export default function PosterCard({ item, animation, index }){

    const posterAnimatedStyle = useAnimatedStyle(() => {
        /**
         * index: currentItem
         * index - 1: next item
         * index + 1: previous item
         * 
         * Remember the index appears this way because we inverted our flatlist
         */
        const inputRange = [index - 1, index, index + 1]

        const translateXInterpolate = interpolate(
          animation.value,
          inputRange,
          /**
           * - for the next Item, we move it to the right a bit
           * - for the current Item, we leave it ats the default position(center screen)
           * - for the previous item, we move it not totally off the screen but almost 
           *   off the screen. We will interpolate the opacity of the prev position to 0 
           *   anyways. So it does not really matter if we really move it clear of screen
           */
          [50, 0, -100],
        )
      
        /**The further down the list, the smaller we make the item appear giving us that illusion
         * of scalling out as we swipe objects out the screen
         */
        const scaleInterpolate = interpolate(
          animation.value,
          inputRange,
          /**
           * next index: we reduce the scale
           * current index :we leave the default scale
           * Prev index: we scale the item even more (1.3) when it is being moved outside the screen
           */
          [.8, 1, 1.3],
        )

        const opacityInterpolate = interpolate(
            animation.value,
            inputRange,
            /**
             * We only want to make three items visible at a time; the currentIndex 
             * and the next two index.
             * 
             * We change the opacity based on the index
             * 
             * 
             */
            [1 - 1 / VISIBLE_ITEMS, 1, 0]
        )

        return {
            opacity: opacityInterpolate,
            transform: [
                { translateX: translateXInterpolate },
                { scale: scaleInterpolate }
            ]
        }
    })
    return (
        <Animated.View 
            style={[
                { 
                    /**
                     * In order to create the carousel stack, we need to set the position
                     *  of each listItem to be absolute so that the items will be stacked 
                     * in front of each other (like a FrameLayout in android)
                     */
                    position: "absolute",
                    left: -ITEM_WIDTH / 2, //position the item to the center of the screen by offesting the left position :)
                },
                posterAnimatedStyle,
            ]}
        >
              <Image 
                source={{ uri: item.poster }}
                style={{
                  width: ITEM_WIDTH,
                  height: ITEM_HEIGHT
                }}
              />
            </Animated.View>
    )
}