import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  Dimensions,
  StyleSheet, 
  Text, 
  View
} from 'react-native';
const { width } = Dimensions.get("screen")
import { EvilIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

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
const ITEM_WIDTH = width * 0.8
const ITEM_HEIGHT = ITEM_WIDTH * 1.7

const OverflowItems = ({ data }) => {
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
      <View>
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
      </View>
    </View>
  )
}

export default function App() {
  const [data, setData] = React.useState(DATA)

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <StatusBar hidden />
      <OverflowItems  data={data}/>
    </SafeAreaView>
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
    //overflow: "hidden", //we want to only show the par of the data in display. If we unComment this, we will see all the data arranged horizontally
  },
});
