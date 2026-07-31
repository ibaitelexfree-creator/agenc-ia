import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'Getxo Bela Eskola <info@getxobelaeskola.cloud>';