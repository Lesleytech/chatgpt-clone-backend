import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, Humanloop } from 'humanloop';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {
  private humanloop: Humanloop;

  constructor(private configService: ConfigService) {
    this.humanloop = new Humanloop({
      basePath: 'https://api.humanloop.com/v4',
      apiKey: configService.get('HUMANLOOP_API_KEY'),
    });
  }

  async getChat(messages: ChatMessage[]) {
    console.log(messages);
    const res = await this.humanloop.chatDeployed({
      project: this.configService.get('HUMANLOOP_PROJECT'),
      messages,
    });

    return res.data.data[0].output;
  }

  async getStream({
    messages,
    roomId,
    msgId,
  }: {
    messages: ChatMessage[];
    roomId: string;
    msgId: string;
  }): Promise<Observable<any>> {
    const res = await this.humanloop.chatDeployedStream({
      project: this.configService.get('HUMANLOOP_PROJECT'),
      messages,
    });

    const response = res.data;

    return new Observable((subscriber) => {
      (async () => {
        const decoder = new TextDecoder();
        const reader = response.getReader();

        let done = false;

        while (!done) {
          const chunk = await reader.read();
          const value = chunk.value;
          done = chunk.done;
          const val = decoder.decode(value);
          const json_chunks = val
            .split('}{')
            .map(
              (s) =>
                (s.startsWith('{') ? '' : '{') +
                s +
                (s.endsWith('}') ? '' : '}'),
            );
          const tokens = json_chunks.map((s) => JSON.parse(s).output).join('');

          subscriber.next({
            event: 'message-token',
            data: { tokens, roomId, msgId },
          });
        }

        subscriber.next({
          event: 'message-token',
          data: { roomId, msgId, done: true },
        });

        subscriber.complete();
      })();
    });
  }
}
