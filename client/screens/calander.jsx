import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { Popup } from "popup-ui";
import Root from "popup-ui/src/basic/Root";

const AppointmentScheduler = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [allReservations, setAllReservatins] = useState([]);
  const [resversedDate, setreservedDate] = useState([]);

  const handleDayPress = (day) => {
    setSelectedDay(day.dateString);
    setSelectedTime(null);
    setModalVisible(true);
    console.log(day);
    const reservationsForSelectedDay = allReservations.filter((reservation) => {
      const reservationDate = new Date(reservation.Day);
      const selectedDate = new Date(day.dateString);
      return (
        reservationDate.toDateString() === selectedDate.toDateString() &&
        reservation.Reserved === true
      );
    });
    console.log(reservationsForSelectedDay);

    var newarray = reservationsForSelectedDay.map((e) => {
      let time = e.Hour;

      return time.slice(0, time.length - 3);
    });

    setreservedDate(newarray);
    return newarray;
  };

  // const aa=reservationsForSelectedDay.filter(reservation=>{
  //   reservation.Reserved===true
  //   console.log(aa);
  // })

  const handleTimePress = (time) => {
    setSelectedTime(time);
    setConfirmVisible(true);
  };

  useEffect(() => {
    fetchallreservation();
  }, []);

  const fetchallreservation = () => {
    axios
      .get("http://192.168.101.8:3000/api/reservation/playerG")
      .then(function (response) {
        setAllReservatins(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // console.log(allReservations);

  const handleConfirm = async () => {
    try {
      const posts = await axios.post(
        "http://192.168.101.8:3000/api/reservation/player/1/1",
        {
          Day: selectedDay,
          Hour: selectedTime,
          Reserved: false,
        }
      );
      console.log(posts);
    } catch (err) {
      console.log(err);
    }
  };

  const timeSlots = [
    "9:00",
    "11:00",
    "13:00",
    "15:00",
    "17:00",
    "19:00",
    "21:00",
    "23:00",
  ];

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDay]: { selected: true },
        }}
      />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a time:</Text>
          <Root>
            {timeSlots.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.timeSlot,
                  hour === selectedTime && styles.selectedTimeSlot,
                ]}
                onPress={() => {
                  handleTimePress(hour),
                    Popup.show({
                      type: "Success",
                      title: "Confirm Your Reservation",
                      button: true,
                      textBody:
                        "Are you sure you want to reserve this date and time ?",
                      buttontext: "Confirm",
                      callback: () => {
                        Popup.hide();
                        handleConfirm();
                      },
                    });
                }}
              >
                <Text
                  style={{
                    color: resversedDate.includes(hour) ? "red" : "black",
                  }}
                >
                  {hour}
                </Text>
              </TouchableOpacity>
            ))}
          </Root>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        visible={confirmVisible}
        onRequestClose={() => {
          setConfirmVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Are you sure you want to select {selectedTime}:00 on {selectedDay}?
          </Text>
          {/* <View style={styles.modalButtonContainer}>
             <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity> */}
          {/* <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity> 
          </View>*/}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "green",
  },
});
export default AppointmentScheduler;
