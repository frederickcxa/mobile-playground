import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {PRIMARY_COLOR} from "../../values/colors";

const ProgressBar = ({size = 'large', color=PRIMARY_COLOR, ...props}) => (
    <View style={{justifyContent: 'center', alignContent: 'center'}}>
        <ActivityIndicator size={size} color={color} {...props}/>
    </View>
);

export default ProgressBar;
