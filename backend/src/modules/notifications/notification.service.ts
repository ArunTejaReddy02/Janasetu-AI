import { Injectable } from '@nestjs/common';

/** @todo Implement WhatsApp + Email in Module 8 — Notifications */
@Injectable()
export class NotificationService {
  findAll() {
    return { message: 'Notifications module — coming in Module 8', data: [] };
  }
}
