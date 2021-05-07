import {NavigationActions} from "react-navigation";

export function createCustomNavigatorStateFunction(navigator, ignoredRoutes: string[]) {
  const defaultGetStateForAction = navigator.router.getStateForAction;
  return (action, state) => {

    // intercept exit logic
    if (state && action.type === NavigationActions.BACK) {
      let shouldIgnore = false;
      for (const ignoredRoute of ignoredRoutes) {
        if (state.routes[state.index].routeName === ignoredRoute) {
          shouldIgnore = true;
          break;
        }
      }

      if (shouldIgnore) {
        // Returning null indicates stack end, and triggers exit
        return null;
      }
    }
    return defaultGetStateForAction(action, state);
  };
}