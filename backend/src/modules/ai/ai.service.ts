import { Injectable } from '@nestjs/common';

/** @todo Implement full AI pipeline in Module 3 — AI */
@Injectable()
export class AiService {
  getStatus() {
    return {
      message: 'AI module — coming in Module 3',
      providers: ['bhashini', 'sarvam', 'google', 'openai'],
    };
  }
}
