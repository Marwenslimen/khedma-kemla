import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Button,
} from "react-native";

const HourPicker = () => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const hours = Array.from({ length: 15 }, (_, i) => i + 8);

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => setSelectedHour(item)}>
      <View
        style={[
          styles.hourItem,
          item === selectedHour && styles.selectedHourItem,
        ]}
      >
        <Text>{`${item}:00`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  const handleSaveHour = () => {
    console.log(`Selected Hour: ${selectedHour}:00`);
  };

  const handleScroll = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = (event) => {
    const { contentOffset } = event.nativeEvent;
    const hour = Math.round(contentOffset.x / 60) + 8;
    setSelectedHour(isScrolling ? selectedHour : hour);
    setIsScrolling(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={hours}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `${item}`}
        renderItem={renderItem}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        snapToAlignment="center"
      />
      <Text>{`Selected Hour: ${selectedHour}:00`}</Text>
      <Button
        title="Save Hour"
        onPress={handleSaveHour}
        disabled={!selectedHour}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hourItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  selectedHourItem: {
    backgroundColor: "#007aff",
  },
});

export default HourPicker;
