// NavigationService.ts
import {
  CommonActions,
  createNavigationContainerRef,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params = {}) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export const resetTo = (routeName, params = {}) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    })
  );
};
