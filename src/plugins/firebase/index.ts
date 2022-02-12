// Инициализация приложения
import { initializeApp } from "firebase/app";
initializeApp({
  apiKey: "AIzaSyCpEY-3ye4t54kD1Q-8sJnyIwD5_1SWhkA",
  authDomain: "vshare.lentryd.su",
  databaseURL:
    "https://vshare-69949-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vshare-69949",
  storageBucket: "vshare-69949.appspot.com",
  messagingSenderId: "15549854749",
  appId: "1:15549854749:web:b669205f9e935f269502f4",
});

// Offline режим бд
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
enableIndexedDbPersistence(getFirestore());

// Делаем Vue плагин для удобства
import { App, unref } from "vue";
import {
  init as authInit,
  user,
  FUser,
  get as getUser,
  userState,
  FUserState,
  onStateChanged,
  signIn,
  signUp,
  resetPassword,
  signInWithGoogle,
  signInAnonymously,
} from "./auth/";
import {
  room,
  FRoom,
  members,
  FMember,
  messages,
  FMessage,
  sendFile,
  getMember,
  selectRoom,
  renameRoom,
  sendMessage,
} from "./room/";
import {
  init as roomsInit,
  rooms,
  FRoomPreview,
  isLoading,
  addMember,
  createRoom,
} from "./rooms/";

export interface Firebase {
  auth: {
    user: FUser;
    state: FUserState;
    onStateChanged: typeof onStateChanged;
    signIn: typeof signIn;
    signUp: typeof signUp;
    getUser: typeof getUser;
    resetPassword: typeof resetPassword;
    signInWithGoogle: typeof signInWithGoogle;
    signInAnonymously: typeof signInAnonymously;
  };

  room: {
    data: FRoom;
    members: FMember[];
    messages: FMessage[];
    sendFile: typeof sendFile;
    getMember: typeof getMember;
    selectRoom: typeof selectRoom;
    renameRoom: typeof renameRoom;
    sendMessage: typeof sendMessage;
  };

  rooms: {
    data: FRoomPreview[];
    isLoading: boolean;
  };

  addMember: typeof addMember;
  createRoom: typeof createRoom;
}

function init() {
  authInit();
  roomsInit();
}

export default {
  install(app: App) {
    init();

    app.config.globalProperties.$firebase = {
      auth: {
        onStateChanged,
        signIn,
        signUp,
        getUser,
        resetPassword,
        signInWithGoogle,
        signInAnonymously,
      },
      room: { sendFile, getMember, selectRoom, renameRoom, sendMessage },
      rooms: {},
      addMember,
      createRoom,
    };
    // $firebase.auth
    Object.defineProperty(app.config.globalProperties.$firebase.auth, "user", {
      enumerable: true,
      get: () => unref(user),
    });
    Object.defineProperty(app.config.globalProperties.$firebase.auth, "state", {
      enumerable: true,
      get: () => unref(userState),
    });
    // $firebase.room
    Object.defineProperty(app.config.globalProperties.$firebase.room, "data", {
      enumerable: true,
      get: () => unref(room),
    });
    Object.defineProperty(
      app.config.globalProperties.$firebase.room,
      "members",
      {
        enumerable: true,
        get: () => unref(members),
      }
    );
    Object.defineProperty(
      app.config.globalProperties.$firebase.room,
      "messages",
      {
        enumerable: true,
        get: () =>
          unref(messages).sort(
            ({ timestamp: t }, { timestamp: t1 }) => +t - +t1
          ),
      }
    );
    // $firebase.rooms
    Object.defineProperty(app.config.globalProperties.$firebase.rooms, "data", {
      enumerable: true,
      get: () => unref(rooms),
    });
    Object.defineProperty(
      app.config.globalProperties.$firebase.rooms,
      "isLoading",
      {
        enumerable: true,
        get: () => unref(isLoading),
      }
    );
  },
};

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $firebase: Firebase;
  }
}
