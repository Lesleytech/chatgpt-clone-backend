import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, Humanloop } from 'humanloop';

@Injectable()
export class ChatService {
    private humanloop: Humanloop;

    constructor(private configService: ConfigService) {
        this.humanloop = new Humanloop({
            basePath: "https://api.humanloop.com/v4",
            apiKey: configService.get("HUMANLOOP_API_KEY"),
          });
    }

    async getChat(messages: ChatMessage[]) {
        console.log(messages)
        const res = await this.humanloop.chatDeployed({
            project: this.configService.get("HUMANLOOP_PROJECT"),
            messages
        })

        return res.data.data[0].output;
    }
}
