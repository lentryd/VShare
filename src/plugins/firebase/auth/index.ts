export { user, FUser, get } from "./user";
export {
  userState,
  FUserState,
  onStateChanged,
  signIn,
  signUp,
  resetPassword,
  signInWithGoogle,
  signInAnonymously,
} from "./state";

import { init as initUser } from "./user";
import { init as initState, onStateChanged } from "./state";

export function init() {
  onStateChanged(({ uid }) => initUser(uid || "none"));
  initState();
}
