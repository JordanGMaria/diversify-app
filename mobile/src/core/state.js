import { createGlobalState } from "react-hooks-global-state";

const { useGlobalState } = createGlobalState({ Authenticated: false });

export const GlobalState = useGlobalState;