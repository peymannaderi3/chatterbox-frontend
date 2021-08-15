import axios from "axios";
import { receiverTypes, LIMIT } from "@/constants/types";

export function changeChannel({ commit }, { channel }) {
  commit("SET_CURRENT_CHANNEL", channel);
}

export async function getRooms({ commit }) {
  try {
    const { data } = await axios.get("rooms");
    commit("SET_ROOMS", data);
  } catch (error) {
    console.log(error);
  }
}

export async function newMessage({ commit }, msg) {
  if (msg.type === receiverTypes.ROOM) {
    commit("ADD_ROOM_MESSAGE", msg);
  } else if (msg.type === receiverTypes.USER) {
    commit("ADD_PV_MESSAGE", msg);
  }
}

export async function getRoomMessages({ commit, state }, { roomId, loadMore }) {
  if (state.roomMessages[roomId]?.noMore) return;

  if (!loadMore && state.roomMessages[roomId]?.messages?.length > 0) return;

  let timestamp;
  if (state.roomMessages[roomId]?.messages[0]) {
    timestamp = state.roomMessages[roomId]?.messages[0].timestamp;
  }

  try {
    const { data } = await axios.get(`messages/rooms/${roomId}`, {
      params: {
        timestamp,
        limit: LIMIT,
      },
    });

    commit("UPDATE_ROOM_MESSAGES", { list: data, roomId, page: 1 });

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPvMessages({ commit, state }, { userId, page }) {
  if (state.pvMessages[userId]?.noMore) return;

  if (state.pvMessages[userId]?.page >= page) return;
  try {
    const { data } = await axios.get(`messages/pv/${userId}?page=${page}`);

    commit("UPDATE_PV_MESSAGES", { list: data, userId, page: 1 });
  } catch (error) {
    console.log(error);
  }
}
