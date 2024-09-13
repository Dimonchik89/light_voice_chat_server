import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class VoiceGeteway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoo(client: Socket, room: string): void {
    client.join(room);
    this.server.to(room).emit("userJoined", client.id)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room)
    this.server.to(room).emit("userLeft", client.id)
  }

  @SubscribeMessage('audio')
  handleAudio(@MessageBody() {audioData, room}: {audioData: ArrayBuffer, room: string}, @ConnectedSocket() client: Socket) {

    if (audioData instanceof Buffer) {
       client.broadcast.to(room).emit('audio', audioData);
    } else {
      console.error('Data is not a Buffer:', audioData);
    }
  }

}