import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket
  } from '@nestjs/websockets';
  import { ChatService } from './chat.service';
import { Catch, ExceptionFilter, HttpException, HttpStatus, Injectable, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { fromAuthHeaderOAsBearerToken } from '../auth/jwt.strategy';
import { prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { User, ChatChannel, ChatMessage } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';
import { BaseExceptionFilter } from '@nestjs/core';

type SocketUserAuth = Socket & {
	user: User;
  }; 

interface ChatClient {
	userId: number;
	channelIds: number[];
	socketId: string;
};


@WebSocketGateway(8192, {
  namespace: 'chat',
  cors: {
    origin: '*',
    maxAge: 600,
  },
})

export class ChatGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
	private readonly chatService: ChatService,
	private prismaService: PrismaService,
	private jwtService: JwtService,
	private jwtStrategy: JwtStrategy)
	{}

	private clients: Map<string, ChatClient> = new Map();

	@WebSocketServer()
	private server: Server;

	private async getUserWithToken(socket: Socket) {
		const token = fromAuthHeaderOAsBearerToken(socket);
		return await (async () => {
		  try {
			return this.jwtStrategy.validate(
			  await this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			  }),
			);
		  } catch (e) {
			if (e.name !== 'JsonWebTokenError') console.error(e); // show other error
			return null;
		  }
		})();
	}

	async handleConnection(socket: Socket)
	{
		const user = await this.getUserWithToken(socket);
		if (!user) {
			socket.disconnect();
			return false;
		}
		const iterator1 = this.clients[Symbol.iterator]();

		for (const item of iterator1) {
			if (item[1].userId === user.id) {
				console.log('double connexion!');
				socket.disconnect();
				return false;
			}
		}
		console.log(user.name, 'has joined the chats.');

		try {
			const ids = await this.chatService.getChannelsIds(user.id)
			const client: ChatClient = {
				userId: user.id,
				channelIds: ids,
				socketId: socket.id,
			};
			socket.join(ids.map((id) => "channel-"+id));
			this.clients.set(client.socketId, client);
		} catch (e: any) { console.log("Couldn't fetch channels for " + user.name + ", disconnecting user..."); socket.disconnect()}
	}

	@UseGuards(JwtAuthGuard)
	async handleDisconnect(@ConnectedSocket() socket: SocketUserAuth)
	{
	  const user = await this.getUserWithToken(socket);
	  if (!this.clients.get(socket.id)) return;
	  this.clients.delete(socket.id);
	  console.log("Disconnection", this.clients.size)
	}	

	getSocketIdByUserId(id: number)
	{
		for (const e of this.clients[Symbol.iterator]()) {
			if (e[1].userId === id)
				return e[1].socketId;
		}
		return null;
	}
	// Methods that updates the client but is triggered by the backend, after all SQL is done 
	async onChannelAdd(user_id: number, channel_id: number)
	{
		const sockId = this.getSocketIdByUserId(user_id)
		if (sockId)
		{
			await (await this.server.fetchSockets()).find((s) => s.id === sockId)?.join("channel-"+channel_id)
			this.clients.get(sockId).channelIds.push(channel_id)
		}
		await  this.server.to("channel-"+channel_id).emit('channel_add', {user: user_id, channel: channel_id});
	}
	async onChannelRemove(user_id: number, channel_id: number)
	{
		await this.server.to("channel-"+channel_id).emit('channel_remove', {user: user_id, channel: channel_id});
		const sockId = this.getSocketIdByUserId(user_id)
		if (!sockId)
			return ;
		await (await this.server.fetchSockets()).find((s) => s.id === sockId)?.leave("channel-"+channel_id)
		this.clients.get(sockId).channelIds = this.clients.get(sockId).channelIds.filter((e) => e !== channel_id);
	}
	async onChannelMute(user_id: number, channel_id: number, mute_expiration: Date)
	{
		await this.server.to("channel-"+channel_id).emit('channel_mute', {user: user_id, channel: channel_id, mute_expiration: mute_expiration});
	}
	async onChannelUnmute(user_id: number, channel_id: number)
	{
		await this.server.to("channel-"+channel_id).emit('channel_unmute', {user: user_id, channel: channel_id});
	}
	async onChannelBan(user_id: number, channel_id: number, ban_expiration: Date)
	{
		await this.server.to("channel-"+channel_id).emit('channel_ban', {user: user_id, channel: channel_id, ban_expiration: ban_expiration});
		const sockId = this.getSocketIdByUserId(user_id)
		if (!sockId)
			return ;
		await (await this.server.fetchSockets()).find((s) => s.id === sockId)?.leave("channel-"+channel_id)
		this.clients.get(sockId).channelIds = this.clients.get(sockId).channelIds.filter((e) => e !== channel_id);
	}
	async onChannelUnban(user_id: number, channel_id: number)
	{
		const sockId = this.getSocketIdByUserId(user_id)
		if (sockId)
		{
			await (await this.server.fetchSockets()).find((s) => s.id === sockId)?.join("channel-"+channel_id)
			this.clients.get(sockId).channelIds.push(channel_id)
		}
		await this.server.to("channel-"+channel_id).emit('channel_unban', {user: user_id, channel: channel_id});
	}
	async onChannelPromote(user_id: number, channel_id: number)
	{
		await this.server.to("channel-"+channel_id).emit('channel_promote', {user: user_id, channel: channel_id});
	}
	async onChannelOwner(user_id: number, channel_id: number)
	{
		await this.server.to("channel-"+channel_id).emit('channel_owner', {user: user_id, channel: channel_id});
	}
	async onChannelDemote(user_id: number, channel_id: number)
	{
		await this.server.to("channel-"+channel_id).emit('channel_demote', {user: user_id, channel: channel_id});
	}
	async onUserBlock(blocker: number, blocked: number) {
		const sockId = this.getSocketIdByUserId(blocker)
		if (!sockId)
			return ;
		await (await this.server.fetchSockets()).find((s) => s.id === sockId)?.emit("user_block", {user: blocked})

	}
	async onUserUnblock(unblocker: number, blocked: number) {
		const sockId = this.getSocketIdByUserId(unblocker)
		if (!sockId)
			return ;
		await (await this.server.fetchSockets()).find((s) => s.id === sockId)?.emit("user_unblock", {user: blocked})
	}


	@SubscribeMessage('send_message')
	@UseGuards(JwtAuthGuard)
	async send_message(
		@ConnectedSocket() socket: SocketUserAuth,
		@MessageBody(new ValidationPipe({ transform: true })) messageDto: SendMessageDto)
	{
		console.log("Received a message", messageDto)

		if (!messageDto.content.trim().length)
			return ;

		// Trying to send to a channel the user is not part of
		if (!this.clients.get(socket.id).channelIds.includes(messageDto.channel))
			return ;

		// Put message in database
		const message = await this.chatService.sendMessage(socket.user.id, messageDto.channel, messageDto.content);
		if (!message)
			return ;

		// Tell every connected socket to receive that message
		this.server.to("channel-"+message.channelId).emit('recv_msg', {...message, senderId: socket.user.id});	
	}
}
