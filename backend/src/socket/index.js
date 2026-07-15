import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { AvailableChatEvents, ChatEventEnum } from "../constants.js";
import { User } from "../models/apps/auth/user.models.js";
import { ApiError } from "../utils/ApiError.js";

const socketUserMap = new Map();
const userSocketMap = new Map();

const trackSocketForUser = (io, socket, userId) => {
  const userIdString = userId?.toString();

  if (!userIdString) return;

  const sockets = userSocketMap.get(userIdString) || new Set();
  const isFirstConnection = sockets.size === 0;

  sockets.add(socket.id);
  userSocketMap.set(userIdString, sockets);
  socketUserMap.set(socket.id, userIdString);

  socket.join(userIdString);

  console.log(`Tracked socket ${socket.id} for user ${userIdString}. Total sockets for this user: ${sockets.size}`);

  if (isFirstConnection) {
    console.log(`First connection for user ${userIdString}, broadcasting online status`);
    broadcastPresenceChange(io, userIdString, "online");
    // Also broadcast the updated online users list to all clients
    broadcastOnlineUsers(io);
  }
  
  // Send the current list of online users to the newly connected socket
  const onlineUserIds = getOnlineUsers();
  socket.emit(ChatEventEnum.UPDATE_ONLINE_USERS_EVENT, {
    onlineUsers: onlineUserIds,
  });
  console.log(`Sent online users list to new connection: ${onlineUserIds.length} users`);
};

const untrackSocketForUser = (io, socket) => {
  const userIdString = socketUserMap.get(socket.id);

  if (!userIdString) return;

  const sockets = userSocketMap.get(userIdString);

  if (sockets) {
    sockets.delete(socket.id);
    console.log(`Removed socket ${socket.id} for user ${userIdString}. Remaining sockets: ${sockets.size}`);

    if (sockets.size === 0) {
      userSocketMap.delete(userIdString);
      console.log(`Last socket disconnected for user ${userIdString}, broadcasting offline status`);
      broadcastPresenceChange(io, userIdString, "offline");
      // Also broadcast the updated online users list to all clients
      broadcastOnlineUsers(io);
    } else {
      userSocketMap.set(userIdString, sockets);
      console.log(`User ${userIdString} still has ${sockets.size} active connection(s)`);
    }
  }

  socketUserMap.delete(socket.id);
  socket.leave(userIdString);
};

/**
 * @description This function is responsible to allow user to join the chat represented by chatId (chatId). event happens when user switches between the chats
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
    // E.g. When user types we don't want to emit that event to specific participant.
    // We want to just emit that to the chat where the typing is happening
    socket.join(chatId);
  });
};

/**
 * @description This function is responsible to emit the typing event to the other participants of the chat
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

/**
 * @description This function is responsible to emit the stopped typing event to the other participants of the chat
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

const broadcastPresenceChange = (io, userId, status) => {
  console.log(`Broadcasting presence change: ${userId} is now ${status}`);
  io.emit(ChatEventEnum.PRESENCE_CHANGED_EVENT, {
    userId: userId?.toString(),
    status,
  });
};

/**
 * Get the list of all currently online user IDs
 */
const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};

/**
 * Broadcast the complete list of online users to all connected clients
 */
const broadcastOnlineUsers = (io) => {
  const onlineUserIds = getOnlineUsers();
  console.log(`Broadcasting online users list: ${onlineUserIds.length} users online`, onlineUserIds);
  io.emit(ChatEventEnum.UPDATE_ONLINE_USERS_EVENT, {
    onlineUsers: onlineUserIds,
  });
};

/**
 *
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io
 */
const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken; // get the accessToken

      if (!token) {
        // If there is no access token in cookies. Check inside the handshake auth
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        // Token is required for the socket to work
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
      );

      // retrieve the user
      if (!user) {
        throw new ApiError(401, "Un-authorized handshake. Token is invalid");
      }
      socket.user = user; // mount te user object to the socket

      // We are creating a room with user id so that if user is joined but does not have any active chat going on.
      // still we want to emit some socket events to the user.
      // so that the client can catch the event and show the notifications.
      trackSocketForUser(io, socket, user._id);
      socket.emit(ChatEventEnum.CONNECTED_EVENT, { userId: user._id.toString() }); // emit the connected event so that client is aware
      console.log("User connected 🗼. userId: ", user._id.toString());

      // Common events that needs to be mounted on the initialization
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?._id);
        untrackSocketForUser(io, socket);
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {string} roomId - Room where the event should be emitted
 * @param {AvailableChatEvents[0]} event - Event that should be emitted
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
