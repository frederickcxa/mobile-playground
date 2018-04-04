import {Platform} from 'react-native';
import {ANDROID_OS} from '../values/strings';

export const isAndroid = () => Platform.OS === ANDROID_OS;
