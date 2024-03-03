import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { ChannelType, ChannelUserPower, Prisma } from '@prisma/client';

import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto, UpdateChannelOperator } from './dto/update-channel.dto';
import { ChatGateway } from './chat.gateway';
import { CronJob } from 'cron';
import { Cron, SchedulerRegistry, CronExpression } from '@nestjs/schedule';

import * as bcrypt from 'bcrypt';

interface Expirable {expiration: Date, user: number, channel: number, operation: string, chatGateway: ChatGateway}

@Injectable()
export class ChatService {
	private expirables: Expirable[] = [];
	private running: boolean = false;

  constructor(private prisma: PrismaService,
			private schedulerRegistry: SchedulerRegistry)
  {
  }

  	async getJoinableChannels(user_id: number) {
		return this.prisma.chatChannel.findMany({
			where: {
				AND: [
					{ visibility: {not: ChannelType.PRIVATE} },
					{ visibility: {not: ChannelType.PRIVATE_MESSAGE} },
					{ users: { every: { OR: [{userId: {not: user_id }}, {connected: false}] } } }
				]
			}
		})
	}


	async getAddableUsers(channel_id: number, current_user_id: number) {
		if (channel_id === -1)
		{
			const addableUsers = await this.prisma.user.findMany({
				where: {
					id: {
						not: current_user_id
					}
				},
				select: {
					id: true,
					name: true,
					avatar: true
				}
			});
			addableUsers.forEach(user => user.avatar = user.avatar.replace(
				'://<<host>>',
        '://' + process.env.FRONT_HOST,
			));
			return addableUsers;
		}
		else
		{
			const addableUsers = await this.prisma.user.findMany({
				where: {
					AND: [
						{ id: {not: current_user_id} },
						{ channels: { every: {OR: [{channelId: {not: channel_id}}, {connected: false}]}}}
					]
				},
				select: {
					id: true,
					name: true,
					avatar: true
				}
			});
			addableUsers.forEach(user => user.avatar = user.avatar.replace(
				'://<<host>>',
        '://' + process.env.FRONT_HOST,
			));
			return addableUsers;
		}
	}


  async sendMessage(id: number, channel: number, content: string) {
	const user = await this.prisma.channelUser.findUnique({where: {userId_channelId: {userId: id, channelId: channel}}});
	if (user.ban_expiration || user.mute_expiration)
		return null;
	try
	{
		return await this.prisma.chatMessage.create({
			data: {
				senderId: user.id,
				channelId: channel,
				content: content
			}
		})
	} catch (e)
	{ return null; }
  }


  async joinChannel(channel_id: number, password: string, user_id: number, chatGateway: ChatGateway) {
	  const channel = await this.prisma.chatChannel.findFirst({
			where: {
				OR: [
					{
						id: channel_id,
						visibility: ChannelType.PASSWORD_PROTECTED
					},
					{
						id: channel_id,
						visibility: ChannelType.PUBLIC
					},
				],
				users: {
					some: {
						OR: [
							{userId: {not: user_id}},
							{userId: user_id, connected: false}
						]
					}
				}
			}
		})
		if (!channel || (channel.password && !(await bcrypt.compare(password, channel.password))))
			throw new HttpException("Channel could not be joined", HttpStatus.I_AM_A_TEAPOT)
		let cu : any;
		try {
		cu = await this.prisma.channelUser.create({
			data: {
				channelId: channel_id,
				userId: user_id,
				power: ChannelUserPower.REGULAR
			}
		});
		} catch (e: any) { cu = await this.prisma.channelUser.update({where: {userId_channelId: {userId: user_id, channelId: channel_id}}, data: {connected: true, power: ChannelUserPower.REGULAR}})}
		chatGateway.onChannelAdd(user_id, channel_id);
		return (cu);
  }

	async createChannel(createDto: CreateChannelDto, user_id: number, chatGateway: ChatGateway) {
		const data = [...new Set(createDto.users)].map(obj => ({userId: obj, power: ChannelUserPower.REGULAR}))
		
		if (createDto.visibility == ChannelType.PRIVATE_MESSAGE
			&& (createDto.users.length > 1))
		{
			throw new HttpException("Private message channel with more than two users?", HttpStatus.I_AM_A_TEAPOT);
		}
		else if (createDto.visibility == ChannelType.PRIVATE_MESSAGE)
		{
			try
			{
				const channels = await this.prisma.chatChannel.findMany({
					where: {
						OR: [
							{name: "DM: "+user_id+"-"+createDto.users[0]},
							{name: "DM: "+createDto.users[0]+"-"+user_id}
						]
					}
				})
				if (channels.length)
					throw new HttpException("This private message channel already exists", HttpStatus.I_AM_A_TEAPOT);
				const chan =  await this.prisma.chatChannel.create({
					data: {
						name: "DM: "+user_id+"-"+createDto.users[0],
						visibility: createDto.visibility,
						password: null,
						users: {
							create: [
								{userId: user_id, power: ChannelUserPower.REGULAR},
								...(data)
							]
						}
					},
					include: {
						users: true
					}
				})
				chan.users.forEach((u) => chatGateway.onChannelAdd(u.userId, u.channelId));
				return (chan);
			} catch (e)
			{
				throw new HttpException("This private message channel already exists", HttpStatus.I_AM_A_TEAPOT);
			}
		}
		if (!data.length)
			throw new HttpException('Can not create a channel with yourself only', HttpStatus.I_AM_A_TEAPOT);
		try {
				const hashed_password = createDto.password ? await bcrypt.hash(createDto.password, 10) : null;
				const chan = await this.prisma.chatChannel.create({
					data: {
						name: createDto.name,
						visibility: createDto.visibility,
						password: hashed_password,
						users: {
							create: [
								{userId: user_id, power: ChannelUserPower.OWNER},
								...(data)
							]
						}
					},
					include: {
						users: true
					}
				})
				chan.users.forEach((u) => chatGateway.onChannelAdd(u.userId, u.channelId));
				return (chan);
			} catch (e)
			{
				if (e instanceof Prisma.PrismaClientKnownRequestError)
				{
					if (e.code == "P2002")
						throw new HttpException('Channel name is not unique', HttpStatus.I_AM_A_TEAPOT);
					else if (e.code == "P2003")
						throw new HttpException('Unknown user was added. Handmade request?', HttpStatus.I_AM_A_TEAPOT);
					else
						throw new HttpException("Unknown internal error on channel creation", HttpStatus.INTERNAL_SERVER_ERROR);
				}
			}
  }

  async getAllExpirable()
  {
	const data = await this.prisma.channelUser.findMany({
		where: {
			OR: [
				{mute_expiration: {not: null}},
				{ban_expiration: {not: null}}
			]
		},
		select: {
			userId: true,
			channelId: true,
			mute_expiration: true,
			ban_expiration: true,
		}
	})
	let expirables: any[] = [];
	data.forEach((e) => {
		if (e.mute_expiration)
			expirables.push({operation: "REVOKE_MUTE", expiration: e.mute_expiration, user: e.userId, channel: e.channelId})
		if (e.ban_expiration)
			expirables.push({operation: "REVOKE_BAN", expiration: e.ban_expiration, user: e.userId, channel: e.channelId})
	})
	return (expirables)
  }

  async leaveChannel(channel_id: number, user_id: number, gateway: ChatGateway) {
		try
		{
			// Make sure user can leave the channel
			await this.prisma.chatChannel.findFirstOrThrow({
				where: {
					id: channel_id,
					visibility: {
						not: ChannelType.PRIVATE_MESSAGE
					},
					/*users: {
						some: {
							AND: [
								{
									userId: user_id,
									ban_expiration: null
								},
								{
									userId: user_id,
									mute_expiration: null
								}
							]
						}
					}*/
				}
			})
			// Delete user
			const user = await this.prisma.channelUser.update({
				where: {
					userId_channelId: {userId: user_id, channelId: channel_id}
				},
				data: {
					connected: false,
				}
			})
			gateway.onChannelRemove(user_id, channel_id);
			/* If user who left was owner */
			let new_owner: any = 1;
			if (user.power == ChannelUserPower.OWNER)
			{
				new_owner = null;
				const user = await this.prisma.channelUser.update({
					where: {
						userId_channelId: {userId: user_id, channelId: channel_id}
					},
					data: {
						connected: false,
						power: ChannelUserPower.REGULAR
					}
				})
	
				// Find another user to give ownership to
				new_owner = await this.prisma.channelUser.findFirst({
					where: {
						channelId: channel_id,
						connected: true
					}
				});
				if (new_owner) // There is another user
				{
					gateway.onChannelOwner(new_owner.userId, new_owner.channelId);
					await this.prisma.channelUser.update({
						where: {
							userId_channelId: {userId: new_owner.userId, channelId: new_owner.channelId}
						},
						data: {
							power: ChannelUserPower.OWNER
						}
					})

				}
			}
			if (!new_owner) // No other user -> delete channel
			{
				await this.prisma.chatMessage.deleteMany({
					where: {
						channelId: channel_id
					}
				})
				await this.prisma.channelUser.deleteMany({
					where: {
						channelId: channel_id
					}
				})
				await this.prisma.chatChannel.delete({
					where: {
						id: channel_id
					}
				})
				this.removeExpirablesByChannelId(channel_id);
				await gateway.onChannelRemove(user_id, channel_id)
			}
		}
		catch (e) { throw new HttpException("Channel could not be left", HttpStatus.I_AM_A_TEAPOT); }
  }

  async updateChannel(channel_id: number, updateDto: UpdateChannelDto, user_id: number, gateway: ChatGateway) {
		// Get channel that needs to be updated
		try
		{
			// Get the user performing the action
			const channel = await this.prisma.chatChannel.findFirstOrThrow({
				where: {
					id: channel_id,
					visibility: {
						not: ChannelType.PRIVATE_MESSAGE
					}
				}
			})
			let user: any;
			if (user_id !== -1)
			{
				user = await this.prisma.channelUser.findUniqueOrThrow({
					where: {userId_channelId: {userId: user_id, channelId: channel_id}}
				})
				if (!user.connected || user.ban_expiration)
					return ;
				// Permission check on the user trying to perform a modification on the channel
				if (user.power != ChannelUserPower.OWNER
				&& ( (user.power == ChannelUserPower.REGULAR
							&& updateDto.operation != UpdateChannelOperator.ADD_USER)
					|| (user.power == ChannelUserPower.ADMINISTRATOR
							&& (updateDto.operation === UpdateChannelOperator.CHANGE_PASSWORD 
							|| updateDto.operation === UpdateChannelOperator.ADD_ADMIN
							|| updateDto.operation === UpdateChannelOperator.REMOVE_ADMIN))
						)
					)
				{
					console.log("user power not enough", user, updateDto.operation, updateDto.parameter, updateDto.parameter_2)
					throw new HttpException("Not enough power to do this", HttpStatus.FORBIDDEN);
				}
			}
			try {
				switch (updateDto.operation) {
					case UpdateChannelOperator.ADD_USER:
						try { await this.prisma.channelUser.create({data: {channelId: channel_id, userId: updateDto.parameter, power: ChannelUserPower.REGULAR}}) }
						catch (e: any) { await this.prisma.channelUser.updateMany({where: {channelId: channel_id, userId: updateDto.parameter}, data: {connected: true, power: ChannelUserPower.REGULAR}}) }

						await gateway.onChannelAdd(updateDto.parameter, channel_id)
						break;
					case UpdateChannelOperator.REMOVE_USER:
						if (user_id != updateDto.parameter)
						{
							if (user.power != ChannelUserPower.OWNER)
								await this.prisma.channelUser.updateMany({where: {channelId: channel_id, userId: updateDto.parameter, power: ChannelUserPower.REGULAR}, data: {connected: false}})
							else
								await this.prisma.channelUser.updateMany({where: {channelId: channel_id, userId: updateDto.parameter}, data: {connected: false}})
							await gateway.onChannelRemove(updateDto.parameter, channel_id)
						}
						break;
					case UpdateChannelOperator.BAN_USER:
						if (user_id != updateDto.parameter)
						{
							if (user.power != ChannelUserPower.OWNER)
								await this.prisma.channelUser.updateMany({where: {channelId: channel_id, userId: updateDto.parameter, power: ChannelUserPower.REGULAR}, data: {ban_expiration: updateDto.parameter_2}})
							else
								await this.prisma.channelUser.update({where: {userId_channelId: {userId: updateDto.parameter, channelId: channel_id}}, data: {ban_expiration: updateDto.parameter_2}})
							this.addExpirable({expiration: new Date(updateDto.parameter_2), user: updateDto.parameter, channel: channel_id, operation: "REVOKE_BAN", chatGateway: gateway})
							this.sortExpirables()
							await gateway.onChannelBan(updateDto.parameter, channel_id, updateDto.parameter_2)
						}
						break;
					case UpdateChannelOperator.MUTE_USER:
						if (user_id != updateDto.parameter)
						{
							if (user.power !== ChannelUserPower.OWNER)
								await this.prisma.channelUser.updateMany({where: {channelId: channel_id, userId: updateDto.parameter, power: ChannelUserPower.REGULAR}, data: {mute_expiration: updateDto.parameter_2}})
							else
								await this.prisma.channelUser.update({where: {userId_channelId: {userId: updateDto.parameter, channelId: channel_id}}, data: {mute_expiration: updateDto.parameter_2}})
							this.addExpirable({expiration: new Date(updateDto.parameter_2), user: updateDto.parameter, channel: channel_id, operation: "REVOKE_MUTE", chatGateway: gateway})
							this.sortExpirables()
							await gateway.onChannelMute(updateDto.parameter, channel_id, updateDto.parameter_2)
						}
						break;
					case UpdateChannelOperator.CHANGE_PASSWORD:
						if (!updateDto.parameter)
							await this.prisma.chatChannel.update({where: {id: channel_id}, data: {password: null, visibility: ChannelType.PUBLIC}})
						else
						{
							await this.prisma.chatChannel.update({where: {id: channel_id}, data: {password: await bcrypt.hash(updateDto.parameter, 10), visibility: ChannelType.PASSWORD_PROTECTED}})
							await this.prisma.channelUser.deleteMany({where: {channelId: channel_id, power: ChannelUserPower.REGULAR}})
						}
						break;
					case UpdateChannelOperator.ADD_ADMIN:
						await this.prisma.channelUser.update({where: {userId_channelId: {userId: updateDto.parameter, channelId: channel_id}}, data: {power: ChannelUserPower.ADMINISTRATOR}})
						await gateway.onChannelPromote(updateDto.parameter, channel_id)
						break;
					case UpdateChannelOperator.REMOVE_ADMIN:
						await this.prisma.channelUser.update({where: {userId_channelId: {userId: updateDto.parameter, channelId: channel_id}}, data: {power: ChannelUserPower.REGULAR}})
						await gateway.onChannelDemote(updateDto.parameter, channel_id)
						break;
					case UpdateChannelOperator.REVOKE_BAN:
						if (user_id === -1 || updateDto.parameter != user_id)
						{
							await this.prisma.channelUser.update({where: {userId_channelId: {userId: updateDto.parameter, channelId: channel_id}}, data: {power: ChannelUserPower.REGULAR, ban_expiration: null}})
							if (user_id !== -1)
								await this.removeExpirablesByUserIdOperation(updateDto.parameter, "REVOKE_BAN");
							await gateway.onChannelUnban(updateDto.parameter, channel_id)
						}
						break;
					case UpdateChannelOperator.REVOKE_MUTE:
						if (user_id === -1 || updateDto.parameter != user_id)
						{
							await this.prisma.channelUser.update({where: {userId_channelId: {userId: updateDto.parameter, channelId: channel_id}}, data: {mute_expiration: null}})
							if (user_id !== -1)
								await this.removeExpirablesByUserIdOperation(updateDto.parameter, "REVOKE_MUTE");
							await gateway.onChannelUnmute(updateDto.parameter, channel_id)
						}
						break;
				}
			} catch (e) { throw new HttpException("error " + updateDto.operation, HttpStatus.I_AM_A_TEAPOT); }
		} catch (e) { throw new HttpException("error " + updateDto.operation, HttpStatus.I_AM_A_TEAPOT); }
  }

  async deleteChannel(channel_id: number, user_id: number, gateway: ChatGateway) {
		const user = await this.prisma.channelUser.findFirstOrThrow({
			where: {
				userId: user_id,
				channelId: channel_id
			}
		})
		if (user.power != ChannelUserPower.OWNER)
			throw new HttpException("Privilege level too low to delete channel", HttpStatus.FORBIDDEN);

		try
		{
			await this.prisma.chatMessage.deleteMany({
				where: {
					channelId: channel_id
				}
			})
			const users = await this.prisma.channelUser.findMany({
				where: {
					channelId: channel_id
				}
			})		
			await this.prisma.channelUser.deleteMany({
				where: {
					channelId: channel_id
				}
			})
			await this.prisma.chatChannel.delete({
				where: {
					id: channel_id
				}
			})
			this.removeExpirablesByChannelId(channel_id);
			users.forEach(async (u) => gateway.onChannelRemove(u.userId, u.channelId))
		} catch (e) {
			throw new HttpException("No such channel", HttpStatus.I_AM_A_TEAPOT)
		}
  }

	// Check if sender is properly fetched
  async getChannelMessages(channel_id: number, user_id: number) {
	  const user = await this.prisma.channelUser.findUnique({where: {userId_channelId: {userId: user_id, channelId: channel_id}}})
	  if (!user)
	  	throw new HttpException("No such channel or you are not part of it", HttpStatus.I_AM_A_TEAPOT);
	  if (user.ban_expiration)
	  	throw new HttpException("You are banned from this channel", HttpStatus.FORBIDDEN);
		if (!user.connected)
	  	throw new HttpException("You are not in this channel", HttpStatus.FORBIDDEN);
	  return await this.prisma.chatMessage.findMany({
			where: {
				channelId: channel_id
			},
			select: {
				sender: true,
				content: true,
				sent_at: true
			}
		})
 	 }

  async getChannelsIds(user_id: number) {
	const ids = await this.prisma.chatChannel.findMany({
		where: {
			users: {
				some: {
					userId: user_id,
				},
				every: {
				  ban_expiration: null,
				  connected: true
				}
		  }
		},
		select: {
			id: true,
		}
	})
	return (ids.map(obj => obj.id));
  }

  async fetchChannel(channel_id: number, user_id: number) {
		const channel = (await this.prisma.chatChannel.findFirst({
		  where: {
			  id: channel_id,
			  users: {
				  some: {
					  userId: user_id,
				  },
				  every: {
					ban_expiration: null,
					connected: true
				  }
			  }
		  },
		  select: {
			  id: true,
			  name: true,
			  visibility: true,
			  users: {
				  select: {
					  user: {
						  select: {
							  id: true,
							  name: true,
							  avatar: true,
							  blocked: true
						  }
					  },
					  power: true,
					  ban_expiration: true,
					  mute_expiration: true
				  }
			  },
			  messages: {
				  select: {
					  sender: {
						  select: {
							  user: {
								  select: {
									  name: true
								  }
							  }
						  }
					  },
					  content: true,
					  sent_at: true
				  },
				  take: -100
			  }
		  }
	  }));
	  if (channel.users)
	  {
		channel.users.forEach(user => user.user.avatar = user.user.avatar.replace(
			'://<<host>>',
			'://' + process.env.FRONT_HOST,
		));
	  }
		return channel;
	}

  async fetchChannels(user_id: number) {
	  const channels = await this.prisma.chatChannel.findMany({
			where: {
				users: {
					some: {
						userId: user_id,
						ban_expiration: null,
						connected: true
					}
				  }
			},
			select: {
				id: true,
				name: true,
				visibility: true,
				users: {
					where: {
						connected: true
					},
					select: {
						user: {
							select: {
								id: true,
								name: true,
								avatar: true,
								blocked: true
							}
						},
						power: true,
						ban_expiration: true,
						mute_expiration: true,
					}
				},
				messages: {
					select: {
						sender: {
							select: {
								user: {
									select: {
										name: true
									}
								}
							}
						},
						content: true,
						sent_at: true
					},
					take: -100
				}
			}
		});

		channels.forEach(chan => chan.users.forEach(user => user.user.avatar = user.user.avatar.replace(
			'://<<host>>',
			'://' + process.env.FRONT_HOST,
		)));
		return channels;
  }
  
  	async blockUser(blocked: number, blocker: number, chatGateway: ChatGateway) {
		const blist = await this.prisma.user.findUnique({
			where: {
				id: blocker
			},
			select: {
				blocked: true
			}
		})
		await this.prisma.user.update({
			where: {
				id: blocker
			},
			data: {
				blocked: [...blist.blocked, blocked]
			}
		})
		chatGateway.onUserBlock(blocker, blocked);
	}

	async unblockUser(blocked: number, unblocker: number, chatGateway: ChatGateway) {
		const blist = await this.prisma.user.findUnique({
			where: {
				id: unblocker
			},
			select: {
				blocked: true
			}
		})
		await this.prisma.user.update({
			where: {
				id: unblocker
			},
			data: {
				blocked: blist.blocked.filter((e) => e !== blocked)
			}
		})
		chatGateway.onUserUnblock(unblocker, blocked);
	}

  addExpirable(e: Expirable)
  {
	this.expirables.push(e)
  }

  removeExpirablesByChannelId(id: number)
  {
	this.expirables = [...this.expirables.filter((expirable: Expirable) => expirable.channel !== id)]
  }

  removeExpirablesByUserIdOperation(id: number, operation: string)
  {
	this.expirables = [...this.expirables.filter((expirable: Expirable) => expirable.user !== id && expirable.operation !== operation)];
  }

  sortExpirables() {
	this.expirables.sort((a, b) => a.expiration.getTime() - b.expiration.getTime())
  }

  @Cron('*/10 * * * * *')
  runEvery10Seconds()
  {
	if (this.running)
		return ;
	this.running = true;
	const expirables_work_copy = this.expirables.filter((e) => e.expiration <= new Date())
	expirables_work_copy.forEach((e) => {
		this.updateChannel(e.channel, {operation: e.operation as UpdateChannelOperator, parameter: e.user, parameter_2: undefined}, -1, e.chatGateway)
		.then(() => this.expirables = this.expirables.filter((ex) => e.user != ex.user && e.operation != ex.operation))
		.catch((error) => {
			console.log("Nothing to do")
		})
	});
	this.running = false;
  }
}
