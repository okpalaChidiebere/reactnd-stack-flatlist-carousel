import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  Dimensions,
  FlatList,
  StyleSheet, 
  Text, 
  View,
} from 'react-native';
import Animated, { 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring
} from "react-native-reanimated"
const { width } = Dimensions.get("screen")
import { EvilIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import PosterCard from './PosterCard';
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler';

const DATA = [
  {
    title: "Afro vibes",
    location: "Mumbai, India",
    date: "Nov 17th, 2020",
    poster: "https://www.creative-flyers.com/wp-content/uploads/2020/07/Afro-vibes-flyer-template.jpg"
  },
  {
    title: "jungle Party",
    location: "Unknown",
    date: "Sept 3rd, 2020",
    poster: "https://c9n8c2u8.rocketcdn.me/wp-content/uploads/2021/08/Jungle-Party-flyer-Psd-145.jpg",
  },
  {
    title: "4th of July",
    location: "New York, USA",
    date: "Oct 11th, 2020",
    poster: "https://www.creative-flyers.com/wp-content/uploads/2020/06/4th-Of-July-Invitation.jpg",
  },
  {
    title: "Summer festival",
    location: "Bucharest, Romania",
    date: "Aug 17th, 2020",
    poster: "https://c9n8c2u8.rocketcdn.me/wp-content/uploads/2021/08/Summer-Festival-Template-99.jpg",
  },
  {
    title: "BBQ woth friends",
    location: "Prague, Czech Republic",
    date: "Sept 11th, 2020",
    poster: "https://c9n8c2u8.rocketcdn.me/wp-content/uploads/2021/06/BBQ-Party-Flyer-7.jpg",
  },
  {
    title: "Festival Music",
    location: "Berlin, Germany",
    date: "April 21th, 2021",
    poster: "https://c9n8c2u8.rocketcdn.me/wp-content/uploads/2018/03/18_0003201803-2.jpg",
  },
  {
    title: "Beach House",
    location: "Lagos, Nigeria",
    date: "June 27th, 2020",
    poster: "https://c9n8c2u8.rocketcdn.me/wp-content/uploads/2021/05/Opening-Flyer-Template.jpg",
  }
]

const OVERFLOW_HEIGHT = 70
const SPACING = 10
const ITEM_WIDTH = width * 0.8 //80% of the screen width
const VISIBLE_ITEMS = 3

const OverflowItems = ({ data, scrollXIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [-1, 0, 1] //we want to flick on at a time
    const translateYInterpolate = interpolate(
      scrollXIndex.value,
      inputRange,
      [
        OVERFLOW_HEIGHT, //height of the item
        0,
        -OVERFLOW_HEIGHT,
      ]
      //FYI: since we did not add clamp, the imputRange will always be increasing
    )
    return {
      transform: [
        { translateY: translateYInterpolate }
      ]
    }
  })
  return (
    /** 
     * This is for our FLicker effect View at the top of the screen as we 
     * scroll through the carousel
     * It has a fixed height of 70 and we only show the first lisitem with
     * the help of `overflow:hidden` propery
     * 
     * The other item hidden will be moved upwards or downwards based on the active index
     * */
    <View style={styles.overflowContainer}>
      <Animated.View style={animatedStyle}>
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <View style={styles.itemContainerRow}>
                <Text style={[styles.location]}>
                  <EvilIcons 
                    name="location"
                    size={16}
                    color="black"
                    style={{ marginRight: 5 }}
                  />
                  {item.location}
                </Text>
                <Text style={[styles.date]}>{item.date}</Text>
              </View>
            </View>
          )
        })}
      </Animated.View>
    </View>
  )
}

export default function App() {
  const [data, setData] = React.useState(DATA)
  const scrollXIndex = useSharedValue(0)
  //we use this index to know when to fetch new data when the user is done scrolling through the current lists
  const [index, setIndex] = React.useState(0)
  const handleSetActiveIndex = React.useCallback((activeIndex) => {
    setIndex(activeIndex)
    scrollXIndex.value = withSpring(activeIndex, { mass: 0.6275 })
  })

  React.useEffect(() => {
    /**
     * We want to fect more data when there is only three cards remaining to 
     * scroll through
     * 
     * In real app, you may want to show your own loading bar animaition
     * https://github.com/software-mansion/react-native-reanimated/issues/871
     */
    if(index === data.length - VISIBLE_ITEMS){
      //get new data
      //fetch more data
      setData(currData => currData.concat(data))
    }

    /*
    //for anual testing!
    setInterval(() => {
      scrollXIndex.value = Math.floor(Math.random() * data.length)
    }, 3000)
    */
  })

  return (
    /**
     * We use FlingGestureHandler from react-native-gesture-handler to make our screen list 
     * swipeable. Remember that we disable the scrollGesture provided by the Flatlist by default.
     * We added two FlingestureHandlers, one for the left direction and the other for the right direction
     */
    <FlingGestureHandler
      key="left"
      direction={Directions.LEFT}
      //listen for onHandlerStage change
      onHandlerStateChange={ev => {
        //we want to increase the scrollIndex when the user ends the flingLeft gesture
        if(ev.nativeEvent.state === State.END){
          //we check if we are at the end of the list. 
          if(index === data.length - 1){
            //we dont want to swpie the last card away and render an empty view to user
            return
          }
          handleSetActiveIndex(index + 1)
        }
      }}
    >
      <FlingGestureHandler
        key="right"
        direction={Directions.RIGHT}
        //listen for onHandlerStage change
        onHandlerStateChange={ev => {
          //we want to increase the scrollIndex when the user ends the flingLeft gesture
          if(ev.nativeEvent.state === State.END){
            //we check if we are at the end of the list. 
            if(index === 0){
              //you are now at the top of the list, no need to keep scrolling
              return
            }
            handleSetActiveIndex(index - 1)
          }
        }}
      >
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          <StatusBar hidden />
          <OverflowItems  data={data} scrollXIndex={scrollXIndex}/>
          <FlatList 
            data={data}
            keyExtractor={(_, index) => String(index)}
            horizontal
            inverted /** we want to have the last index render first */
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              padding: SPACING * 2,
            }}
            scrollEnabled={false} //we dont want to rely on the flastlist default gestures because we will be adding our own
            removeClippedSubviews={false} //this will make items visible in android as well
            /** 
             * Understanding CellRendererComponent
             * 
             * CellRendererComponent is the wrapper for the renderItem. So we can 
             * change the order of the z-index here
             * */
            CellRendererComponent={({ item, index, children, style, ...props }) => {
              const newStyle = [
                style,
                /**
                 * How zIndex works is the deeper you go into the views from the top the lower 
                 * the zIndex. Knowing that we set our flatlist to be inverted. This made the zIndex of the 
                 * last item to be the highest; making it appear at the top of the stack.
                 * 
                 * But we want to revert the index back and having the lastItem in the list to have the 
                 * lowest index
                 * 
                 * we start from the data.length and decrease the zIndex from there
                 */
                { zIndex: data.length - index} //eg at data[6], the zIndex will be 7 - 6 = 1; at data[5] the zIndex will be 7 - 5 = 2; etc
              ]
              return (
                <View style={newStyle} index={index} {...props}>
                  {children}
                </View>
              )
            }}
            renderItem={({ item, index }) => {
              return (
                <PosterCard item={item} animation={scrollXIndex} index={index}/>
              )
            }}
          />
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -1
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING,
  },
  itemContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: "hidden", //we want to only show the par of the data in display. If we unComment this, we will see all the data arranged horizontally
  },
});
