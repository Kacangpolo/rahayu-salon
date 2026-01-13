import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
    constructor(private config: ConfigService) { }

    async sendMessage(phone: string, message: string) {
        const apiUrl = this.config.get('WA_API_URL');
        const apiKey = this.config.get('WA_API_KEY');

        if (!apiUrl || !apiKey) {
            console.warn('WA_API_URL or WA_API_KEY not set. Skipping real send.');
            return { status: 'mocked' };
        }

        // Normalize phone to E.164 (simplistic)
        let formattedPhone = phone.replace(/^0/, '62').replace(/\D/g, '');

        // Example payload for a generic provider (adapt as needed)
        return axios.post(apiUrl, {
            target: formattedPhone,
            message: message,
        }, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });
    }
}
