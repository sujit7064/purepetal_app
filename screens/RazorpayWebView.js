import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { proceedtobuy } from "../env/action";

const RazorpayWebView = ({ route, navigation }) => {
  const {
    amount,
    email,
    contact,
    buyer_id,
    selected_address_id,
    delivery_charge,
    total_amount,
  } = route.params;
  //console.log(cart_items,'sahcsc');
  const injectedJavaScript = `
    var options = {
      "key": "rzp_live_NlaeDylhQ5dzrd",
      "amount": "${amount}",
      "currency": "INR",
      "name": "PurePetal",
      "description": "Test Transaction",
      "handler": function (response){
          window.ReactNativeWebView.postMessage(JSON.stringify(response));
      },
      "prefill": {
          "email": "${email}",
          "contact": "${contact}"
      },
      "theme": {
          "color": "#28a745"
      }
    };
    var rzp = new Razorpay(options);
    rzp.open();
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{
        html: `<html><head><script src="https://checkout.razorpay.com/v1/checkout.js"></script></head><body></body></html>`,
      }}
      injectedJavaScript={injectedJavaScript}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        console.log("Razorpay Response:", data);
        // navigation.goBack();
        // alert(`Payment Success: ${data.razorpay_payment_id}`);
        if (data.razorpay_payment_id) {
          const payload = {
            buyer_id: buyer_id,
            address_id: selected_address_id,
            total_product_amount: total_amount,
            delivery_charges: delivery_charge,
            total_amount: amount,
            payment_method: "razorpay",
            payment_status: "paid",
            transaction_id: data.razorpay_payment_id,
          };
          proceedtobuy(payload, (res) => {
            console.log("📦 Order API Response:", res);
            if (res.status === 1) {
              alert("✅ Order placed successfully!");
            } else {
              alert("⚠️ Order failed. Please try again.");
            }
            navigation.navigate("MainApp");
          });
        }
      }}
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      )}
    />
  );
};

export default RazorpayWebView;
